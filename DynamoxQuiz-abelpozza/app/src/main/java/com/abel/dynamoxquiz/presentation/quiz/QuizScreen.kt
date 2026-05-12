package com.abel.dynamoxquiz.presentation.quiz

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.abel.dynamoxquiz.R

@Composable
fun QuizScreen(
    viewModel: QuizViewModel
) {

    val uiState by viewModel.uiState.collectAsState()
    val isCorrectFromApi by
    viewModel.isCorrect.collectAsState()
    val currentQuestion by
    viewModel.currentQuestion.collectAsState()
    val score by
    viewModel.score.collectAsState()
    val quizFinished by
    viewModel.quizFinished.collectAsState()
    val scores by
    viewModel.scores.collectAsState()
    val nickname by
    viewModel.nickname.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(
                rememberScrollState()
            )
            .padding(24.dp),
        verticalArrangement =
            Arrangement.Center,
        horizontalAlignment =
            Alignment.CenterHorizontally
    ) {

        when {
            uiState.isLoading -> {
                CircularProgressIndicator()
            }
            uiState.error != null -> {

                Column(
                    horizontalAlignment =
                        Alignment.CenterHorizontally
                ) {

                    Text(
                        text =
                            uiState.error
                                ?: "Unknown error",

                        color = MaterialTheme
                            .colorScheme
                            .error
                    )

                    Spacer(
                        modifier = Modifier
                            .height(16.dp)
                    )

                    Button(
                        onClick = {
                            viewModel.loadQuestion()
                        },
                        colors =
                            ButtonDefaults.buttonColors(
                                containerColor =
                                    Color.Black,
                                contentColor =
                                    Color.White
                            )
                    ) {

                        Text("Tentar novamente")
                    }
                }
            }
            uiState.question != null -> {
                if (quizFinished) {
                    Column(
                        horizontalAlignment =
                            Alignment.CenterHorizontally
                    ) {
                        Text(
                            text =
                                "🎉 Quiz Finalizado!",
                            style = MaterialTheme
                                .typography
                                .headlineMedium,
                            fontWeight =
                                FontWeight.Bold
                        )

                        Spacer(
                            modifier = Modifier
                                .height(12.dp)
                        )

                        Text(

                            text = "Parabéns, $nickname!",

                            style = MaterialTheme
                                .typography
                                .titleLarge
                        )

                        Spacer(
                            modifier = Modifier
                                .height(24.dp)
                        )
                        Text(
                            text =
                                "Sua pontuação foi:",
                            style = MaterialTheme
                                .typography
                                .titleLarge
                        )
                        Spacer(
                            modifier = Modifier
                                .height(12.dp)
                        )
                        Text(
                            text = "$score / 10",
                            style = MaterialTheme
                                .typography
                                .headlineLarge,
                            color = Color.Black,
                            fontWeight =
                                FontWeight.Bold
                        )
                        Spacer(
                            modifier = Modifier
                                .height(32.dp)
                        )
                        Spacer(
                            modifier = Modifier
                                .height(32.dp)
                        )

                        Text(
                            text = "🏆 Ranking",
                            style = MaterialTheme
                                .typography
                                .titleLarge,

                            fontWeight = FontWeight.Bold
                        )
                        Spacer(
                            modifier = Modifier
                                .height(16.dp)
                        )

                        scores.take(5).forEach { scoreItem ->
                            Text(
                                text =
                                    "${scoreItem.nickname} - ${scoreItem.score}/10",
                                style = MaterialTheme
                                    .typography
                                    .bodyLarge,
                                modifier = Modifier
                                    .padding(vertical = 4.dp)
                            )
                        }
                        Button(
                            onClick = {
                                viewModel.restartQuiz()
                            },
                            colors =
                                ButtonDefaults.buttonColors(
                                    containerColor =
                                        Color.Black,
                                    contentColor =
                                        Color.White
                                )

                        ) {
                            Text(
                                "Reiniciar Quiz"
                            )
                        }
                    }

                } else {
                    val question =
                        uiState.question
                    var selectedOption by remember {
                        mutableStateOf<String?>(null)
                    }
                    var answerChecked by remember {
                        mutableStateOf(false)
                    }
                    Column(
                        horizontalAlignment =
                            Alignment.CenterHorizontally
                    ) {
                        Text(
                            text =
                                "Pergunta $currentQuestion de 10",

                            fontSize = 20.sp,
                            style = MaterialTheme
                                .typography
                                .titleMedium,

                            color = Color.Black,
                            fontWeight =
                                FontWeight.Bold,
                            modifier = Modifier
                                .padding(bottom = 20.dp)
                        )
                        Text(
                            text =
                                question?.statement ?: "",
                            style = MaterialTheme
                                .typography
                                .headlineSmall
                        )
                        Spacer(
                            modifier = Modifier
                                .padding(8.dp)
                        )
                        question?.options?.forEachIndexed { index, option ->
                            val optionLetter =
                                ('A' + index)
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 12.dp)
                                    .border(
                                        width = 1.dp,
                                        color = Color.Gray,
                                        shape =
                                            RoundedCornerShape(12.dp)
                                    )
                                    .clickable {
                                        selectedOption = option
                                    }
                                    .padding(16.dp),

                                verticalAlignment =
                                    Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected =
                                        selectedOption == option,
                                    onClick = {
                                        selectedOption = option
                                    }
                                )
                                Spacer(
                                    modifier = Modifier
                                        .width(8.dp)
                                )
                                Text(
                                    text =
                                        "$optionLetter) $option",
                                    style = MaterialTheme
                                        .typography
                                        .bodyLarge,
                                    fontWeight =
                                        FontWeight.Normal
                                )
                            }
                        }

                        Button(
                            onClick = {

                                if (!answerChecked) {
                                    selectedOption?.let {
                                        viewModel.sendAnswer(it)
                                        answerChecked = true
                                    }

                                } else {

                                    if (currentQuestion < 10) {
                                        selectedOption = null
                                        answerChecked = false
                                        viewModel.nextQuestion()

                                    } else {

                                        viewModel.finishQuiz()
                                    }
                                }
                            },
                            shape =
                                RoundedCornerShape(26.dp),
                            colors =
                                ButtonDefaults.buttonColors(
                                    containerColor =
                                        Color.Black,
                                    contentColor =
                                        Color.White
                                ),

                            modifier = Modifier
                                .fillMaxWidth()
                                .height(70.dp)
                                .padding(top = 24.dp)
                        ) {

                            Text(
                                if (!answerChecked) {

                                    "Verificar resposta"
                                } else {
                                    if (currentQuestion == 10)
                                        "Ver pontuação"
                                    else
                                        "Próxima pergunta"
                                }
                            )
                        }

                        if (answerChecked) {
                            when (isCorrectFromApi) {
                                true -> {
                                    Text(text="Resposta correta", color= Color(0xFF2E7D32),  modifier = Modifier
                                        .padding(top = 16.dp),

                                        fontWeight =
                                            FontWeight.Bold )
                                }

                                false -> {
                                    Text(text="Resposta incorreta", color= Color.Red,   modifier = Modifier
                                        .padding(top = 16.dp),

                                        fontWeight =
                                            FontWeight.Bold )
                                }

                                null -> {
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}