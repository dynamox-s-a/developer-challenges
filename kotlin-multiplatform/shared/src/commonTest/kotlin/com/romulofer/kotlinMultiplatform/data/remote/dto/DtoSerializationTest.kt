package com.romulofer.kotlinMultiplatform.data.remote.dto

import assertk.assertFailure
import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isFalse
import assertk.assertions.isInstanceOf
import assertk.assertions.isTrue
import com.romulofer.kotlinMultiplatform.data.remote.apiJson
import kotlinx.serialization.SerializationException
import kotlin.test.Test
import kotlinx.serialization.decodeFromString
class DtoSerializationTest {

    @Test
    fun `decodes question`(){
        val text = """{"id":"44","statement":"Quais os nomes dos três Reis Magos?","options":["A","B","C"]}"""

        val dto = apiJson.decodeFromString<QuestionDto>(text)

        val expectedResult = QuestionDto (
            id = "44",
            statement = "Quais os nomes dos três Reis Magos?",
            options = listOf("A", "B", "C")
        )

        assertThat(dto).isEqualTo(expectedResult)
    }

    @Test
    fun `encodes answer request`(){
        val text = apiJson.encodeToString(AnswerRequestDto("Dynamox"))

        assertThat(text).isEqualTo("""{"answer":"Dynamox"}""")
    }

    @Test
    fun `fails when required field is missing`(){
        val text = """{"id":"44","options":["A"]}"""

        assertFailure { apiJson.decodeFromString<QuestionDto>(text) }
            .isInstanceOf<SerializationException>()
    }

    @Test
    fun `ignores unknown keys`(){
        val text = """{"id":"44","statement":"Q","options":["A"],"category":"history"}"""

        val expectedResult = QuestionDto (
            id = "44",
            statement = "Q",
            options = listOf("A")
        )

        val dto = apiJson.decodeFromString<QuestionDto>(text)
        assertThat(dto).isEqualTo(expectedResult)
    }

    @Test
    fun `decodes correct answer result`(){
        val dto = apiJson.decodeFromString<AnswerResponseDto>("""{"result": true}""")

        assertThat(dto.result).isTrue()
    }

    @Test
    fun `decodes wrong answer result`() {
        val dto = apiJson.decodeFromString<AnswerResponseDto>("""{"result": false}""")

        assertThat(dto.result).isFalse()
    }

    @Test
    fun `fails when body is not json`() {
        val text = "400 BAD REQUEST: Question not found."

        assertFailure { apiJson.decodeFromString<QuestionDto>(text) }
            .isInstanceOf<SerializationException>()
    }
}