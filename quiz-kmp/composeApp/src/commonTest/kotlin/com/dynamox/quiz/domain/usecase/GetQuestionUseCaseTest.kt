package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.AppError
import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.domain.repository.QuizRepository
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.test.assertTrue

/**
 * Testes unitários do GetQuestionUseCase.
 *
 * Cada método de teste verifica um comportamento específico do Use Case.
 * Convenção de nomenclatura: `função testada` `condição` `resultado esperado`
 */
class GetQuestionUseCaseTest {

    /** Pergunta de exemplo reutilizada nos testes */
    private val fakeQuestion = Question(
        id = "1",
        statement = "What is the name of the coolest company in the world?",
        options = listOf("Google", "Microsoft", "Dynamox", "Spotify", "Amazon")
    )

    /**
     * Cenário: repositório retorna sucesso > Use Case deve retornar a mesma pergunta.
     * Verifica que o Use Case não modifica o resultado do repositório.
     */
    @Test
    fun `invoke returns question on success`() = runTest {
        val repository = FakeQuizRepository(questionResult = Result.success(fakeQuestion))
        val useCase = GetQuestionUseCase(repository)

        val result = useCase()

        assertTrue(result.isSuccess)
        assertEquals(fakeQuestion, result.getOrNull())
    }

    /**
     * Cenário: falha de rede > Use Case deve propagar o NetworkError.
     * Verifica que erros não são engolidos silenciosamente.
     */
    @Test
    fun `invoke returns error on network failure`() = runTest {
        val error = AppError.NetworkError("Connection failed")
        val repository = FakeQuizRepository(questionResult = Result.failure(error))
        val useCase = GetQuestionUseCase(repository)

        val result = useCase()

        assertTrue(result.isFailure)
        assertIs<AppError.NetworkError>(result.exceptionOrNull())
    }

    /**
     * Cenário: erro 500 no servidor > Use Case deve propagar o ServerError com código.
     * Verifica que o código HTTP é preservado para tratamento na camada superior.
     */
    @Test
    fun `invoke returns error on server failure`() = runTest {
        val error = AppError.ServerError(500, "Internal server error")
        val repository = FakeQuizRepository(questionResult = Result.failure(error))
        val useCase = GetQuestionUseCase(repository)

        val result = useCase()

        assertTrue(result.isFailure)
        val exception = result.exceptionOrNull()
        assertIs<AppError.ServerError>(exception)
        assertEquals(500, exception.code)
    }
}

/**
 * Testes unitários do SubmitAnswerUseCase.
 * Foco nas validações de entrada implementadas pelo Use Case.
 */
class SubmitAnswerUseCaseTest {

    /**
     * Cenário: resposta válida e correta > retorna true.
     */
    @Test
    fun `invoke returns true when answer is correct`() = runTest {
        val repository = FakeQuizRepository(answerResult = Result.success(true))
        val useCase = SubmitAnswerUseCase(repository)

        val result = useCase("1", "Dynamox")

        assertTrue(result.isSuccess)
        assertEquals(true, result.getOrNull())
    }

    /**
     * Cenário: resposta válida mas errada > retorna false (não é um erro).
     * Importante: false não é uma falha, é um resultado válido.
     */
    @Test
    fun `invoke returns false when answer is wrong`() = runTest {
        val repository = FakeQuizRepository(answerResult = Result.success(false))
        val useCase = SubmitAnswerUseCase(repository)

        val result = useCase("1", "Google")

        assertTrue(result.isSuccess)
        assertEquals(false, result.getOrNull())
    }

    /**
     * Cenário: resposta vazia > ValidationError SEM chamar a API.
     * Verifica que a validação acontece antes da requisição de rede.
     */
    @Test
    fun `invoke returns validation error when answer is blank`() = runTest {
        val repository = FakeQuizRepository(answerResult = Result.success(true))
        val useCase = SubmitAnswerUseCase(repository)

        val result = useCase("1", "")

        assertTrue(result.isFailure)
        assertIs<AppError.ValidationError>(result.exceptionOrNull())
    }

    /**
     * Cenário: resposta com apenas espaços > deve ser tratada como vazia.
     * isBlank() retorna true para strings com apenas whitespace.
     */
    @Test
    fun `invoke returns validation error when answer is whitespace only`() = runTest {
        val repository = FakeQuizRepository(answerResult = Result.success(true))
        val useCase = SubmitAnswerUseCase(repository)

        val result = useCase("1", "   ")

        assertTrue(result.isFailure)
        assertIs<AppError.ValidationError>(result.exceptionOrNull())
    }
}

/**
 * Testes unitários do GetOrCreatePlayerUseCase.
 * Foco na validação do nome e no comportamento de sanitização (trim).
 */
class GetOrCreatePlayerUseCaseTest {

    private val fakePlayer = com.dynamox.quiz.domain.model.Player(id = 1, name = "TestPlayer")

    /**
     * Cenário: nome válido > retorna o jogador criado/recuperado com sucesso.
     */
    @Test
    fun `invoke returns player on valid name`() = runTest {
        val repository = FakeQuizRepository(playerResult = Result.success(fakePlayer))
        val useCase = GetOrCreatePlayerUseCase(repository)

        val result = useCase("TestPlayer")

        assertTrue(result.isSuccess)
        assertEquals(fakePlayer, result.getOrNull())
    }

    /**
     * Cenário: nome vazio > ValidationError imediato (sem tocar no banco).
     */
    @Test
    fun `invoke returns validation error on blank name`() = runTest {
        val repository = FakeQuizRepository(playerResult = Result.success(fakePlayer))
        val useCase = GetOrCreatePlayerUseCase(repository)

        val result = useCase("")

        assertTrue(result.isFailure)
        assertIs<AppError.ValidationError>(result.exceptionOrNull())
    }

    /**
     * Cenário: nome só com espaços > deve ser tratado como vazio após trim().
     */
    @Test
    fun `invoke returns validation error on whitespace name`() = runTest {
        val repository = FakeQuizRepository(playerResult = Result.success(fakePlayer))
        val useCase = GetOrCreatePlayerUseCase(repository)

        val result = useCase("   ")

        assertTrue(result.isFailure)
        assertIs<AppError.ValidationError>(result.exceptionOrNull())
    }

    /**
     * Cenário: nome com mais de 30 caracteres > ValidationError.
     * Verifica que a mensagem menciona o limite ("30").
     */
    @Test
    fun `invoke returns validation error when name exceeds 30 characters`() = runTest {
        val repository = FakeQuizRepository(playerResult = Result.success(fakePlayer))
        val useCase = GetOrCreatePlayerUseCase(repository)

        val result = useCase("A".repeat(31)) // 31 caracteres = acima do limite

        assertTrue(result.isFailure)
        val error = result.exceptionOrNull()
        assertIs<AppError.ValidationError>(error)
        assertTrue(error.message!!.contains("30"))
    }

    /**
     * Cenário: nome com espaços nas bordas > deve ser trimado antes de salvar.
     *
     * Usa subclasse anônima do FakeQuizRepository para capturar o nome
     * que chegou ao repositório e verificar que foi trimado.
     */
    @Test
    fun `invoke trims whitespace from name before processing`() = runTest {
        var capturedName = ""
        val repository = object : FakeQuizRepository(playerResult = Result.success(fakePlayer)) {
            override suspend fun getOrCreatePlayer(name: String) = Result.success(
                // Captura o nome recebido para verificação
                fakePlayer.copy(name = name).also { capturedName = name }
            )
        }
        val useCase = GetOrCreatePlayerUseCase(repository)

        useCase("  Alice  ") // espaços nas bordas

        // Verifica que o repositório recebeu "Alice" sem espaços
        assertEquals("Alice", capturedName)
    }
}
