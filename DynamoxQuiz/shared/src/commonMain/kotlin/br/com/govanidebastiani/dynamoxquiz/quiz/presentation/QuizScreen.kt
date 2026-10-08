package br.com.govanidebastiani.dynamoxquiz.quiz.presentation

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import br.com.govanidebastiani.dynamoxquiz.core.presentation.DynamoxPrimaryColor
import br.com.govanidebastiani.dynamoxquiz.core.presentation.DynamoxPrimaryColorVariant
import br.com.govanidebastiani.dynamoxquiz.core.presentation.GreenColor
import br.com.govanidebastiani.dynamoxquiz.core.presentation.LoadingState
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.questionMock
import dynamoxquiz.shared.generated.resources.Res
import dynamoxquiz.shared.generated.resources.quiz_screen_finish_screen
import dynamoxquiz.shared.generated.resources.quiz_screen_next_question
import org.jetbrains.compose.resources.stringResource

@Composable
fun QuizScreenRoute(
    viewModel: QuizViewModel,
    onNavigateToFinalScore: (Long, List<String>) -> Unit
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    LaunchedEffect(state.navigateToFinalScore) {
        if (state.navigateToFinalScore) {
            state.quizId?.let {
                onNavigateToFinalScore.invoke(it, state.ignoreIds)
                viewModel.navigateToFinalScoreHandled()
            }
        }
    }

    QuizScreen(
        state = state,
        onNextQuestionClick= {
            if (state.isLastQuestion) {
                viewModel.onSaveQuiz()
            } else {
                viewModel.onNextQuestion()
            }
        },
        onOptionSelected = viewModel::checkSelectedOption,
    )
}

@Composable
fun QuizScreen(
    state: QuizUIState,
    onNextQuestionClick: () -> Unit,
    onOptionSelected: (String) -> Unit
) {
    Scaffold(
        bottomBar = {
            Button(
                onClick = onNextQuestionClick,
                enabled = state.currentOption != null,
                colors = ButtonDefaults.buttonColors(containerColor = DynamoxPrimaryColor),
                modifier = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(16.dp)
                    .height(50.dp)
            ) {
                Text(
                    text = if (state.isLastQuestion) stringResource(Res.string.quiz_screen_finish_screen) else stringResource(Res.string.quiz_screen_next_question),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    ) { paddingValues ->
        if (state.isLoading) {
            LoadingState()
        } else {
            state.errorMessage?.let {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(text = stringResource(it))
                }
            }
            state.currentQuestion?.let { question ->
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                        .verticalScroll(rememberScrollState())
                        .consumeWindowInsets(paddingValues)
                ) {
                    Question(
                        question = question,
                        selectedOption = state.currentOption,
                        onOptionSelected = onOptionSelected,
                        isCorrectOption = state.isCorrect
                    )
                }
            }
        }
    }
}

@Composable
private fun Question(question: Question,
                     selectedOption: String?,
                     onOptionSelected: (String) -> Unit,
                     isCorrectOption: Boolean?) {
    Column(
        modifier = Modifier.padding(12.dp)
    ) {
        Text(
            text = question.statement,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        question.options.forEach { option ->
            QuestionOption(
                option = option,
                isEnabled = isCorrectOption == null,
                onClick = {
                    onOptionSelected(option)
                },
                isSelected = option == selectedOption,
                isCorrect = isCorrectOption
            )
        }
    }
}

@Composable
private fun QuestionOption(
    option: String,
    isEnabled: Boolean,
    onClick: () -> Unit,
    isSelected: Boolean,
    isCorrect: Boolean?
) {
    val targetBackground = when {
        isSelected && isCorrect == true -> GreenColor
        isSelected && isCorrect == false -> MaterialTheme.colorScheme.error
        isSelected -> DynamoxPrimaryColorVariant
        else -> MaterialTheme.colorScheme.surfaceVariant
    }

    val targetOnBackground = when {
        isSelected && isCorrect == true -> Color.White
        isSelected && isCorrect == false -> MaterialTheme.colorScheme.onError
        isSelected -> Color.White
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }

    val backgroundColor by animateColorAsState(
        targetValue = targetBackground,
        animationSpec = tween(durationMillis = 300),
        label = "OptionBackgroundColor"
    )

    val onBackgroundColor by animateColorAsState(
        targetValue = targetOnBackground,
        animationSpec = tween(durationMillis = 300),
        label = "OptionOnBackgroundColor"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(backgroundColor)
            .clickable(
                enabled = isEnabled,
                onClick = onClick
            )
            .padding(12.dp)
    ) {
        Text(
            text = option,
            style = MaterialTheme.typography.bodyLarge,
            color = onBackgroundColor
        )
    }

    Spacer(Modifier.height(10.dp))
}

@Composable
@Preview(
    showBackground = true,
    showSystemUi = true
)
fun QuizScreenPreview() {
    QuizScreen(
        state = QuizUIState(
            currentQuestion = questionMock,
            currentOption = "Friends",
            isLoading = false
        ),
        onNextQuestionClick = {},
        onOptionSelected = {}
    )
}
