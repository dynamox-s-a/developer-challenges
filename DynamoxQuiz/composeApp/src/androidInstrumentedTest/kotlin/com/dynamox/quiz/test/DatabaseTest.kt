package com.dynamox.quiz.test

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.dynamox.quiz.database.DatabaseDynamoxQuiz
import com.dynamox.quiz.database.DriverFactory
import com.dynamox.quiz.database.createDatabase
import com.dynamox.quiz.testUtils.Dummy
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import kotlin.time.Clock

@RunWith(AndroidJUnit4::class)
class DatabaseTest {
    private lateinit var db: DatabaseDynamoxQuiz

    @Before
    fun setup() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val driver = DriverFactory(context).createInMemoryDriver()
        db = createDatabase(driver = driver)
    }

    @Test
    fun testGetUsers() {
        val initialUsers = db.userQueries.selectAll().executeAsList()
        println("Initial users: $initialUsers")
        assert(initialUsers.isEmpty())
    }

    @Test
    fun testCreateUser() {
        val newUser = Dummy.user()
        db.userQueries.save(newUser)
        val usersAfterInsert = db.userQueries.selectAll().executeAsList()
        println("Users after insert: $usersAfterInsert")
        assert(usersAfterInsert.size == 1)
        assert(usersAfterInsert[0].id == newUser.id)
    }

    @Test
    fun updateUser() {
        val newUser = Dummy.user()
        db.userQueries.save(newUser)
        val updatedUser = newUser.copy(
            name = "Updated Name",
            lastModified = Clock.System.now().toEpochMilliseconds()
        )
        db.userQueries.save(updatedUser)
        val usersAfterUpdate = db.userQueries.selectAll().executeAsList()
        println("Users after update: $usersAfterUpdate")
        assert(usersAfterUpdate.size == 1)
        val currentUser = usersAfterUpdate[0]
        assert(currentUser.id == updatedUser.id)
        assert(currentUser.name == "Updated Name")
    }

    @Test
    fun deleteUser() {
        val newUser = Dummy.user()
        db.userQueries.save(newUser)
        db.userQueries.delete(newUser.id)
        val usersAfterDelete = db.userQueries.selectAll().executeAsList()
        println("Users after delete: $usersAfterDelete")
        assert(usersAfterDelete.isEmpty())
    }
}