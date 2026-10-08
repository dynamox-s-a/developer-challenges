package br.com.govanidebastiani.dynamoxquiz.quiz.presentation.finalscore

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import br.com.govanidebastiani.dynamoxquiz.core.presentation.DynamoxPrimaryColor
import br.com.govanidebastiani.dynamoxquiz.core.presentation.LoadingState
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.quizMock
import dynamoxquiz.shared.generated.resources.Res
import dynamoxquiz.shared.generated.resources.final_score_quiz_completed
import dynamoxquiz.shared.generated.resources.final_score_restart_quiz
import dynamoxquiz.shared.generated.resources.final_score_see_history
import dynamoxquiz.shared.generated.resources.final_score_your_score
import org.jetbrains.compose.resources.stringResource
import kotlin.time.Clock

@Composable
fun FinalScoreScreenRoot(
    viewModel: FinalScoreViewModel,
    onRestartQuiz: (String, List<String>) -> Unit,
    onSeeHistory: () -> Unit
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    FinalScoreScreen(
        state = state,
        onRestartQuiz = onRestartQuiz,
        onSeeHistory = onSeeHistory
    )
}

@Composable
fun FinalScoreScreen(
    state: FinalScoreUIState,
    onRestartQuiz: (String, List<String>) -> Unit,
    onSeeHistory: () -> Unit
) {
    Scaffold { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .consumeWindowInsets(paddingValues)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            if (state.isLoading) {
                LoadingState()
            } else {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 32.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 40.dp, horizontal = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = stringResource(Res.string.final_score_quiz_completed),
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text =  stringResource(Res.string.final_score_your_score),
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "${state.quiz!!.amountCorrectAnswers}/${state.quiz.amountQuestions}",
                            style = MaterialTheme.typography.displayMedium,
                            fontWeight = FontWeight.ExtraBold,
                            color = DynamoxPrimaryColor,
                            fontSize = 48.sp
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = {
                            state.quiz?.let { quiz ->
                                onRestartQuiz(quiz.playerNickname, state.ignoreIds)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DynamoxPrimaryColor),
                        modifier = Modifier
                            .weight(1f)
                            .height(56.dp),
                        shape = MaterialTheme.shapes.medium
                    ) {
                        Text(
                            text = stringResource(Res.string.final_score_restart_quiz),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Button(
                        onClick = onSeeHistory,
                        colors = ButtonDefaults.buttonColors(containerColor = DynamoxPrimaryColor),
                        modifier = Modifier
                            .weight(1f)
                            .height(56.dp),
                        shape = MaterialTheme.shapes.medium
                    ) {
                        Text(
                            text = stringResource(Res.string.final_score_see_history),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
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
fun FinalScoreScreenPreview() {
    FinalScoreScreen(
        state = FinalScoreUIState(
            quiz = quizMock,
            isLoading = false
        ),
        onRestartQuiz = { _, _ -> },
        onSeeHistory = {}
    )
}