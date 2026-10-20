package com.romulofer.backend.config

import com.romulofer.backend.sensor.Machine
import com.romulofer.backend.sensor.SensorRepository
import com.romulofer.backend.sensor.Series
import com.romulofer.backend.sensor.controller.SensorController
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType.APPLICATION_PROBLEM_JSON
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@WebMvcTest(SensorController::class)
@Import(ApiExceptionHandlerTest.FailingRepositoryConfig::class)
class ApiExceptionHandlerTest(@Autowired private val mockMvc: MockMvc) {

    @TestConfiguration
    class FailingRepositoryConfig {
        @Bean
        fun sensorRepository(): SensorRepository = object : SensorRepository {
            override fun getMachine(): Machine = error("secret internal detail")
            override fun getSeries(): List<Series> = error("secret internal detail")
        }
    }

    @Test
    fun `unknown path returns a 404 problem`() {
        mockMvc.get("/nothing").andExpect {
            status { isNotFound() }
            content { contentTypeCompatibleWith(APPLICATION_PROBLEM_JSON) }
            jsonPath("$.status") { value(404) }
            jsonPath("$.trace") { doesNotExist() }
        }
    }

    @Test
    fun `unsupported method returns a 405 problem`() {
        mockMvc.post("/machine").andExpect {
            status { isMethodNotAllowed() }
            content { contentTypeCompatibleWith(APPLICATION_PROBLEM_JSON) }
            jsonPath("$.status") { value(405) }
        }
    }

    @Test
    fun `unexpected failure returns a generic 500 problem without internals`() {
        mockMvc.get("/machine").andExpect {
            status { isInternalServerError() }
            content { contentTypeCompatibleWith(APPLICATION_PROBLEM_JSON) }
            jsonPath("$.status") { value(500) }
            jsonPath("$.detail") { value("Unexpected error.") }
            jsonPath("$.trace") { doesNotExist() }
        }
    }
}
