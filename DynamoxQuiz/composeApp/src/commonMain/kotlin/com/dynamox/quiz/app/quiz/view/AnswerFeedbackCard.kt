package com.dynamox.quiz.app.quiz.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.correct_message
import dynamoxquiz.composeapp.generated.resources.finish
import dynamoxquiz.composeapp.generated.resources.leave
import dynamoxquiz.composeapp.generated.resources.next
import dynamoxquiz.composeapp.generated.resources.time_for_question_message
import dynamoxquiz.composeapp.generated.resources.wrong_message
import org.jetbrains.compose.resources.stringResource
import kotlin.time.Duration

@Composable
internal fun AnswerFeedbackCard(
    correct: Boolean,
    duration: Duration,
    isLastQuestion: Boolean,
    onNext: () -> Unit,
    onExit: () -> Unit
) {
    val color = if (correct) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
    val title = if (correct) {
        stringResource(Res.string.correct_message)
    } else {
        stringResource(Res.string.wrong_message)
    }
    val nextLabel = if (isLastQuestion) {
        stringResource(Res.string.finish)
    } else {
        stringResource(Res.string.next)
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        ElevatedCard(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(title, style = MaterialTheme.typography.headlineSmall, color = color)
                Text(stringResource(Res.string.time_for_question_message, duration.toString()))
            }
        }

        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(onClick = onExit, modifier = Modifier.weight(1f)) {
                Text(
                    stringResource(
                        Res.string.leave
                    )
                )
            }
            Button(onClick = onNext, modifier = Modifier.weight(1f)) { Text(nextLabel) }
        }
    }
}
