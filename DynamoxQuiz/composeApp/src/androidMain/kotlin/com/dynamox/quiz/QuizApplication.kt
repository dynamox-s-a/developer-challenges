package com.dynamox.quiz

import android.app.Application
import android.content.Context
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

class QuizApplication: Application() {
    override fun onCreate() {
        super.onCreate()
        val appContext: Context = this

        startKoin {
            androidContext(appContext)
            modules(appKoinModule() + androidKoinModule(context = appContext))
        }
    }
}