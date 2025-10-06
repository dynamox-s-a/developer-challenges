package com.dynamox.quiz.api.utils

import platform.Foundation.NSError
import platform.Foundation.NSURLErrorDomain

actual fun Throwable.isCausedByNetworkError(): Boolean {
    val causes = generateSequence(this) { it.cause }
    return causes.any { it is NSError && it.domain == NSURLErrorDomain }
}