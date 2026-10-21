package com.romulofer.kotlinMultiplatform.data.local

import kotlin.time.Clock
import kotlin.time.Instant

internal class FakeClock(var current: Instant): Clock {
    override fun now(): Instant = current
}