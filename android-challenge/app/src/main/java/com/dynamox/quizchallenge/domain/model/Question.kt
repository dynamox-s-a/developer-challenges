package com.dynamox.quizchallenge.domain.model

/**
 * A single multiple-choice quiz question, as presented to the user.
 */
data class Question(
    val id: String,
    val statement: String,
    val options: List<String>,
)
