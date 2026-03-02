package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.AppError
import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.presentation.screens.quiz.QuizState
import com.dynamox.quiz.presentation.screens.quiz.QuizViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.test.assertNull
import kotlin.test.assertTrue

/**
 * Testes unitários do QuizViewModel.
 *
 * Testa o fluxo completo de uma sessão de quiz sem tocar em rede ou banco.
 *
 * Técnica de teste de coroutines:
 * - StandardTestDispatcher: substitui o Dispatchers.Main real por um dispatcher
 *   controlado. Coroutines só executam quando chamamos advanceUntilIdle().
 * - Isso garante controle preciso sobre quando cada coroutine roda,
 *   tornando os testes determinísticos.
 *
 */
@OptIn(ExperimentalCoroutinesApi::class)
class QuizViewModelTest {

    /**
     * Dispatcher controlado para testes.
     * 'StandardTestDispatcher' não executa coroutines automaticamente —
     * precisamos chamar advanceUntilIdle() explicitamente.
     */
    private val testDispatcher = StandardTestDispatcher()

    /** Pergunta fake usada em todos os testes */
    private val fakeQuestion = Question(
        id = "1",
        statement = "What is 2+2?",
        options = listOf("3", "4", "5", "6")
    )

    /**
     * Executado antes de cada teste (@BeforeTest).
     * Substitui o Main dispatcher pelo testDispatcher para que o viewModelScope
     * use nosso dispatcher controlado.
     */
    @BeforeTest
    fun setup() {
        Dispatchers.setMain(testDispatcher)
    }

    /**
     * Executado após cada teste (@AfterTest).
     * Restaura o Main dispatcher original para não interferir em outros testes.
     */
    @AfterTest
    fun tearDown() {
        Dispatchers.resetMain()
    }

    /**
     * Helper para criar um ViewModel com resultados pré-configurados.
     * Evita duplicação de código boilerplate nos testes.
     */
    private fun createViewModel(
        questionResult: Result<Question> = Result.success(fakeQuestion),
        answerResult: Result<Boolean> = Result.success(true)
    ): QuizViewModel {
        val repo = FakeQuizRepository(
            questionResult = questionResult,
            answerResult = answerResult
        )
        return QuizViewModel(
            getQuestion = GetQuestionUseCase(repo),
            submitAnswer = SubmitAnswerUseCase(repo),
            saveQuizScore = SaveQuizScoreUseCase(repo)
        )
    }

    /**
     * Verifica que ao iniciar o quiz, a pergunta é carregada corretamente.
     * advanceUntilIdle() executa todas as coroutines pendentes.
     */
    @Test
    fun `initQuiz starts loading question`() = runTest {
        val viewModel = createViewModel()

        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle() // executa a coroutine de loadNextQuestion

        val state = viewModel.uiState.value
        assertEquals(0, state.currentQuestionIndex)
        assertEquals("Alice", state.playerName)
        // Após carregar, deve estar em ShowQuestion com a pergunta fake
        assertIs<QuizState.ShowQuestion>(state.quizState)
        assertEquals(fakeQuestion, (state.quizState as QuizState.ShowQuestion).question)
    }

    /**
     * Verifica que selecionar uma alternativa atualiza o selectedAnswer no estado.
     */
    @Test
    fun `onAnswerSelected updates selected answer`() = runTest {
        val viewModel = createViewModel()
        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.onAnswerSelected("4")

        assertEquals("4", viewModel.uiState.value.selectedAnswer)
    }

    /**
     * Verifica que submeter a resposta correta incrementa o score e
     * vai para o estado ShowResult com isCorrect=true.
     */
    @Test
    fun `onSubmitAnswer transitions to ShowResult with correct answer`() = runTest {
        val viewModel = createViewModel(answerResult = Result.success(true))
        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.onAnswerSelected("4")
        viewModel.onSubmitAnswer()
        testDispatcher.scheduler.advanceUntilIdle() // executa a coroutine de submitAnswer

        val state = viewModel.uiState.value
        assertIs<QuizState.ShowResult>(state.quizState)
        assertEquals(true, (state.quizState as QuizState.ShowResult).isCorrect)
        assertEquals(1, state.score) // score incrementado
    }

    /**
     * Verifica que resposta errada NÃO incrementa o score.
     * Comportamento esperado: score permanece 0.
     */
    @Test
    fun `onSubmitAnswer does not increment score on wrong answer`() = runTest {
        val viewModel = createViewModel(answerResult = Result.success(false))
        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.onAnswerSelected("3")
        viewModel.onSubmitAnswer()
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(0, viewModel.uiState.value.score) // score deve continuar 0
    }

    /**
     * Verifica que onNextQuestion incrementa o índice da pergunta.
     */
    @Test
    fun `onNextQuestion increments question index`() = runTest {
        val viewModel = createViewModel()
        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.onAnswerSelected("4")
        viewModel.onSubmitAnswer()
        testDispatcher.scheduler.advanceUntilIdle()
        viewModel.onNextQuestion()
        testDispatcher.scheduler.advanceUntilIdle() // carrega a próxima pergunta

        assertEquals(1, viewModel.uiState.value.currentQuestionIndex)
    }

    /**
     * Verifica que ao avançar de pergunta, a seleção anterior é limpa.
     * Sem isso, a próxima pergunta apareceria com uma alternativa pré-selecionada.
     */
    @Test
    fun `selected answer is cleared after moving to next question`() = runTest {
        val viewModel = createViewModel()
        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.onAnswerSelected("4")
        viewModel.onSubmitAnswer()
        testDispatcher.scheduler.advanceUntilIdle()
        viewModel.onNextQuestion()
        testDispatcher.scheduler.advanceUntilIdle()

        assertNull(viewModel.uiState.value.selectedAnswer) // deve ser null após avançar
    }

    /**
     * Verifica que após 10 perguntas, o estado vira Finished.
     * Este é o teste de integração mais completo do ViewModel —
     * simula um quiz completo do início ao fim.
     *
     * Fluxo: initQuiz > 10x(avança, seleciona, submete, próxima) > Finished
     */
    @Test
    fun `quiz finishes after 10 questions`() = runTest {
        val viewModel = createViewModel()
        viewModel.initQuiz(1L, "Alice")

        repeat(10) {
            testDispatcher.scheduler.advanceUntilIdle() // carrega pergunta
            viewModel.onAnswerSelected("4")
            viewModel.onSubmitAnswer()
            testDispatcher.scheduler.advanceUntilIdle() // submete resposta
            viewModel.onNextQuestion()
        }

        testDispatcher.scheduler.advanceUntilIdle()
        assertIs<QuizState.Finished>(viewModel.uiState.value.quizState)
    }

    /**
     * Verifica que falha ao carregar pergunta resulta em estado Error.
     * A UI deve mostrar mensagem de erro e botão retry.
     */
    @Test
    fun `error state shown when question fails to load`() = runTest {
        val viewModel = createViewModel(
            questionResult = Result.failure(AppError.NetworkError("No internet"))
        )
        viewModel.initQuiz(1L, "Alice")
        testDispatcher.scheduler.advanceUntilIdle()

        assertIs<QuizState.Error>(viewModel.uiState.value.quizState)
    }
}
