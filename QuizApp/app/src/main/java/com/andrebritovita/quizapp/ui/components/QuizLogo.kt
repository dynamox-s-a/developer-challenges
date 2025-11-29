package com.andrebritovita.quizapp.ui.components

import androidx.compose.foundation.Image
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import com.andrebritovita.quizapp.R

@Composable
fun QuizLogo(
    modifier: Modifier = Modifier
) {
    Image(
        painter = painterResource(id = R.drawable.logo_quiz_app),
        contentDescription = stringResource(id = R.string.content_desc_logo),
        modifier = modifier
    )
}