package com.dynamox.quiz.api.model

sealed interface ApiError {
    data object NetworkError: ApiError
    data object Forbidden: ApiError
    data object NotFound: ApiError
    data object Unauthorized: ApiError
    data object ParseError : ApiError
    data class OtherError(val serverMessage: String) : ApiError
}