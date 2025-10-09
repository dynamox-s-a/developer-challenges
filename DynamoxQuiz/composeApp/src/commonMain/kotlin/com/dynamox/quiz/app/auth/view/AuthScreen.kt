package com.dynamox.quiz.app.auth.view

import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.app.auth.viewModel.AuthViewModel
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.app_name
import dynamoxquiz.composeapp.generated.resources.email
import dynamoxquiz.composeapp.generated.resources.hide
import dynamoxquiz.composeapp.generated.resources.join_to_quiz_message
import dynamoxquiz.composeapp.generated.resources.login
import dynamoxquiz.composeapp.generated.resources.password
import dynamoxquiz.composeapp.generated.resources.show
import dynamoxquiz.composeapp.generated.resources.signup
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.koinInject

@Composable
fun AuthScreen(
    onSignUpRequest: () -> Unit,
) {
    val viewModel: AuthViewModel = koinInject()

    val email by viewModel.email.collectAsState()
    val password by viewModel.password.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    var passwordVisible by remember { mutableStateOf(false) }
    Scaffold { paddingValues ->
        Column(
            modifier = Modifier.fillMaxSize().padding(paddingValues).padding(32.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Column(
                modifier = Modifier.fillMaxWidth().weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp, alignment = Alignment.Bottom),
                horizontalAlignment = CenterHorizontally,
            ) {
                Box(
                    modifier = Modifier.fillMaxWidth().weight(1f),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = stringResource(Res.string.app_name),
                        style = MaterialTheme.typography.displayLarge,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Bold
                    )
                }

                Text(
                    text = stringResource(Res.string.join_to_quiz_message),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
            Column(
                modifier = Modifier.fillMaxWidth().weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                horizontalAlignment = CenterHorizontally,
            ) {
                OutlinedTextField(
                    value = email,
                    onValueChange = viewModel::updateEmail,
                    label = { Text(stringResource(Res.string.email)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = viewModel::updatePassword,
                    label = { Text(stringResource(Res.string.password)) },
                    singleLine = true,
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        TextButton(onClick = { passwordVisible = !passwordVisible }) {
                            Text(
                                if (passwordVisible) {
                                    stringResource(Res.string.hide)
                                } else {
                                    stringResource(Res.string.show)
                                }
                            )
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                )

                AnimatedContent(errorMessage) {
                    if (it != null) {
                        Text(text = it, color = MaterialTheme.colorScheme.error)
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    OutlinedButton(
                        onClick = onSignUpRequest,
                        enabled = !isLoading
                    ) { Text(stringResource(Res.string.signup)) }

                    Button(
                        onClick = viewModel::login,
                        enabled = !isLoading
                    ) { Text(stringResource(Res.string.login)) }
                }
            }
        }
    }
}