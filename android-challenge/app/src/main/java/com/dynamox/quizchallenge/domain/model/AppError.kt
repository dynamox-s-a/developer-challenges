package com.dynamox.quizchallenge.domain.model

/**
 * Domain-level representation of everything that can go wrong when talking to the quiz backend.
 * The data layer is responsible for translating raw exceptions/HTTP status codes into these
 * types, so the UI and ViewModels never need to know about Retrofit, OkHttp or HTTP codes.
 *
 * Modeled after specific HTTP status codes (as called out by the challenge's bonus
 * requirements: 400 for validation, 404 for not found, 500 for unexpected errors) rather than
 * broad "4xx/5xx" buckets, so each case can carry a distinct, more actionable user message.
 */
sealed class AppError : Throwable() {

    /** No usable network connection, or the request timed out. */
    data object Network : AppError()

    /** HTTP 400: the server rejected the request as invalid (e.g. a malformed body). */
    data object BadRequest : AppError()

    /**
     * HTTP 404: the requested resource does not exist.
     *
     * Note: the real backend actually reports an unknown `questionId` as HTTP 400 (with a plain
     * text body), not 404 -- see [BadRequest] and `QuizRepositoryImplTest`. This case is still
     * modeled explicitly so the mapping stays correct and complete if the API ever does return a
     * real 404, instead of silently lumping it into [Unknown].
     */
    data object NotFound : AppError()

    /** HTTP 5xx: the server encountered an unexpected error. */
    data object ServerError : AppError()

    /** Any other unexpected HTTP status code, or a response the app couldn't parse. */
    data class Unknown(override val message: String? = null) : AppError()
}
