package com.romulofer.backend.sensor

interface SensorRepository {
    fun getMachine(): Machine
    fun getSeries(): List<Series>
}
