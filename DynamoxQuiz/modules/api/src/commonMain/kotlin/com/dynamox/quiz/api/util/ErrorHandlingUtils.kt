package com.dynamox.quiz.api.util

import kotlin.reflect.KClass

/**
 * Checks if this throwable was caused by any of the specified [causes].
 */
fun Throwable.isCausedBy(vararg causes: KClass<out Throwable>): Boolean {
    val causeChain = generateSequence(this) { it.cause }
    return causeChain.any { throwableInChain ->
        causes.any { causeClass -> causeClass.isInstance(throwableInChain) }
    }
}

/**
 * Checks if the Throwable was caused by a network error.
 * This is useful for distinguishing between different types of errors,
 * such as network issues versus other exceptions.
 *
 * @return true if the Throwable was caused by a network error, false otherwise.
 */
expect fun Throwable.isCausedByNetworkError(): Boolean