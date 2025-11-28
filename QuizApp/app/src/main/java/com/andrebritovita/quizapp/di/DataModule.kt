package com.andrebritovita.quizapp.di

import com.andrebritovita.quizapp.data.local.LocalDataSource
import com.andrebritovita.quizapp.data.local.LocalDataSourceImpl
import com.andrebritovita.quizapp.data.remote.RemoteDataSource
import com.andrebritovita.quizapp.data.remote.RemoteDataSourceImpl
import dagger.hilt.components.SingletonComponent
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import javax.inject.Singleton

/**
 * Módulo Hilt para vincular Interfaces de DataSource às suas Implementações.
 *
 * Usa @Binds para evitar boilerplate de código, já que Hilt sabe como criar
 * as implementações (elas possuem @Inject no construtor).
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {

    @Binds
    @Singleton
    abstract fun bindLocalDataSource(
        impl: LocalDataSourceImpl
    ): LocalDataSource

    @Binds
    @Singleton
    abstract fun bindRemoteDataSource(
        impl: RemoteDataSourceImpl
    ): RemoteDataSource
}