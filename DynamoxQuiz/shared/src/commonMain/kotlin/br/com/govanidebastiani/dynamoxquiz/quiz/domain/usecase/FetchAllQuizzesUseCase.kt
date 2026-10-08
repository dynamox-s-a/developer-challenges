package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository

class FetchAllQuizzesUseCase(
    private val quizRepository: QuizRepository
) {
    suspend operator fun invoke(): List<Quiz> {
        return quizRepository.fetchAllQuizzes()
    }
}