package com.dynamox.quiz.auth.koin

import com.dynamox.quiz.auth.Authenticator
import com.dynamox.quiz.auth.impl.AuthenticatorImpl
import com.dynamox.quiz.auth.kdf.PasswordKdf
import com.dynamox.quiz.auth.kdf.Pbkdf2Kdf
import org.koin.core.module.Module
import org.koin.dsl.module


/**
 * Koin module for authentication-related dependencies.
 *
 * Provides implementations for password key derivation and authentication services.
 *
 * @return A Koin [Module] with authentication dependencies.
 */
fun authKoinModule(): Module = module {
    single<PasswordKdf> { Pbkdf2Kdf() }
    single<Authenticator> { AuthenticatorImpl(repository = get(), kdf = get()) }
}