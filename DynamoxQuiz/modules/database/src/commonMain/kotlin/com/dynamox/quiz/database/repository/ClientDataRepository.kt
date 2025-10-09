package com.dynamox.quiz.database.repository

import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserBestScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.model.User
import kotlinx.coroutines.flow.Flow
import kotlin.uuid.Uuid

/**
 * Repository interface for managing client data, including users and quiz scores.
 */
interface ClientDataRepository {

    /**
     * Loads a user entity by its unique identifier.
     *
     * @param id The unique identifier of the user entity.
     * @return A [Result] containing the [UserEntity] if found, or an error if not.
     */
    suspend fun loadUserEntity(id: Uuid): Result<UserEntity>

    /**
     * Creates a new user entity in the database.
     *
     * @param user The [UserEntity] to be created.
     * @return A [Result] indicating success or failure of the operation.
     */
    suspend fun createUserEntity(user: UserEntity): Result<Unit>

    /**
     * Updates an existing user entity in the database.
     *
     * @param user The [UserEntity] with updated information.
     * @return A [Result] indicating success or failure of the operation.
     */
    suspend fun updateUserEntity(user: UserEntity): Result<Unit>

    /**
     * Loads a user by its unique identifier.
     * * @param id The unique identifier of the user.
     * @return A [Result] containing the [User] if found, or an error if not.
     */
    suspend fun loadUser(id: Uuid): Result<User>

    /**
     * Deletes a user by its unique identifier.
     *
     * @param id The unique identifier of the user to be deleted.
     * @return A [Result] indicating success or failure of the operation.
     */

    suspend fun deleteUser(id: Uuid): Result<Unit>

    /**
     * Checks if an email address is available for registration.
     *
     * @param email The email address to be checked.
     * @return A [Result] containing `true` if the email is available, `false` otherwise.
     */
    suspend fun emailIsAvailable(email: String): Result<Boolean>

    /**
     * Saves a quiz score to the database.
     *
     * @param score The [QuizScore] to be saved.
     * @return A [Result] indicating success or failure of the operation.
     */
    suspend fun saveQuizScore(score: QuizScore): Result<Unit>

    /**
     * Loads the top quiz scores from the database.
     *
     * @return A [Result] containing a list of top [QuizScore]s, or an error if the operation fails.
     */
    suspend fun loadTopQuizScores(): Result<List<QuizScore>>

    /**
     * Observes changes to the top quiz scores in real-time.
     *
     * @return A [Flow] emitting lists of top [UserBestScore]s whenever they change.
     */
    fun observeTopQuizScores(): Flow<List<UserBestScore>>

    /**
     * Loads the best quiz score for a specific user.
     *
     * @param userId The unique identifier of the user.
     * @return A [Result] containing the user's best [UserBestScore], or an error if the operation fails.
     */
    suspend fun loadUserBestScore(userId: Uuid): Result<UserBestScore>

    /**
     * Loads all quiz scores for a specific user.
     *
     * @param userId The unique identifier of the user.
     * @return A [Result] containing a list of the user's [QuizScore]s, or an error if the operation fails.
     */
    suspend fun loadUserQuizScores(userId: Uuid): Result<List<QuizScore>>

    /**
     * Observes changes to a specific user's quiz scores in real-time.
     *
     * @param userId The unique identifier of the user.
     * @return A [Flow] emitting lists of the user's [QuizScore]s whenever they change.
     */
    fun observeUserQuizScores(userId: Uuid): Flow<List<QuizScore>>

    /**
     * Deletes a quiz score by its unique identifier.
     *
     * @param id The unique identifier of the quiz score to be deleted.
     * @return A [Result] indicating success or failure of the operation.
     */
    suspend fun deleteQuizScore(id: Uuid): Result<Unit>

    /**
     * Loads a quiz score by its unique identifier.
     *
     * @param id The unique identifier of the quiz score.
     * @return A [Result] containing the [QuizScore] if found, or an error if not.
     */
    suspend fun loadQuizScore(id: Uuid): Result<QuizScore>

    /**
     * Loads a user entity by its email address.
     *
     * @param email The email address of the user entity.
     * @return A [Result] containing the [UserEntity] if found, or `null` if not found.
     */
    suspend fun loadUserEntityByEmail(email: String): Result<UserEntity?>

    /**
     * Updates a user's password information.
     *
     * @param userId The unique identifier of the user.
     * @param algo The hashing algorithm used.
     * @param salt The salt used in hashing.
     * @param hash The resulting hash of the password.
     * @param iters The number of iterations used in hashing.
     * @return A [Result] indicating success or failure of the operation.
     */
    suspend fun updateUserPassword(
        userId: Uuid,
        algo: String,
        salt: ByteArray,
        hash: ByteArray,
        iters: Long
    ): Result<Unit>
}