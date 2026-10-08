package br.com.govanidebastiani.dynamoxquiz

import android.app.Application
import br.com.govanidebastiani.dynamoxquiz.di.initKoin
import org.koin.android.ext.koin.androidContext

class DynamoxQuizApplication: Application() {
    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@DynamoxQuizApplication)
        }
    }
}