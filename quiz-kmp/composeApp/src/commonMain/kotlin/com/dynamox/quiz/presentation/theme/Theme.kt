package com.dynamox.quiz.presentation.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = ElectricBlue,
    onPrimary = DeepNavy,
    primaryContainer = DarkNavy,
    onPrimaryContainer = ElectricBlue,
    secondary = RoyalBlue,
    onSecondary = TextPrimary,
    secondaryContainer = SurfaceCard,
    onSecondaryContainer = TextPrimary,
    tertiary = NeonPink,
    onTertiary = TextPrimary,
    background = DeepNavy,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextSecondary,
    outline = Divider,
    error = WrongRed,
    onError = TextPrimary
)

@Composable
fun DynaQuizTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = AppTypography,
        content = content
    )
}
