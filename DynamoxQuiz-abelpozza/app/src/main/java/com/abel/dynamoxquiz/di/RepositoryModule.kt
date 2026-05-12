package com.abel.dynamoxquiz.di

import com.abel.dynamoxquiz.data.repository.QuizRepositoryImpl
import com.abel.dynamoxquiz.domain.repository.QuizRepository

object RepositoryModule {

    fun provideQuizRepository(): QuizRepository {

        return QuizRepositoryImpl(
            apiService = NetworkModule.quizApiService
        )
    }
}