package com.dynamox.quiz.auth.model

import com.dynamox.quiz.database.model.User

sealed interface AuthenticateResult {
    data object FailedToLoadUser : AuthenticateResult
    data object UserDeleted : AuthenticateResult
    data object InvalidCredentials : AuthenticateResult
    data object FailedToUpdateCredentials : AuthenticateResult
    data class Success(val user: User) : AuthenticateResult
}