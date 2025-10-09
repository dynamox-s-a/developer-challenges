package com.dynamox.quiz.database.koin

import com.dynamox.quiz.database.DatabaseDynamoxQuiz
import com.dynamox.quiz.database.createDatabase
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.database.repository.impl.ClientDataRepositoryImpl
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Koin module for setting up the persistence layer.
 *
 * This module provides the necessary dependencies for database access and
 * data repository management.
 *
 * @return A Koin [Module] containing the persistence layer definitions.
 */
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