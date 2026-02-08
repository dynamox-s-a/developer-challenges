package org.kaelkill.quiz

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform