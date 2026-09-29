package com.dynamox.quizchallenge.di

import com.dynamox.quizchallenge.data.repository.QuizRepositoryImpl
import com.dynamox.quizchallenge.data.repository.ScoreRepositoryImpl
import com.dynamox.quizchallenge.domain.repository.QuizRepository
import com.dynamox.quizchallenge.domain.repository.ScoreRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindQuizRepository(impl: QuizRepositoryImpl): QuizRepository

    @Binds
    @Singleton
    abstract fun bindScoreRepository(impl: ScoreRepositoryImpl): ScoreRepository
}
