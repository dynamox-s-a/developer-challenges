package com.dynamox.quiz.presentation.screens.splash

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.EaseOutBack
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dynamox.quiz.presentation.theme.DeepNavy
import com.dynamox.quiz.presentation.theme.DarkNavy
import com.dynamox.quiz.presentation.theme.ElectricBlue
import com.dynamox.quiz.presentation.theme.MidnightBlue
import com.dynamox.quiz.presentation.theme.NeonPink
import com.dynamox.quiz.domain.usecase.GetQuestionUseCase
import com.dynamox.quiz.presentation.theme.TextSecondary
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.koin.compose.koinInject

/**
 * Tela de splash exibida ao iniciar o app.
 *
 * Nos testes, tive problemas na primeira inicialização do app, onde a primeira pergunta
 * sempre nos retornava um timeout, sendo necessário com isso clicar em retry. Com isso,
 * a Splash além das animações visuais, dispara um pré-aquecimento da API em paralelo.
 * A API roda no Google Cloud Run, que "adormece" após inatividade (cold start).
 * Ao fazer uma requisição silenciosa aqui, o servidor já estará ativo quando
 * o usuário chegar na tela do quiz.
 *
 * getQuestion      Use Case injetado pelo Koin para pré-aquecer a API.
 */
@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit,
    getQuestion: GetQuestionUseCase = koinInject()
) {
    //Diferente de animateXAsState, Animatable permte sequenciar animações com awaitCompletion
    val scale = remember { Animatable(0f) }      // Logo começa invisível (escala 0)
    val alpha = remember { Animatable(0f) }       // Logo começa transparente
    val textAlpha = remember { Animatable(0f) }   // Título começa transparente
    val subtitleAlpha = remember { Animatable(0f) }// Subtítulo começa transparente

    LaunchedEffect(Unit) {
        // Dispara o pré-aquecimento da API em paralelo com as animações.
        // O resultado é descartado — não importa se falhar; a única finalidade
        // é "acordar" o servidor Cloud Run antes que o usuário chegue ao quiz.
        launch { runCatching { getQuestion() } }

        // Animação 1: logo "cresce" com efeito elástico (EaseOutBack)
        scale.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 700, easing = EaseOutBack)
        )
        // Animação 2: logo aparece gradualmente
        alpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 500)
        )
        // Animação 3: título fade-in (delayMillis = espera antes de iniciar)
        textAlpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 600, delayMillis = 200)
        )
        // Animação 4: subtítulo fade-in
        subtitleAlpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 600, delayMillis = 100)
        )
        delay(1000)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                // Gradiente vertical de fundo: escuro no topo, mais escuro embaixo
                brush = Brush.verticalGradient(
                    colors = listOf(MidnightBlue, DeepNavy, DarkNavy)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(32.dp)
        ) {
            Box(
                modifier = Modifier
                    .scale(scale.value)
                    .alpha(alpha.value)
                    .size(120.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(ElectricBlue, NeonPink)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                //Letras da logo
                Text(
                    text = "DQ",
                    fontSize = 64.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = DeepNavy
                )
            }

            Spacer(Modifier.height(32.dp))
            Text(
                text = "DynaQuiz",
                style = MaterialTheme.typography.displayMedium.copy(
                    // Gradiente aplicado DIRETAMENTE no texto via Brush
                    brush = Brush.linearGradient(
                        colors = listOf(ElectricBlue, NeonPink)
                    )
                ),
                modifier = Modifier.alpha(textAlpha.value),
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(8.dp))
            Text(
                text = "Teste seus conhecimentos",
                style = MaterialTheme.typography.bodyLarge,
                color = TextSecondary,
                modifier = Modifier.alpha(subtitleAlpha.value),
                textAlign = TextAlign.Center
            )
        }
    }
}
