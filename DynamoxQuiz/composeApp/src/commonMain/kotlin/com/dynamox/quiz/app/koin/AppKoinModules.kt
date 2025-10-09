package com.dynamox.quiz.app.koin

import com.dynamox.quiz.api.koin.apiKoinModule
import com.dynamox.quiz.app.api.QuizApiConfig
import com.dynamox.quiz.app.auth.viewModel.AuthViewModel
import com.dynamox.quiz.app.auth.viewModel.impl.AuthViewModelImpl
import com.dynamox.quiz.app.home.profile.viewModel.ProfileViewModel
import com.dynamox.quiz.app.home.profile.viewModel.ProfileViewModelImpl
import com.dynamox.quiz.app.home.viewModel.HomeViewModel
import com.dynamox.quiz.app.home.viewModel.impl.HomeViewModelImpl
import com.dynamox.quiz.app.quiz.viewModel.QuizViewModel
import com.dynamox.quiz.app.quiz.viewModel.impl.QuizViewModelImpl
import com.dynamox.quiz.app.signup.viewModel.SignUpViewModel
import com.dynamox.quiz.app.signup.viewModel.impl.SignUpViewModelImpl
import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.app.session.impl.SessionManagerImpl
import com.dynamox.quiz.auth.koin.authKoinModule
import com.dynamox.quiz.database.koin.persistenceKoinModule
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Aggregates all Koin modules for the application.
 * This includes modules for persistence, authentication, and API interactions.
 * Additionally, it defines ViewModel and SessionManager dependencies.
 */
fun appKoinModule(): List<Module> {
    val persistence = persistenceKoinModule()
    val auth = authKoinModule()
    val api = apiKoinModule(apiUrl = QuizApiConfig.baseUrl)
    return persistence + auth + api + module {
        single<SessionManager> {
            SessionManagerImpl(authenticator = get())
        }

        factory<AuthViewModel> { AuthViewModelImpl(sessionManager = get()) }
        factory<SignUpViewModel> { SignUpViewModelImpl(sessionManager = get()) }
        factory<HomeViewModel> { HomeViewModelImpl(repository = get()) }
        factory<ProfileViewModel> {
            ProfileViewModelImpl(
                repository = get(),
                sessionManager = get()
            )
        }
        factory<QuizViewModel> {
            QuizViewModelImpl(repository = get(), sessionManager = get(), quizApi = get())
        }
    }
}