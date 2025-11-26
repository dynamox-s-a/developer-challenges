package com.franckkumako.dynamoxquiz.di

import com.franckkumako.dynamoxquiz.data.local.QuizDao
import com.franckkumako.dynamoxquiz.data.remote.QuizApi
import com.franckkumako.dynamoxquiz.data.repository.QuizRepositoryImpl
import com.franckkumako.dynamoxquiz.domain.repository.QuizRepository
import com.franckkumako.dynamoxquiz.domain.usecase.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideQuizRepository(
        api: QuizApi,
        dao: QuizDao
    ): QuizRepository = QuizRepositoryImpl(api, dao)

    @Provides
    fun provideGetQuestionUseCase(repository: QuizRepository) =
        GetQuestionUseCase(repository)

    @Provides
    fun provideSubmitAnswerUseCase(repository: QuizRepository) =
        SubmitAnswerUseCase(repository)

    @Provides
    fun provideSaveScoreUseCase(repository: QuizRepository) =
        SaveScoreUseCase(repository)

    @Provides
    fun provideGetScoresUseCase(repository: QuizRepository) =
        GetScoresUseCase(repository)
}
