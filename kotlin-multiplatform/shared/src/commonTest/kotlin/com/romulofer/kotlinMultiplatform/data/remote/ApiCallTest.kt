package com.romulofer.kotlinMultiplatform.data.remote

import assertk.assertFailure
import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isInstanceOf
import com.romulofer.kotlinMultiplatform.domain.model.DataResult.Success
import kotlinx.coroutines.test.runTest
import kotlin.coroutines.cancellation.CancellationException
import kotlin.test.Test

class ApiCallTest{
    @Test
    fun `returns success with the block value`() = runTest{
        assertThat(apiCall { 42 }).isEqualTo(Success(42))
    }

    @Test
    fun `rethrows cancellation instead of mapping it`() = runTest{
        assertFailure { apiCall { throw CancellationException("cancelled") } }
            .isInstanceOf<CancellationException>()

    }
}