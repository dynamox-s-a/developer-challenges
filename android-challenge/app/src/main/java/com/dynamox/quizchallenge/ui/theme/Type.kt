package com.dynamox.quizchallenge.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Rely on the Material 3 default type scale; only override the one style the app
// actually leans on for emphasis, instead of redefining every slot from scratch.
val Typography = Typography(
    headlineMedium = TextStyle(fontWeight = FontWeight.Bold, fontSize = 28.sp, lineHeight = 34.sp),
)
