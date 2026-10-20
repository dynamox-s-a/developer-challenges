package com.romulofer.backend.sensor

import assertk.assertFailure
import assertk.assertThat
import assertk.assertions.containsExactly
import assertk.assertions.isEqualTo
import assertk.assertions.isNotEmpty
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.ClassPathResource
import tools.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant.parse
import kotlin.test.Test

class JsonSensorRepositoryTest {

    private val repository = JsonSensorRepository(
        objectMapper = jacksonObjectMapper(),
        seedResource = ClassPathResource("data/db.json")
    )

    @Test
    fun `loads the machine`() {
        val expectedResult = Machine(
            name = "Máquina 1023",
            point = "Ponto 20192",
            sampleRate = 200,
            range = "16g",
            interval = "20 min",
        )

        assertThat(repository.getMachine()).isEqualTo(expectedResult)
    }

    @Test
    fun `loads the seven series in contract order`() {
        val names = repository.getSeries().map { it.name }

        assertThat(names).containsExactly(
            "accelerationRms/x",
            "accelerationRms/y",
            "accelerationRms/z",
            "velocityRms/x",
            "velocityRms/y",
            "velocityRms/z",
            "temperature",
        )
    }

    @Test
    fun `every series has the same non-empty timestamps`() {
        val timestamps = repository.getSeries().map { series -> series.data.map { it.datetime } }

        assertThat(timestamps.first()).isNotEmpty()
        assertThat(timestamps.distinct().size).isEqualTo(1)
    }

    @Test
    fun `every datetime is an ISO instant`() {
        repository.getSeries().flatMap { it.data }.forEach { parse(it.datetime) }
    }

    @Test
    fun `fails fast when the seed is not valid json`() {
        assertFailure {
            JsonSensorRepository(jacksonObjectMapper(), ByteArrayResource("not json".toByteArray()))
        }
    }

}
