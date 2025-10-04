package com.dynamox.quiz

import android.content.Context
import app.cash.sqldelight.db.SqlDriver
import com.dynamox.quiz.database.DriverFactory
import org.koin.core.module.Module
import org.koin.dsl.module

fun androidKoinModule(context: Context): Module {
    return module {
        single<SqlDriver> {
            DriverFactory(context).createDriver()
        }
    }
}