package br.com.govanidebastiani.dynamoxquiz.quiz.data.repository

import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.core.domain.map
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerRequestDto
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerResponseDto
import br.com.govanidebastiani.dynamoxquiz.quiz.data.local.QuizLocalDataSource
import br.com.govanidebastiani.dynamoxquiz.quiz.data.mappers.toQuestion
import br.com.govanidebastiani.dynamoxquiz.quiz.data.remote.QuizRemoteDataSource
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class QuizRepositoryImpl(
    private val quizLocalDataSource: QuizLocalDataSource,
    private val quizRemoteDataSource: QuizRemoteDataSource
): QuizRepository {
    override suspend fun fetchQuestion(): Result<Question, DataError.Remote> = withContext(
        Dispatchers.IO) {
        return@withContext quizRemoteDataSource.fetchQuestion().map {
            it.toQuestion()
        }
    }

    override suspend fun submitAnswer(
        questionId: String,
        answer: String
    ): Result<QuestionAnswerResponseDto, DataError.Remote> = withContext(Dispatchers.IO) {
        return@withContext quizRemoteDataSource.submitAnswer(questionId, QuestionAnswerRequestDto(answer))
    }

    override suspend fun createQuiz(quiz: Quiz): Long = withContext(Dispatchers.IO) {
        return@withContext quizLocalDataSource.createQuiz(quiz)
    }

    override suspend fun fetchQuizById(quizId: Long): Quiz = withContext(Dispatchers.IO) {
        return@withContext quizLocalDataSource.fetchQuiz(quizId)
    }

    override suspend fun fetchAllQuizzes(): List<Quiz> = withContext(Dispatchers.IO) {
        return@withContext quizLocalDataSource.fetchAllQuizzes()
    }
}