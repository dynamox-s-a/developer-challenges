package com.romulofer.kotlinMultiplatform.presentation.strings

import androidx.compose.runtime.staticCompositionLocalOf
import com.romulofer.kotlinMultiplatform.domain.model.Language
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese

val LocalStrings = staticCompositionLocalOf<AppStrings> { EnglishStrings }

fun Language.strings(): AppStrings = when (this) {
    English -> EnglishStrings
    Portuguese -> PortugueseStrings
}
