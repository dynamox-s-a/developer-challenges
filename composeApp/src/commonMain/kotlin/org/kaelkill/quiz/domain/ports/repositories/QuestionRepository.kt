package org.kaelkill.quiz.domain.ports.repositories

import org.kaelkill.quiz.domain.model.entities.Question

interface QuestionRepository {
    suspend fun getRandomQuestion(): Result<Question>
    suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean>
}