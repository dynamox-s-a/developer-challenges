package com.dynamox.quiz.app.auth.viewModel

import kotlinx.coroutines.flow.StateFlow


interface AuthViewModel {
    val email: StateFlow<String>
    val password: StateFlow<String>
    val isLoading: StateFlow<Boolean>

    val errorMessage: StateFlow<String?>

    fun updateEmail(newEmail: String)

    fun updatePassword(newPassword: String)

    fun login()
}