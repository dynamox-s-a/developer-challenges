package com.romulofer.kotlinMultiplatform.domain.model

sealed interface DataResult<out T> {
    data class Success<T>(val value: T): DataResult<T>
    data class Failure(val error: AppError): DataResult<Nothing>
}