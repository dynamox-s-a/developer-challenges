package com.dynamox.quizchallenge.data.local

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Instrumented test (runs on a device/emulator via `./gradlew connectedAndroidTest`) so Room can
 * use a real SQLite implementation, exercising the actual persistence mechanism end to end.
 */
@RunWith(AndroidJUnit4::class)
class PlayerScoreDaoTest {

    private lateinit var database: AppDatabase
    private lateinit var dao: PlayerScoreDao

    @Before
    fun setUp() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java,
        ).allowMainThreadQueries().build()
        dao = database.playerScoreDao()
    }

    @After
    fun tearDown() {
        database.close()
    }

    @Test
    fun insertAndObserveAll_returnsScoresMostRecentFirst() = runTest {
        dao.insert(
            PlayerScoreEntity(playerName = "Ada", correctCount = 5, totalQuestions = 10, playedAtEpochMillis = 1_000),
        )
        dao.insert(
            PlayerScoreEntity(playerName = "Grace", correctCount = 9, totalQuestions = 10, playedAtEpochMillis = 2_000),
        )

        val scores = dao.observeAll().first()

        assertEquals(2, scores.size)
        assertEquals("Grace", scores.first().playerName) // higher timestamp -> most recent first
        assertEquals("Ada", scores.last().playerName)
    }

    @Test
    fun observeAll_emitsEmptyListWhenNoScoresSaved() = runTest {
        val scores = dao.observeAll().first()
        assertEquals(emptyList<PlayerScoreEntity>(), scores)
    }
}
