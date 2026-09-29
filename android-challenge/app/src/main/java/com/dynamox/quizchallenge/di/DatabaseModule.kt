package com.dynamox.quizchallenge.di

import android.content.Context
import androidx.room.Room
import com.dynamox.quizchallenge.data.local.AppDatabase
import com.dynamox.quizchallenge.data.local.PlayerScoreDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

private const val DATABASE_NAME = "quiz-challenge.db"

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, DATABASE_NAME).build()

    @Provides
    @Singleton
    fun providePlayerScoreDao(database: AppDatabase): PlayerScoreDao = database.playerScoreDao()
}
