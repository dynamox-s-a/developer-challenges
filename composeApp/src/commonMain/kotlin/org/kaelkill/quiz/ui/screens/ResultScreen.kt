package org.kaelkill.quiz.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.kaelkill.quiz.ui.components.PrimaryButton
import org.kaelkill.quiz.ui.components.SecondaryButton

@Composable
fun ResultScreen(
    playerName: String,
    score: Int,
    onRestartQuiz: () -> Unit,
    onShowHistory: () -> Unit,
    onBackToLogin: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        ScoreFeedback(score)

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = playerName,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(32.dp))

        ScoreDisplay(score)

        Spacer(modifier = Modifier.height(48.dp))

        PrimaryButton(text = "Jogar Novamente", onClick = onRestartQuiz)
        Spacer(modifier = Modifier.height(12.dp))
        SecondaryButton(text = "Ver Histórico", onClick = onShowHistory)
        Spacer(modifier = Modifier.height(12.dp))
        SecondaryButton(text = "Trocar Jogador", onClick = onBackToLogin)
    }
}

@Composable
private fun ScoreFeedback(score: Int) {
    val (emoji, message) = when {
        score == 10 -> "🏆" to "Perfeito! Você é incrível!"
        score >= 7 -> "🎉" to "Ótimo resultado!"
        score >= 5 -> "👍" to "Bom trabalho!"
        score >= 3 -> "😅" to "Continue praticando!"
        else -> "💪" to "Não desista, tente novamente!"
    }

    Text(text = emoji, fontSize = 72.sp)
    Spacer(modifier = Modifier.height(16.dp))

    Text(
        text = "Quiz finalizado!",
        style = MaterialTheme.typography.headlineMedium,
        fontWeight = FontWeight.Bold
    )
}

@Composable
private fun ScoreDisplay(score: Int) {
    val message = when {
        score == 10 -> "Perfeito! Você é incrível!"
        score >= 7 -> "Ótimo resultado!"
        score >= 5 -> "Bom trabalho!"
        score >= 3 -> "Continue praticando!"
        else -> "Não desista, tente novamente!"
    }

    Text(
        text = "$score/10",
        fontSize = 64.sp,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.primary
    )

    Spacer(modifier = Modifier.height(8.dp))

    Text(
        text = message,
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        textAlign = TextAlign.Center
    )
}
