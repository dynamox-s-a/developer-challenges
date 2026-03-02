package com.dynamox.quiz

import androidx.compose.runtime.Composable
import com.dynamox.quiz.presentation.navigation.NavGraph
import com.dynamox.quiz.presentation.theme.DynaQuizTheme

@Composable
fun App() {
    DynaQuizTheme {
        NavGraph()
    }
}
