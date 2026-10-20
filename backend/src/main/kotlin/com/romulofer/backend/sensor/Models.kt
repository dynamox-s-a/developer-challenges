package com.romulofer.backend.sensor

data class Machine(
    val name: String,
    val point: String,
    val sampleRate: Int,
    val range: String,
    val interval: String
)

data class SeriesPoint(val datetime: String, val max: Double)

data class Series(val name: String, val data: List<SeriesPoint>)
