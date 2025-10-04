package com.dynamox.quiz.database

import org.koin.core.module.Module
import org.koin.dsl.module

fun persistenceKoinModule(): Module {
    return module {
        single<DatabaseDynamoxQuiz> {
            createDatabase(driver = get())
        }
    }
}