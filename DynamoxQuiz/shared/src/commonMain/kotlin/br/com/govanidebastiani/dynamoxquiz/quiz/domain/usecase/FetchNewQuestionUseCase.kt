package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository

class FetchNewQuestionUseCase(
    private val quizRepository: QuizRepository
) {
    suspend operator fun invoke(ignoreIds: List<String>, maxAttempts: Int = 3): Result<Question, DataError.Remote> {
        var attempts = 0

        while (attempts < maxAttempts) {
            attempts++

            when (val result = quizRepository.fetchQuestion()) {
                is Result.Success -> {
                    if (result.data.id !in ignoreIds) {
                        return result
                    }
                }
                is Result.Error -> {
                    return result
                }
            }
        }

        return Result.Error(DataError.Remote.NOT_FOUND)
    }
}