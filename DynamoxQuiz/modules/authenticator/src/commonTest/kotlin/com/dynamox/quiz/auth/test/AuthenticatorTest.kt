package com.dynamox.quiz.auth.test

import com.dynamox.quiz.auth.Authenticator
import com.dynamox.quiz.auth.authKoinModule
import com.dynamox.quiz.auth.models.AuthenticateResult
import com.dynamox.quiz.auth.models.ChangePasswordResult
import com.dynamox.quiz.auth.models.RegisterResult
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.testUtils.database.InMemoryClientDataRepository
import kotlinx.coroutines.test.runTest
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.dsl.bind
import org.koin.dsl.module
import org.koin.test.KoinTest
import org.koin.test.inject
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.uuid.Uuid

class AuthenticatorTest : KoinTest {
    private val repository: InMemoryClientDataRepository by inject()
    private val authenticator: Authenticator by inject()

    @BeforeTest
    fun setUp() {
        startKoin {
            modules(
                authKoinModule(),
                module {
                    single {
                        InMemoryClientDataRepository()
                    } bind ClientDataRepository::class
                }
            )
        }
    }

    @AfterTest
    fun tearDown() {
        stopKoin()
    }

    @Test
    fun register_success() = runTest {
        val result = authenticator.register(
            name = "User",
            email = "user@test.com",
            password = "test#123".toCharArray()
        )
        assertIs<RegisterResult.Success>(result)
        assertEquals("user@test.com", result.user.email)
        assertEquals("User", result.user.name)
    }

    @Test
    fun register_emailAlreadyInUse() = runTest {
        val ok = authenticator.register("User1", "user1@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(ok)

        val dup = authenticator.register("User2", "user1@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.EmailAlreadyInUse>(dup)
    }

    @Test
    fun register_failedToVerifyEmail() = runTest {
        repository.setShouldFail(InMemoryClientDataRepository.Op.EMAIL_IS_AVAILABLE, enabled = true)
        val result = authenticator.register("User", "test@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.FailedToVerifyEmail>(result)
    }

    @Test
    fun register_failedToCreateUser() = runTest {
        repository.setShouldFail(InMemoryClientDataRepository.Op.CREATE_USER, enabled = true)
        val result = authenticator.register("User", "test@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.FailedToCreateUser>(result)
    }

    @Test
    fun authenticate_success() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)

        val login = authenticator.authenticate("USER@test.com", "test#123".toCharArray())
        assertIs<AuthenticateResult.Success>(login)
        assertEquals("user@test.com", login.user.email)
    }

    @Test
    fun authenticate_invalidCredentials_wrongPassword() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)

        val login = authenticator.authenticate("user@test.com", "WRONG".toCharArray())
        assertIs<AuthenticateResult.InvalidCredentials>(login)
    }

    @Test
    fun authenticate_invalidCredentials_unknownEmail() = runTest {
        val login = authenticator.authenticate("user@test.com", "test#123".toCharArray())
        assertIs<AuthenticateResult.InvalidCredentials>(login)
    }

    @Test
    fun authenticate_userDeleted() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)
        repository.deleteUser(reg.user.id).getOrThrow()

        val login = authenticator.authenticate("user@test.com", "test#123".toCharArray())
        assertIs<AuthenticateResult.UserDeleted>(login)
    }

    @Test
    fun authenticate_failedToLoadUser() = runTest {
        repository.setShouldFail(InMemoryClientDataRepository.Op.LOAD_USER_BY_EMAIL, enabled = true)
        val result = authenticator.authenticate("user@test.com", "test#123".toCharArray())
        assertIs<AuthenticateResult.FailedToLoadUser>(result)
    }

    @Test
    fun changePassword_success() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)

        val change = authenticator.changePassword(
            userId = reg.user.id,
            currentPassword = "test#123".toCharArray(),
            newPassword = "test#321".toCharArray()
        )
        assertIs<ChangePasswordResult.Success>(change)

        val loginOld = authenticator.authenticate("user@test.com", "test#123".toCharArray())
        assertIs<AuthenticateResult.InvalidCredentials>(loginOld)

        val loginNew = authenticator.authenticate("user@test.com", "test#321".toCharArray())
        assertIs<AuthenticateResult.Success>(loginNew)
    }

    @Test
    fun changePassword_failedToLoadUser() = runTest {
        val randomId = Uuid.random()
        repository.setShouldFail(InMemoryClientDataRepository.Op.LOAD_USER_ENTITY, enabled = true)
        val result = authenticator.changePassword(
            userId = randomId,
            currentPassword = "test#123".toCharArray(),
            newPassword = "test#321".toCharArray()
        )
        assertIs<ChangePasswordResult.FailedToLoadUser>(result)
    }

    @Test
    fun changePassword_userDeleted() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)
        repository.deleteUser(reg.user.id).getOrThrow()

        val result = authenticator.changePassword(
            userId = reg.user.id,
            currentPassword = "test#123".toCharArray(),
            newPassword = "test#321".toCharArray()
        )
        assertIs<ChangePasswordResult.UserDeleted>(result)
    }

    @Test
    fun changePassword_invalidCredentials_wrongCurrent() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)

        val result = authenticator.changePassword(
            userId = reg.user.id,
            currentPassword = "WRONG".toCharArray(),
            newPassword = "test#321".toCharArray()
        )
        assertIs<ChangePasswordResult.InvalidCredentials>(result)
    }

    @Test
    fun changePassword_failedToUpdateCredentials() = runTest {
        val reg = authenticator.register("User", "user@test.com", "test#123".toCharArray())
        assertIs<RegisterResult.Success>(reg)

        repository.setShouldFail(
            InMemoryClientDataRepository.Op.UPDATE_USER_PASSWORD,
            enabled = true
        )
        val result = authenticator.changePassword(
            userId = reg.user.id,
            currentPassword = "test#123".toCharArray(),
            newPassword = "test#321".toCharArray()
        )
        assertIs<ChangePasswordResult.FailedToUpdateCredentials>(result)
    }
}