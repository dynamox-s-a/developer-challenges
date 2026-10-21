package com.romulofer.kotlinMultiplatform.integration

import assertk.assertThat
import assertk.assertions.hasSize
import assertk.assertions.isEqualTo
import assertk.assertions.isInstanceOf
import com.romulofer.kotlinMultiplatform.data.local.FakeClock
import com.romulofer.kotlinMultiplatform.data.local.PlayerRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.local.ScoreRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.local.createTestDatabase
import com.romulofer.kotlinMultiplatform.data.remote.QuizApi
import com.romulofer.kotlinMultiplatform.data.remote.QuizRepositoryImpl
import com.romulofer.kotlinMultiplatform.data.remote.createHttpClient
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Server
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession.Companion.TOTAL_QUESTIONS
import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import com.romulofer.kotlinMultiplatform.domain.usecase.LoadQuestionUseCase
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Quiz
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Answered
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Asking
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Finished
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizViewModel
import com.romulofer.kotlinMultiplatform.presentation.registration.RegistrationViewModel
import com.romulofer.kotlinMultiplatform.testutil.resetMainDispatcher
import com.romulofer.kotlinMultiplatform.testutil.useTestMainDispatcher
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.MockRequestHandleScope
import io.ktor.client.engine.mock.respond
import io.ktor.client.request.HttpResponseData
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.time.Instant

@OptIn(ExperimentalCoroutinesApi::class)
class QuizFlowIntegrationTest {

    private val now = Instant.fromEpochMilliseconds(5_000L)
    private var questionsServed = 0
    private var failNextAnswer = false

    private val engine = MockEngine { request ->
        when (request.url.encodedPath) {
            "/question" -> json("""{"id":"${++questionsServed}","statement":"Q","options":["A","B","C"]}""")
            "/answer" -> answer(request.url.parameters["questionId"]!!.toInt())
            else -> respond("", HttpStatusCode.NotFound)
        }
    }

    private fun MockRequestHandleScope.json(
        content: String,
        status: HttpStatusCode = HttpStatusCode.OK,
    ): HttpResponseData = respond(
        content = content,
        status = status,
        headers = headersOf(HttpHeaders.ContentType, "application/json"),
    )

    private fun MockRequestHandleScope.answer(questionId: Int): HttpResponseData {
        if (failNextAnswer) {
            failNextAnswer = false
            return json("boom", HttpStatusCode.InternalServerError)
        }
        return json("""{"result":${questionId % 2 == 1}}""")
    }

    private class App(
        val navigator: Navigator,
        val registration: RegistrationViewModel,
        val scores: ScoreRepositoryImpl,
        val newQuiz: (Player) -> QuizViewModel,
    )

    @BeforeTest
    fun setUp() = useTestMainDispatcher()

    @AfterTest
    fun tearDown() = resetMainDispatcher()

    private fun TestScope.app(): App {
        val database = createTestDatabase()
        val dispatcher = UnconfinedTestDispatcher(testScheduler)
        val quiz = QuizRepositoryImpl(QuizApi(createHttpClient(engine, "https://example.test")))
        val players = PlayerRepositoryImpl(database, dispatcher)
        val scores = ScoreRepositoryImpl(database, FakeClock(now), dispatcher)
        val navigator = Navigator()
        return App(
            navigator = navigator,
            registration = RegistrationViewModel(RegisterPlayerUseCase(players), navigator),
            scores = scores,
            newQuiz = { player -> QuizViewModel(player, LoadQuestionUseCase(quiz), quiz, scores, navigator) },
        )
    }

    private suspend fun App.startQuizFor(name: String): QuizViewModel {
        registration.onNameChange(name)
        registration.onStart()
        val screen = navigator.backStack.first { it.last() is Quiz }.last() as Quiz
        return newQuiz(screen.player)
    }

    private suspend fun QuizViewModel.playWholeQuiz() {
        repeat(TOTAL_QUESTIONS) {
            state.first { it.step is Asking }
            onOptionSelected("A")
            onSubmit()
            state.first { it.step is Answered }
            onNext()
        }
        state.first { it.step is Finished }
    }

    @Test
    fun `plays a whole quiz and lists the score on the scoreboard`() = runTest {
        val app = app()
        val quiz = app.startQuizFor("Ana")

        quiz.playWholeQuiz()

        assertThat(quiz.state.value.step).isEqualTo(Finished(scoreSaved = true))
        assertThat(quiz.state.value.session.correct).isEqualTo(5)
        assertThat(questionsServed).isEqualTo(TOTAL_QUESTIONS)
        assertThat(app.scores.observeScoreboard().first()).isEqualTo(
            listOf(ScoreboardEntry("Ana", 5, TOTAL_QUESTIONS, 5_000L)),
        )
    }

    @Test
    fun `lists both scores when the player restarts the quiz`() = runTest {
        val app = app()
        val quiz = app.startQuizFor("Ana")
        quiz.playWholeQuiz()

        quiz.onRestart()
        quiz.playWholeQuiz()

        val scoreboard = app.scores.observeScoreboard().first()
        assertThat(scoreboard).hasSize(2)
        assertThat(scoreboard.map { it.playerName }).isEqualTo(listOf("Ana", "Ana"))
        assertThat(questionsServed).isEqualTo(TOTAL_QUESTIONS * 2)
    }

    @Test
    fun `recognizes a returning player regardless of case`() = runTest {
        val app = app()
        app.startQuizFor("Ana").playWholeQuiz()
        app.navigator.backToRegistration()

        app.startQuizFor("ANA").playWholeQuiz()

        val scoreboard = app.scores.observeScoreboard().first()
        assertThat(scoreboard.map { it.playerName }).isEqualTo(listOf("Ana", "Ana"))
    }

    @Test
    fun `recovers from a server error while submitting an answer`() = runTest {
        val app = app()
        val quiz = app.startQuizFor("Ana")
        quiz.state.first { it.step is Asking }
        failNextAnswer = true
        quiz.onOptionSelected("A")

        quiz.onSubmit()
        val failed = quiz.state.first { (it.step as? Asking)?.submitError != null }
        quiz.onSubmit()
        quiz.state.first { it.step is Answered }

        assertThat((failed.step as Asking).submitError).isEqualTo(Server(500))
        assertThat(quiz.state.value.step).isInstanceOf<Answered>()
    }
}
