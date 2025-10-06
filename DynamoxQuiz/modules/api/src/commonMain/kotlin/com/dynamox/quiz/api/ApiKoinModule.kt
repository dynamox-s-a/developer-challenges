package com.dynamox.quiz.api

import com.dynamox.quiz.api.impl.QuizApiImpl
import io.ktor.client.HttpClient
import io.ktor.http.Url
import org.koin.core.module.Module
import org.koin.dsl.module

fun apiKoinModule(
    apiUrl: Url,
): Module {
    return module {
        single { HttpClient() }
        single<QuizApi> {
            QuizApiImpl(
                client = get(),
                apiUrl = apiUrl,
            )
        }
    }
}