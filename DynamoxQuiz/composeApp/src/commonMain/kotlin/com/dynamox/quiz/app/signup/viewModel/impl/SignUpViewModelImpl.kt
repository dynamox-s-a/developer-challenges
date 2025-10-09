package com.dynamox.quiz.app.signup.viewModel.impl

import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.app.signup.viewModel.SignUpViewModel
import com.dynamox.quiz.app.util.EmailValidator
import com.dynamox.quiz.auth.model.RegisterResult
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.email_already_in_use_message
import dynamoxquiz.composeapp.generated.resources.empty_name_error
import dynamoxquiz.composeapp.generated.resources.failed_to_create_user_message
import dynamoxquiz.composeapp.generated.resources.failed_to_verify_email_message
import dynamoxquiz.composeapp.generated.resources.invalid_email_error
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.getString
import org.jetbrains.compose.resources.stringResource

class SignUpViewModelImpl(
    private val sessionManager: SessionManager,
): SignUpViewModel {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override val name = MutableStateFlow("")
    override val email = MutableStateFlow("")
    override val password = MutableStateFlow("")
    override val isLoading = MutableStateFlow(false)
    override val errorMessage = MutableStateFlow<String?>(null)

    override fun updateName(newName: String) {
        name.update { newName }
    }

    override fun updateEmail(newEmail: String) {
        email.update { newEmail }
    }

    override fun updatePassword(newPassword: String) {
        password.update { newPassword }
    }

    override fun register() {
        val name = name.value
        val email = email.value
        val password = password.value.toCharArray()

        scope.launch {
            if (name.isBlank()) {
                errorMessage.update { getString(Res.string.empty_name_error) }
                return@launch
            }

            if (!(EmailValidator.isValidEmail(email))) {
                errorMessage.update { getString(Res.string.invalid_email_error) }
                return@launch
            }
            isLoading.update { true }
            errorMessage.update { null }
            val result = sessionManager.register(name = name, email = email, password = password)
            val message = when (result) {
                is RegisterResult.Success -> null
                is RegisterResult.FailedToVerifyEmail -> getString(Res.string.failed_to_verify_email_message)
                is RegisterResult.EmailAlreadyInUse -> getString(Res.string.email_already_in_use_message)
                is RegisterResult.FailedToCreateUser -> getString(Res.string.failed_to_create_user_message)
            }
            errorMessage.update { message }
            isLoading.update { false }
        }
    }
}