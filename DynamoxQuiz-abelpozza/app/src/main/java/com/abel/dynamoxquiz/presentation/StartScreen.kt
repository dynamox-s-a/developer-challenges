package com.abel.dynamoxquiz.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.abel.dynamoxquiz.R

@Composable
fun StartScreen(
    onStartQuiz: (String) -> Unit
) {
    var nickname by remember {
        mutableStateOf("")
    }
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement =
            Arrangement.Center,
        horizontalAlignment =
            Alignment.CenterHorizontally
    ) {

        Image(
            painter = painterResource(
                id = R.drawable.dynamox_logo
            ),

            contentDescription = "Logo Dynamox",

            modifier = Modifier
                .width(120.dp),

            contentScale = ContentScale.Fit
        )

        Spacer(
            modifier = Modifier
                .height(24.dp)
        )

        Text(
            text = "Dynamox Quiz",
            style = MaterialTheme
                .typography
                .headlineMedium,
            fontWeight = FontWeight.Bold
        )

        OutlinedTextField(
            value = nickname,
            onValueChange = {
                nickname = it
            },
            label = {
                Text("Digite seu nome")

            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 24.dp)
        )

        Button(
            onClick = {
                if (nickname.isNotBlank()) {
                    onStartQuiz(
                        nickname
                    )
                }
            },
            shape =
                RoundedCornerShape(16.dp),
            colors =
                ButtonDefaults.buttonColors(
                    containerColor = Color.Black,
                    contentColor = Color.White
                ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 24.dp)
        ) {
            Text("Começar Quiz")
        }
    }
}