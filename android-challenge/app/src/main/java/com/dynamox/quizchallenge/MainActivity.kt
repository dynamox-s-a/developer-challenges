package com.dynamox.quizchallenge

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.dynamox.quizchallenge.ui.navigation.QuizNavHost
import com.dynamox.quizchallenge.ui.theme.QuizChallengeTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            QuizChallengeTheme {
                QuizNavHost()
            }
        }
    }
}
