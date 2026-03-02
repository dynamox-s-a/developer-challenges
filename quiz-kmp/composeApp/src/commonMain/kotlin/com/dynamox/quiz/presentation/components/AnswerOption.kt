package com.dynamox.quiz.presentation.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.presentation.theme.CorrectGreen
import com.dynamox.quiz.presentation.theme.CorrectGreenLight
import com.dynamox.quiz.presentation.theme.OptionCorrect
import com.dynamox.quiz.presentation.theme.OptionCorrectBorder
import com.dynamox.quiz.presentation.theme.OptionDefault
import com.dynamox.quiz.presentation.theme.OptionSelected
import com.dynamox.quiz.presentation.theme.OptionSelectedBorder
import com.dynamox.quiz.presentation.theme.OptionWrong
import com.dynamox.quiz.presentation.theme.OptionWrongBorder
import com.dynamox.quiz.presentation.theme.TextPrimary
import com.dynamox.quiz.presentation.theme.WrongRed
import com.dynamox.quiz.presentation.theme.WrongRedLight

/** Enum que representa os estados visuais de uma alternativa */
enum class AnswerState { DEFAULT, SELECTED, CORRECT, WRONG }
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnswerOption(
    text: String,
    state: AnswerState,
    onClick: () -> Unit,
    enabled: Boolean = true,
    modifier: Modifier = Modifier
) {
    val containerColor by animateColorAsState(
        targetValue = when (state) {
            AnswerState.DEFAULT  -> OptionDefault
            AnswerState.SELECTED -> OptionSelected
            AnswerState.CORRECT  -> OptionCorrect
            AnswerState.WRONG    -> OptionWrong
        },
        animationSpec = tween(300),
        label = "container"
    )

    val borderColor by animateColorAsState(
        targetValue = when (state) {
            AnswerState.DEFAULT  -> Color.Transparent
            AnswerState.SELECTED -> OptionSelectedBorder
            AnswerState.CORRECT  -> OptionCorrectBorder
            AnswerState.WRONG    -> OptionWrongBorder
        },
        animationSpec = tween(300),
        label = "border"
    )

    val textColor by animateColorAsState(
        targetValue = when (state) {
            AnswerState.DEFAULT, AnswerState.SELECTED -> TextPrimary
            AnswerState.CORRECT -> CorrectGreenLight
            AnswerState.WRONG   -> WrongRedLight
        },
        animationSpec = tween(300),
        label = "text"
    )

    Card(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = containerColor),
        border = BorderStroke(1.5.dp, borderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = text,
                style = MaterialTheme.typography.bodyLarge,
                color = textColor,
                modifier = Modifier.weight(1f)
            )

            when (state) {
                AnswerState.CORRECT -> {
                    Spacer(Modifier.width(12.dp))
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Correto",
                        tint = CorrectGreen,
                        modifier = Modifier.size(20.dp)
                    )
                }
                AnswerState.WRONG -> {
                    Spacer(Modifier.width(12.dp))
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Errado",
                        tint = WrongRed,
                        modifier = Modifier.size(20.dp)
                    )
                }
                else -> {}
            }
        }
    }
}
