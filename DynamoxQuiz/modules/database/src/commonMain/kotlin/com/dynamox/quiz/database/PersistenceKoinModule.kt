package com.dynamox.quiz.database

import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.database.repository.ClientDataRepositoryImpl
import org.koin.core.module.Module
import org.koin.dsl.module

fun persistenceKoinModule(): Module {
    return module {
        single<DatabaseDynamoxQuiz> {
            createDatabase(driver = get())
        }
        single<ClientDataRepository> {
            ClientDataRepositoryImpl(database = get())
        }
    }
}