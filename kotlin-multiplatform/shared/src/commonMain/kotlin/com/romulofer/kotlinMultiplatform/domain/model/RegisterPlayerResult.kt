package com.romulofer.kotlinMultiplatform.domain.model

sealed interface RegisterPlayerResult {
    data class Registered(val player: Player): RegisterPlayerResult
    data class Invalid(val reason: InvalidNameReason): RegisterPlayerResult
    data object StorageFailure: RegisterPlayerResult
}
