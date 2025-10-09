package com.dynamox.quiz.shared

import kotlin.time.Clock

/**
 * Returns the current system epoch time in milliseconds.
 */
fun systemEpochMilliseconds(): Long = Clock.System.now().toEpochMilliseconds()