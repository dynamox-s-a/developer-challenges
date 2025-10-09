package com.dynamox.quiz.app.quiz.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import com.dynamox.quiz.app.quiz.model.QuizState
import com.dynamox.quiz.app.quiz.viewModel.QuizViewModel
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.error
import dynamoxquiz.composeapp.generated.resources.final_question
import dynamoxquiz.composeapp.generated.resources.leave
import dynamoxquiz.composeapp.generated.resources.question
import dynamoxquiz.composeapp.generated.resources.quiz_resume
import dynamoxquiz.composeapp.generated.resources.restart
import dynamoxquiz.composeapp.generated.resources.score_saved_message
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.koinInject

@Composable
fun QuizScreen(
    onCloseRequest: () -> Unit
) {
    val viewModel: QuizViewModel = koinInject()

    val quizState by viewModel.state.collectAsState()
    val questionState by viewModel.currentQuestionState.collectAsState()
    val currentQuestionNumber by viewModel.currentQuestionNumber.collectAsState()
    val isLastQuestion by viewModel.isLastQuestion.collectAsState()

    var showExitConfirm by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }

    val scoredSavedMessage = stringResource(Res.string.score_saved_message)
    LaunchedEffect(viewModel) {
        launch {
            viewModel.onSaved.collect {
                snackbarHostState.showSnackbar(scoredSavedMessage)
                onCloseRequest()
            }
        }
        if (questionState == null && quizState is QuizState.Answering) {
            viewModel.loadNextQuestion()
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = when (quizState) {
                            is QuizState.Completed -> stringResource(Res.string.quiz_resume)
                            is QuizState.Error -> stringResource(Res.string.error)
                            is QuizState.Answering -> if (isLastQuestion) {
                                stringResource(Res.string.final_question)
                            } else {
                                "${stringResource(Res.string.question)} $currentQuestionNumber"
                            }
                        },
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                },
                navigationIcon = {
                    if (quizState !is QuizState.Completed) {
                        TextButton(onClick = { showExitConfirm = true }) {
                            Text(stringResource(Res.string.leave))
                        }
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Box(Modifier.fillMaxSize().padding(paddingValues)) {
            when (val state = quizState) {
                is QuizState.Answering -> {
                    QuestionStage(
                        questionState = questionState,
                        isLastQuestion = isLastQuestion,
                        onSubmitAnswer = viewModel::answerQuestion,
                        onNext = viewModel::loadNextQuestion,
                        onTryAgain = viewModel::tryAgain,
                        onExit = { showExitConfirm = true }
                    )
                }

                is QuizState.Completed -> {
                    QuizCompletedContent(
                        score = state.score,
                        totalDuration = state.totalDuration,
                        onSave = viewModel::saveScore,
                        onRestart = viewModel::restartQuiz,
                        onExit = onCloseRequest
                    )
                }

                is QuizState.Error -> {
                    ErrorFullScreen(
                        message = state.errorMessage,
                        primary = stringResource(Res.string.restart),
                        onPrimary = viewModel::restartQuiz,
                        secondary = stringResource(Res.string.leave),
                        onSecondary = onCloseRequest
                    )
                }
            }

            if (showExitConfirm) {
                ConfirmExitDialog(
                    onConfirm = {
                        showExitConfirm = false
                        onCloseRequest()
                    },
                    onDismiss = { showExitConfirm = false }
                )
            }
        }
    }
}