package com.andrebritovita.quizapp.ui

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.andrebritovita.quizapp.ui.screens.welcome.WelcomeScreen
import com.andrebritovita.quizapp.ui.theme.QuizAppTheme
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class WelcomeScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun welcomeScreen_showsTitleAndButton() {
        composeTestRule.setContent {
            QuizAppTheme {
                WelcomeScreen(
                    onStartClick = {},
                    onHistoryClick = {}
                )
            }
        }

        composeTestRule.onNodeWithText("Quiz Dynamox").assertIsDisplayed()
        composeTestRule.onNodeWithText("Iniciar Quiz").assertIsDisplayed()
    }
}