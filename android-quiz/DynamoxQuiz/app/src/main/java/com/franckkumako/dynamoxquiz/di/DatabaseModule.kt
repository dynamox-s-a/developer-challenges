package com.franckkumako.dynamoxquiz.di

import android.content.Context
import androidx.room.Room
import com.franckkumako.dynamoxquiz.data.local.AppDatabase
import com.franckkumako.dynamoxquiz.data.local.QuizDao
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
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "quiz_db"
        ).build()
    }

    @Provides
    @Singleton
    fun provideQuizDao(db: AppDatabase): QuizDao = db.quizDao()
}
