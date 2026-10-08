package br.com.govanidebastiani.dynamoxquiz.quiz.data

import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerResponseDto
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository

class FakeQuizRepositoryImpl: QuizRepository {
    val savedQuizzes = mutableListOf<Quiz>()

    var fetchQuestionResult: Result<Question, DataError.Remote>? = null

    var submitAnswerResult: Result<QuestionAnswerResponseDto, DataError.Remote>? = null

    var shouldThrowLocalError: Boolean = false

    val answeredQuestions = mutableListOf<Question>()

    override suspend fun fetchQuestion(): Result<Question, DataError.Remote> {
        if (answeredQuestions.isNotEmpty()) {
            return Result.Success(answeredQuestions.removeAt(0))
        }

        return fetchQuestionResult ?: Result.Error(DataError.Remote.UNKNOWN)
    }

    override suspend fun submitAnswer(
        questionId: String,
        answer: String
    ): Result<QuestionAnswerResponseDto, DataError.Remote> {
        return submitAnswerResult ?: Result.Error(DataError.Remote.UNKNOWN)
    }

    override suspend fun createQuiz(quiz: Quiz): Long {
        if (shouldThrowLocalError) throw IllegalStateException("Database error")

        // To emulate the autoincrement
        quiz.id = (savedQuizzes.size + 1).toLong()
        savedQuizzes.add(quiz)

        return quiz.id
    }

    override suspend fun fetchQuizById(quizId: Long): Quiz {
        if (shouldThrowLocalError) throw IllegalStateException("Database error")

        return savedQuizzes.firstOrNull { it.id == quizId }
            ?: throw NoSuchElementException("Quiz with ID $quizId not found")
    }

    override suspend fun fetchAllQuizzes(): List<Quiz> {
        if (shouldThrowLocalError) throw IllegalStateException("Database error")

        return savedQuizzes.toList()
    }
}