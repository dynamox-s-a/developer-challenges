package com.romulofer.kotlinMultiplatform.presentation.settings

import androidx.compose.foundation.layout.Arrangement.spacedBy
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.romulofer.kotlinMultiplatform.domain.model.Language
import com.romulofer.kotlinMultiplatform.domain.model.Language.English
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import com.romulofer.kotlinMultiplatform.presentation.components.ScreenScaffold
import com.romulofer.kotlinMultiplatform.presentation.strings.AppStrings
import com.romulofer.kotlinMultiplatform.presentation.strings.LocalStrings
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun SettingsScreen(viewModel: SettingsViewModel = koinViewModel()) {
    val language by viewModel.language.collectAsStateWithLifecycle()
    val strings = LocalStrings.current
    ScreenScaffold(title = strings.settingsTitle, onBack = viewModel::onBack) {
        Spacer(Modifier.height(8.dp))
        Text(
            text = strings.languageLabel,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(12.dp))
        Column(modifier = Modifier.selectableGroup(), verticalArrangement = spacedBy(10.dp)) {
            Language.entries.forEach { option ->
                LanguageOption(
                    text = languageName(option, strings),
                    selected = option == language,
                    onClick = { viewModel.onLanguageSelected(option) }
                )
            }
        }
    }
}

private fun languageName(language: Language, strings: AppStrings): String = when (language) {
    English -> strings.languageEnglish
    Portuguese -> strings.languagePortuguese
}

@Composable
private fun LanguageOption(text: String, selected: Boolean, onClick: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .selectable(selected = selected, onClick = onClick, role = Role.RadioButton)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = CenterVertically
        ) {
            RadioButton(selected = selected, onClick = null)
            Text(
                text = text,
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(start = 16.dp)
            )
        }
    }
}
