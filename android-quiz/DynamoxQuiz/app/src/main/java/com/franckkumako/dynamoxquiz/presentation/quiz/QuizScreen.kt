package com.franckkumako.dynamoxquiz.presentation.quiz

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.franckkumako.dynamoxquiz.domain.model.Question
import androidx.compose.foundation.verticalScroll
@Composable
fun QuizScreen(
    viewModel: QuizViewModel,
    playerName: String,
    onQuizFinished: (Int) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.startQuiz(playerName)
    }

    if (state.isFinished) {
        onQuizFinished(state.score)
        return
    }
    val currentQuestion = state.currentQuestion
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        when {
            state.isLoading && currentQuestion == null -> {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            }

            state.errorMessage != null -> {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(text = state.errorMessage ?: "Error")
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(onClick = { viewModel.loadNextQuestion() }) {
                        Text(text = "Try again")
                    }
                }
            }

            currentQuestion != null -> {
                QuizContent(
                    question = currentQuestion,
                    questionIndex = state.questionIndex,
                    totalQuestions = state.totalQuestions,
                    selectedOption = state.selectedOption,
                    isAnswerCorrect = state.isAnswerCorrect,
                    isLoading = state.isLoading,
                    score = state.score,
                    onOptionSelected = { viewModel.selectOption(it) },
                    onSubmit = {
                        viewModel.submitAnswer(playerName, onQuizFinished)
                    }
                )
            }
        }
    }
}

@Composable
private fun QuizContent(
    question: Question,
    questionIndex: Int,
    totalQuestions: Int,
    selectedOption: String?,
    isAnswerCorrect: Boolean?,
    isLoading: Boolean,
    score: Int,
    onOptionSelected: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Question ${questionIndex + 1} of $totalQuestions")
                Text(text = "Score: $score", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(text = question.statement, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(16.dp))

            question.options.forEach { option ->


                val cardColor =
                    when {

                        isAnswerCorrect == true && option == selectedOption ->
                            Color(0xFF4CAF50).copy(alpha = 0.4f)

                        isAnswerCorrect == false && option == selectedOption ->
                            Color(0xFFF44336).copy(alpha = 0.4f)

                        else -> MaterialTheme.colorScheme.surface
                    }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .selectable(
                            selected = selectedOption == option,
                            onClick = { if (isAnswerCorrect == null) onOptionSelected(option) },
                            role = Role.RadioButton
                        ),
                    colors = CardDefaults.cardColors(
                        containerColor = cardColor
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedOption == option,
                            onClick = { if (isAnswerCorrect == null) onOptionSelected(option) }
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = option)
                    }
                }
            }


            Spacer(modifier = Modifier.height(12.dp))

            AnimatedVisibility(
                visible = isAnswerCorrect != null,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                if (isAnswerCorrect == true) {
                    Text(
                        text = "Correct!",
                        color = MaterialTheme.colorScheme.primary
                    )
                } else if (isAnswerCorrect == false) {
                    Text(
                        text = "Wrong answer",
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }



        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            enabled = selectedOption != null && !isLoading,
            onClick = onSubmit
        ) {
            Text("Submit answer")
        }




    }




        }

