package com.dynamox.quiz.shared

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.withContext

/**
 * Executes a suspending [block] of code on the specified [dispatcher] and returns a [Result] encapsulating
 * the outcome of the operation. If the block completes successfully, the result is wrapped in [Result.success].
 * If an exception is thrown during execution, it is caught and wrapped in [Result.failure].
 *
 * @param dispatcher The [CoroutineDispatcher] on which to execute the block. Defaults to [Dispatchers.IO].
 * @param block The suspending block of code to be executed.
 * @return A [Result] containing either the successful result or the exception thrown.
 */
suspend inline fun <R> runCatchingOnDispatcher(dispatcher: CoroutineDispatcher = Dispatchers.IO, crossinline block: suspend CoroutineScope.() -> R): Result<R> = withContext(dispatcher) {
    try {
        Result.success(block())
    } catch (ex: Exception) {
        Result.failure(ex)
    }
}