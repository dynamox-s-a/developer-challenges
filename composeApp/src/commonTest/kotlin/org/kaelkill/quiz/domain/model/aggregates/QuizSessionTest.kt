package org.kaelkill.quiz.domain.model.aggregates

import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class QuizSessionTest {

    private fun createValidQuestion(id: String): Question {
        val options = listOf("A", "B", "C", "D", "E")
        return Question.create(id, "Statement $id", options).getOrThrow()
    }

    private fun createValidPlayer(): PlayerName {
        return PlayerName.create("Player One").getOrThrow()
    }

    @Test
    fun `should create valid session with exactly 10 questions`() {
        val questions = (1..10).map { createValidQuestion("q$it") }
        val player = createValidPlayer()

        val result = QuizSession.create(
            player = player,
            questions = questions
        )

        assertTrue(result.isSuccess)
        val session = result.getOrNull()
        assertEquals(10, session?.questions?.size)
        assertEquals(player, session?.player)
    }

    @Test
    fun `should fail when questions count is less than 10`() {
        val questions = (1..9).map { createValidQuestion("q$it") }
        val player = createValidPlayer()

        val result = QuizSession.create(
            player = player,
            questions = questions
        )

        assertTrue(result.isFailure)
        assertEquals("A session must have exactly 10 unique questions", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when questions count is more than 10`() {
        val questions = (1..11).map { createValidQuestion("q$it") }
        val player = createValidPlayer()

        val result = QuizSession.create(
            player = player,
            questions = questions
        )

        assertTrue(result.isFailure)
        assertEquals("A session must have exactly 10 unique questions", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when questions list contains duplicates`() {
        val questions = (1..9).map { createValidQuestion("q$it") }.toMutableList()
        questions.add(questions[0])
        val player = createValidPlayer()

        val result = QuizSession.create(
            player = player,
            questions = questions
        )

        assertTrue(result.isFailure)
        assertEquals("A session must have exactly 10 unique questions", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should sanitize list when input has duplicates but valid unique count`() {
        val distinctQuestions = (1..10).map { createValidQuestion("q$it") }

        val dirtyList = distinctQuestions.toMutableList()
        dirtyList.add(distinctQuestions[0])

        val player = createValidPlayer()

        val result = QuizSession.create(player, dirtyList)
        val session = result.getOrThrow()
        assertEquals(10, session.questions.size)
    }

    @Test
    fun `should register answer successfully`() {
        val questions = (1..10).map { createValidQuestion("q$it") }
        val session = QuizSession.create(createValidPlayer(), questions).getOrThrow()

        val questionId = "q1"
        val selectedOption = "A"

        val result = session.answerQuestion(questionId, selectedOption)

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()

        assertEquals(1, updatedSession.answers.size)
        assertEquals("q1", updatedSession.answers.first().questionId.value)
        assertEquals("A", updatedSession.answers.first().selectedOption.value)
    }

    @Test
    fun `should fail when answering non-existent question`() {
        val questions = (1..10).map { createValidQuestion("q$it") }
        val session = QuizSession.create(createValidPlayer(), questions).getOrThrow()

        val result = session.answerQuestion("q99", "A")

        assertTrue(result.isFailure)
        assertEquals("Question not found in this session", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when answering with invalid option for the question`() {
        val questions = (1..10).map { createValidQuestion("q$it") }
        val session = QuizSession.create(createValidPlayer(), questions).getOrThrow()

        val result = session.answerQuestion("q1", "Z")

        assertTrue(result.isFailure)
        assertEquals("Selected option is not valid for this question", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when answering the same question twice`() {
        val questions = (1..10).map { createValidQuestion("q$it") }
        val session = QuizSession.create(createValidPlayer(), questions).getOrThrow()

        val firstAnswerSession = session.answerQuestion("q1", "A").getOrThrow()

        val result = firstAnswerSession.answerQuestion("q1", "B")

        assertTrue(result.isFailure)
        assertEquals("Question already answered", result.exceptionOrNull()?.message)
    }
}