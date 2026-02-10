package org.kaelkill.quiz

import androidx.compose.ui.window.ComposeUIViewController
import org.kaelkill.quiz.di.appModule
import org.kaelkill.quiz.infrastructure.db.DatabaseDriverFactory
import org.koin.core.context.startKoin
import org.koin.dsl.module

fun MainViewController() = ComposeUIViewController { App() }

fun initKoin() {
    startKoin {
        modules(appModule, module {
            single { DatabaseDriverFactory() }
        })
    }
}
