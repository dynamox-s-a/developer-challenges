package com.dynamox.quiz.auth.models

interface ChangePasswordResult {
    data object FailedToLoadUser : ChangePasswordResult
    data object UserDeleted : ChangePasswordResult
    data object InvalidCredentials : ChangePasswordResult
    data object FailedToUpdateCredentials : ChangePasswordResult
    data object Success : ChangePasswordResult
}