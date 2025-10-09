package com.dynamox.quiz.auth.kdf

import com.dynamox.quiz.auth.util.wipe
import dev.whyoleg.cryptography.BinarySize.Companion.bytes
import dev.whyoleg.cryptography.CryptographyProvider
import dev.whyoleg.cryptography.algorithms.PBKDF2
import dev.whyoleg.cryptography.algorithms.SHA256
import dev.whyoleg.cryptography.random.CryptographyRandom

/**
 * PBKDF2 key derivation function implementation using HMAC-SHA256.
 *
 * @property iterations The number of iterations to perform (default is 210,000).
 * @property derivedKeyLengthBytes The length of the derived key in bytes (default is 32 bytes).
 * @property provider The cryptography provider to use (default is the system default provider).
 */
class Pbkdf2Kdf(
    override val iterations: Int = 210_000,
    override val derivedKeyLengthBytes: Int = 32,
    private val provider: CryptographyProvider = CryptographyProvider.Default
) : PasswordKdf {
    override val algorithmName: String = "pbkdf2-hmac-sha256"

    override fun generateSalt(byteCount: Int): ByteArray =
        CryptographyRandom.nextBytes(byteCount)

    override fun derive(password: CharArray, salt: ByteArray): ByteArray {
        val passwordBytes = password.concatToString().encodeToByteArray()
        try {
            val derivation = provider.get(PBKDF2).secretDerivation(
                digest = SHA256,
                iterations = iterations,
                outputSize = derivedKeyLengthBytes.bytes,
                salt = salt
            )
            return derivation.deriveSecretBlocking(passwordBytes).toByteArray()
        } finally {
            wipe(password)
            passwordBytes.fill(0)
        }
    }
}