package com.dynamox.quiz.shared

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.withContext

suspend inline fun <R> runCatchingOnDispatcher(dispatcher: CoroutineDispatcher = Dispatchers.IO, crossinline block: suspend CoroutineScope.() -> R): Result<R> = withContext(dispatcher) {
    try {
        Result.success(block())
    } catch (ex: Exception) {
        Result.failure(ex)
    }
}