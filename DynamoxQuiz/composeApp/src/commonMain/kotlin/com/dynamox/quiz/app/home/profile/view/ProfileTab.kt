package com.dynamox.quiz.app.home.profile.view

import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.app.home.profile.viewModel.ProfileViewModel
import com.dynamox.quiz.database.QuizScore
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.cancel
import dynamoxquiz.composeapp.generated.resources.confirm
import dynamoxquiz.composeapp.generated.resources.confirmation
import dynamoxquiz.composeapp.generated.resources.delete
import dynamoxquiz.composeapp.generated.resources.delete_score_confirmation_message
import dynamoxquiz.composeapp.generated.resources.email
import dynamoxquiz.composeapp.generated.resources.logout
import dynamoxquiz.composeapp.generated.resources.name
import dynamoxquiz.composeapp.generated.resources.no_saved_scores_message
import dynamoxquiz.composeapp.generated.resources.profile
import dynamoxquiz.composeapp.generated.resources.save
import dynamoxquiz.composeapp.generated.resources.saved_scores
import dynamoxquiz.composeapp.generated.resources.score
import dynamoxquiz.composeapp.generated.resources.time
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.koinInject
import kotlin.time.Duration.Companion.milliseconds
import kotlin.uuid.Uuid

@Composable
fun ProfileTab(
    modifier: Modifier,
) {
    val viewModel: ProfileViewModel = koinInject()

    val name by viewModel.name.collectAsState()
    val email by viewModel.email.collectAsState()
    val scores by viewModel.scores.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            text = stringResource(Res.string.profile),
            style = MaterialTheme.typography.titleLarge,
        )

        OutlinedTextField(
            value = name,
            onValueChange = viewModel::updateName,
            label = { Text(stringResource(Res.string.name)) },
            modifier = Modifier.fillMaxWidth()
        )
        OutlinedTextField(
            value = email,
            onValueChange = viewModel::updateEmail,
            label = { Text(stringResource(Res.string.email)) },
            modifier = Modifier.fillMaxWidth()
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = CenterVertically,
        ) {
            OutlinedButton(onClick = viewModel::logout) { Text(stringResource(Res.string.logout)) }
            Button(onClick = viewModel::saveProfile) { Text(stringResource(Res.string.save)) }
        }

        AnimatedContent(errorMessage) {
            if (it != null) {
                Text(it, color = MaterialTheme.colorScheme.error)
            }
        }

        Text(stringResource(Res.string.saved_scores), style = MaterialTheme.typography.titleMedium)
        ScoresList(scores = scores, onDelete = viewModel::deleteScore)
    }
}

@Composable
private fun ScoresList(
    scores: List<QuizScore>,
    onDelete: (Uuid) -> Unit
) {
    var openDialogForId by remember { mutableStateOf<Uuid?>(null) }

    LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        if (scores.isNotEmpty()) {
            items(scores) { score ->
                ElevatedCard(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(12.dp)) {
                        Text(buildString {
                            append(stringResource(Res.string.score))
                            append(": ${score.score}")
                        })
                        Text(buildString {
                            append(stringResource(Res.string.time))
                            append(": ${score.timeTakenMs.milliseconds}")
                        })
                        Spacer(Modifier.height(8.dp))
                        OutlinedButton(onClick = { openDialogForId = score.id }) {
                            Text(stringResource(Res.string.delete))
                        }
                    }
                }
            }
        } else {
            item {
                Text(
                    text = stringResource(Res.string.no_saved_scores_message),
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center,
                )
            }
        }
    }

    if (openDialogForId != null) {
        AlertDialog(
            onDismissRequest = { openDialogForId = null },
            confirmButton = {
                TextButton(
                    onClick = {
                        onDelete(openDialogForId!!)
                        openDialogForId = null
                    }
                ) { Text(stringResource(Res.string.confirm)) }
            },
            dismissButton = {
                TextButton(onClick = { openDialogForId = null }) {
                    Text(stringResource(Res.string.cancel))
                }
            },
            title = { Text(stringResource(Res.string.confirmation)) },
            text = { Text(stringResource(Res.string.delete_score_confirmation_message)) }
        )
    }
}
