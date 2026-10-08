package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerResponseDto
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository

class SubmitAnswerUseCase(
    private val quizRepository: QuizRepository
) {
    suspend operator fun invoke(questionId: String, option: String): Result<QuestionAnswerResponseDto, DataError.Remote> {
        return quizRepository.submitAnswer(questionId, option)
    }
}