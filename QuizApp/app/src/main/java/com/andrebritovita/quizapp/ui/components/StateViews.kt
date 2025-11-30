package com.andrebritovita.quizapp.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MaterialTheme.colorScheme
import androidx.compose.material3.MaterialTheme.typography
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.andrebritovita.quizapp.R

@Composable
fun LoadingView() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        CircularProgressIndicator(
            color = colorScheme.primary
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = stringResource(R.string.loading_title),
            style = typography.titleMedium,
            color = colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = stringResource(R.string.loading_subtitle),
            style = typography.bodyMedium,
            color = colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun ErrorView(
    messageId: Int,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = stringResource(id = messageId),
            style = typography.titleLarge,
            color = colorScheme.error,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        SecondaryButton(
            text = stringResource(R.string.btn_retry),
            onClick = onRetry
        )
    }
}