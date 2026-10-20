package com.romulofer.backend.sensor

import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.stereotype.Repository
import tools.jackson.databind.ObjectMapper

@Repository
class JsonSensorRepository(
    objectMapper: ObjectMapper,
    @Value("classpath:data/db.json") seedResource: Resource,
) : SensorRepository {

    private val seed: SensorSeed = seedResource.inputStream.use {
        objectMapper.readValue(it, SensorSeed::class.java)
    }

    override fun getMachine(): Machine = seed.machine

    override fun getSeries(): List<Series> = seed.series
}

internal data class SensorSeed(val machine: Machine, val series: List<Series>)
