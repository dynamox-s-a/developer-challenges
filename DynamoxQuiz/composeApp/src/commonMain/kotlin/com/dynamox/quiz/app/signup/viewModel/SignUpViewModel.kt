package com.dynamox.quiz.app.signup.viewModel

import kotlinx.coroutines.flow.StateFlow

interface SignUpViewModel {
    val name: StateFlow<String>
    val email: StateFlow<String>
    val password: StateFlow<String>
    val isLoading: StateFlow<Boolean>
    val errorMessage: StateFlow<String?>

    fun updateName(newName: String)
    fun updateEmail(newEmail: String)
    fun updatePassword(newPassword: String)
    fun register()
}