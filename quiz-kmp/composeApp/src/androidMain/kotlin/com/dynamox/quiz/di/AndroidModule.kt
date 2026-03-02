package com.dynamox.quiz.di

import com.dynamox.quiz.data.local.AndroidDatabaseDriverFactory
import com.dynamox.quiz.data.local.DatabaseDriverFactory
import org.koin.android.ext.koin.androidContext
import org.koin.dsl.bind
import org.koin.dsl.module

val androidModule = module {
    single { AndroidDatabaseDriverFactory(androidContext()) } bind DatabaseDriverFactory::class
}
