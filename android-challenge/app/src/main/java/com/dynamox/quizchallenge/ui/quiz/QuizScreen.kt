package com.dynamox.quizchallenge.ui.quiz

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.dynamox.quizchallenge.R
import com.dynamox.quizchallenge.domain.model.AppError
import com.dynamox.quizchallenge.ui.theme.OnSuccessGreenContainerDark
import com.dynamox.quizchallenge.ui.theme.OnSuccessGreenContainerLight
import com.dynamox.quizchallenge.ui.theme.SuccessGreen
import com.dynamox.quizchallenge.ui.theme.SuccessGreenContainerDark
import com.dynamox.quizchallenge.ui.theme.SuccessGreenContainerLight
import com.dynamox.quizchallenge.ui.theme.SuccessGreenDark

@Composable
fun QuizScreen(
    onFinished: (correctCount: Int, totalQuestions: Int) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: QuizViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    QuizContent(
        uiState = uiState,
        onOptionSelected = viewModel::onOptionSelected,
        onSubmit = viewModel::onSubmitAnswer,
        onNext = { state ->
            if (state.isLastQuestion) {
                onFinished(state.correctCountSoFar, state.totalQuestions)
            } else {
                viewModel.onNextQuestion()
            }
        },
        onRetry = viewModel::onRetry,
        modifier = modifier,
    )
}

@Composable
private fun QuizContent(
    uiState: QuizUiState,
    onOptionSelected: (String) -> Unit,
    onSubmit: () -> Unit,
    onNext: (QuizUiState.InProgress) -> Unit,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Scaffold(modifier = modifier) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
        ) {
            when (uiState) {
                QuizUiState.Loading -> CircularProgressIndicator(Modifier.align(Alignment.Center))
                is QuizUiState.Error -> ErrorContent(
                    error = uiState.error,
                    onRetry = onRetry,
                    modifier = Modifier.align(Alignment.Center),
                )
                is QuizUiState.InProgress -> QuestionContent(uiState, onOptionSelected, onSubmit, onNext)
            }
        }
    }
}

@Composable
private fun QuestionContent(
    state: QuizUiState.InProgress,
    onOptionSelected: (String) -> Unit,
    onSubmit: () -> Unit,
    onNext: (QuizUiState.InProgress) -> Unit,
) {
    Column(modifier = Modifier.fillMaxSize()) {
        val animatedProgress by animateFloatAsState(
            targetValue = state.questionNumber / state.totalQuestions.toFloat(),
            animationSpec = tween(400),
            label = "quiz_progress",
        )
        LinearProgressIndicator(
            progress = { animatedProgress },
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(16.dp))
        Text(
            text = stringResource(R.string.quiz_question_counter, state.questionNumber, state.totalQuestions),
            style = MaterialTheme.typography.labelLarge,
        )
        Spacer(Modifier.height(8.dp))
        Text(text = state.question.statement, style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(24.dp))

        Column(
            modifier = Modifier
                .selectableGroup()
                .weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            state.question.options.forEach { option ->
                OptionRow(
                    text = option,
                    selected = option == state.selectedOption,
                    revealedCorrect = state.revealedCorrect,
                    enabled = !state.isAnswerRevealed && !state.isSubmitting,
                    onClick = { onOptionSelected(option) },
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        AnimatedVisibility(
            visible = state.isAnswerRevealed,
            enter = fadeIn(tween(300)) + expandVertically(tween(300)),
            exit = fadeOut(tween(150)) + shrinkVertically(tween(150)),
        ) {
            AnswerFeedback(isCorrect = state.revealedCorrect == true)
        }

        if (state.isAnswerRevealed) {
            Spacer(Modifier.height(16.dp))
            Button(onClick = { onNext(state) }, modifier = Modifier.fillMaxWidth()) {
                Text(
                    stringResource(
                        if (state.isLastQuestion) R.string.quiz_finish_button else R.string.quiz_next_button,
                    ),
                )
            }
        } else {
            Button(
                onClick = onSubmit,
                enabled = state.selectedOption != null && !state.isSubmitting,
                modifier = Modifier.fillMaxWidth(),
            ) {
                if (state.isSubmitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp,
                    )
                } else {
                    Text(stringResource(R.string.quiz_submit_button))
                }
            }
        }
    }
}

@Composable
private fun OptionRow(
    text: String,
    selected: Boolean,
    revealedCorrect: Boolean?,
    enabled: Boolean,
    onClick: () -> Unit,
) {
    val isDark = isSystemInDarkTheme()
    val targetContainerColor = getTargetContainerColor(isDark, revealedCorrect, selected)
    val targetContentColor = getTargetContentColor(isDark, revealedCorrect, selected)

    val containerColor by animateColorAsState(targetValue = targetContainerColor, label = "option_color")
    val contentColor by animateColorAsState(targetValue = targetContentColor, label = "option_content_color")
    
    Surface(
        color = containerColor,
        contentColor = contentColor,
        shape = MaterialTheme.shapes.medium,
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, enabled = enabled, role = Role.RadioButton, onClick = onClick),
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            RadioButton(selected = selected, onClick = null, enabled = enabled)
            Spacer(Modifier.width(8.dp))
            Text(text = text, style = MaterialTheme.typography.bodyLarge)
        }
    }
}

@Composable
private fun AnswerFeedback(isCorrect: Boolean) {
    val isDark = isSystemInDarkTheme()
    val icon = if (isCorrect) Icons.Filled.CheckCircle else Icons.Filled.Warning
    val textRes = if (isCorrect) R.string.quiz_correct_feedback else R.string.quiz_incorrect_feedback
    val descriptionRes = if (isCorrect) {
        R.string.quiz_correct_icon_description
    } else {
        R.string.quiz_incorrect_icon_description
    }
    val tint = if (isCorrect) {
        if (isDark) SuccessGreenDark else SuccessGreen
    } else {
        if (isDark)
            MaterialTheme.colorScheme.errorContainer
        else
            MaterialTheme.colorScheme.error
    }

    Row(
        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(imageVector = icon, contentDescription = stringResource(descriptionRes), tint = tint)
        Spacer(Modifier.width(8.dp))
        Text(text = stringResource(textRes), color = tint, style = MaterialTheme.typography.titleMedium)
    }
}

@Composable
private fun getTargetContainerColor(isDark: Boolean, revealedCorrect: Boolean?, selected: Boolean) = when {
    revealedCorrect != null && selected && revealedCorrect ->
        if (isDark) SuccessGreenContainerDark else SuccessGreenContainerLight
    revealedCorrect != null && selected -> MaterialTheme.colorScheme.errorContainer
    selected -> MaterialTheme.colorScheme.secondaryContainer
    else -> MaterialTheme.colorScheme.surfaceVariant
}

@Composable
private fun getTargetContentColor(isDark: Boolean, revealedCorrect: Boolean?, selected: Boolean) = when {
    revealedCorrect != null && selected && revealedCorrect ->
        if (isDark) OnSuccessGreenContainerDark else OnSuccessGreenContainerLight
    revealedCorrect != null && selected -> MaterialTheme.colorScheme.onErrorContainer
    selected -> MaterialTheme.colorScheme.onSecondaryContainer
    else -> MaterialTheme.colorScheme.onSurfaceVariant
}

@Composable
private fun ErrorContent(error: AppError, onRetry: () -> Unit, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.semantics { liveRegion = LiveRegionMode.Polite },
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(text = error.toMessage(), textAlign = TextAlign.Center)
        Spacer(Modifier.height(16.dp))
        Button(onClick = onRetry) { Text(stringResource(R.string.error_retry_button)) }
    }
}

@Composable
private fun AppError.toMessage(): String = when (this) {
    AppError.Network -> stringResource(R.string.error_network)
    AppError.BadRequest -> stringResource(R.string.error_bad_request)
    AppError.NotFound -> stringResource(R.string.error_not_found)
    AppError.ServerError -> stringResource(R.string.error_server)
    is AppError.Unknown -> stringResource(R.string.error_unknown)
}
