package com.romulofer.kotlinMultiplatform.domain.model

sealed interface AppError {
    data object NoConnection: AppError
    data class Server(val code: Int): AppError
    data object Unknown: AppError
}