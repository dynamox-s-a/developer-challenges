package com.dynamox.quiz.app.signup.view

import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.app.signup.viewModel.SignUpViewModel
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.back
import dynamoxquiz.composeapp.generated.resources.create_account
import dynamoxquiz.composeapp.generated.resources.email
import dynamoxquiz.composeapp.generated.resources.hide
import dynamoxquiz.composeapp.generated.resources.name
import dynamoxquiz.composeapp.generated.resources.password
import dynamoxquiz.composeapp.generated.resources.show
import dynamoxquiz.composeapp.generated.resources.signup
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.koinInject

@Composable
fun SignUpScreen(
    onBackRequest: () -> Unit,
) {
    val viewModel: SignUpViewModel = koinInject()

    val name by viewModel.name.collectAsState()
    val email by viewModel.email.collectAsState()
    val password by viewModel.password.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    var passwordVisible by remember { mutableStateOf(false) }

    Scaffold { paddingValues ->
        Column(
            modifier = Modifier.fillMaxSize().padding(paddingValues).padding(32.dp),
            verticalArrangement = Arrangement.spacedBy(
                8.dp,
                alignment = Alignment.CenterVertically
            ),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = stringResource(Res.string.create_account),
                style = MaterialTheme.typography.headlineLarge,
            )

            OutlinedTextField(
                value = name,
                onValueChange = viewModel::updateName,
                label = { Text(stringResource(Res.string.name)) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
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
                    Text(it, color = MaterialTheme.colorScheme.error)
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(
                    onClick = onBackRequest,
                    enabled = !isLoading
                ) { Text(stringResource(Res.string.back)) }

                Button(
                    onClick = viewModel::register,
                    enabled = !isLoading
                ) { Text(stringResource(Res.string.signup)) }
            }
        }
    }
}