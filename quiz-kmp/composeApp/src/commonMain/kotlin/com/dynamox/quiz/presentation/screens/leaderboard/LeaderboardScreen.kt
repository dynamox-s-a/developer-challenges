package com.dynamox.quiz.presentation.screens.leaderboard

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.domain.model.QuizScore
import com.dynamox.quiz.presentation.components.PrimaryButton
import com.dynamox.quiz.presentation.theme.DarkNavy
import com.dynamox.quiz.presentation.theme.DeepNavy
import com.dynamox.quiz.presentation.theme.ElectricBlue
import com.dynamox.quiz.presentation.theme.MidnightBlue
import com.dynamox.quiz.presentation.theme.SurfaceCard
import com.dynamox.quiz.presentation.theme.SurfaceCardLight
import com.dynamox.quiz.presentation.theme.TextPrimary
import com.dynamox.quiz.presentation.theme.TextSecondary
import org.koin.compose.viewmodel.koinViewModel

private val Gold = Color(0xFFFFD700)
private val Silver = Color(0xFFC0C0C0)
private val Bronze = Color(0xFFCD7F32)

@Composable
fun LeaderboardScreen(
    onBack: () -> Unit,
    viewModel: LeaderboardViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(MidnightBlue, DeepNavy, DarkNavy)
                )
            )
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Voltar",
                        tint = ElectricBlue
                    )
                }
                Text(
                    text = "Leaderboard",
                    style = MaterialTheme.typography.headlineMedium,
                    color = TextPrimary,
                    modifier = Modifier.weight(1f),
                    textAlign = TextAlign.Center
                )
                // Spacer to balance the back button
                Spacer(Modifier.size(48.dp))
            }

            when (val currentState = state) {
                is LeaderboardState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            color = ElectricBlue,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }

                is LeaderboardState.Empty -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.padding(32.dp)
                        ) {
                            Text(text = "🏆", style = MaterialTheme.typography.displayMedium)
                            Spacer(Modifier.height(16.dp))
                            Text(
                                text = currentState.message,
                                style = MaterialTheme.typography.bodyLarge,
                                color = TextSecondary,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }

                is LeaderboardState.Error -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = currentState.message,
                            style = MaterialTheme.typography.bodyLarge,
                            color = TextSecondary,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(24.dp))
                        PrimaryButton(
                            text = "Retry",
                            onClick = viewModel::loadLeaderboard,
                            modifier = Modifier.padding(horizontal = 32.dp)
                        )
                    }
                }

                is LeaderboardState.Success -> {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        item { Spacer(Modifier.height(8.dp)) }
                        itemsIndexed(currentState.scores) { index, score ->
                            ScoreItem(index = index, score = score)
                        }
                        item { Spacer(Modifier.height(24.dp)) }
                    }
                }
            }
        }
    }
}

@Composable
private fun ScoreItem(index: Int, score: QuizScore) {
    val rankColor = when (index) {
        0 -> Gold
        1 -> Silver
        2 -> Bronze
        else -> TextSecondary
    }

    val rankEmoji = when (index) {
        0 -> "🥇"
        1 -> "🥈"
        2 -> "🥉"
        else -> "#${index + 1}"
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(if (index < 3) SurfaceCardLight else SurfaceCard)
            .padding(horizontal = 20.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Rank
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(rankColor.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = rankEmoji,
                style = if (index < 3) MaterialTheme.typography.titleMedium
                else MaterialTheme.typography.labelMedium,
                color = rankColor,
                fontWeight = FontWeight.Bold
            )
        }

        // Info jogador
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = score.playerName,
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary
            )
            Text(
                text = formatDate(score.createdAt),
                style = MaterialTheme.typography.labelMedium,
                color = TextSecondary
            )
        }

        // Info pontuação
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = "${score.score}/${score.totalQuestions}",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = ElectricBlue
            )
            val percent = (score.score.toFloat() / score.totalQuestions.toFloat() * 100).toInt()
            Text(
                text = "$percent%",
                style = MaterialTheme.typography.labelMedium,
                color = TextSecondary
            )
        }
    }
}

private fun formatDate(isoDate: String): String {
    return try {
        val parts = isoDate.split("T")[0].split("-")
        if (parts.size >= 3) {
            val months = listOf("", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
            val month = months.getOrNull(parts[1].toIntOrNull() ?: 0) ?: parts[1]
            "$month ${parts[2]}, ${parts[0]}"
        } else isoDate
    } catch (e: Exception) {
        isoDate
    }
}
