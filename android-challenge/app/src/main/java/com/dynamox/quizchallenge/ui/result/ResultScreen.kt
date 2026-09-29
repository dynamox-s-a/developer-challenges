package com.dynamox.quizchallenge.ui.result

import android.content.Intent
import androidx.compose.animation.core.animateIntAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dynamox.quizchallenge.R

@Composable
fun ResultScreen(
    playerName: String,
    correctCount: Int,
    totalQuestions: Int,
    onRestart: () -> Unit,
    onChangePlayer: () -> Unit,
    onViewHistory: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    val shareMessageTemplate = stringResource(R.string.result_share_message)
    val shareChooserTitle = stringResource(R.string.result_share_chooser_title)

    Scaffold(modifier = modifier) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text = stringResource(R.string.result_title),
                style = MaterialTheme.typography.headlineMedium,
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(16.dp))
            ResultScoreText(playerName = playerName, correctCount = correctCount, totalQuestions = totalQuestions)
            Spacer(Modifier.height(16.dp))
            OutlinedButton(
                onClick = {
                    val message = buildShareMessage(shareMessageTemplate, playerName, correctCount, totalQuestions)
                    val sendIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, message)
                    }
                    context.startActivity(Intent.createChooser(sendIntent, shareChooserTitle))
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                // Decorative: the button's own text already announces "Compartilhar pontuação",
                // so the icon does not need a separate content description.
                Icon(imageVector = Icons.Filled.Share, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text(stringResource(R.string.result_share_button))
            }
            Spacer(Modifier.height(12.dp))
            Button(onClick = onRestart, modifier = Modifier.fillMaxWidth()) {
                Text(stringResource(R.string.result_restart_button))
            }
            Spacer(Modifier.height(12.dp))
            OutlinedButton(onClick = onViewHistory, modifier = Modifier.fillMaxWidth()) {
                Text(stringResource(R.string.result_history_button))
            }
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onChangePlayer, modifier = Modifier.fillMaxWidth()) {
                Text(stringResource(R.string.result_change_player_button))
            }
        }
    }
}

@Composable
private fun ResultScoreText(
    playerName: String,
    correctCount: Int,
    totalQuestions: Int,
) {
    var animationStarted by remember { mutableStateOf(value = false) }
    LaunchedEffect(Unit) {
        animationStarted = true
    }
    val animatedCorrectCount by animateIntAsState(
        targetValue = if (animationStarted) correctCount else 0,
        animationSpec = tween(durationMillis = 1000),
        label = "result_score_count",
    )
    Text(
        text = stringResource(R.string.result_score, playerName, animatedCorrectCount, totalQuestions),
        style = MaterialTheme.typography.titleLarge,
        textAlign = TextAlign.Center,
    )
}
