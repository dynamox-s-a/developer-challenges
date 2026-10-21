package com.romulofer.kotlinMultiplatform.presentation.registration

import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason

data class RegistrationUiState(
    val name: String = "",
    val nameError: InvalidNameReason? = null,
    val storageFailed: Boolean = false,
    val isLoading: Boolean = false
)
