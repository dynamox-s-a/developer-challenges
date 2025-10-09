package com.dynamox.quiz.shared

import kotlin.uuid.Uuid

/** Parses a [String] to a [Uuid], throwing an [IllegalArgumentException] if the string is not a valid UUID.
 *
 * @param stringUuid The string representation of the UUID to parse.
 * @return The parsed [Uuid].
 * @throws IllegalArgumentException if the string is not a valid UUID.
 */
fun Uuid.Companion.fromString(stringUuid: String): Uuid {
    return try {
        parse(stringUuid)
    } catch (ex: Exception) {
        throw IllegalArgumentException("Failed to parse $stringUuid to Uuid", ex)
    }
}

/** Converts a [String] to a [Uuid], throwing an [IllegalArgumentException] if the string is not a valid UUID.
 *
 * @return The parsed [Uuid].
 * @throws IllegalArgumentException if the string is not a valid UUID.
 */
fun String.toUuid(): Uuid = Uuid.fromString(this)