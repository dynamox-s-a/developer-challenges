package com.andrebritovita.quizapp.ui.screens.quiz

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.material3.MaterialTheme.colorScheme
import androidx.compose.material3.MaterialTheme.typography
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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
        containerColor = colorScheme.background
    ){ paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            LinearProgressIndicator(
                progress = { state.questionIndex / state.totalQuestions.toFloat() },
                modifier = Modifier.fillMaxWidth().height(8.dp),
                color = colorScheme.secondary,
                trackColor = colorScheme.surfaceVariant,
            )

            Spacer(Modifier.height(16.dp))

            Text(
                text = stringResource(
                    R.string.quiz_question_count,
                    state.questionIndex,
                    state.totalQuestions
                ),
                style = typography.labelLarge,
                color = colorScheme.onSurfaceVariant
            )

            Spacer(Modifier.height(32.dp))

            state.question?.let { question ->
                Text(
                    text = question.statement,
                    style = typography.headlineLarge,
                    color = colorScheme.onBackground
                )

                Spacer(Modifier.height(32.dp))

                question.options.forEach { option ->
                    val isSelected = option == state.selectedOption
                    val isResultState = state.isAnswerCorrect != null

                    val cardColor = when {
                        isResultState && isSelected && state.isAnswerCorrect == true -> InfoGreen
                        isResultState && isSelected -> ErrorRed
                        isSelected -> colorScheme.secondary
                        else -> colorScheme.surface
                    }

                    val borderColor = when {
                        isResultState && isSelected -> Color.Transparent
                        isSelected -> colorScheme.secondary
                        else -> colorScheme.outline
                    }

                    val textColor = when {
                        isSelected -> Color.White
                        else -> colorScheme.onSurface
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
                                style = typography.bodyLarge.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 18.sp
                                ),
                                modifier = Modifier.weight(1f),
                                color = textColor
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