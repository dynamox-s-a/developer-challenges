package com.romulofer.kotlinMultiplatform.ui

import androidx.activity.ComponentActivity
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.junit4.AndroidComposeTestRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import org.junit.Test
import org.robolectric.annotation.Config

private const val AWAIT_MILLIS = 15_000L

internal class AppUiTest : AppUiTestBase() {

    @Test
    fun showsTheWelcomeScreen() {
        rule.onNodeWithText("Welcome").assertIsDisplayed()
        rule.onNodeWithText("Name or nickname").assertIsDisplayed()
        rule.onNodeWithText("Start quiz").assertIsEnabled()
    }

    @Test
    fun asksForAnameWhenItIsEmpty() {
        click("Start quiz")

        awaitText("Enter a name to continue.")
    }

    @Test
    fun warnsWhenTheNameIsTooLong() {
        rule.onNodeWithText("Name or nickname").performTextInput("a".repeat(21))
        click("Start quiz")

        awaitText("Use at most 20 characters.")
    }

    @Test
    fun clearsTheNameErrorWhenTheUserTypes() {
        click("Start quiz")
        awaitText("Enter a name to continue.")

        rule.onNodeWithText("Name or nickname").performTextInput("A")

        rule.waitUntil(AWAIT_MILLIS) {
            rule.onAllNodesWithText("Enter a name to continue.").fetchSemanticsNodes().isEmpty()
        }
    }

    @Test
    fun loadsTheFirstQuestionAfterRegistering() {
        register("Ana")

        awaitText("Statement 1")
        rule.onNodeWithText("Question 1 of 10").assertIsDisplayed()
        rule.onNodeWithText("Score: 0").assertIsDisplayed()
        rule.onNodeWithText("Option A").assertIsDisplayed()
    }

    @Test
    fun keepsSubmitDisabledUntilAnOptionIsChosen() {
        register("Ana")
        awaitText("Statement 1")

        rule.onNodeWithText("Submit answer").assertIsNotEnabled()
        click("Option B")

        rule.onNodeWithText("Submit answer").assertIsEnabled()
    }

    @Test
    fun showsFeedbackForACorrectAnswerAndRaisesTheScore() {
        register("Ana")

        awaitText("Statement 1")
        answerQuestion()

        rule.onNodeWithText("Correct!").assertIsDisplayed()
        rule.onNodeWithText("Score: 1").assertIsDisplayed()
    }

    @Test
    fun showsFeedbackForAWrongAnswer() {
        register("Ana")
        awaitText("Statement 1")
        answerQuestion()
        click("Next question")
        awaitText("Statement 2")

        answerQuestion()

        rule.onNodeWithText("Not quite.").assertIsDisplayed()
        rule.onNodeWithText("Score: 1").assertIsDisplayed()
    }

    @Test
    fun showsAnErrorAndRetriesWhenTheQuestionCannotBeLoaded() {
        server.failingQuestions = 1
        register("Ana")

        awaitText("The server had a problem (code 500). Try again.")
        click("Try again")

        awaitText("Statement 1")
    }

    @Test
    fun letsTheUserSubmitAgainAfterAServerErrorOnTheAnswer() {
        register("Ana")
        awaitText("Statement 1")
        server.failingAnswers = 1
        click("Option A")
        click("Submit answer")
        awaitText("The server had a problem (code 500). Try again.")

        click("Try again")

        awaitText("Correct!")
    }

    @Test
    fun playsAWholeQuizAndShowsTheFinalScore() {
        register("Ana")

        playWholeQuiz()

        awaitText("Quiz complete")
        rule.onNodeWithText("5/10").assertIsDisplayed()
        rule.onNodeWithText("You scored 5 out of 10").assertIsDisplayed()
    }

    @Test
    fun startsANewQuizWithNewQuestionsWhenPlayingAgain() {
        register("Ana")
        playWholeQuiz()

        click("Play again")

        awaitText("Statement 11")
        rule.onNodeWithText("Question 1 of 10").assertIsDisplayed()
        rule.onNodeWithText("Score: 0").assertIsDisplayed()
    }

    @Test
    fun listsTheScoreOnTheScoreboardAfterAQuiz() {
        register("Ana")
        playWholeQuiz()

        click("Scoreboard")

        awaitText("Ana")
        rule.onNodeWithText("5/10").assertIsDisplayed()
        rule.onNodeWithText("1").assertIsDisplayed()
    }

    @Test
    fun goesBackToTheRegistrationWhenChangingPlayer() {
        register("Ana")
        playWholeQuiz()

        click("Change player")

        awaitText("Welcome")
    }

    @Test
    fun showsAnEmptyScoreboardBeforeAnyQuiz() {
        rule.onNodeWithContentDescription("Scoreboard").performClick()

        awaitText("No scores yet. Finish a quiz to appear here.")
    }

    @Test
    fun goesBackFromTheScoreboardWithTheBackArrow() {
        rule.onNodeWithContentDescription("Scoreboard").performClick()
        awaitText("No scores yet. Finish a quiz to appear here.")

        rule.onNodeWithContentDescription("Back").performClick()

        awaitText("Welcome")
    }

    @Test
    fun opensTheScoreboardInTheMiddleOfAQuizAndComesBack() {
        register("Ana")
        awaitText("Statement 1")
        click("Option B")

        rule.onNodeWithContentDescription("Scoreboard").performClick()
        awaitText("No scores yet. Finish a quiz to appear here.")
        rule.onNodeWithContentDescription("Back").performClick()

        awaitText("Statement 1")
        rule.onNodeWithText("Submit answer").assertIsEnabled()
    }

    @Test
    fun leavesAQuizWithTheBackArrow() {
        register("Ana")
        awaitText("Statement 1")

        rule.onNodeWithContentDescription("Back").performClick()

        awaitText("Welcome")
    }

    @Test
    fun goesBackWithTheSystemBackButton() {
        rule.onNodeWithContentDescription("Settings").performClick()
        awaitText("Language")

        rule.pressSystemBack()

        awaitText("Welcome")
    }

    @Test
    fun switchesTheInterfaceToPortuguese() {
        rule.onNodeWithContentDescription("Settings").performClick()
        click("Português")

        awaitText("Idioma")
        rule.onNodeWithContentDescription("Voltar").performClick()

        awaitText("Bem-vindo")
        rule.onNodeWithText("Começar quiz").assertIsDisplayed()
    }

    @Test
    fun switchesBackToEnglish() {
        rule.onNodeWithContentDescription("Settings").performClick()
        click("Português")
        awaitText("Idioma")

        click("English")

        awaitText("Language")
    }

    @Test
    @Config(qualifiers = "w411dp-h891dp-night-xxhdpi")
    fun rendersInTheDarkTheme() {
        rule.onNodeWithText("Welcome").assertIsDisplayed()
        rule.onNodeWithText("Start quiz").assertIsDisplayed()
    }

    private fun AndroidComposeTestRule<*, ComponentActivity>.pressSystemBack() {
        runOnUiThread { activity.onBackPressedDispatcher.onBackPressed() }
    }
}
