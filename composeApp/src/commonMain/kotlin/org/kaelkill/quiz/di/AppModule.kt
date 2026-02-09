package org.kaelkill.quiz.di

import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import org.kaelkill.quiz.application.usecases.AnswerQuestionUseCase
import org.kaelkill.quiz.application.usecases.FillSessionUseCase
import org.kaelkill.quiz.application.usecases.RegisterOrLoginPlayerUseCase
import org.kaelkill.quiz.application.usecases.StartNewQuizSessionUseCase
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import org.kaelkill.quiz.infrastructure.repositories.HttpQuestionRepository
import org.kaelkill.quiz.infrastructure.repositories.InMemoryPlayerRepository
import org.kaelkill.quiz.infrastructure.repositories.InMemoryQuizSessionRepository
import org.kaelkill.quiz.ui.viewmodel.QuizViewModel
import org.koin.dsl.module

val appModule = module {

    // HTTP Client
    single {
        HttpClient {
            install(ContentNegotiation) {
                val jsonConfig = Json { ignoreUnknownKeys = true }
                json(jsonConfig)
                json(jsonConfig, ContentType("text", "application-json"))
                json(jsonConfig, ContentType.Text.Html)
            }
        }
    }

    // Repositories
    single<PlayerRepository> { InMemoryPlayerRepository() }
    single<QuizSessionRepository> { InMemoryQuizSessionRepository() }
    single<QuestionRepository> { HttpQuestionRepository(get()) }

    // Use Cases
    factory { RegisterOrLoginPlayerUseCase(get()) }
    factory { FillSessionUseCase(get(), get()) }
    factory { StartNewQuizSessionUseCase(get(), get(), get()) }
    factory { AnswerQuestionUseCase(get(), get()) }

    // ViewModel
    factory { QuizViewModel(get(), get(), get(), get()) }
}