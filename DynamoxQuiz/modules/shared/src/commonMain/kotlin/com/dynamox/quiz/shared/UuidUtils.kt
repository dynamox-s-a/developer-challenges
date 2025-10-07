package com.dynamox.quiz.shared

import kotlin.uuid.Uuid

fun Uuid.Companion.fromString(stringUuid: String): Uuid {
    return try {
        parse(stringUuid)
    } catch (ex: Exception) {
        throw IllegalArgumentException("Failed to parse $stringUuid to Uuid", ex)
    }
}

fun String.toUuid(): Uuid = Uuid.fromString(this)