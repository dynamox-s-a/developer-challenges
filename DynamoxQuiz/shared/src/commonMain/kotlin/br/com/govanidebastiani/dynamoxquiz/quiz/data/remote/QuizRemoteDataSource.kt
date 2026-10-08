package br.com.govanidebastiani.dynamoxquiz.quiz.data.remote

import br.com.govanidebastiani.dynamoxquiz.core.data.safeCall
import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerRequestDto
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionAnswerResponseDto
import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionDto
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import kotlinx.serialization.json.Json

private const val BASE_URL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app"

class QuizRemoteDataSource(
    private val httpClient: HttpClient
) {
    suspend fun fetchQuestion(): Result<QuestionDto, DataError.Remote> {
        return safeCall<QuestionDto> {
            httpClient.get("${BASE_URL}/question")
        }
    }

    suspend fun submitAnswer(questionId: String, answerRequest: QuestionAnswerRequestDto): Result<QuestionAnswerResponseDto, DataError.Remote> {
        return safeCall<QuestionAnswerResponseDto> {
            httpClient.post("${BASE_URL}/answer?questionId=$questionId") {
                setBody(Json.encodeToString(answerRequest))
            }
        }
    }
}