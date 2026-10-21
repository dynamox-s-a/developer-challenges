package com.romulofer.kotlinMultiplatform.presentation.scoreboard

import androidx.compose.foundation.layout.Arrangement.Center
import androidx.compose.foundation.layout.Arrangement.spacedBy
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight.Companion.Bold
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.romulofer.kotlinMultiplatform.domain.model.ScoreboardEntry
import com.romulofer.kotlinMultiplatform.presentation.components.AppIcon
import com.romulofer.kotlinMultiplatform.presentation.components.ScreenScaffold
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Content
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Empty
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Failed
import com.romulofer.kotlinMultiplatform.presentation.scoreboard.ScoreboardUiState.Loading
import com.romulofer.kotlinMultiplatform.presentation.strings.AppStrings
import com.romulofer.kotlinMultiplatform.presentation.strings.LocalStrings
import com.romulofer.kotlinMultiplatform.presentation.theme.feedback
import com.romulofer.kotlinMultiplatform.resources.Res
import com.romulofer.kotlinMultiplatform.resources.ic_trophy
import kotlin.time.Instant
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun ScoreboardScreen(viewModel: ScoreboardViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val strings = LocalStrings.current
    ScreenScaffold(title = strings.scoreboardTitle, onBack = viewModel::onBack) {
        when (val current = state) {
            Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            Empty -> Message(strings.scoreboardEmpty, showTrophy = true)
            Failed -> Message(strings.storageError, showTrophy = false)
            is Content -> ScoreList(current.entries, strings)
        }
    }
}

@Composable
private fun Message(text: String, showTrophy: Boolean) {
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Center,
        horizontalAlignment = CenterHorizontally
    ) {
        if (showTrophy) {
            AppIcon(
                resource = Res.drawable.ic_trophy,
                contentDescription = null,
                size = 64.dp,
                tint = MaterialTheme.colorScheme.outline
            )
            Spacer(Modifier.height(16.dp))
        }
        Text(
            text = text,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun ScoreList(entries: List<ScoreboardEntry>, strings: AppStrings) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = spacedBy(10.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        itemsIndexed(entries) { index, entry ->
            ScoreRow(rank = index + 1, entry = entry, strings = strings)
        }
    }
}

@Composable
private fun ScoreRow(rank: Int, entry: ScoreboardEntry, strings: AppStrings) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = CenterVertically
        ) {
            RankBadge(rank)
            Spacer(Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = entry.playerName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = Bold
                )
                Text(
                    text = formatDate(entry.playedAtEpochMillis),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Text(
                text = strings.scoreValue(entry.correctAnswers, entry.totalQuestions),
                style = MaterialTheme.typography.titleLarge,
                fontWeight = Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun RankBadge(rank: Int) {
    val feedback = MaterialTheme.feedback
    val color = when (rank) {
        1 -> feedback.gold
        2 -> feedback.silver
        3 -> feedback.bronze
        else -> MaterialTheme.colorScheme.secondaryContainer
    }
    val content = if (rank <= 3) Color.White else MaterialTheme.colorScheme.onSecondaryContainer
    Surface(shape = CircleShape, color = color, modifier = Modifier.size(36.dp)) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = rank.toString(),
                style = MaterialTheme.typography.labelLarge,
                fontWeight = Bold,
                color = content
            )
        }
    }
}

private fun formatDate(epochMillis: Long): String =
    Instant.fromEpochMilliseconds(epochMillis).toString().substringBefore('T')
