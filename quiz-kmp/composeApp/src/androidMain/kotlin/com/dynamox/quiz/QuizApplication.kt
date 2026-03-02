package com.dynamox.quiz

import android.app.Application
import com.dynamox.quiz.di.androidModule
import com.dynamox.quiz.di.appModules
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

/**
 * Classe Application personalizada do Android
 * O Android instancia esta classe ANTES de qualquer Activity ou Service.
 * Local para inicializar bibliotecas globais como o Koin, pois garante que as dependências estarão
 * disponíveis quando qualquer tela for criada.
 */
class QuizApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@QuizApplication)
            modules(appModules + androidModule)
        }
    }
}
