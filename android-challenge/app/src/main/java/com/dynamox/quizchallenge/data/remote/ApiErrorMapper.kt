package com.dynamox.quizchallenge.data.remote

import com.dynamox.quizchallenge.domain.model.AppError
import kotlinx.serialization.SerializationException
import retrofit2.HttpException
import java.io.IOException

/**
 * Runs [block] (a suspend Retrofit call) and converts any failure into a domain [AppError],
 * so repositories and everything above them never need to know about Retrofit/OkHttp
 * exceptions or raw HTTP status codes.
 *
 * Note: this intentionally does *not* catch a blanket [Exception]. Doing so would also catch
 * [kotlinx.coroutines.CancellationException], which must always propagate for structured
 * concurrency (e.g. cancelling in-flight requests) to keep working correctly.
 */
suspend fun <T> safeApiCall(block: suspend () -> T): Result<T> = try {
    Result.success(block())
} catch (e: HttpException) {
    val error = when (e.code()) {
        400 -> AppError.BadRequest
        404 -> AppError.NotFound
        in 500..599 -> AppError.ServerError
        else -> AppError.Unknown(e.message())
    }
    Result.failure(error)
} catch (e: IOException) {
    Result.failure(AppError.Network)
} catch (e: SerializationException) {
    Result.failure(AppError.Unknown(e.message))
}
