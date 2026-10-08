package br.com.govanidebastiani.dynamoxquiz.di

import org.koin.core.context.startKoin
import org.koin.dsl.KoinAppDeclaration

fun initKoin(config: KoinAppDeclaration? = null) {
    startKoin {
        config?.invoke(this)
        modules(
            viewModelModule,
            databaseModule,
            repositoryModule,
            useCaseModule,
            targetModule,
            networkModule
        )
    }
}