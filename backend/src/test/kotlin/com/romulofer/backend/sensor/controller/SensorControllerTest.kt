package com.romulofer.backend.sensor.controller

import com.romulofer.backend.sensor.Machine
import com.romulofer.backend.sensor.SensorRepository
import com.romulofer.backend.sensor.Series
import com.romulofer.backend.sensor.SeriesPoint
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@WebMvcTest(SensorController::class)
@Import(SensorControllerTest.FakeRepositoryConfig::class)
class SensorControllerTest(
    @Autowired private val mockMvc: MockMvc
) {

    @TestConfiguration
    class FakeRepositoryConfig {
        @Bean
        fun sensorRepository(): SensorRepository = object : SensorRepository {
            override fun getMachine() = Machine(
                name = "Máquina 1",
                point = "Ponto 1",
                sampleRate = 200,
                range = "16g",
                interval = "20 min",
            )

            override fun getSeries() = listOf(
                Series(
                    name = "temperature",
                    data = listOf(
                        SeriesPoint(datetime = "2023-11-07T11:53:38.187Z", max = 23.5),
                        SeriesPoint(
                            datetime = "2023-11-07T12:13:38.187Z", max = 24.0
                        ),
                    ),
                )
            )
        }
    }

    @Test
    fun `GET machine returns the machine fields the frontend expects`() {
        mockMvc.get("/machine").andExpect {
            status { isOk() }
            content { contentTypeCompatibleWith(APPLICATION_JSON) }
            jsonPath("$.length()") { value(5) }
            jsonPath("$.name") { value("Máquina 1") }
            jsonPath("$.point") { value("Ponto 1") }
            jsonPath("$.sampleRate") { value(200) }
            jsonPath("$.range") { value("16g") }
            jsonPath("$.interval") { value("20 min") }
        }
    }

    @Test
    fun `GET series returns named series of datetime and max points`() {
        mockMvc.get("/series").andExpect {
            status { isOk() }
            content { contentTypeCompatibleWith(APPLICATION_JSON) }
            jsonPath("$.length()") { value(1) }
            jsonPath("$[0].name") { value("temperature") }
            jsonPath("$[0].data.length()") { value(2) }
            jsonPath("$[0].data[0].datetime") { value("2023-11-07T11:53:38.187Z") }
            jsonPath("$[0].data[0].max") { value(23.5) }
        }
    }

    @Test
    fun `allows the frontend origin`() {
        mockMvc.get("/series") { header("Origin", "http://localhost:5173") }.andExpect {
            status { isOk() }
            header { string("Access-Control-Allow-Origin", "http://localhost:5173") }
        }
    }

    @Test
    fun `rejects an unknown origin`() {
        mockMvc.get("/series") { header("Origin", "http://other.test") }.andExpect {
            status { isForbidden() }
        }
    }
}
