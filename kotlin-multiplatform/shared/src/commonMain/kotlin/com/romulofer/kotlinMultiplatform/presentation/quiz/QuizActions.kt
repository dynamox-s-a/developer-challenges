package com.romulofer.kotlinMultiplatform.presentation.quiz

class QuizActions(
    val onOptionSelected: (String) -> Unit,
    val onSubmit: () -> Unit,
    val onNext: () -> Unit,
    val onRetry: () -> Unit,
    val onRestart: () -> Unit,
    val onChangePlayer: () -> Unit,
    val onScoreboardClick: () -> Unit,
    val onBack: () -> Unit
)
