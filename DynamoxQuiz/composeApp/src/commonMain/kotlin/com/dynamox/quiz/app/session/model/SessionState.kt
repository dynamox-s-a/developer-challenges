package com.dynamox.quiz.app.session.model

import com.dynamox.quiz.database.model.User

sealed interface SessionState {
    data object Unauthenticated : SessionState
    data object Registering : SessionState
    data class Authenticated(val user: User) : SessionState
}