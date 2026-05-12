package com.abel.dynamoxquiz

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModelProvider
import com.abel.dynamoxquiz.di.RepositoryModule
import com.abel.dynamoxquiz.presentation.quiz.QuizScreen
import com.abel.dynamoxquiz.presentation.quiz.QuizViewModel
import com.abel.dynamoxquiz.presentation.quiz.QuizViewModelFactory
import com.abel.dynamoxquiz.ui.theme.DynamoxQuizTheme
import androidx.compose.runtime.*
import com.abel.dynamoxquiz.data.local.ScoreDao
import com.abel.dynamoxquiz.di.DatabaseModule
import com.abel.dynamoxquiz.presentation.StartScreen

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        val repository =
            RepositoryModule.provideQuizRepository()

        val scoreDao =
            DatabaseModule.provideScoreDao(
                applicationContext
            )

        val factory =
            QuizViewModelFactory(
                repository,
                scoreDao)


        val viewModel = ViewModelProvider(
            this,
            factory
        )[QuizViewModel::class.java]

        setContent {
            var startedQuiz by remember {
                mutableStateOf(false)
            }
            DynamoxQuizTheme {
                if (!startedQuiz) {
                    StartScreen(
                        onStartQuiz = { nickname ->
                            viewModel.setNickname(
                                nickname
                            )
                            startedQuiz = true
                            viewModel.loadQuestion()

                        }
                    )
                } else {
                    QuizScreen(
                        viewModel = viewModel
                    )
                }
            }
        }
    }
}

// Challenger Finished