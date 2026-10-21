package com.romulofer.kotlinMultiplatform.presentation.quiz

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Arrangement.Center
import androidx.compose.foundation.layout.Arrangement.spacedBy
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight.Companion.Bold
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.romulofer.kotlinMultiplatform.domain.model.Question
import com.romulofer.kotlinMultiplatform.presentation.components.AppIcon
import com.romulofer.kotlinMultiplatform.presentation.components.ErrorPanel
import com.romulofer.kotlinMultiplatform.presentation.components.ScreenScaffold
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Correct
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Dimmed
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Idle
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Selected
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Wrong
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Answered
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Asking
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Finished
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.LoadFailed
import com.romulofer.kotlinMultiplatform.presentation.quiz.QuizStep.Loading
import com.romulofer.kotlinMultiplatform.presentation.strings.AppStrings
import com.romulofer.kotlinMultiplatform.presentation.strings.LocalStrings
import com.romulofer.kotlinMultiplatform.presentation.theme.feedback
import com.romulofer.kotlinMultiplatform.resources.Res
import com.romulofer.kotlinMultiplatform.resources.ic_check
import com.romulofer.kotlinMultiplatform.resources.ic_close
import com.romulofer.kotlinMultiplatform.resources.ic_play_arrow
import com.romulofer.kotlinMultiplatform.resources.ic_trophy

private const val STEP_ENTER_MILLIS = 280
private const val STEP_EXIT_MILLIS = 120
private const val PROGRESS_MILLIS = 400
private const val OPTION_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

@Composable
fun QuizScreen(viewModel: QuizViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val actions = QuizActions(
        onOptionSelected = viewModel::onOptionSelected,
        onSubmit = viewModel::onSubmit,
        onNext = viewModel::onNext,
        onRetry = viewModel::onRetry,
        onRestart = viewModel::onRestart,
        onChangePlayer = viewModel::onChangePlayer,
        onScoreboardClick = viewModel::onScoreboardClick,
        onBack = viewModel::onBack
    )
    QuizContent(state, actions)
}

@Composable
private fun QuizContent(state: QuizUiState, actions: QuizActions) {
    val strings = LocalStrings.current
    val step = state.step
    ScreenScaffold(
        title = if (step is Finished) strings.finishedTitle else strings.questionProgress(state.questionNumber, state.totalQuestions),
        onBack = actions.onBack,
        actions = {
            IconButton(onClick = actions.onScoreboardClick) {
                AppIcon(Res.drawable.ic_trophy, strings.scoreboardAction)
            }
        }
    ) {
        if (step !is Finished) {
            QuizProgress(state, strings)
            Spacer(Modifier.height(16.dp))
        }
        AnimatedContent(
            targetState = step,
            modifier = Modifier.fillMaxSize(),
            contentKey = ::stepKey,
            transitionSpec = {
                (fadeIn(tween(STEP_ENTER_MILLIS)) + slideInVertically(tween(STEP_ENTER_MILLIS)) { it / 12 }) togetherWith
                    fadeOut(tween(STEP_EXIT_MILLIS))
            }
        ) { current ->
            when (current) {
                Loading -> LoadingContent(strings)
                is LoadFailed -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    ErrorPanel(strings.errorMessage(current.error), actions.onRetry)
                }
                is Asking -> AskingContent(current, strings, actions)
                is Answered -> AnsweredContent(current, strings, actions)
                is Finished -> FinishedContent(state, current, strings, actions)
            }
        }
    }
}

private fun stepKey(step: QuizStep): String = when (step) {
    Loading -> "loading"
    is LoadFailed -> "failed"
    is Asking -> "question-${step.question.id}"
    is Answered -> "question-${step.question.id}"
    is Finished -> "finished"
}

@Composable
private fun QuizProgress(state: QuizUiState, strings: AppStrings) {
    val progress by animateFloatAsState(state.progress, tween(PROGRESS_MILLIS))
    Column(verticalArrangement = spacedBy(8.dp)) {
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape),
            trackColor = MaterialTheme.colorScheme.surfaceVariant,
            drawStopIndicator = {}
        )
        Text(
            text = strings.liveScore(state.session.correct),
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.align(CenterHorizontally)
        )
    }
}

@Composable
private fun LoadingContent(strings: AppStrings) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Center,
        horizontalAlignment = CenterHorizontally
    ) {
        CircularProgressIndicator()
        Spacer(Modifier.height(16.dp))
        Text(
            text = strings.loadingQuestion,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun AskingContent(asking: Asking, strings: AppStrings, actions: QuizActions) {
    QuestionLayout(
        question = asking.question,
        optionState = { option -> if (option == asking.selected) Selected else Idle },
        optionsEnabled = !asking.isSubmitting,
        onOptionClick = actions.onOptionSelected
    ) {
        asking.submitError?.let { error ->
            ErrorPanel(strings.errorMessage(error), actions.onSubmit)
        }
        Button(
            onClick = actions.onSubmit,
            enabled = asking.selected != null && !asking.isSubmitting,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            if (asking.isSubmitting) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp,
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text(strings.submitAnswer, style = MaterialTheme.typography.titleMedium)
            }
        }
    }
}

@Composable
private fun AnsweredContent(answered: Answered, strings: AppStrings, actions: QuizActions) {
    QuestionLayout(
        question = answered.question,
        optionState = { option ->
            when {
                option != answered.selected -> Dimmed
                answered.isCorrect -> Correct
                else -> Wrong
            }
        },
        optionsEnabled = false,
        onOptionClick = {}
    ) {
        FeedbackBanner(answered.isCorrect, strings)
        Button(
            onClick = actions.onNext,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text(
                text = if (answered.isLastQuestion) strings.seeResult else strings.nextQuestion,
                style = MaterialTheme.typography.titleMedium
            )
        }
    }
}

@Composable
private fun QuestionLayout(
    question: Question,
    optionState: (String) -> OptionState,
    optionsEnabled: Boolean,
    onOptionClick: (String) -> Unit,
    footer: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(bottom = 24.dp),
        verticalArrangement = spacedBy(12.dp)
    ) {
        Text(
            text = question.statement,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = Bold,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        question.options.forEachIndexed { index, option ->
            OptionCard(
                label = OPTION_LABELS[index % OPTION_LABELS.length].toString(),
                text = option,
                state = optionState(option),
                enabled = optionsEnabled,
                onClick = { onOptionClick(option) }
            )
        }
        Spacer(Modifier.height(4.dp))
        footer()
    }
}

@Composable
private fun FeedbackBanner(isCorrect: Boolean, strings: AppStrings) {
    val container = if (isCorrect) MaterialTheme.feedback.correctContainer else MaterialTheme.colorScheme.errorContainer
    val content = if (isCorrect) MaterialTheme.feedback.onCorrectContainer else MaterialTheme.colorScheme.onErrorContainer
    val visibility = remember { MutableTransitionState(false).apply { targetState = true } }
    AnimatedVisibility(
        visibleState = visibility,
        enter = fadeIn(tween(STEP_ENTER_MILLIS)) + slideInVertically(tween(STEP_ENTER_MILLIS)) { it / 4 }
    ) {
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            color = container
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = CenterVertically
            ) {
                AppIcon(
                    resource = if (isCorrect) Res.drawable.ic_check else Res.drawable.ic_close,
                    contentDescription = null,
                    tint = content
                )
                Spacer(Modifier.width(12.dp))
                Text(
                    text = if (isCorrect) strings.correctFeedback else strings.incorrectFeedback,
                    style = MaterialTheme.typography.titleMedium,
                    color = content
                )
            }
        }
    }
}

@Composable
private fun FinishedContent(
    state: QuizUiState,
    finished: Finished,
    strings: AppStrings,
    actions: QuizActions
) {
    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(bottom = 24.dp),
        verticalArrangement = Center,
        horizontalAlignment = CenterHorizontally
    ) {
        Surface(
            shape = CircleShape,
            color = MaterialTheme.colorScheme.primaryContainer,
            modifier = Modifier.size(112.dp)
        ) {
            AppIcon(
                resource = Res.drawable.ic_trophy,
                contentDescription = null,
                modifier = Modifier.padding(28.dp),
                size = 56.dp,
                tint = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }
        Spacer(Modifier.height(24.dp))
        Text(
            text = strings.scoreValue(state.session.correct, state.totalQuestions),
            style = MaterialTheme.typography.displayMedium,
            fontWeight = Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = strings.finalScore(state.session.correct, state.totalQuestions),
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center
        )
        if (!finished.scoreSaved) {
            Spacer(Modifier.height(12.dp))
            Text(
                text = strings.scoreNotSaved,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.error,
                textAlign = TextAlign.Center
            )
        }
        Spacer(Modifier.height(32.dp))
        Button(
            onClick = actions.onRestart,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            AppIcon(Res.drawable.ic_play_arrow, contentDescription = null, size = 20.dp)
            Spacer(Modifier.width(8.dp))
            Text(strings.playAgain, style = MaterialTheme.typography.titleMedium)
        }
        Spacer(Modifier.height(12.dp))
        OutlinedButton(
            onClick = actions.onScoreboardClick,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text(strings.scoreboardAction, style = MaterialTheme.typography.titleMedium)
        }
        Spacer(Modifier.height(4.dp))
        TextButton(onClick = actions.onChangePlayer) {
            Text(strings.changePlayer)
        }
    }
}
