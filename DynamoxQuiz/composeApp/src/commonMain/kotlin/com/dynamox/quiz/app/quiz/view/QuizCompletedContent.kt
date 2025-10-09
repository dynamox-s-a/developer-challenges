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
import dynamoxquiz.composeapp.generated.resources.back
import dynamoxquiz.composeapp.generated.resources.quiz_completed
import dynamoxquiz.composeapp.generated.resources.restart
import dynamoxquiz.composeapp.generated.resources.save_score
import dynamoxquiz.composeapp.generated.resources.total_time_message
import dynamoxquiz.composeapp.generated.resources.your_final_score_message
import org.jetbrains.compose.resources.stringResource
import kotlin.time.Duration

@Composable
internal fun QuizCompletedContent(
    score: Int,
    totalDuration: Duration,
    onSave: () -> Unit,
    onRestart: () -> Unit,
    onExit: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        ElevatedCard(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    stringResource(Res.string.quiz_completed),
                    style = MaterialTheme.typography.headlineSmall
                )
                Text(stringResource(Res.string.your_final_score_message, score))
                Text(stringResource(Res.string.total_time_message, totalDuration.toString()))
            }
        }

        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(onClick = onExit, modifier = Modifier.weight(1f)) {
                Text(
                    stringResource(
                        Res.string.back
                    )
                )
            }
            OutlinedButton(onClick = onRestart, modifier = Modifier.weight(1f)) {
                Text(
                    stringResource(Res.string.restart)
                )
            }
            Button(
                onClick = onSave,
                modifier = Modifier.weight(1f)
            ) { Text(stringResource(Res.string.save_score)) }
        }
    }
}
