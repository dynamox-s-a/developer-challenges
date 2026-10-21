package com.romulofer.kotlinMultiplatform.presentation.quiz

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment.Companion.Center
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight.Companion.Bold
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Box
import com.romulofer.kotlinMultiplatform.presentation.components.AppIcon
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Correct
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Dimmed
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Idle
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Selected
import com.romulofer.kotlinMultiplatform.presentation.quiz.OptionState.Wrong
import com.romulofer.kotlinMultiplatform.presentation.theme.feedback
import com.romulofer.kotlinMultiplatform.resources.Res
import com.romulofer.kotlinMultiplatform.resources.ic_check
import com.romulofer.kotlinMultiplatform.resources.ic_close

enum class OptionState { Idle, Selected, Correct, Wrong, Dimmed }

private const val COLOR_ANIMATION_MILLIS = 250

@Composable
fun OptionCard(
    label: String,
    text: String,
    state: OptionState,
    enabled: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scheme = MaterialTheme.colorScheme
    val feedback = MaterialTheme.feedback

    val container = when (state) {
        Idle, Dimmed -> scheme.surfaceVariant.copy(alpha = 0.4f)
        Selected -> scheme.primaryContainer
        Correct -> feedback.correctContainer
        Wrong -> scheme.errorContainer
    }
    val border = when (state) {
        Idle, Dimmed -> scheme.outline.copy(alpha = 0.4f)
        Selected -> scheme.primary
        Correct -> feedback.correct
        Wrong -> scheme.error
    }
    val badge = when (state) {
        Idle, Dimmed -> scheme.secondaryContainer
        Selected -> scheme.primary
        Correct -> feedback.correct
        Wrong -> scheme.error
    }
    val badgeContent = when (state) {
        Idle, Dimmed -> scheme.onSecondaryContainer
        Selected -> scheme.onPrimary
        Correct -> feedback.onCorrect
        Wrong -> scheme.onError
    }

    val containerColor by animateColorAsState(container, tween(COLOR_ANIMATION_MILLIS))
    val borderColor by animateColorAsState(border, tween(COLOR_ANIMATION_MILLIS))
    val badgeColor by animateColorAsState(badge, tween(COLOR_ANIMATION_MILLIS))
    val badgeContentColor by animateColorAsState(badgeContent, tween(COLOR_ANIMATION_MILLIS))

    Surface(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.fillMaxWidth().alpha(if (state == Dimmed) 0.6f else 1f),
        shape = RoundedCornerShape(16.dp),
        color = containerColor,
        border = BorderStroke(if (state == Idle || state == Dimmed) 1.dp else 2.dp, borderColor)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = CenterVertically
        ) {
            Surface(shape = CircleShape, color = badgeColor, modifier = Modifier.size(32.dp)) {
                Box(contentAlignment = Center) {
                    when (state) {
                        Correct -> AppIcon(Res.drawable.ic_check, null, size = 18.dp, tint = badgeContentColor)
                        Wrong -> AppIcon(Res.drawable.ic_close, null, size = 18.dp, tint = badgeContentColor)
                        else -> Text(
                            text = label,
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = Bold,
                            color = badgeContentColor
                        )
                    }
                }
            }
            Spacer(Modifier.width(16.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.bodyLarge,
                color = scheme.onSurface
            )
        }
    }
}
