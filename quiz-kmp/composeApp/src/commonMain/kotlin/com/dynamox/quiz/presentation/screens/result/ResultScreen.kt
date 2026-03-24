package com.dynamox.quiz.presentation.screens.result

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.EaseOutBack
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dynamox.quiz.presentation.components.PrimaryButton
import com.dynamox.quiz.presentation.components.SecondaryButton
import com.dynamox.quiz.presentation.theme.CorrectGreen
import com.dynamox.quiz.presentation.theme.DarkNavy
import com.dynamox.quiz.presentation.theme.DeepNavy
import com.dynamox.quiz.presentation.theme.ElectricBlue
import com.dynamox.quiz.presentation.theme.MidnightBlue
import com.dynamox.quiz.presentation.theme.RoyalBlue
import com.dynamox.quiz.presentation.theme.SurfaceCard
import com.dynamox.quiz.presentation.theme.TextPrimary
import com.dynamox.quiz.presentation.theme.TextSecondary
import com.dynamox.quiz.presentation.theme.WrongRed
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun ResultScreen(
    playerName: String,
    playerId: Long,
    score: Int,
    total: Int,
    onRestartQuiz: () -> Unit,
    onViewLeaderboard: () -> Unit,
    onHome: () -> Unit,
    viewModel: ResultViewModel = koinViewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.loadRecentScores()
    }

    val percentage = (score.toFloat() / total.toFloat()) * 100f
    val emoji = when {
        percentage >= 90 -> "🏆"
        percentage >= 70 -> "🎉"
        percentage >= 50 -> "👍"
        else -> "💪"
    }
    val message = when {
        percentage >= 90 -> "Surreal!!"
        percentage >= 70 -> "Excelente trabalho!"
        percentage >= 50 -> "Você foi bem!"
        else -> "Continue praticando!"
    }

    val scoreColor = when {
        percentage >= 70 -> CorrectGreen
        percentage >= 50 -> ElectricBlue
        else -> WrongRed
    }

    val scale = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        scale.animateTo(1f, animationSpec = tween(600, easing = EaseOutBack))
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(MidnightBlue, DeepNavy, DarkNavy)
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 28.dp, vertical = 40.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = emoji,
                style = MaterialTheme.typography.displayLarge,
                modifier = Modifier.scale(scale.value)
            )

            Spacer(Modifier.height(16.dp))

            Text(
                text = message,
                style = MaterialTheme.typography.headlineLarge,
                color = TextPrimary,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(8.dp))

            Text(
                text = playerName,
                style = MaterialTheme.typography.titleMedium,
                color = ElectricBlue,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(40.dp))

            // Score card
            Box(
                modifier = Modifier
                    .scale(scale.value)
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.radialGradient(
                            colors = listOf(
                                scoreColor.copy(alpha = 0.3f),
                                scoreColor.copy(alpha = 0.05f)
                            )
                        )
                    )
                    .padding(4.dp),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(CircleShape)
                        .background(SurfaceCard),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "$score",
                            fontSize = 52.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = scoreColor
                        )
                        Text(
                            text = "de $total",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                    }
                }
            }

            Spacer(Modifier.height(32.dp))

            // Stats row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(SurfaceCard)
                    .padding(24.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatItem(
                    label = "Correto",
                    value = "$score",
                    color = CorrectGreen
                )
                StatItem(
                    label = "Errado",
                    value = "${total - score}",
                    color = WrongRed
                )
                StatItem(
                    label = "Pontuação",
                    value = "${percentage.toInt()}%",
                    color = ElectricBlue
                )
            }

            Spacer(Modifier.height(40.dp))

            PrimaryButton(
                text = "Jogar novamente",
                onClick = onRestartQuiz
            )

            Spacer(Modifier.height(12.dp))

            SecondaryButton(
                text = "Classificação",
                onClick = onViewLeaderboard,
                contentColor = RoyalBlue
            )

            Spacer(Modifier.height(12.dp))

            SecondaryButton(
                text = "Voltar para o início",
                onClick = onHome
            )

            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun StatItem(
    label: String,
    value: String,
    color: Color
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = color
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = TextSecondary
        )
    }
}
