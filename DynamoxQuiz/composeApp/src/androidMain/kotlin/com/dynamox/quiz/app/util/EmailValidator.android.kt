package com.dynamox.quiz.app.util

import java.net.IDN

actual fun toAsciiPlatform(domain: String): String? {
    return try {
        IDN.toASCII(domain)
    } catch (e: Exception) {
        null
    }
}