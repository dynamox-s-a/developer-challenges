package com.dynamox.quiz.shared

import kotlin.time.Clock


fun systemEpochMilliseconds(): Long = Clock.System.now().toEpochMilliseconds()