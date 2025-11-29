package com.andrebritovita.quizapp.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.andrebritovita.quizapp.R
import com.andrebritovita.quizapp.ui.components.PrimaryButton
import com.andrebritovita.quizapp.ui.components.QuizLogo
import com.andrebritovita.quizapp.ui.components.SecondaryButton

@Composable
fun WelcomeScreen(
    onStartClick: (String) -> Unit,
    onHistoryClick: () -> Unit
) {
    var name by remember { mutableStateOf("") }

    Column (
        Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ){
        QuizLogo(
            modifier = Modifier.size(120.dp)
        )
        //Spacer(Modifier.height(8.dp))

        Text(
            text =stringResource(R.string.welcome_title),
            style = MaterialTheme.typography.displayLarge,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(Modifier.height(64.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text(stringResource(R.string.welcome_hint))},
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(32.dp))

        PrimaryButton(
            text = stringResource(R.string.btn_start),
            onClick = { onStartClick(name) },
            enabled = name.isNotBlank()
        )
        Spacer(Modifier.height(16.dp))
        SecondaryButton(
            text = stringResource(R.string.btn_history),
            onClick = onHistoryClick
        )
    }
}