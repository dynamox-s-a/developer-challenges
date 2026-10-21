package com.romulofer.kotlinMultiplatform.domain.util

import kotlinx.coroutines.CancellationException

suspend fun <T> catching(block: suspend () -> T): Result<T> =
    try {
        Result.success(block())
    } catch (e: CancellationException) {
        throw e
    } catch (e: Exception) {
        Result.failure(e)
    }
