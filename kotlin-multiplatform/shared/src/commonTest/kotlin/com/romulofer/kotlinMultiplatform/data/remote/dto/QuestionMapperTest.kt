package com.romulofer.kotlinMultiplatform.data.remote.dto

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.romulofer.kotlinMultiplatform.domain.model.Question
import kotlin.test.Test

class QuestionMapperTest {

    @Test
    fun `maps question dto to domain`(){
        val dto = QuestionDto(id = "44", statement = "Q", options = listOf("A", "B"))

        val question = dto.toDomain()

        val expectedResult = Question(id = "44", statement = "Q", options = listOf("A", "B"))

        assertThat(question).isEqualTo(expectedResult)
    }

}
