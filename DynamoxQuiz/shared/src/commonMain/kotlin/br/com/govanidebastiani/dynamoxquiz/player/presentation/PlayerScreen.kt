package br.com.govanidebastiani.dynamoxquiz.player.presentation

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction.Companion.Done
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import br.com.govanidebastiani.dynamoxquiz.core.presentation.DynamoxPrimaryColor
import dynamoxquiz.shared.generated.resources.Res
import dynamoxquiz.shared.generated.resources.dynamox_bg
import dynamoxquiz.shared.generated.resources.player_nickname_screen_enter_your_nickname
import dynamoxquiz.shared.generated.resources.player_nickname_screen_start_quiz
import dynamoxquiz.shared.generated.resources.player_nickname_see_history
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.resources.stringResource

@Composable
fun PlayerScreenRoot(
    viewModel: PlayerViewModel,
    onNavigateToQuiz: (String) -> Unit,
    onSeeHistory: () -> Unit
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    LaunchedEffect(state.isStartQuiz) {
        if (state.isStartQuiz) {
            onNavigateToQuiz(state.playerNickname)
            viewModel.onNavigationToQuizFinished()
        }
    }
    PlayerScreen(
        state = state,
        onNicknameChanged = viewModel::onNicknameChanged,
        onStartQuizClick = viewModel::onStartQuizClick,
        onSeeHistory = onSeeHistory
    )
}

@Composable
fun PlayerScreen(
    state: PlayerUIState,
    onNicknameChanged: (String) -> Unit,
    onStartQuizClick: () -> Unit,
    onSeeHistory: () -> Unit
) {
    val keyboardController = LocalSoftwareKeyboardController.current

    Scaffold(
        modifier = Modifier.fillMaxSize()
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .consumeWindowInsets(paddingValues)
                .imePadding()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(Res.drawable.dynamox_bg),
                contentDescription = "Quiz Logo",
                modifier = Modifier.height(100.dp)
                    .width(200.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            ElevatedCard(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = stringResource(Res.string.player_nickname_screen_enter_your_nickname),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    OutlinedTextField(
                        value = state.playerNickname,
                        onValueChange = onNicknameChanged,
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = DynamoxPrimaryColor
                        ),
                        placeholder = {
                            Text(text = stringResource(Res.string.player_nickname_screen_enter_your_nickname))
                        },
                        keyboardOptions = KeyboardOptions(
                            imeAction = Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (state.playerNickname.isNotBlank()) {
                                    keyboardController?.hide()
                                    onStartQuizClick()
                                }
                            }
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = {
                            keyboardController?.hide()
                            onStartQuizClick()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DynamoxPrimaryColor),
                        enabled = state.playerNickname.isNotBlank(),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = stringResource(Res.string.player_nickname_screen_start_quiz),
                            style = MaterialTheme.typography.labelLarge
                        )
                    }

                    Spacer(modifier = Modifier.height(20.dp))


                    Text(
                        text = stringResource(Res.string.player_nickname_see_history),
                        color = DynamoxPrimaryColor,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.clickable {
                            onSeeHistory.invoke()
                        }
                    )
                }
            }
        }
    }
}

@Composable
@Preview(
    showBackground = true,
    showSystemUi = true
)
fun PlayerScreenPreview() {
    MaterialTheme {
        PlayerScreen(
            state = PlayerUIState(),
            onNicknameChanged = {},
            onStartQuizClick = {},
            onSeeHistory = {}
        )
    }
}