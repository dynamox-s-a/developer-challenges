package com.dynamox.quiz.test.database

import com.dynamox.quiz.shared.systemEpochMilliseconds
import com.dynamox.quiz.shared.toUuid
import junit.framework.TestCase.assertEquals
import org.junit.Test

class UserBestScoreQueriesTest : DatabaseTest() {

    @Test
    fun bestScore_picksHighestScore() {
        val user = createAndSaveUser()

        createAndSaveScore(userId = user.id, score = 10)
        val score = createAndSaveScore(userId = user.id, score = 20)

        val bestScore = db.userBestScoreQueries.selectByUserId(user.id).executeAsOne()
        assertEquals(user.id, bestScore.userId)
        assertEquals(score.score, bestScore.score)
    }

    @Test
    fun tie_break_by_timeTaken() {
        val user = createAndSaveUser()
        createAndSaveScore(userId = user.id, score = 50, timeTaken = 120)
        val score = createAndSaveScore(userId = user.id, score = 50, timeTaken = 90)

        val bestScore = db.userBestScoreQueries.selectByUserId(user.id).executeAsOne()
        assertEquals(score.score, bestScore.score)
        assertEquals(score.timeTakenMs, bestScore.timeTakenMs)
    }

    @Test
    fun tie_break_by_createdAt_when_score_and_time_equal() {
        val user = createAndSaveUser()
        val score =
            createAndSaveScore(userId = user.id, score = 80, timeTaken = 100, createdAt = 1_000)
        createAndSaveScore(userId = user.id, score = 80, timeTaken = 100, createdAt = 2_000)

        val bestScore = db.userBestScoreQueries.selectByUserId(user.id).executeAsOne()
        assertEquals(score.createdAt, bestScore.createdAt)
    }

    @Test
    fun final_tie_break_by_id_when_all_equal() {
        val user = createAndSaveUser()
        val score = createAndSaveScore(
            id = "00000000-0000-0000-0000-00000000000a".toUuid(),
            userId = user.id,
            score = 100,
            timeTaken = 50,
            createdAt = 10_000
        )
        createAndSaveScore(
            id = "00000000-0000-0000-0000-00000000000b".toUuid(),
            userId = user.id,
            score = 100,
            timeTaken = 50,
            createdAt = 10_000
        )

        val bestScore = db.userBestScoreQueries.selectByUserId(user.id).executeAsOne()
        assertEquals(score.id, bestScore.scoreId)
    }

    @Test
    fun ignores_deleted_rows() {
        val user = createAndSaveUser()
        val score = createAndSaveScore(
            userId = user.id,
            score = 10,
            timeTaken = 10,
            createdAt = 100,
            deleted = false
        )
        createAndSaveScore(userId = user.id, score = 999, deleted = true, deletedAt = systemEpochMilliseconds())

        val bestScore = db.userBestScoreQueries.selectByUserId(user.id).executeAsOne()
        assertEquals(score.score, bestScore.score)
        assertEquals(score.timeTakenMs, bestScore.timeTakenMs)
    }

    @Test
    fun multiple_users_each_has_one_row() {
        val user1 = createAndSaveUser()
        val user2 = createAndSaveUser()

        createAndSaveScore(userId = user1.id, score = 5)
        val user1Score = createAndSaveScore(userId = user1.id, score = 10)
        createAndSaveScore(userId = user2.id, score = 3)
        val user2Score = createAndSaveScore(userId = user2.id, score = 9)

        val bestScores = db.userBestScoreQueries.selectAll().executeAsList()
        assertEquals(bestScores.size, 2)
        val user1BestScore = bestScores.first { it.userId == user1.id }
        val user2BestScore = bestScores.first { it.userId == user2.id }
        assertEquals(user1Score.score, user1BestScore.score)
        assertEquals(user2Score.score, user2BestScore.score)
    }

    @Test
    fun user_without_scores_is_absent_from_view() {
        val user = createAndSaveUser()
        val userBestScores = db.userBestScoreQueries.selectByUserId(user.id).executeAsList()
        assert(userBestScores.isEmpty())
    }

    @Test
    fun deleted_user_is_absent_from_view_even_with_scores() {
        val user = createAndSaveUser(deleted = true, deletedAt = systemEpochMilliseconds())
        createAndSaveScore(userId = user.id, score = 50, timeTaken = 50)
        val userBestScores = db.userBestScoreQueries.selectByUserId(user.id).executeAsList()
        assert(userBestScores.isEmpty())
    }

    @Test
    fun userBestScore_selectAll_respectsOrderingAndLimit() {
        val user1 = createAndSaveUser(name = "User 1")
        val user2 = createAndSaveUser(name = "User 2")
        val user3 = createAndSaveUser(name = "User 3")

        createAndSaveScore(userId = user1.id, score = 90, timeTaken = 100, createdAt = 1000)
        createAndSaveScore(userId = user2.id, score = 100, timeTaken = 50, createdAt = 1000)
        createAndSaveScore(userId = user3.id, score = 100, timeTaken = 80, createdAt = 1000)

        val top2 = db.userBestScoreQueries.selectAll().executeAsList()
        assertEquals(3, top2.size)
        assertEquals(user2.id, top2[0].userId)
        assertEquals(user3.id, top2[1].userId)
        assertEquals(user1.id, top2[2].userId)
    }
}