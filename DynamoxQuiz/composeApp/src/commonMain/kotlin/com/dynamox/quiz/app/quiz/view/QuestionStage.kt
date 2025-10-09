package com.dynamox.quiz.app.quiz.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.api.model.ApiError
import com.dynamox.quiz.app.quiz.model.QuestionState
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.`continue`
import dynamoxquiz.composeapp.generated.resources.forbidden_error_message
import dynamoxquiz.composeapp.generated.resources.invalid_state_message
import dynamoxquiz.composeapp.generated.resources.leave
import dynamoxquiz.composeapp.generated.resources.loading_final_question
import dynamoxquiz.composeapp.generated.resources.loading_question
import dynamoxquiz.composeapp.generated.resources.network_error_message
import dynamoxquiz.composeapp.generated.resources.not_found_error_message
import dynamoxquiz.composeapp.generated.resources.parse_error_message
import dynamoxquiz.composeapp.generated.resources.resubmit
import dynamoxquiz.composeapp.generated.resources.submitting_your_answer
import dynamoxquiz.composeapp.generated.resources.try_again
import dynamoxquiz.composeapp.generated.resources.unauthorized_error_message
import dynamoxquiz.composeapp.generated.resources.unknown_error_message
import org.jetbrains.compose.resources.stringResource

@Composable
internal fun QuestionStage(
    questionState: QuestionState?,
    isLastQuestion: Boolean,
    onSubmitAnswer: (questionId: String, answer: String) -> Unit,
    onNext: () -> Unit,
    onTryAgain: (QuestionState) -> Unit,
    onExit: () -> Unit
) {
    when (val state = questionState) {
        null, QuestionState.Fetching -> LoadingFullScreen(
            title = if (isLastQuestion) {
                stringResource(Res.string.loading_final_question)
            } else {
                stringResource(Res.string.loading_question)
            }
        )

        is QuestionState.Loaded -> {
            QuestionLoadedCard(
                state = state,
                isLastQuestion = isLastQuestion,
                onSubmitAnswer = onSubmitAnswer,
                onExit = onExit
            )
        }

        is QuestionState.Answering -> {
            Column(
                modifier = Modifier.fillMaxSize().padding(24.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                LinearProgressIndicator(Modifier.fillMaxWidth())
                Spacer(Modifier.height(12.dp))
                Text(stringResource(Res.string.submitting_your_answer))
            }
        }

        is QuestionState.Answered -> {
            AnswerFeedbackCard(
                correct = state.correct,
                duration = state.duration,
                isLastQuestion = isLastQuestion,
                onNext = onNext,
                onExit = onExit
            )
        }

        is QuestionState.Error -> when (state) {
            is QuestionState.Error.Api -> {
                ErrorFullScreen(
                    message = renderApiError(state.error),
                    primary = when (state.state) {
                        is QuestionState.Answering -> stringResource(Res.string.resubmit)
                        else -> stringResource(Res.string.try_again)
                    },
                    onPrimary = { onTryAgain(state) },
                    secondary = stringResource(Res.string.leave),
                    onSecondary = onExit
                )
            }

            is QuestionState.Error.InvalidState -> {
                ErrorFullScreen(
                    message = stringResource(Res.string.invalid_state_message),
                    primary = stringResource(Res.string.`continue`),
                    onPrimary = { onTryAgain(state) },
                    secondary = stringResource(Res.string.leave),
                    onSecondary = onExit
                )
            }
        }
    }
}

@Composable
private fun renderApiError(error: ApiError): String = when (error) {
    ApiError.NetworkError -> stringResource(Res.string.network_error_message)
    ApiError.Forbidden -> stringResource(Res.string.forbidden_error_message)
    ApiError.NotFound -> stringResource(Res.string.not_found_error_message)
    is ApiError.OtherError -> stringResource(Res.string.unknown_error_message)
    ApiError.ParseError -> stringResource(Res.string.parse_error_message)
    ApiError.Unauthorized -> stringResource(Res.string.unauthorized_error_message)
}
