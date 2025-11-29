package com.andrebritovita.quizapp.ui.screens

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun ResultScreen(
    score: Int,
    onRestartClick: () -> Unit,
    onHistoryClick: () -> Unit
) {
    Text(text = "Resultado Final: $score")
}