package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository

class FetchQuizByIdUseCase(
    private val quizRepository: QuizRepository
) {
    suspend operator fun invoke(quizId: Long): Quiz {
        return quizRepository.fetchQuizById(quizId)
    }
}