package com.romulofer.kotlinMultiplatform

import android.app.Application
import com.romulofer.kotlinMultiplatform.di.initKoin
import org.koin.android.ext.koin.androidContext

class QuizApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin { androidContext(this@QuizApplication) }
    }
}