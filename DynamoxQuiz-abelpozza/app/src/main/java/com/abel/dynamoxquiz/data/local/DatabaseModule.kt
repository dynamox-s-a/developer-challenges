package com.abel.dynamoxquiz.di

import android.content.Context
import androidx.room.Room
import com.abel.dynamoxquiz.data.local.AppDatabase
import com.abel.dynamoxquiz.data.local.ScoreDao

object DatabaseModule {

    private var database:
            AppDatabase? = null

    fun provideDatabase(
        context: Context
    ): AppDatabase {
        return database ?: synchronized(this) {
            val instance = Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "dynamox_database"
            ).build()
            database = instance
            instance
        }
    }
    fun provideScoreDao(
        context: Context
    ): ScoreDao {
        return provideDatabase(
            context
        ).scoreDao()
    }
}