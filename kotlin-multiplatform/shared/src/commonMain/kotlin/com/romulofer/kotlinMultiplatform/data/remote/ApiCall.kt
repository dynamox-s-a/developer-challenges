package com.romulofer.kotlinMultiplatform.data.remote

import com.romulofer.kotlinMultiplatform.domain.model.AppError
import com.romulofer.kotlinMultiplatform.domain.model.DataResult
import io.ktor.client.plugins.ResponseException
import io.ktor.utils.io.CancellationException
import kotlinx.io.IOException

internal suspend fun <T> apiCall(block: suspend() -> T): DataResult<T> =
    try{
        DataResult.Success(block())
    } catch (e: CancellationException) {
        throw e
    } catch (e: Exception){
        DataResult.Failure(e.toAppError())
    }

private fun Exception.toAppError(): AppError = when(this){
    is ResponseException -> AppError.Server(response.status.value)
    is IOException -> AppError.NoConnection
    else -> AppError.Unknown
}