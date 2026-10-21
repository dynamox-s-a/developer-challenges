package com.romulofer.kotlinMultiplatform.presentation.strings

import com.romulofer.kotlinMultiplatform.domain.model.AppError
import com.romulofer.kotlinMultiplatform.domain.model.AppError.NoConnection
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Server
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Unknown
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.Blank
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.TooLong

object EnglishStrings : AppStrings {
    override val appName = "Quiz"
    override val back = "Back"
    override val retry = "Try again"

    override val welcomeTitle = "Welcome"
    override val welcomeSubtitle = "Enter your name or nickname to start the quiz."
    override val nameLabel = "Name or nickname"
    override val startQuiz = "Start quiz"
    override val scoreboardAction = "Scoreboard"
    override val settingsAction = "Settings"
    override val storageError = "Could not save your data on this device. Try again."
    override fun nameError(reason: InvalidNameReason, maxLength: Int) = when (reason) {
        Blank -> "Enter a name to continue."
        TooLong -> "Use at most $maxLength characters."
    }

    override val loadingQuestion = "Loading question"
    override val submitAnswer = "Submit answer"
    override val correctFeedback = "Correct!"
    override val incorrectFeedback = "Not quite."
    override val nextQuestion = "Next question"
    override val seeResult = "See result"
    override fun questionProgress(current: Int, total: Int) = "Question $current of $total"
    override fun liveScore(correct: Int) = "Score: $correct"

    override val finishedTitle = "Quiz complete"
    override fun finalScore(correct: Int, total: Int) = "You scored $correct out of $total"
    override val playAgain = "Play again"
    override val changePlayer = "Change player"
    override val scoreNotSaved = "Your score could not be saved on this device."

    override val scoreboardTitle = "Scoreboard"
    override val scoreboardEmpty = "No scores yet. Finish a quiz to appear here."
    override fun scoreValue(correct: Int, total: Int) = "$correct/$total"

    override val settingsTitle = "Settings"
    override val languageLabel = "Language"
    override val languageEnglish = "English"
    override val languagePortuguese = "Português"

    override fun errorMessage(error: AppError) = when (error) {
        NoConnection -> "No internet connection. Check your network and try again."
        is Server -> "The server had a problem (code ${error.code}). Try again."
        Unknown -> "Something went wrong. Try again."
    }
}
