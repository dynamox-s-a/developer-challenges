package com.romulofer.kotlinMultiplatform.domain.usecase

import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.Blank
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.TooLong
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.Invalid
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.Registered
import com.romulofer.kotlinMultiplatform.domain.model.RegisterPlayerResult.StorageFailure
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.util.catching

class RegisterPlayerUseCase(private val players: PlayerRepository) {

    suspend operator fun invoke(rawName: String): RegisterPlayerResult {
        val name = rawName.trim()
        return when {
            name.isEmpty() -> Invalid(Blank)
            name.length > MAX_NAME_LENGTH -> Invalid(TooLong)
            else -> catching { players.getOrCreate(name) }.fold(
                onSuccess = { Registered(it) },
                onFailure = { StorageFailure },
            )
        }
    }

    companion object {
        const val MAX_NAME_LENGTH = 20
    }
}
