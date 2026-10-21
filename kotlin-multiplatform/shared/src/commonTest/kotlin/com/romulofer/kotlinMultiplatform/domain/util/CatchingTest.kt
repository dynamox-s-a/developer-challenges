package com.romulofer.kotlinMultiplatform.domain.util

import assertk.assertFailure
import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isInstanceOf
import assertk.assertions.isSuccess
import assertk.assertions.isFailure
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

class CatchingTest {

    @Test
    fun `returns the value when the block succeeds`() = runTest {
        val result = catching { 42 }

        assertThat(result).isSuccess().isEqualTo(42)
    }

    @Test
    fun `captures an exception thrown by the block`() = runTest {
        val result = catching<Int> { throw IllegalStateException("boom") }

        assertThat(result).isFailure().isInstanceOf<IllegalStateException>()
    }

    @Test
    fun `lets a cancellation go through`() = runTest {
        assertFailure { catching<Int> { throw CancellationException("cancelled") } }
            .isInstanceOf<CancellationException>()
    }
}
