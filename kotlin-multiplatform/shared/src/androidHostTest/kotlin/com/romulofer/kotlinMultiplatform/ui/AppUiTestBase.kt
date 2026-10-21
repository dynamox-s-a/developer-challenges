package com.romulofer.kotlinMultiplatform.ui

import androidx.activity.ComponentActivity
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import app.cash.sqldelight.driver.android.AndroidSqliteDriver
import com.romulofer.kotlinMultiplatform.App
import com.romulofer.kotlinMultiplatform.data.local.QuizDatabase
import com.romulofer.kotlinMultiplatform.di.dataModule
import com.romulofer.kotlinMultiplatform.di.presentationModule
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.runner.RunWith
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.core.module.Module
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

private const val AWAIT_MILLIS = 15_000L

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [35], qualifiers = "w411dp-h891dp-xxhdpi")
internal abstract class AppUiTestBase {

    protected val server = FakeQuizServer()

    protected open val overrides: List<Module> = emptyList()

    @get:Rule
    val rule = createAndroidComposeRule<ComponentActivity>()

    @Before
    fun setUp() {
        val driver = { AndroidSqliteDriver(QuizDatabase.Schema, RuntimeEnvironment.getApplication(), null) }
        startKoin { modules(server.platformModule(driver), dataModule, presentationModule, *overrides.toTypedArray()) }
        rule.setContent { App() }
        awaitText("Welcome")
    }

    @After
    fun tearDown() = stopKoin()

    protected fun awaitText(text: String) {
        rule.waitUntil(AWAIT_MILLIS) {
            rule.onAllNodesWithText(text).fetchSemanticsNodes().isNotEmpty()
        }
    }

    protected fun click(text: String) {
        awaitText(text)
        rule.onNodeWithText(text).performClick()
    }

    protected fun register(name: String) {
        rule.onNodeWithText("Name or nickname").performTextInput(name)
        click("Start quiz")
    }

    protected fun answerQuestion(option: String = "Option A") {
        click(option)
        click("Submit answer")
        rule.waitUntil(AWAIT_MILLIS) {
            rule.onAllNodesWithText("Next question").fetchSemanticsNodes().isNotEmpty() ||
                rule.onAllNodesWithText("See result").fetchSemanticsNodes().isNotEmpty()
        }
    }

    protected fun playWholeQuiz() {
        repeat(9) {
            answerQuestion()
            click("Next question")
        }
        answerQuestion()
        click("See result")
    }
}
