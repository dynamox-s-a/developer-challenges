package com.andrebritovita.quizapp.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.andrebritovita.quizapp.data.local.dao.ScoreDao
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity

@Database([ScoreEntity::class], version = 1)
abstract class QuizDatabase : RoomDatabase () {
    abstract val scoreDao: ScoreDao
}