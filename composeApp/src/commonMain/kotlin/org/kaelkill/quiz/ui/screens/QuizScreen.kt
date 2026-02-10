package org.kaelkill.quiz.ui.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.ui.components.LoadingContent
import org.kaelkill.quiz.ui.components.PrimaryButton

@Composable
fun QuizScreen(
    question: Question?,
    progress: String,
    questionIndex: Int,
    selectedOption: String?,
    answerResult: Boolean?,
    isLoading: Boolean,
    isWaitingForQuestion: Boolean,
    score: Int,
    error: String?,
    canRetry: Boolean,
    onSelectOption: (String) -> Unit,
    onSubmitAnswer: () -> Unit,
    onNextQuestion: () -> Unit,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        ProgressHeader(progress, questionIndex, score)

        Spacer(modifier = Modifier.height(24.dp))

        if (isWaitingForQuestion) {
            LoadingContent("Carregando pergunta...")
            return
        }

        if (question != null) {
            QuestionContent(
                question = question,
                selectedOption = selectedOption,
                answerResult = answerResult,
                isLoading = isLoading,
                error = error,
                onSelectOption = onSelectOption,
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.height(16.dp))

            QuizActionButton(
                canRetry = canRetry,
                answerResult = answerResult,
                selectedOption = selectedOption,
                isLoading = isLoading,
                isLastQuestion = questionIndex >= 9,
                onRetry = onRetry,
                onSubmitAnswer = onSubmitAnswer,
                onNextQuestion = onNextQuestion
            )
        }
    }
}

@Composable
private fun ProgressHeader(progress: String, questionIndex: Int, score: Int) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "Pergunta $progress",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Score: $score",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )
    }

    Spacer(modifier = Modifier.height(8.dp))

    LinearProgressIndicator(
        progress = { (questionIndex + 1) / 10f },
        modifier = Modifier
            .fillMaxWidth()
            .height(8.dp),
        trackColor = MaterialTheme.colorScheme.surfaceVariant,
    )
}

@Composable
private fun QuestionContent(
    question: Question,
    selectedOption: String?,
    answerResult: Boolean?,
    isLoading: Boolean,
    error: String?,
    onSelectOption: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.verticalScroll(rememberScrollState())
    ) {
        StatementCard(question.statement.value)

        Spacer(modifier = Modifier.height(20.dp))

        question.options.forEach { option ->
            OptionItem(
                text = option.value,
                isSelected = selectedOption == option.value,
                answerResult = answerResult,
                enabled = answerResult == null && !isLoading,
                onClick = { onSelectOption(option.value) }
            )
        }

        if (answerResult != null) {
            AnswerFeedback(isCorrect = answerResult)
        }

        if (error != null) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
private fun StatementCard(statement: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Text(
            text = statement,
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(20.dp),
            textAlign = TextAlign.Start
        )
    }
}

@Composable
private fun OptionItem(
    text: String,
    isSelected: Boolean,
    answerResult: Boolean?,
    enabled: Boolean,
    onClick: () -> Unit
) {
    val hasResult = answerResult != null

    val borderColor by animateColorAsState(
        targetValue = when {
            !isSelected -> MaterialTheme.colorScheme.outline
            hasResult && answerResult -> MaterialTheme.colorScheme.primary
            hasResult && !answerResult -> MaterialTheme.colorScheme.error
            else -> MaterialTheme.colorScheme.primary
        }
    )

    val containerColor by animateColorAsState(
        targetValue = when {
            !isSelected -> MaterialTheme.colorScheme.surface
            hasResult && answerResult -> MaterialTheme.colorScheme.primaryContainer
            hasResult && !answerResult -> MaterialTheme.colorScheme.errorContainer
            else -> MaterialTheme.colorScheme.secondaryContainer
        }
    )

    OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .defaultMinSize(minHeight = 64.dp),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(2.dp, borderColor),
        colors = ButtonDefaults.outlinedButtonColors(containerColor = containerColor)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Start,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        )
    }
}

@Composable
private fun AnswerFeedback(isCorrect: Boolean) {
    Spacer(modifier = Modifier.height(16.dp))

    val (text, color) = if (isCorrect) {
        "✅ Correto!" to MaterialTheme.colorScheme.primary
    } else {
        "❌ Incorreto!" to MaterialTheme.colorScheme.error
    }

    Text(
        text = text,
        color = color,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.fillMaxWidth(),
        textAlign = TextAlign.Center
    )
}

@Composable
private fun QuizActionButton(
    canRetry: Boolean,
    answerResult: Boolean?,
    selectedOption: String?,
    isLoading: Boolean,
    isLastQuestion: Boolean,
    onRetry: () -> Unit,
    onSubmitAnswer: () -> Unit,
    onNextQuestion: () -> Unit
) {
    when {
        canRetry -> PrimaryButton(text = "Tentar Novamente", onClick = onRetry)
        answerResult == null -> PrimaryButton(
            text = "Confirmar",
            onClick = onSubmitAnswer,
            enabled = selectedOption != null,
            isLoading = isLoading
        )
        else -> PrimaryButton(
            text = if (isLastQuestion) "Ver Resultado" else "Próxima",
            onClick = onNextQuestion
        )
    }
}