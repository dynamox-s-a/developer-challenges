package com.dynamox.quiz.domain.usecase

import com.dynamox.quiz.domain.model.Question
import com.dynamox.quiz.domain.repository.QuizRepository

/**
 * Buscar uma pergunta aleatória do servidor.
 *
 * Cada Use Case recebe dependências via construtor (injetadas pelo Koin) e expõe apenas um método público.
 *
 * Motivso para abordagem:
 * - Testável isoladamente com um repositório fake
 * - Fácil de reutilizar em múltiplas telas
 * - Segue o Princípio da Responsabilidade Única (SRP do SOLID)
 *
 */
class GetQuestionUseCase(private val repository: QuizRepository) {
    suspend operator fun invoke(): Result<Question> = repository.getQuestion()
}
