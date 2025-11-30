package com.andrebritovita.quizapp.ui.screens.quiz

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.andrebritovita.quizapp.R
import com.andrebritovita.quizapp.ui.components.PrimaryButton
import com.andrebritovita.quizapp.ui.theme.ErrorRed
import com.andrebritovita.quizapp.ui.theme.InfoGreen

@Composable
fun QuizContent(
    state: QuizUiState,
    onOptionSelected: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background
    ){ paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            LinearProgressIndicator(
                progress = { state.questionIndex / state.totalQuestions.toFloat() },
                modifier = Modifier.fillMaxWidth().height(8.dp),
                color = MaterialTheme.colorScheme.secondary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant,
            )

            Spacer(Modifier.height(16.dp))

            Text(
                text = stringResource(
                    R.string.quiz_question_count,
                    state.questionIndex,
                    state.totalQuestions
                ),
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(Modifier.height(8.dp))

            state.question?.let { question ->
                Text(
                    text = question.statement,
                    style = MaterialTheme.typography.headlineLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )

                Spacer(Modifier.height(32.dp))

                question.options.forEach { option ->
                    val isSelected = option == state.selectedOption
                    val isResultState = state.isAnswerCorrect != null

                    val cardColor = when {
                        isResultState && isSelected && state.isAnswerCorrect == true -> InfoGreen
                        isResultState && isSelected -> ErrorRed
                        isSelected -> MaterialTheme.colorScheme.primaryContainer
                        else -> MaterialTheme.colorScheme.surface
                    }

                    val borderColor = when {
                        isResultState && isSelected -> Color.Transparent
                        isSelected -> MaterialTheme.colorScheme.primary
                        else -> MaterialTheme.colorScheme.outline
                    }

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp)
                            .clickable(enabled = !state.isCheckingAnswer && !isResultState) {
                                onOptionSelected(option)
                            },
                        border = BorderStroke(2.dp, borderColor),
                        colors = CardDefaults.cardColors(containerColor = cardColor)
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = option,
                                style = MaterialTheme.typography.bodyLarge,
                                modifier = Modifier.weight(1f),
                                color = if (isSelected || isResultState) Color.Black else MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(32.dp))
            PrimaryButton(
                text = if (state.isCheckingAnswer) "..." else stringResource(R.string.btn_submit),
                onClick = onSubmit,
                enabled = state.isButtonEnabled
            )
        }
    }
}