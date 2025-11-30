package com.andrebritovita.quizapp.data.local

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.andrebritovita.quizapp.data.local.dao.ScoreDao
import com.andrebritovita.quizapp.data.local.entity.ScoreEntity
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.io.IOException

@RunWith(AndroidJUnit4::class)
class ScoreDaoTest {

    private lateinit var scoreDao: ScoreDao
    private lateinit var db: QuizDatabase

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, QuizDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        scoreDao = db.scoreDao
    }

    @After
    @Throws(IOException::class)
    fun closeDb() {
        db.close()
    }

    @Test
    @Throws(Exception::class)
    fun insertScore_and_getAllScores_returns_inserted_data() = runBlocking {
        val score = ScoreEntity(name = "Teste Integration", score = 10, gameDate = 12345L)

        scoreDao.insertScore(score)

        val list = scoreDao.getAllScores().first()

        assertEquals(1, list.size)
        assertEquals("Teste Integration", list[0].name)
        assertEquals(10, list[0].score)
    }
}