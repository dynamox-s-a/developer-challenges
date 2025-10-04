package com.dynamox.quiz

import android.app.Application
import android.content.Context
import org.koin.core.context.startKoin

class QuizApplication: Application() {
    override fun onCreate() {
        super.onCreate()
        val appContext: Context = this

        startKoin {
            modules(appKoinModule() + androidKoinModule(context = appContext))
        }
    }
}