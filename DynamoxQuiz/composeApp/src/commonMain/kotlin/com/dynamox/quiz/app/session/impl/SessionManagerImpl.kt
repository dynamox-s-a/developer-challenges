package com.dynamox.quiz.app.session.impl

import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.app.session.model.SessionState
import com.dynamox.quiz.auth.Authenticator
import com.dynamox.quiz.auth.model.AuthenticateResult
import com.dynamox.quiz.auth.model.RegisterResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update

class SessionManagerImpl(
    private val authenticator: Authenticator,
) : SessionManager {
    override val state = MutableStateFlow<SessionState>(SessionState.Unauthenticated)

    override suspend fun register(
        email: String,
        password: CharArray,
        name: String
    ): RegisterResult {
        val result = authenticator.register(name, email, password)
        if (result is RegisterResult.Success) {
            state.update { SessionState.Authenticated(result.user) }
        }
        return result
    }

    override suspend fun login(
        email: String,
        password: CharArray
    ): AuthenticateResult {
        val result = authenticator.authenticate(email, password)
        if (result is AuthenticateResult.Success) {
            state.update { SessionState.Authenticated(result.user) }
        }
        return result
    }

    override fun logout() {
        state.update { SessionState.Unauthenticated }
    }

    override fun setRegistering() {
        state.update { SessionState.Registering }
    }

    override fun setAuthenticating() {
        state.update { SessionState.Unauthenticated }
    }
}