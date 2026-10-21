package com.romulofer.kotlinMultiplatform.domain.repository

import com.romulofer.kotlinMultiplatform.domain.model.Player

interface PlayerRepository {
    suspend fun getOrCreate(name: String): Player
}