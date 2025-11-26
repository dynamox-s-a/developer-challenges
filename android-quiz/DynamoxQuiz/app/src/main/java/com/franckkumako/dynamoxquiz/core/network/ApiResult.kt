package com.franckkumako.dynamoxquiz.core.network

// Comentário em português:
// Wrapper simples para representar sucesso/erro em chamadas de rede
sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val throwable: Throwable) : ApiResult<Nothing>()
}
