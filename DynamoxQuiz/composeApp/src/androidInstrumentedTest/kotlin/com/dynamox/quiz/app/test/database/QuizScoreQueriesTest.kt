package com.dynamox.quiz.app.test.database

import com.dynamox.quiz.shared.systemEpochMilliseconds
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFails

class QuizScoreQueriesTest : DatabaseTest() {
    @Test
    fun insert_and_selectById() {
        val user = createAndSaveUser()
        val score = createAndSaveScore(userId = user.id)
        val got = db.quizScoreQueries.selectById(score.id).executeAsOne()
        assertEquals(score.id, got.id)
    }

    @Test
    fun fk_preventsInsertForUnknownUser() {
        assertFails {
            createAndSaveScore()
        }
    }

    @Test
    fun selectAllByUser_filtersDeleted() {
        val user = createAndSaveUser()
        val score = createAndSaveScore(userId = user.id)
        createAndSaveScore(userId = user.id, deleted = true, deletedAt = systemEpochMilliseconds())

        val scores = db.quizScoreQueries.selectAllByUserId(user.id).executeAsList()
        assertEquals(1, scores.size)
        assertEquals(score.id, scores[0].id)
    }

    @Test
    fun deleteUser_cascadeDeletesScores() {
        val user = createAndSaveUser()
        createAndSaveScore(userId = user.id)
        createAndSaveScore(userId = user.id)

        db.userEntityQueries.delete(user.id)

        val scores = db.quizScoreQueries.selectAll().executeAsList()
        assert(scores.isEmpty())
    }
}