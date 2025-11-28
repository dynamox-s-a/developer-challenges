package com.andrebritovita.quizapp.di

import com.andrebritovita.quizapp.data.repository.QuizRepositoryImpl
import com.andrebritovita.quizapp.domain.repository.QuizRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Módulo Hilt responsável por vincular a interface do Repositório à sua implementação.
 *
 * Isso permite que o Domínio (UseCases) peça apenas 'QuizRepository'
 * e o Hilt saiba entregar 'QuizRepositoryImpl'.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindQuizRepository(
        quizRepositoryImpl: QuizRepositoryImpl
    ): QuizRepository
}