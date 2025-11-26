package com.franckkumako.dynamoxquiz.presentation.welcome

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun WelcomeScreen(
    onStartQuiz: (String) -> Unit
) {

    var name by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Welcome to Dynamox Quiz!")

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Enter your name or nickname") }
            )

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                enabled = name.isNotBlank(),
                onClick = { onStartQuiz(name.trim()) }
            ) {
                Text(text = "Start Quiz")
            }

            AnimatedVisibility(
                visible = name.isNotBlank(),
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Ready, $name?")
            }
        }
    }
}
