package br.com.govanidebastiani.dynamoxquiz.quiz.presentation.history

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import br.com.govanidebastiani.dynamoxquiz.core.presentation.DynamoxPrimaryColor
import br.com.govanidebastiani.dynamoxquiz.core.presentation.LoadingState
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.quizMock
import dynamoxquiz.shared.generated.resources.Res
import dynamoxquiz.shared.generated.resources.history_no_completed_quiz_yet
import dynamoxquiz.shared.generated.resources.history_quiz_score_format
import dynamoxquiz.shared.generated.resources.history_screen
import org.jetbrains.compose.resources.stringResource

@Composable
fun HistoryScreenRoot(
    viewModel: HistoryScreenViewModel,
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    HistoryScreen(
        state = state
    )
}

@Composable
fun HistoryScreen(
    state: HistoryScreenUIState
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(Res.string.history_screen)) }
            )
        }
    ) { paddingValues ->
        if (state.isLoading) {
            LoadingState()
        } else {
            if (state.quizzes.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize()
                        .consumeWindowInsets(paddingValues),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = stringResource(Res.string.history_no_completed_quiz_yet),
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .consumeWindowInsets(paddingValues)
                        .padding(paddingValues),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(
                        items = state.quizzes,
                        key = { quiz -> quiz.id }
                    ) { quiz ->
                        QuizHistoryCard(
                            quiz = quiz,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun QuizHistoryCard(
    quiz: Quiz,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainer
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = quiz.playerNickname,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = stringResource(Res.string.history_quiz_score_format,  quiz.amountQuestions, quiz.amountCorrectAnswers),
                    style = MaterialTheme.typography.titleSmall,
                    color = DynamoxPrimaryColor
                )
            }
        }
    }
}

@Composable
@Preview(
    showBackground = true,
    showSystemUi = true
)
fun HistoryScreenPreview() {
    HistoryScreen(
        state = HistoryScreenUIState(
            isLoading = false,
            quizzes = listOf(
                quizMock
            )
        )
    )
}