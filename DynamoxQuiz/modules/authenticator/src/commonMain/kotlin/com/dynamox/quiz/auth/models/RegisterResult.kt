package com.dynamox.quiz.auth.models

import com.dynamox.quiz.database.models.User

sealed interface RegisterResult {
    data object FailedToVerifyEmail : RegisterResult
    data object EmailAlreadyInUse : RegisterResult
    data object FailedToCreateUser : RegisterResult
    data class Success(val user: User) : RegisterResult
}