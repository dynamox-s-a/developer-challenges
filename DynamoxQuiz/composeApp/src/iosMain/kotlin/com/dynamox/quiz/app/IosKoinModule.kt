package com.dynamox.quiz.app

import app.cash.sqldelight.db.SqlDriver
import com.dynamox.quiz.app.koin.appKoinModule
import com.dynamox.quiz.database.DriverFactory
import org.koin.core.context.startKoin
import org.koin.core.module.Module
import org.koin.dsl.module

fun iosKoinModule(): Module {
    return module {
        single<SqlDriver> {
            DriverFactory().createDriver()
        }
    }
}

fun initKoin() {
    startKoin {
        modules(appKoinModule() + iosKoinModule())
    }
}