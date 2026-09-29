package com.dynamox.quizchallenge.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

// exportSchema is disabled for simplicity in this challenge; a long-lived production app
// would export it under app/schemas and check it in to support migration testing.
@Database(entities = [PlayerScoreEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun playerScoreDao(): PlayerScoreDao
}
