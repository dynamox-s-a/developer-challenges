package com.dynamox.quiz.app.api

import io.ktor.http.Url

/**
 * Configuration for the Quiz API.
 */
object QuizApiConfig {
    private const val SCHEME = "https"
    private const val DOMAIN = "quiz-api-bwi5hjqyaq-uc.a.run.app"

    val baseUrl = Url("$SCHEME://$DOMAIN")
}