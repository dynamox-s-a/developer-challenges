package com.dynamox.quiz.test.database

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import app.cash.sqldelight.db.SqlDriver
import com.dynamox.quiz.database.DatabaseDynamoxQuiz
import com.dynamox.quiz.database.DriverFactory
import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.persistenceKoinModule
import com.dynamox.quiz.shared.systemEpochMilliseconds
import com.dynamox.quiz.testUtils.Dummy
import org.junit.Before
import org.junit.runner.RunWith
import org.koin.core.context.startKoin
import org.koin.dsl.module
import org.koin.test.AutoCloseKoinTest
import org.koin.test.inject
import kotlin.random.Random
import kotlin.time.Duration.Companion.minutes
import kotlin.uuid.Uuid

@RunWith(AndroidJUnit4::class)
abstract class DatabaseTest : AutoCloseKoinTest() {
    protected val db: DatabaseDynamoxQuiz by inject()

    @Before
    fun setup() {
        startKoin {
            modules(
                module {
                    single<SqlDriver> {
                        val context = ApplicationProvider.getApplicationContext<Context>()
                        DriverFactory(context).createInMemoryDriver()
                    }
                },
                persistenceKoinModule()
            )
        }
    }

    fun createAndSaveUser(
        id: Uuid = Uuid.random(),
        email: String = "testuser_${id}@test.com",
        name: String = "Test User",
        deleted: Boolean = false,
        deletedAt: Long? = null,
    ): UserEntity {
        val user = Dummy.user(
            id = id,
            email = email,
            name = name,
            deleted = deleted,
            deletedAt = deletedAt,
        )
        db.userEntityQueries.insert(user)
        return user
    }

    fun createAndSaveScore(
        id: Uuid = Uuid.random(),
        userId: Uuid = Uuid.random(),
        score: Int = Random.nextInt(11),
        timeTaken: Long = Random.nextInt(2, 6).minutes.inWholeMilliseconds,
        createdAt: Long = systemEpochMilliseconds(),
        deleted: Boolean = false,
        deletedAt: Long? = null
    ): QuizScore {
        val score = Dummy.score(
            id = id,
            userId = userId,
            score = score,
            timeTaken = timeTaken,
            createdAt = createdAt,
            deleted = deleted,
            deletedAt = deletedAt,
        )
        db.quizScoreQueries.save(score)
        return score
    }

}