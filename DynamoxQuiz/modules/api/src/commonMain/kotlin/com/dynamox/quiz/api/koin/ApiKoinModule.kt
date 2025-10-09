package com.dynamox.quiz.api.koin

import com.dynamox.quiz.api.QuizApi
import com.dynamox.quiz.api.impl.QuizApiImpl
import io.ktor.client.HttpClient
import io.ktor.http.Url
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Koin module for providing API-related dependencies.
 *
 * @param apiUrl The base URL for the API.
 * @return A Koin [Module] that provides the necessary dependencies for the API.
 */
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