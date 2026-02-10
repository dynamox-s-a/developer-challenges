package org.kaelkill.quiz.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.kaelkill.quiz.ui.components.PrimaryButton

@Composable
fun LoginScreen(
    playerName: String,
    isLoading: Boolean,
    error: String?,
    onNameChanged: (String) -> Unit,
    onStartQuiz: () -> Unit,
    onShowHistory: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        AppLogo()

        Spacer(modifier = Modifier.height(48.dp))

        NameInput(
            value = playerName,
            onValueChange = onNameChanged,
            isError = error != null
        )

        AnimatedError(error)

        Spacer(modifier = Modifier.height(24.dp))

        PrimaryButton(
            text = "Começar Quiz",
            onClick = onStartQuiz,
            isLoading = isLoading
        )

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onShowHistory) {
            Text("Ver histórico de pontuações")
        }
    }
}

@Composable
private fun AppLogo() {
    Text(text = "🧠", fontSize = 64.sp)

    Spacer(modifier = Modifier.height(16.dp))

    Text(
        text = "Quiz App",
        style = MaterialTheme.typography.headlineLarge,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.primary
    )

    Spacer(modifier = Modifier.height(8.dp))

    Text(
        text = "Teste seus conhecimentos!",
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant
    )
}

@Composable
private fun NameInput(
    value: String,
    onValueChange: (String) -> Unit,
    isError: Boolean
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text("Seu nome ou apelido") },
        singleLine = true,
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth(),
        isError = isError
    )
}

@Composable
private fun AnimatedError(error: String?) {
    AnimatedVisibility(visible = error != null) {
        Text(
            text = error ?: "",
            color = MaterialTheme.colorScheme.error,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}
