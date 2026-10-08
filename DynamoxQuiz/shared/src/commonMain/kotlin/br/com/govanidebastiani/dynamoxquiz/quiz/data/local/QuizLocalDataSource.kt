package br.com.govanidebastiani.dynamoxquiz.quiz.data.local

import br.com.geovanidebastiani.dynamoxquiz.db.QuizQueries
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz

class QuizLocalDataSource(
    private val quizQueries: QuizQueries
) {
    suspend fun createQuiz(quiz: Quiz): Long {
        return quizQueries.transactionWithResult {
            quizQueries.insertQuiz(
                amountQuestions = quiz.amountQuestions,
                amountCorrectAnswers = quiz.amountCorrectAnswers,
                createdAt = quiz.createdAt,
                playerNickname = quiz.playerNickname
            )

            quizQueries.lastInsertRowId().executeAsOne()
        }
    }

    suspend fun fetchQuiz(quizId: Long): Quiz {
        return quizQueries.fetchQuizById(quizId) { id, playerNickname, amountQuestions, amountCorrectAnswers, createdAt ->
            Quiz(
                id = id,
                playerNickname = playerNickname,
                amountQuestions = amountQuestions,
                amountCorrectAnswers = amountCorrectAnswers,
                createdAt = createdAt
            )
        }.executeAsOne()
    }

    suspend fun fetchAllQuizzes(): List<Quiz> {
        return quizQueries.queryAllQuiz() { id, playerNickname, amountQuestions, amountCorrectAnswers, createdAt ->
            Quiz(
                id = id,
                playerNickname = playerNickname,
                amountQuestions = amountQuestions,
                amountCorrectAnswers = amountCorrectAnswers,
                createdAt = createdAt
            )
        }.executeAsList()
    }
}