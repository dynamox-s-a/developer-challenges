package com.andrebritovita.quizapp.ui.screens.quiz

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun QuizScreen(
    playerName: String,
    onQuizFinished: (Int) -> Unit
) {
    Text(text = "Quiz rodando para: $playerName")
}