package com.dynamox.quizchallenge.ui.quiz

import androidx.lifecycle.SavedStateHandle
import app.cash.turbine.test
import com.dynamox.quizchallenge.domain.model.AppError
import com.dynamox.quizchallenge.domain.model.Question
import com.dynamox.quizchallenge.domain.usecase.GetUniqueQuestionUseCase
import com.dynamox.quizchallenge.domain.usecase.SaveScoreUseCase
import com.dynamox.quizchallenge.domain.usecase.SubmitAnswerUseCase
import com.dynamox.quizchallenge.fakes.FakeQuizRepository
import com.dynamox.quizchallenge.fakes.FakeScoreRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class QuizViewModelTest {

    private val dispatcher = StandardTestDispatcher()
    private lateinit var quizRepository: FakeQuizRepository
    private lateinit var scoreRepository: FakeScoreRepository

    @Before
    fun setUp() {
        Dispatchers.setMain(dispatcher)
        quizRepository = FakeQuizRepository()
        scoreRepository = FakeScoreRepository()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    private fun question(id: String) = Question(id = id, statement = "Statement $id", options = listOf("A", "B"))

    private fun createViewModel(
        playerName: String = "Ada",
        savedState: Map<String, Any> = emptyMap(),
    ): QuizViewModel = QuizViewModel(
        savedStateHandle = SavedStateHandle(mapOf("playerName" to playerName) + savedState),
        getUniqueQuestion = GetUniqueQuestionUseCase(quizRepository),
        submitAnswerUseCase = SubmitAnswerUseCase(quizRepository),
        saveScoreUseCase = SaveScoreUseCase(scoreRepository),
    )

    @Test
    fun `loads the first question on init`() = runTest {
        quizRepository.enqueueQuestion(question("1"))
        val viewModel = createViewModel()

        viewModel.uiState.test {
            assertEquals(QuizUiState.Loading, awaitItem())
            val state = awaitItem() as QuizUiState.InProgress
            assertEquals(1, state.questionNumber)
            assertEquals("1", state.question.id)
        }
    }

    @Test
    fun `selecting and submitting a correct answer reveals success`() = runTest {
        quizRepository.enqueueQuestion(question("1"))
        quizRepository.answerResult = true
        val viewModel = createViewModel()

        viewModel.uiState.test {
            awaitItem() // Loading
            awaitItem() // InProgress, unanswered

            viewModel.onOptionSelected("A")
            val selected = awaitItem() as QuizUiState.InProgress
            assertEquals("A", selected.selectedOption)

            viewModel.onSubmitAnswer()
            awaitItem() // isSubmitting = true
            val revealed = awaitItem() as QuizUiState.InProgress
            assertEquals(true, revealed.revealedCorrect)
            assertEquals(1, revealed.correctCountSoFar)
        }
    }

    @Test
    fun `an incorrect answer is revealed without incrementing the score`() = runTest {
        quizRepository.enqueueQuestion(question("1"))
        quizRepository.answerResult = false
        val viewModel = createViewModel()

        viewModel.uiState.test {
            awaitItem() // Loading
            awaitItem() // InProgress, unanswered
            viewModel.onOptionSelected("A")
            awaitItem() // selected
            viewModel.onSubmitAnswer()
            awaitItem() // isSubmitting = true
            val revealed = awaitItem() as QuizUiState.InProgress
            assertEquals(false, revealed.revealedCorrect)
            assertEquals(0, revealed.correctCountSoFar)
        }
    }

    @Test
    fun `saves the final score once the tenth question is answered`() = runTest {
        repeat(10) { quizRepository.enqueueQuestion(question(it.toString())) }
        quizRepository.answerResult = true
        val viewModel = createViewModel(playerName = "Ada")

        viewModel.uiState.test {
            repeat(10) { index ->
                awaitItem() // Loading
                awaitItem() // InProgress, unanswered
                viewModel.onOptionSelected("A")
                awaitItem() // selected
                viewModel.onSubmitAnswer()
                awaitItem() // isSubmitting = true
                val revealed = awaitItem() as QuizUiState.InProgress
                assertEquals(index == 9, revealed.isLastQuestion)
                if (index < 9) viewModel.onNextQuestion()
            }
        }

        val saved = scoreRepository.savedScores.single()
        assertEquals("Ada", saved.playerName)
        assertEquals(10, saved.correctCount)
        assertEquals(10, saved.totalQuestions)
    }

    @Test
    fun `emits an error state when fetching a question fails`() = runTest {
        quizRepository.nextFailure = AppError.Network
        val viewModel = createViewModel()

        viewModel.uiState.test {
            awaitItem() // Loading
            val error = awaitItem() as QuizUiState.Error
            assertEquals(AppError.Network, error.error)
        }
    }

    @Test
    fun `retrying after an error loads a question again`() = runTest {
        quizRepository.nextFailure = AppError.Network
        val viewModel = createViewModel()

        viewModel.uiState.test {
            awaitItem() // Loading
            awaitItem() // Error

            quizRepository.nextFailure = null
            quizRepository.enqueueQuestion(question("1"))
            viewModel.onRetry()

            awaitItem() // Loading
            val state = awaitItem() as QuizUiState.InProgress
            assertEquals("1", state.question.id)
        }
    }

    @Test
    fun `a fast double-tap on submit only counts the answer once`() = runTest {
        // Regression test: onSubmitAnswer() used to only guard on isAnswerRevealed, which stays
        // false until the *first* call's network response comes back. Calling it twice in a row
        // (before either coroutine has had a chance to run) used to schedule two submissions for
        // a single tap, double-counting the score.
        quizRepository.enqueueQuestion(question("1"))
        quizRepository.answerResult = true
        val viewModel = createViewModel()

        viewModel.uiState.test {
            awaitItem() // Loading
            awaitItem() // InProgress, unanswered
            viewModel.onOptionSelected("A")
            awaitItem() // selected

            viewModel.onSubmitAnswer()
            viewModel.onSubmitAnswer() // simulated fast double-tap, before the first call resolves

            awaitItem() // isSubmitting = true
            val revealed = awaitItem() as QuizUiState.InProgress
            assertEquals(1, revealed.correctCountSoFar)
            expectNoEvents()
        }
        assertEquals(1, quizRepository.submitAnswerCallCount)
    }

    @Test
    fun `a fast double-tap on submit does not save the score twice on the last question`() = runTest {
        quizRepository.enqueueQuestion(question("10"))
        quizRepository.answerResult = true
        // Pre-seed progress as if 9 questions were already answered, so this is the 10th/last one.
        val viewModel = createViewModel(
            savedState = mapOf(
                "quiz_answeredCount" to 9,
                "quiz_correctCount" to 9,
                "quiz_seenQuestionIds" to ArrayList((1..9).map { it.toString() }),
            ),
        )

        viewModel.uiState.test {
            awaitItem() // Loading
            awaitItem() // InProgress, unanswered
            viewModel.onOptionSelected("A")
            awaitItem() // selected

            viewModel.onSubmitAnswer()
            viewModel.onSubmitAnswer() // simulated fast double-tap

            awaitItem() // isSubmitting = true
            awaitItem() // revealed
            expectNoEvents()
        }
        assertEquals(1, scoreRepository.savedScores.size)
    }

    @Test
    fun `a fast double-tap on next question only fetches one question`() = runTest {
        quizRepository.enqueueQuestion(question("1"))
        quizRepository.enqueueQuestion(question("2"))
        quizRepository.answerResult = true
        val viewModel = createViewModel()

        viewModel.uiState.test {
            awaitItem() // Loading
            awaitItem() // InProgress, unanswered
            viewModel.onOptionSelected("A")
            awaitItem() // selected
            viewModel.onSubmitAnswer()
            awaitItem() // isSubmitting = true
            awaitItem() // revealed

            viewModel.onNextQuestion()
            viewModel.onNextQuestion() // simulated fast double-tap, before the first fetch resolves

            awaitItem() // Loading
            val state = awaitItem() as QuizUiState.InProgress
            assertEquals("2", state.question.id)
            expectNoEvents()
        }
        // Only one of the two enqueued follow-up fetches should have been consumed: the initial
        // load already consumed question "1", so exactly one more call for question "2".
        assertEquals(2, quizRepository.fetchQuestionCallCount)
    }

    @Test
    fun `restores progress from SavedStateHandle after process death`() = runTest {
        // Simulates the ViewModel being recreated after the OS killed the process mid-quiz:
        // progress persisted via SavedStateHandle should be picked up instead of starting over.
        quizRepository.enqueueQuestion(question("2")) // already seen -> triggers a retry
        quizRepository.enqueueQuestion(question("4")) // fresh question
        val viewModel = createViewModel(
            savedState = mapOf(
                "quiz_answeredCount" to 3,
                "quiz_correctCount" to 2,
                "quiz_seenQuestionIds" to ArrayList(listOf("1", "2", "3")),
            ),
        )

        viewModel.uiState.test {
            awaitItem() // Loading
            val state = awaitItem() as QuizUiState.InProgress
            assertEquals(4, state.questionNumber) // answeredCount (3) + 1, not restarted from 1
            assertEquals("4", state.question.id) // skipped the already-seen "2"
        }
    }
}
