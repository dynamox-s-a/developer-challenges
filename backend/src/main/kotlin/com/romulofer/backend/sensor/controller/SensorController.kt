package com.romulofer.backend.sensor.controller

import com.romulofer.backend.sensor.Machine
import com.romulofer.backend.sensor.SensorRepository
import com.romulofer.backend.sensor.Series
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SensorController(private val repository: SensorRepository) {
    @GetMapping("/machine")
    fun machine(): Machine = repository.getMachine()

    @GetMapping("/series")
    fun series(): List<Series> = repository.getSeries()
}
