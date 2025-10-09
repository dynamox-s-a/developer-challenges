package com.dynamox.quiz.app.home.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.database.UserBestScore
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.best_players
import dynamoxquiz.composeapp.generated.resources.no_scores_message
import dynamoxquiz.composeapp.generated.resources.score
import dynamoxquiz.composeapp.generated.resources.start_quiz
import dynamoxquiz.composeapp.generated.resources.test_knowledge_message
import dynamoxquiz.composeapp.generated.resources.time
import dynamoxquiz.composeapp.generated.resources.welcome_message
import org.jetbrains.compose.resources.stringResource
import kotlin.time.Duration.Companion.milliseconds

@Composable
fun HomeTab(
    bestScores: List<UserBestScore>,
    onStartQuiz: () -> Unit,
    modifier: Modifier,
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = CenterHorizontally
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().weight(1f),
            verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.Bottom),
            horizontalAlignment = CenterHorizontally
        ) {
            Text(
                text = stringResource(Res.string.welcome_message),
                style = MaterialTheme.typography.headlineMedium,
                textAlign = TextAlign.Center,
            )
            Text(
                text = stringResource(Res.string.test_knowledge_message),
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center,
            )
            Button(onClick = onStartQuiz) { Text(stringResource(Res.string.start_quiz)) }
        }
        Text(
            text = stringResource(Res.string.best_players),
            style = MaterialTheme.typography.titleMedium
        )
        LazyColumn(
            modifier = Modifier.fillMaxWidth().weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            if (bestScores.isNotEmpty()) {
                items(bestScores) { row ->
                    ElevatedCard(Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(12.dp)) {
                            Text(
                                text = row.userName,
                                style = MaterialTheme.typography.titleMedium
                            )
                            Text(text = buildString {
                                append(stringResource(Res.string.score))
                                append(": ${row.score} • ")
                                append(stringResource(Res.string.time))
                                append(": ${row.timeTakenMs.milliseconds}")
                            })
                        }
                    }
                }
            } else {
                item {
                    Text(
                        modifier = Modifier.fillMaxWidth(),
                        text = stringResource(Res.string.no_scores_message),
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}