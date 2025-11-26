package com.franckkumako.dynamoxquiz.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [PlayerEntity::class, ScoreEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun quizDao(): QuizDao
}
