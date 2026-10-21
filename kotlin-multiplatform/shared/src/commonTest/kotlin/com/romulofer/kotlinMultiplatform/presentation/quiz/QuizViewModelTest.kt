package com.romulofer.kotlinMultiplatform.presentation.quiz

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isInstanceOf
import assertk.assertions.isTrue
import com.romulofer.kotlinMultiplatform.domain.model.AppError.NoConnection
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Server
import com.romulofer.kotlinMultiplatform.domain.model.DataResult
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Failure
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Success
import com.romulofer.kotlinMultiplatform.domain.model.Player
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.domain.model.QuizSession.Companion.TOTAL_QUESTIONS
import com.romulofer.kotlinMultiplatform.domain.repository.QuizRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import com.romulofer.kotlinMultiplatform.domain.usecase.LoadQuestionUseCase
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Registration
import com.romulofer.kotlinMultiplatform.presentation.navigation.Screen.Scoreboard
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Answered
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Asking
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Finished
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.LoadFailed
import com.romulofer.kotlinMultiplatform.testutil.resetMainDispatcher
import com.romulofer.kotlinMultiplatform.testutil.useTestMainDispatcher
import dev.mokkery.answering.calls
import dev.mokkery.answering.returns
import dev.mokkery.answering.sequentiallyReturns
import dev.mokkery.answering.throws
import dev.mokkery.everySuspend
import dev.mokkery.matcher.any
import dev.mokkery.mock
import dev.mokkery.verify.VerifyMode.Companion.exactly
import dev.mokkery.verifySuspend
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.test.runTest
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test

class QuizViewModelTest {

    private val quiz = mock<QuizRepository>()
    private val scores = mock<ScoreRepository>()
    private val navigator = Navigator()
    private val ana = Player(id = 7, name = "Ana")
    private var nextQuestionId = 1

    @BeforeTest
    fun setUp() {
        useTestMainDispatcher()
        everySuspend { quiz.getQuestion() } calls { Success(question(nextQuestionId++.toString())) }
        everySuspend { quiz.submitAnswer(any(), any()) } returns Success(true)
        everySuspend { scores.save(any(), any(), any()) } returns Unit
    }

    @AfterTest
    fun tearDown() = resetMainDispatcher()

    private fun question(id: String) = Question(id = id, statement = "Q$id", options = listOf("A", "B", "C"))

    private fun viewModel() = QuizViewModel(ana, LoadQuestionUseCase(quiz), quiz, scores, navigator)

    private fun QuizViewModel.answer(option: String = "A") {
        onOptionSelected(option)
        onSubmit()
    }

    private fun QuizViewModel.answerAll() {
        repeat(TOTAL_QUESTIONS) {
            answer()
            onNext()
        }
    }

    @Test
    fun `loads the first question when it starts`() = runTest {
        val viewModel = viewModel()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1")))
        assertThat(viewModel.state.value.questionNumber).isEqualTo(1)
        assertThat(viewModel.state.value.totalQuestions).isEqualTo(TOTAL_QUESTIONS)
    }

    @Test
    fun `shows the error when the first question fails to load`() = runTest {
        everySuspend { quiz.getQuestion() } returns Failure(NoConnection)

        val viewModel = viewModel()

        assertThat(viewModel.state.value.step).isEqualTo(LoadFailed(NoConnection))
    }

    @Test
    fun `loads the question again after a failure when the user retries`() = runTest {
        everySuspend { quiz.getQuestion() } sequentiallyReturns listOf(
            Failure(Server(500)),
            Success(question("1")),
        )
        val viewModel = viewModel()

        viewModel.onRetry()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1")))
    }

    @Test
    fun `remembers the selected option`() = runTest {
        val viewModel = viewModel()

        viewModel.onOptionSelected("B")

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1"), selected = "B"))
    }

    @Test
    fun `lets the user change the selected option`() = runTest {
        val viewModel = viewModel()

        viewModel.onOptionSelected("B")
        viewModel.onOptionSelected("C")

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1"), selected = "C"))
    }

    @Test
    fun `does not submit without a selected option`() = runTest {
        val viewModel = viewModel()

        viewModel.onSubmit()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1")))
        verifySuspend(exactly(0)) { quiz.submitAnswer(any(), any()) }
    }

    @Test
    fun `shows a correct answer and counts it`() = runTest {
        val viewModel = viewModel()

        viewModel.answer("B")

        assertThat(viewModel.state.value.step).isEqualTo(
            Answered(question("1"), selected = "B", isCorrect = true, isLastQuestion = false),
        )
        assertThat(viewModel.state.value.session.correct).isEqualTo(1)
        verifySuspend { quiz.submitAnswer("1", "B") }
    }

    @Test
    fun `shows a wrong answer without raising the score`() = runTest {
        everySuspend { quiz.submitAnswer(any(), any()) } returns Success(false)
        val viewModel = viewModel()

        viewModel.answer()

        assertThat(viewModel.state.value.step).isEqualTo(
            Answered(question("1"), selected = "A", isCorrect = false, isLastQuestion = false),
        )
        assertThat(viewModel.state.value.session.correct).isEqualTo(0)
    }

    @Test
    fun `keeps the selection and shows the error when submitting fails`() = runTest {
        everySuspend { quiz.submitAnswer(any(), any()) } returns Failure(NoConnection)
        val viewModel = viewModel()

        viewModel.answer("B")

        assertThat(viewModel.state.value.step).isEqualTo(
            Asking(question("1"), selected = "B", isSubmitting = false, submitError = NoConnection),
        )
    }

    @Test
    fun `can submit again after a failure`() = runTest {
        everySuspend { quiz.submitAnswer(any(), any()) } sequentiallyReturns listOf(
            Failure(NoConnection),
            Success(true),
        )
        val viewModel = viewModel()
        viewModel.answer("B")

        viewModel.onSubmit()

        assertThat(viewModel.state.value.step).isInstanceOf<Answered>()
    }

    @Test
    fun `ignores a second submit once the answer was given`() = runTest {
        val viewModel = viewModel()
        viewModel.answer()

        viewModel.onSubmit()

        verifySuspend(exactly(1)) { quiz.submitAnswer(any(), any()) }
    }

    @Test
    fun `moves to the next question after an answer`() = runTest {
        val viewModel = viewModel()
        viewModel.answer()

        viewModel.onNext()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("2")))
        assertThat(viewModel.state.value.questionNumber).isEqualTo(2)
    }

    @Test
    fun `does not move on before the question is answered`() = runTest {
        val viewModel = viewModel()

        viewModel.onNext()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1")))
    }

    @Test
    fun `fills the progress as questions are answered`() = runTest {
        val viewModel = viewModel()
        viewModel.answer()
        viewModel.onNext()
        viewModel.answer()

        assertThat(viewModel.state.value.progress).isEqualTo(2f / TOTAL_QUESTIONS)
    }

    @Test
    fun `flags the last question and saves the score when it is answered`() = runTest {
        val viewModel = viewModel()
        repeat(TOTAL_QUESTIONS - 1) {
            viewModel.answer()
            viewModel.onNext()
        }

        viewModel.answer()

        val step = viewModel.state.value.step as Answered
        assertThat(step.isLastQuestion).isTrue()
        verifySuspend { scores.save(7L, TOTAL_QUESTIONS, TOTAL_QUESTIONS) }
    }

    @Test
    fun `saves only the correct answers in the score`() = runTest {
        everySuspend { quiz.submitAnswer(any(), any()) } sequentiallyReturns
            List(TOTAL_QUESTIONS) { index -> Success(index < 4) }
        val viewModel = viewModel()

        viewModel.answerAll()

        verifySuspend(exactly(1)) { scores.save(7L, 4, TOTAL_QUESTIONS) }
    }

    @Test
    fun `does not save the score before the quiz is over`() = runTest {
        val viewModel = viewModel()
        repeat(TOTAL_QUESTIONS - 1) {
            viewModel.answer()
            viewModel.onNext()
        }

        verifySuspend(exactly(0)) { scores.save(any(), any(), any()) }
    }

    @Test
    fun `finishes after the last answer`() = runTest {
        val viewModel = viewModel()

        viewModel.answerAll()

        assertThat(viewModel.state.value.step).isEqualTo(Finished(scoreSaved = true))
        assertThat(viewModel.state.value.session.correct).isEqualTo(TOTAL_QUESTIONS)
    }

    @Test
    fun `finishes and warns when the score cannot be saved`() = runTest {
        everySuspend { scores.save(any(), any(), any()) } throws IllegalStateException("disk full")
        val viewModel = viewModel()

        viewModel.answerAll()

        assertThat(viewModel.state.value.step).isEqualTo(Finished(scoreSaved = false))
    }

    @Test
    fun `restarts with a fresh score and new questions`() = runTest {
        val viewModel = viewModel()
        viewModel.answerAll()

        viewModel.onRestart()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("11")))
        assertThat(viewModel.state.value.session.answered).isEqualTo(0)
        assertThat(viewModel.state.value.session.correct).isEqualTo(0)
        assertThat(viewModel.state.value.questionNumber).isEqualTo(1)
    }

    @Test
    fun `does not restart in the middle of a quiz`() = runTest {
        val viewModel = viewModel()
        viewModel.answer()
        viewModel.onNext()

        viewModel.onRestart()

        assertThat(viewModel.state.value.session.answered).isEqualTo(1)
        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("2")))
    }

    @Test
    fun `never asks the same question twice in a quiz`() = runTest {
        everySuspend { quiz.getQuestion() } sequentiallyReturns listOf(
            Success(question("1")),
            Success(question("1")),
            Success(question("2")),
        )
        val viewModel = viewModel()
        viewModel.answer()

        viewModel.onNext()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("2")))
    }

    @Test
    fun `goes back to the registration screen when the player changes`() = runTest {
        navigator.startQuiz(ana)
        val viewModel = viewModel()

        viewModel.onChangePlayer()

        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `opens the scoreboard and can come back`() = runTest {
        val viewModel = viewModel()

        viewModel.onScoreboardClick()
        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration, Scoreboard))

        viewModel.onBack()
        assertThat(navigator.backStack.value).isEqualTo(listOf(Registration))
    }

    @Test
    fun `ignores a retry when nothing failed`() = runTest {
        val viewModel = viewModel()

        viewModel.onRetry()

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1")))
        verifySuspend(exactly(1)) { quiz.getQuestion() }
    }

    @Test
    fun `ignores a selection once the answer was given`() = runTest {
        val viewModel = viewModel()
        viewModel.answer("A")

        viewModel.onOptionSelected("B")

        assertThat(viewModel.state.value.step).isInstanceOf<Answered>()
    }

    @Test
    fun `ignores selections and submits while an answer is being sent`() = runTest {
        val reply = CompletableDeferred<DataResult<Boolean>>()
        everySuspend { quiz.submitAnswer(any(), any()) } calls { reply.await() }
        val viewModel = viewModel()
        viewModel.answer("A")

        viewModel.onOptionSelected("B")
        viewModel.onSubmit()
        reply.complete(Success(true))

        assertThat(viewModel.state.value.step).isInstanceOf<Answered>()
        assertThat((viewModel.state.value.step as Answered).selected).isEqualTo("A")
        verifySuspend(exactly(1)) { quiz.submitAnswer(any(), any()) }
    }

    @Test
    fun `shows the answer is being sent while waiting for the server`() = runTest {
        val reply = CompletableDeferred<DataResult<Boolean>>()
        everySuspend { quiz.submitAnswer(any(), any()) } calls { reply.await() }
        val viewModel = viewModel()

        viewModel.answer("A")

        assertThat(viewModel.state.value.step).isEqualTo(Asking(question("1"), selected = "A", isSubmitting = true))
        reply.complete(Success(true))
    }

    @Test
    fun `ignores a next request on the finished screen`() = runTest {
        val viewModel = viewModel()
        viewModel.answerAll()

        viewModel.onNext()

        assertThat(viewModel.state.value.step).isEqualTo(Finished(scoreSaved = true))
    }
}
