package com.dynamox.quiz.shared.test

import com.dynamox.quiz.shared.fromString
import kotlin.test.Test
import kotlin.test.assertFails
import kotlin.test.assertTrue
import kotlin.uuid.Uuid

class UuidUtilsTest {
    @Test
    fun `test parse uuid from string`() {
        val validUuid = "123e4567-e89b-12d3-a456-426614174000"
        val parsedValidUuid = Uuid.fromString(validUuid)
        assertTrue(parsedValidUuid.toString() == validUuid)
        val invalidUuid = "invalid-uuid-string"
        assertFails { Uuid.fromString(invalidUuid) }
    }
}