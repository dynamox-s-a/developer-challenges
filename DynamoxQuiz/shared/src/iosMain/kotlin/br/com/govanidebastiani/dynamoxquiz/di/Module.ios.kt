package br.com.govanidebastiani.dynamoxquiz.di

import br.com.govanidebastiani.dynamoxquiz.core.data.DatabaseDriverFactory
import br.com.govanidebastiani.dynamoxquiz.data.IOSDatabaseDriverFactory
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.engine.darwin.Darwin
import org.koin.core.module.Module
import org.koin.dsl.module

actual val targetModule: Module
    get() = module {
        single<HttpClientEngine> { Darwin.create() }
        single<DatabaseDriverFactory> { IOSDatabaseDriverFactory() }
    }