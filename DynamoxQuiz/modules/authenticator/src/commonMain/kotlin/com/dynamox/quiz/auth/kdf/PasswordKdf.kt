package com.dynamox.quiz.auth.kdf

/**
 * Interface for password-based key derivation functions (KDFs).
 *
 * This interface defines the necessary properties and methods for implementing
 * a password KDF, including algorithm name, iteration count, derived key length,
 * salt generation, and key derivation.
 */
interface PasswordKdf {
    val algorithmName: String
    val iterations: Int
    val derivedKeyLengthBytes: Int

    /**
     * Generates a random salt of the specified byte count.
     *
     * @param byteCount The number of bytes for the salt. Default is 16 bytes.
     * @return A byte array representing the generated salt.
     */
    fun generateSalt(byteCount: Int = 16): ByteArray

    /**
     * Derives a cryptographic key from the given password and salt.
     *
     * @param password The input password as a character array.
     * @param salt The salt as a byte array.
     * @return The derived key as a byte array.
     */
    fun derive(password: CharArray, salt: ByteArray): ByteArray
}