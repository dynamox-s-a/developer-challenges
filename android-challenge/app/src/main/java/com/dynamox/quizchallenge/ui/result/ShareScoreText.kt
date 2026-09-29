package com.dynamox.quizchallenge.ui.result

/**
 * Builds the plain-text message shared via the Android system share sheet, addressing user
 * story 2 ("...so that I could share it with friends").
 *
 * [template] must use the same positional placeholders (%1$s player name, %2$d correct count,
 * %3$d total questions) as `R.string.result_share_message`. It is resolved by the caller (a
 * Composable, via `stringResource`) and passed in here, so this function stays a plain,
 * Android-`Context`-free unit that is trivial to unit test without Robolectric.
 */
fun buildShareMessage(
    template: String,
    playerName: String,
    correctCount: Int,
    totalQuestions: Int,
): String = String.format(template, playerName, correctCount, totalQuestions)
