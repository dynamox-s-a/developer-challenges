package com.romulofer.kotlinMultiplatform.data.remote

import kotlinx.serialization.json.Json

internal val apiJson = Json {
    ignoreUnknownKeys = true
}