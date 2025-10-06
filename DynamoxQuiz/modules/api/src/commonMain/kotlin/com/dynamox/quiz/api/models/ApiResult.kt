package com.dynamox.quiz.api.models

data class ApiResult<Success>(
    val success: Success? = null,
    val error: ApiError? = null
) {
    val isSuccess: Boolean = success != null && error == null
    val isError: Boolean = error != null && success == null

    fun getOrThrow(): Success {
        return success
            ?: throw IllegalStateException("Cannot get success value from an error result")
    }

    inline fun onSuccess(block: (Success) -> Unit): ApiResult<Success> {
        success?.run(block)
        return this
    }

    inline fun onError(block: (ApiError) -> Unit): ApiResult<Success> {
        error?.run(block)
        return this
    }
}
