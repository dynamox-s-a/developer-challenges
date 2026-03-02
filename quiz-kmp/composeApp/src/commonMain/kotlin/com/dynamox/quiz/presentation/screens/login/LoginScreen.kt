package com.dynamox.quiz.presentation.screens.login

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dynamox.quiz.domain.model.Player
import com.dynamox.quiz.presentation.components.PrimaryButton
import com.dynamox.quiz.presentation.components.SecondaryButton
import com.dynamox.quiz.presentation.theme.DarkNavy
import com.dynamox.quiz.presentation.theme.DeepNavy
import com.dynamox.quiz.presentation.theme.Divider
import com.dynamox.quiz.presentation.theme.ElectricBlue
import com.dynamox.quiz.presentation.theme.MidnightBlue
import com.dynamox.quiz.presentation.theme.NeonPink
import com.dynamox.quiz.presentation.theme.TextHint
import com.dynamox.quiz.presentation.theme.TextPrimary
import com.dynamox.quiz.presentation.theme.TextSecondary
import com.dynamox.quiz.presentation.theme.WrongRed
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun LoginScreen(
    onStartQuiz: (Player) -> Unit,
    onViewLeaderboard: () -> Unit,
    viewModel: LoginViewModel = koinViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    // Reseta o estado ao entrar na tela, garantindo campo de nome vazio
    LaunchedEffect(Unit) {
        viewModel.resetState()
    }

    LaunchedEffect(uiState.player) {
        uiState.player?.let { player ->
            onStartQuiz(player)
            viewModel.onNavigated()
        }
    }

    LaunchedEffect(uiState.error) {
        uiState.error?.let { error ->
            snackbarHostState.showSnackbar(error)
            viewModel.onErrorDismissed()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(MidnightBlue, DeepNavy, DarkNavy)
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .imePadding()
                .padding(horizontal = 32.dp, vertical = 48.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Logo
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(ElectricBlue, NeonPink)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "DQ",
                    fontSize = 42.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = DeepNavy
                )
            }

            Spacer(Modifier.height(24.dp))

            Text(
                text = "DynaQuiz",
                style = MaterialTheme.typography.headlineLarge.copy(
                    brush = Brush.linearGradient(
                        colors = listOf(ElectricBlue, NeonPink)
                    )
                ),
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(8.dp))

            Text(
                text = "Digite seu nome para iniciarmos!",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(48.dp))

            OutlinedTextField(
                value = uiState.playerName,
                onValueChange = viewModel::onNameChanged,
                label = {
                    Text("Seu nome ou apelido", color = TextHint)
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ElectricBlue,
                    unfocusedBorderColor = Divider,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    cursorColor = ElectricBlue,
                    focusedLabelColor = ElectricBlue,
                    unfocusedLabelColor = TextHint,
                    focusedContainerColor = DarkNavy.copy(alpha = 0.5f),
                    unfocusedContainerColor = DarkNavy.copy(alpha = 0.3f)
                ),
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.Words,
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(
                    onDone = { viewModel.onStartQuiz() }
                ),
                isError = uiState.error != null
            )

            AnimatedVisibility(
                visible = uiState.error != null,
                enter = fadeIn() + slideInVertically(),
                exit = fadeOut()
            ) {
                Text(
                    text = uiState.error ?: "",
                    color = WrongRed,
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 6.dp, start = 16.dp)
                )
            }

            Spacer(Modifier.height(32.dp))

            PrimaryButton(
                text = "Iniciar Quiz",
                onClick = viewModel::onStartQuiz,
                isLoading = uiState.isLoading,
                enabled = uiState.playerName.isNotBlank()
            )

            Spacer(Modifier.height(16.dp))

            SecondaryButton(
                text = "Classificação",
                onClick = onViewLeaderboard
            )
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(16.dp)
        )
    }
}
