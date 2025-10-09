package com.dynamox.quiz.app.quiz.view

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.cancel
import dynamoxquiz.composeapp.generated.resources.leave
import dynamoxquiz.composeapp.generated.resources.leave_quiz
import dynamoxquiz.composeapp.generated.resources.leave_quiz_confirmation_message
import org.jetbrains.compose.resources.stringResource

@Composable
internal fun ConfirmExitDialog(
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(stringResource(Res.string.leave_quiz)) },
        text = { Text(stringResource(Res.string.leave_quiz_confirmation_message)) },
        confirmButton = {
            TextButton(onClick = onConfirm) { Text(stringResource(Res.string.leave)) }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text(stringResource(Res.string.cancel)) }
        }
    )
}
