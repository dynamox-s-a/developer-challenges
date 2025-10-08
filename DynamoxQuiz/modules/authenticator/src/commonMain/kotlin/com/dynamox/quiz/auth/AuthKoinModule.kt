package com.dynamox.quiz.auth

import com.dynamox.quiz.auth.kdf.PasswordKdf
import com.dynamox.quiz.auth.kdf.Pbkdf2Kdf
import org.koin.core.module.Module
import org.koin.dsl.module

fun authKoinModule(): Module = module {
    single<PasswordKdf> { Pbkdf2Kdf() }
    single<Authenticator> { AuthenticatorImpl(repository = get(), kdf = get()) }
}