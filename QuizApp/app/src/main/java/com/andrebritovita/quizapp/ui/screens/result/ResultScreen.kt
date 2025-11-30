package com.andrebritovita.quizapp.ui.screens.result

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MaterialTheme.colorScheme
import androidx.compose.material3.MaterialTheme.typography
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.andrebritovita.quizapp.R
import com.andrebritovita.quizapp.ui.components.PrimaryButton
import com.andrebritovita.quizapp.ui.components.QuizLogo
import com.andrebritovita.quizapp.ui.components.SecondaryButton

@Composable
fun ResultScreen(
    score: Int,
    onRestartClick: () -> Unit,
    onHistoryClick: () -> Unit
) {
    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = colorScheme.background
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(it)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            QuizLogo(modifier = Modifier.size(120.dp))
            Spacer(modifier = Modifier.height(32.dp))
            Text(
                text = stringResource(R.string.result_title),
                style = typography.displayLarge,
                color = colorScheme.primary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = stringResource(R.string.result_score_format, score, 10),
                style = typography.headlineLarge,
                color = colorScheme.onBackground,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(48.dp))

            PrimaryButton(
                text = stringResource(R.string.btn_play_again),
                onClick = onRestartClick
            )

            Spacer(modifier = Modifier.height(16.dp))

            SecondaryButton(
                text = stringResource(R.string.btn_history),
                onClick = onHistoryClick
            )
        }
    }
}

