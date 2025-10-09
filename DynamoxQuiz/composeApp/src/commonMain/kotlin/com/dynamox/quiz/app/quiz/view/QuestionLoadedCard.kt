package com.dynamox.quiz.app.quiz.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.app.quiz.model.QuestionState
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.final_question
import dynamoxquiz.composeapp.generated.resources.leave
import dynamoxquiz.composeapp.generated.resources.question
import dynamoxquiz.composeapp.generated.resources.submit
import org.jetbrains.compose.resources.stringResource

@Composable
internal fun QuestionLoadedCard(
    state: QuestionState.Loaded,
    isLastQuestion: Boolean,
    onSubmitAnswer: (questionId: String, answer: String) -> Unit,
    onExit: () -> Unit
) {
    val question = state.question
    val scrollState = rememberScrollState()
    var selected by remember(question.id) { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            modifier = Modifier.weight(1f).verticalScroll(scrollState),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    AssistChip(
                        onClick = {},
                        label = {
                            Text(
                                if (isLastQuestion) stringResource(Res.string.final_question) else stringResource(
                                    Res.string.question
                                ),
                                style = MaterialTheme.typography.labelMedium
                            )
                        }
                    )
                    Text(
                        question.statement,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(Modifier.height(8.dp))
                    question.options.forEach { option ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = selected == option,
                                onClick = { selected = option }
                            )
                            Spacer(Modifier.width(8.dp))
                            Text(option)
                        }
                    }
                }
            }
        }

        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onExit,
                modifier = Modifier.weight(1f)
            ) { Text(stringResource(Res.string.leave)) }

            Button(
                onClick = { selected?.let { onSubmitAnswer(question.id, it) } },
                enabled = selected != null,
                modifier = Modifier.weight(1f)
            ) {
                Text(stringResource(Res.string.submit))
            }
        }
    }
}