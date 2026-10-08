package br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase

import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository
import kotlin.time.Clock

class SaveQuizUseCase(
    private val quizRepository: QuizRepository
) {
    suspend operator fun invoke(playerNickname: String,
                                amountCorrectAnswers: Long,
                                amountQuestions: Long = 10): Long {

        val quiz = Quiz(
            playerNickname = playerNickname,
            amountCorrectAnswers = amountCorrectAnswers,
            amountQuestions = amountQuestions,
            createdAt = Clock.System.now().toEpochMilliseconds()
        )

        return quizRepository.createQuiz(quiz)
    }
}