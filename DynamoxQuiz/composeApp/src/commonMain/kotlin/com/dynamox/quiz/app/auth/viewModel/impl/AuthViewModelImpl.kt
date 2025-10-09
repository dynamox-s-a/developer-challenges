package com.dynamox.quiz.app.auth.viewModel.impl

import com.dynamox.quiz.app.auth.viewModel.AuthViewModel
import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.auth.model.AuthenticateResult
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.failed_to_load_user_to_validate_message
import dynamoxquiz.composeapp.generated.resources.failed_to_update_credentials_message
import dynamoxquiz.composeapp.generated.resources.invalid_credentials_message
import dynamoxquiz.composeapp.generated.resources.user_deleted_message
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.getString

class AuthViewModelImpl(
    private val sessionManager: SessionManager,
) : AuthViewModel {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override val email = MutableStateFlow("")
    override val password = MutableStateFlow("")
    override val isLoading = MutableStateFlow(false)
    override val errorMessage = MutableStateFlow<String?>(null)


    override fun updateEmail(newEmail: String) {
        email.update { newEmail }
    }

    override fun updatePassword(newPassword: String) {
        password.update { newPassword }
    }

    override fun login() {
        val email = email.value
        val password = password.value.toCharArray()
        scope.launch {
            isLoading.update { true }
            errorMessage.update { null }
            val result = sessionManager.login(email, password)
            val message = when (result) {
                is AuthenticateResult.Success -> null
                AuthenticateResult.FailedToLoadUser -> getString(Res.string.failed_to_load_user_to_validate_message)
                AuthenticateResult.FailedToUpdateCredentials -> getString(Res.string.failed_to_update_credentials_message)
                AuthenticateResult.InvalidCredentials -> getString(Res.string.invalid_credentials_message)
                AuthenticateResult.UserDeleted -> getString(Res.string.user_deleted_message)
            }
            errorMessage.update { message }
            isLoading.update { false }
        }
    }
}