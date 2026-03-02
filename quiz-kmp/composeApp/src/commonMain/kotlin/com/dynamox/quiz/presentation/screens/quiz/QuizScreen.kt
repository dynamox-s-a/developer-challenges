package com.dynamox.quiz.presentation.screens.quiz

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.presentation.components.AnswerOption
import com.dynamox.quiz.presentation.components.AnswerState
import com.dynamox.quiz.presentation.components.PrimaryButton
import com.dynamox.quiz.presentation.components.SecondaryButton
import com.dynamox.quiz.presentation.theme.CorrectGreen
import com.dynamox.quiz.presentation.theme.DarkNavy
import com.dynamox.quiz.presentation.theme.DeepNavy
import com.dynamox.quiz.presentation.theme.ElectricBlue
import com.dynamox.quiz.presentation.theme.MidnightBlue
import com.dynamox.quiz.presentation.theme.NeonPink
import com.dynamox.quiz.presentation.theme.SurfaceCard
import com.dynamox.quiz.presentation.theme.TextPrimary
import com.dynamox.quiz.presentation.theme.TextSecondary
import com.dynamox.quiz.presentation.theme.WrongRed
import org.koin.compose.viewmodel.koinViewModel

/**
 *
 * Estrutura da tela:
 * - LoadingQuestion: spinner
 * - ShowQuestion: pergunta + opções
 * - SubmittingAnswer: opções + loading
 * - ShowResult: feedback colorido
 * - Error: mensagem + retry
 *
 * - playerId       ID do jogador (pra salvar score).
 * - playerName     Nome para exibir no header.
 * - onQuizFinished Callback quando as 10 perguntas são concluídas.
 * - viewModel      ViewModel injetado pelo Koin via koinViewModel().
 */
@Composable
fun QuizScreen(
    playerId: Long,
    playerName: String,
    onQuizFinished: (score: Int, total: Int) -> Unit,
    viewModel: QuizViewModel = koinViewModel()
) {
    // collectAsState() converte o StateFlow em State<T> do Compose
    // O Composable recompõe automaticamente quando o estado muda
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(playerId) {
        viewModel.initQuiz(playerId, playerName)
    }

    /**
     * LaunchedEffect(uiState.quizState): monitora o estado do quiz.
     * Quando o estado vira Finished, chama onQuizFinished() para navegar.
     * Usar o estado como chave garante que só executa quando muda.
     */
    LaunchedEffect(uiState.quizState) {
        if (uiState.quizState is QuizState.Finished) {
            onQuizFinished(uiState.score, uiState.totalQuestions)
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
                .padding(horizontal = 20.dp, vertical = 24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Olá, $playerName!",
                        style = MaterialTheme.typography.labelLarge,
                        color = ElectricBlue
                    )
                    Text(
                        text = "Pergunta ${uiState.currentQuestionIndex + 1} de ${uiState.totalQuestions}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceCard)
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "Pontos: ${uiState.score}",
                        style = MaterialTheme.typography.labelLarge,
                        color = ElectricBlue
                    )
                }
            }

            Spacer(Modifier.height(16.dp))
            LinearProgressIndicator(
                progress = {
                    (uiState.currentQuestionIndex.toFloat() + 1f) / uiState.totalQuestions.toFloat()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(50)),
                color = ElectricBlue,
                trackColor = SurfaceCard,
                strokeCap = StrokeCap.Round
            )

            Spacer(Modifier.height(24.dp))

            /**
             * AnimatedContent: troca o conteúdo com animação quando o estado muda.
             *
             * transitionSpec: define como entra e sai:
             * - Entrada: fade-in + deslizamento suave para cima
             * - Saída: fade-out
             *
             * O label "quiz_content" é para identificar no Compose Layout Inspector.
             */
            AnimatedContent(
                targetState = uiState.quizState,
                transitionSpec = {
                    (fadeIn(tween(300)) + slideInVertically(tween(300)) { it / 10 })
                        .togetherWith(fadeOut(tween(200)))
                },
                label = "quiz_content"
            ) { state ->
                when (state) {
                    is QuizState.LoadingQuestion -> LoadingContent()

                    // Pergunta exibida: mostra opções e botão de confirmar
                    is QuizState.ShowQuestion -> QuestionContent(
                        question = state.question,
                        selectedAnswer = uiState.selectedAnswer,
                        isSubmitting = false,
                        onAnswerSelected = viewModel::onAnswerSelected,
                        onSubmit = viewModel::onSubmitAnswer
                    )

                    // Enviando resposta: mantém a pergunta visível com loading no botão
                    is QuizState.SubmittingAnswer -> QuestionContent(
                        question = state.question,
                        selectedAnswer = uiState.selectedAnswer,
                        isSubmitting = true,
                        onAnswerSelected = viewModel::onAnswerSelected,
                        onSubmit = {}
                    )

                    // Resultado recebido: feedback colorido com botão "Próxima"
                    is QuizState.ShowResult -> ResultFeedbackContent(
                        question = state.question,
                        selectedAnswer = state.selectedAnswer,
                        isCorrect = state.isCorrect,
                        isLastQuestion = uiState.currentQuestionIndex + 1 >= uiState.totalQuestions,
                        onNext = viewModel::onNextQuestion
                    )

                    // Erro: mensagem + botão retry
                    is QuizState.Error -> ErrorContent(
                        message = state.message,
                        onRetry = viewModel::onRetryLoad
                    )

                    // Finalizado: spinner temporário enquanto navega
                    is QuizState.Finished -> LoadingContent()
                }
            }
        }
    }
}

@Composable
private fun LoadingContent() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            CircularProgressIndicator(
                color = ElectricBlue,
                modifier = Modifier.size(48.dp),
                strokeWidth = 3.dp
            )
            Spacer(Modifier.height(16.dp))
            Text(
                text = "Carregando pergunta...",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )
        }
    }
}

@Composable
private fun QuestionContent(
    question: com.dynamox.quiz.domain.model.Question,
    selectedAnswer: String?,
    isSubmitting: Boolean,
    onAnswerSelected: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(SurfaceCard)
                .padding(24.dp)
        ) {
            Text(
                text = question.statement,
                style = MaterialTheme.typography.headlineSmall,
                color = TextPrimary,
                textAlign = TextAlign.Start
            )
        }

        Spacer(Modifier.height(24.dp))

        Text(
            text = "Escolha sua resposta:",
            style = MaterialTheme.typography.labelMedium,
            color = TextSecondary,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        question.options.forEach { option ->
            AnswerOption(
                text = option,
                // Estado: selecionada se for a escolhida, padrão caso contrário
                state = when {
                    selectedAnswer == option -> AnswerState.SELECTED
                    else -> AnswerState.DEFAULT
                },
                onClick = { onAnswerSelected(option) },
                // Desabilita cliques enquanto aguarda resposta da API
                enabled = !isSubmitting,
                modifier = Modifier.padding(bottom = 10.dp)
            )
        }

        Spacer(Modifier.height(24.dp))

        // Botão de confirmar — desabilitado se nenhuma alternativa foi selecionada
        PrimaryButton(
            text = if (isSubmitting) "Verificando..." else "Confirmar Resposta",
            onClick = onSubmit,
            enabled = selectedAnswer != null && !isSubmitting,
            isLoading = isSubmitting
        )

        Spacer(Modifier.height(16.dp))
    }
}

@Composable
private fun ResultFeedbackContent(
    question: com.dynamox.quiz.domain.model.Question,
    selectedAnswer: String,
    isCorrect: Boolean,
    isLastQuestion: Boolean,
    onNext: () -> Unit
) {
    val feedbackColor = if (isCorrect) CorrectGreen else WrongRed
    val feedbackText = if (isCorrect) "Correto!" else "Errado!"
    val feedbackEmoji = if (isCorrect) "🎉" else "😕"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(feedbackColor.copy(alpha = 0.15f))
                .padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = feedbackEmoji, style = MaterialTheme.typography.headlineMedium)
                Spacer(Modifier.size(12.dp))
                Text(
                    text = feedbackText,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = feedbackColor
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(SurfaceCard)
                .padding(20.dp)
        ) {
            Text(
                text = question.statement,
                style = MaterialTheme.typography.bodyLarge,
                color = TextSecondary
            )
        }

        Spacer(Modifier.height(16.dp))

        Text(
            text = "Alternativas:",
            style = MaterialTheme.typography.labelMedium,
            color = TextSecondary,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        question.options.forEach { option ->
            AnswerOption(
                text = option,
                state = when {
                    option == selectedAnswer && isCorrect  -> AnswerState.CORRECT
                    option == selectedAnswer && !isCorrect -> AnswerState.WRONG
                    else -> AnswerState.DEFAULT
                },
                onClick = {}, //Validar
                enabled = false,
                modifier = Modifier.padding(bottom = 10.dp)
            )
        }

        Spacer(Modifier.height(24.dp))

        PrimaryButton(
            text = if (isLastQuestion) "Ver Resultado Final" else "Próxima Pergunta",
            onClick = onNext
        )

        Spacer(Modifier.height(16.dp))
    }
}

@Composable
private fun ErrorContent(message: String, onRetry: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "⚠️", style = MaterialTheme.typography.displayMedium)
        Spacer(Modifier.height(16.dp))
        Text(
            text = "Algo deu errado",
            style = MaterialTheme.typography.headlineSmall,
            color = TextPrimary,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 24.dp)
        )
        Spacer(Modifier.height(32.dp))
        PrimaryButton(
            text = "Tentar Novamente",
            onClick = onRetry,
            modifier = Modifier.padding(horizontal = 32.dp)
        )
    }
}
