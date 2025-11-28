package com.andrebritovita.quizapp.di

import android.content.Context
import androidx.room.Room
import com.andrebritovita.quizapp.data.local.QuizDatabase
import com.andrebritovita.quizapp.data.local.dao.ScoreDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): QuizDatabase {
        return Room.databaseBuilder(
            context,
            QuizDatabase::class.java,
            "quiz_database"
        ).fallbackToDestructiveMigration() // provisório para criação do app
            .build()
    }

    @Provides
    fun provideScoreDao(database: QuizDatabase): ScoreDao {
        return database.scoreDao
    }
}