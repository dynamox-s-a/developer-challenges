package com.romulofer.backend.sensor

import assertk.assertThat
import assertk.assertions.isEmpty
import assertk.assertions.isEqualTo
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.core.io.ClassPathResource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import tools.jackson.databind.JsonNode
import tools.jackson.databind.ObjectMapper

@SpringBootTest
@AutoConfigureMockMvc
class SeedContractTest(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper,
) {

    private val seed: JsonNode =
        ClassPathResource("data/db.json").inputStream.use { objectMapper.readTree(it) }

    private val sameNumbers = Comparator<JsonNode> { a, b ->
        when {
            a.isNumber && b.isNumber -> a.decimalValue().compareTo(b.decimalValue())
            a == b -> 0
            else -> 1
        }
    }

    private fun bodyOf(path: String): JsonNode {
        val response = mockMvc.get(path).andReturn().response
        return objectMapper.readTree(response.getContentAsString(Charsets.UTF_8))
    }

    @Test
    fun `machine endpoint serves the seed machine unchanged`() {
        assertThat(bodyOf("/machine")).isEqualTo(seed["machine"])
    }

    @Test
    fun `series endpoint serves every seed series unchanged`() {
        val actual = bodyOf("/series")
        val expected = seed["series"]

        assertThat(actual.size()).isEqualTo(expected.size())

        val differing = expected.mapIndexedNotNull { index, series ->
            series["name"].asString().takeUnless { actual[index].equals(sameNumbers, series) }
        }
        assertThat(differing).isEmpty()
    }
}
