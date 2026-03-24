package com.dynamox.quiz.domain.model


sealed class AppError : Exception() {
    data class NetworkError(override val message: String = "Sem conexão com a internet") : AppError()

    data class ServerError(val code: Int, override val message: String = "Erro no servidor") : AppError()

    data class NotFoundError(override val message: String = "Requisição não encontrada") : AppError()

    data class ValidationError(override val message: String = "Dado inválido") : AppError()

    data class UnknownError(override val message: String = "Ocorreu um erro inesperado") : AppError()
}
