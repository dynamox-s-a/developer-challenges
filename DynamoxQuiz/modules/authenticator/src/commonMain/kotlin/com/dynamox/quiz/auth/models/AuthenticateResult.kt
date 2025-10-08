package com.dynamox.quiz.auth.models

import com.dynamox.quiz.database.models.User

sealed interface AuthenticateResult {
    data object FailedToLoadUser : AuthenticateResult
    data object UserDeleted : AuthenticateResult
    data object InvalidCredentials : AuthenticateResult
    data object FailedToUpdateCredentials : AuthenticateResult
    data class Success(val user: User) : AuthenticateResult
}