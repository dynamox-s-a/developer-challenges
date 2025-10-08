package com.dynamox.quiz.auth.kdf

interface PasswordKdf {
    val algorithmName: String
    val iterations: Int
    val derivedKeyLengthBytes: Int
    fun generateSalt(byteCount: Int = 16): ByteArray
    fun derive(password: CharArray, salt: ByteArray): ByteArray
}