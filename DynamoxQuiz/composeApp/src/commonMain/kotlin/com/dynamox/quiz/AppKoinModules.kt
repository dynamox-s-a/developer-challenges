package com.dynamox.quiz

import com.dynamox.quiz.database.persistenceKoinModule
import org.koin.core.module.Module
import org.koin.dsl.module


fun appKoinModule(): List<Module> {
    val persistence = persistenceKoinModule()
    return persistence + module {

    }
}