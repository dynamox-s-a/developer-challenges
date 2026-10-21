package com.romulofer.kotlinMultiplatform.presentation.strings

import com.romulofer.kotlinMultiplatform.domain.model.AppError
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason

interface AppStrings {
    val appName: String
    val back: String
    val retry: String

    val welcomeTitle: String
    val welcomeSubtitle: String
    val nameLabel: String
    val startQuiz: String
    val scoreboardAction: String
    val settingsAction: String
    val storageError: String
    fun nameError(reason: InvalidNameReason, maxLength: Int): String

    val loadingQuestion: String
    val submitAnswer: String
    val correctFeedback: String
    val incorrectFeedback: String
    val nextQuestion: String
    val seeResult: String
    fun questionProgress(current: Int, total: Int): String
    fun liveScore(correct: Int): String

    val finishedTitle: String
    fun finalScore(correct: Int, total: Int): String
    val playAgain: String
    val changePlayer: String
    val scoreNotSaved: String

    val scoreboardTitle: String
    val scoreboardEmpty: String
    fun scoreValue(correct: Int, total: Int): String

    val settingsTitle: String
    val languageLabel: String
    val languageEnglish: String
    val languagePortuguese: String

    fun errorMessage(error: AppError): String
}
