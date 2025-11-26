package com.franckkumako.dynamoxquiz.presentation.result

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.franckkumako.dynamoxquiz.domain.model.Score

@Composable
fun ResultScreen(
    playerName: String,
    score: Int,
    onRestart: () -> Unit,
    viewModel: ResultViewModel
) {
    val scores by viewModel.scores.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadScores()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Congrats, $playerName!")
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "Your final score: $score / 10")

            Spacer(modifier = Modifier.height(16.dp))

            Button(onClick = onRestart) {
                Text(text = "Restart Quiz")
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(text = "All players scores")
            Spacer(modifier = Modifier.height(8.dp))

            ScoreList(scores = scores)
        }
    }
}

@Composable
private fun ScoreList(scores: List<Score>) {
    LazyColumn {
        items(scores) { item ->
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Text(text = "${item.playerName} - ${item.score}/10")
            }
        }
    }
}
