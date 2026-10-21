package com.romulofer.kotlinMultiplatform.presentation.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

@Immutable
class FeedbackColors(
    val correct: Color,
    val onCorrect: Color,
    val correctContainer: Color,
    val onCorrectContainer: Color,
    val gold: Color,
    val silver: Color,
    val bronze: Color
)

private val LightFeedbackColors = FeedbackColors(
    correct = Color(0xFF2E7D32),
    onCorrect = Color.White,
    correctContainer = Color(0xFFD7F0D9),
    onCorrectContainer = Color(0xFF0B3D10),
    gold = Color(0xFFC98A00),
    silver = Color(0xFF8E9AA6),
    bronze = Color(0xFFB87333)
)

private val DarkFeedbackColors = FeedbackColors(
    correct = Color(0xFF7FD184),
    onCorrect = Color(0xFF00390A),
    correctContainer = Color(0xFF1B4D20),
    onCorrectContainer = Color(0xFFD7F0D9),
    gold = Color(0xFFFFB74D),
    silver = Color(0xFFB4BEC8),
    bronze = Color(0xFFD99A63)
)

private val LightColors = lightColorScheme(
    primary = Color(0xFFA63F10),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFBDDD0),
    onPrimaryContainer = Color(0xFF3B1305),
    secondary = Color(0xFFA65A00),
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFF5E0C3),
    onSecondaryContainer = Color(0xFF2F1A00),
    background = Color(0xFFFFFCF9),
    onBackground = Color(0xFF1B1411),
    surface = Color(0xFFFFFCF9),
    onSurface = Color(0xFF1B1411),
    surfaceVariant = Color(0xFFF2EBE5),
    onSurfaceVariant = Color(0xFF6A5D56),
    outline = Color(0xFF85766E),
    error = Color(0xFFB00020),
    onError = Color.White,
    errorContainer = Color(0xFFFFD9DC),
    onErrorContainer = Color(0xFF40000A)
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFD9531E),
    onPrimary = Color.White,
    primaryContainer = Color(0xFF6B2A16),
    onPrimaryContainer = Color(0xFFFFDBCD),
    secondary = Color(0xFFFFB74D),
    onSecondary = Color(0xFF3A2400),
    secondaryContainer = Color(0xFF4D3A1E),
    onSecondaryContainer = Color(0xFFFFDDB0),
    background = Color(0xFF000000),
    onBackground = Color.White,
    surface = Color(0xFF000000),
    onSurface = Color.White,
    surfaceVariant = Color(0xFF241C18),
    onSurfaceVariant = Color(0xFFB8ADA6),
    outline = Color(0xFF7A6F68),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6)
)

private val LocalFeedbackColors = staticCompositionLocalOf { LightFeedbackColors }

val MaterialTheme.feedback: FeedbackColors
    @Composable
    @ReadOnlyComposable
    get() = LocalFeedbackColors.current

@Composable
fun QuizTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    CompositionLocalProvider(
        LocalFeedbackColors provides if (darkTheme) DarkFeedbackColors else LightFeedbackColors
    ) {
        MaterialTheme(
            colorScheme = if (darkTheme) DarkColors else LightColors,
            content = content
        )
    }
}
