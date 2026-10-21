package com.romulofer.kotlinMultiplatform.presentation.registration

import androidx.compose.foundation.layout.Arrangement.Center
import androidx.compose.foundation.layout.Arrangement.spacedBy
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight.Companion.Bold
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.romulofer.kotlinMultiplatform.domain.usecase.RegisterPlayerUseCase.Companion.MAX_NAME_LENGTH
import com.romulofer.kotlinMultiplatform.presentation.components.AppIcon
import com.romulofer.kotlinMultiplatform.presentation.components.ScreenScaffold
import com.romulofer.kotlinMultiplatform.presentation.strings.LocalStrings
import com.romulofer.kotlinMultiplatform.resources.Res
import com.romulofer.kotlinMultiplatform.resources.ic_settings
import com.romulofer.kotlinMultiplatform.resources.ic_trophy
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun RegistrationScreen(viewModel: RegistrationViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    RegistrationContent(
        state = state,
        onNameChange = viewModel::onNameChange,
        onStart = viewModel::onStart,
        onScoreboardClick = viewModel::onScoreboardClick,
        onSettingsClick = viewModel::onSettingsClick
    )
}

@Composable
private fun RegistrationContent(
    state: RegistrationUiState,
    onNameChange: (String) -> Unit,
    onStart: () -> Unit,
    onScoreboardClick: () -> Unit,
    onSettingsClick: () -> Unit
) {
    val strings = LocalStrings.current
    ScreenScaffold(
        title = strings.appName,
        actions = {
            IconButton(onClick = onScoreboardClick) {
                AppIcon(Res.drawable.ic_trophy, strings.scoreboardAction)
            }
            IconButton(onClick = onSettingsClick) {
                AppIcon(Res.drawable.ic_settings, strings.settingsAction)
            }
        }
    ) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()),
            verticalArrangement = Center,
            horizontalAlignment = CenterHorizontally
        ) {
            Surface(
                shape = CircleShape,
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(96.dp)
            ) {
                AppIcon(
                    resource = Res.drawable.ic_trophy,
                    contentDescription = null,
                    modifier = Modifier.padding(24.dp),
                    size = 48.dp,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer
                )
            }
            Spacer(Modifier.height(24.dp))
            Text(
                text = strings.welcomeTitle,
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = Bold
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = strings.welcomeSubtitle,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(32.dp))
            OutlinedTextField(
                value = state.name,
                onValueChange = onNameChange,
                modifier = Modifier.fillMaxWidth(),
                label = { Text(strings.nameLabel) },
                singleLine = true,
                isError = state.nameError != null,
                supportingText = state.nameError?.let { reason ->
                    { Text(strings.nameError(reason, MAX_NAME_LENGTH)) }
                },
                shape = RoundedCornerShape(16.dp),
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.Words,
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(onDone = { onStart() })
            )
            if (state.storageFailed) {
                Text(
                    text = strings.storageError,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
            Spacer(Modifier.height(24.dp))
            Button(
                onClick = onStart,
                enabled = !state.isLoading,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                if (state.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text(strings.startQuiz, style = MaterialTheme.typography.titleMedium)
                }
            }
        }
    }
}
