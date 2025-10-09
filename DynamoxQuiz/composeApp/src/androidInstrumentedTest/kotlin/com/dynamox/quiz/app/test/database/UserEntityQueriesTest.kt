package com.dynamox.quiz.app.test.database

import com.dynamox.quiz.shared.systemEpochMilliseconds
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFails

class UserEntityQueriesTest : DatabaseTest() {
    @Test
    fun selectAll_emptyInitially() {
        val users = db.userEntityQueries.selectAll().executeAsList()
        assert(users.isEmpty())
    }

    @Test
    fun insert_and_selectById() {
        val user = createAndSaveUser()
        val got = db.userEntityQueries.selectById(user.id).executeAsOne()
        assertEquals(user.id, got.id)
    }

    @Test
    fun insert_and_selectByEmail() {
        val email = "test@test.com"
        val user = createAndSaveUser(email = email)
        val got = db.userEntityQueries.selectByEmail(email).executeAsOne()
        assertEquals(user.id, got.id)
    }

    @Test
    fun update_via_save_replace_preserves_primaryKey() {
        val user = createAndSaveUser(name = "Old")
        val updated = user.copy(name = "New", lastModified = systemEpochMilliseconds())
        db.userEntityQueries.update(
            id = updated.id,
            name = updated.name,
            email = updated.email,
            createdAt = updated.createdAt,
            lastModified = updated.lastModified,
            deleted = updated.deleted,
            deletedAt = updated.deletedAt,
            password_algo = updated.password_algo,
            password_salt = updated.password_salt,
            password_hash = updated.password_hash,
            password_iters = updated.password_iters,
        )

        val got = db.userEntityQueries.selectById(user.id).executeAsOne()
        assertEquals(user.id, got.id)
        assertEquals(updated.name, got.name)
    }

    @Test
    fun delete_removesRow() {
        val user = createAndSaveUser()
        db.userEntityQueries.delete(user.id)
        val users = db.userEntityQueries.selectAll().executeAsList()
        assert(users.isEmpty())
    }

    @Test
    fun selectAllNonDeleted_filtersDeleted() {
        val user = createAndSaveUser()
        createAndSaveUser(deleted = true, deletedAt = systemEpochMilliseconds())

        val users = db.userEntityQueries.selectAllNonDeleted().executeAsList()
        assertEquals(1, users.size)
        assertEquals(user.id, users[0].id)
    }

    @Test
    fun uniqueEmail_violatesOnDuplicate() {
        val email = "test@test.com"
        createAndSaveUser(email = email)
        assertFails {
            createAndSaveUser(email = email)
        }
    }

    @Test
    fun checkLowerEmail_failsWithUppercase() {
        assertFails {
            createAndSaveUser(email = "UPPER@MAIL.COM")
        }
    }

    @Test
    fun updateUser_doesNotCascadeScores() {
        val user = createAndSaveUser()
        createAndSaveScore(userId = user.id)
        createAndSaveScore(userId = user.id)

        db.userEntityQueries.update(
            id = user.id,
            email = user.email,
            name = "Updated",
            createdAt = user.createdAt,
            lastModified = systemEpochMilliseconds(),
            deleted = user.deleted,
            deletedAt = user.deletedAt,
            password_algo = user.password_algo,
            password_salt = user.password_salt,
            password_hash = user.password_hash,
            password_iters = user.password_iters,
        )

        val scores = db.quizScoreQueries.selectAllByUserId(user.id).executeAsList()
        assertEquals(2, scores.size)
    }

    @Test
    fun upsertById_failsWhenChangingEmailToExisting() {
        val user1 = createAndSaveUser(email = "user1@test.com")
        val user2 = createAndSaveUser(email = "user2@test.com")

        assertFails {
            db.userEntityQueries.update(
                id = user2.id,
                email = user1.email,
                name = user2.name,
                createdAt = user2.createdAt,
                lastModified = systemEpochMilliseconds(),
                deleted = user2.deleted,
                deletedAt = user2.deletedAt,
                password_algo = user2.password_algo,
                password_salt = user2.password_salt,
                password_hash = user2.password_hash,
                password_iters = user2.password_iters,
            )
        }
    }
}