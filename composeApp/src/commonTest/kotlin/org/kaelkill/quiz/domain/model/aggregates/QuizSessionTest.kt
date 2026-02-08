package org.kaelkill.quiz.domain.model.aggregates

import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.assertFalse

class QuizSessionTest {

    private fun createValidQuestion(id: String): Question {
        val options = listOf("A", "B", "C", "D", "E")
        return Question.create(id, "Statement $id", options).getOrThrow()
    }

    private fun createValidPlayer(): PlayerName {
        return PlayerName.create("Player One").getOrThrow()
    }

    @Test
    fun `should create empty session initially`() {
        val player = createValidPlayer()

        val session = QuizSession.create(player)

        assertEquals(player, session.player)
        assertTrue(session.questions.isEmpty(), "Session should start with 0 questions")
        assertEquals(0, session.score, "Initial score must be 0")
        assertFalse(session.isFinished, "Session should not be finished")
    }

    @Test
    fun `should add new question to session`() {
        val session = QuizSession.create(createValidPlayer())
        val question = createValidQuestion("q1")

        val result = session.addNewQuestion(question)

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()
        assertEquals(1, updatedSession.questions.size)
        assertEquals("q1", updatedSession.questions.first().id.value)
    }

    @Test
    fun `should fail when adding question beyond limit`() {
        var session = QuizSession.create(createValidPlayer())
        repeat(10) { i ->
            session = session.addNewQuestion(createValidQuestion("q$i")).getOrThrow()
        }

        val result = session.addNewQuestion(createValidQuestion("q11"))

        assertTrue(result.isFailure)
        assertEquals("Quiz is already full (10 questions)", result.exceptionOrNull()?.message)
    }


    @Test
    fun `should increase score when answer is correct`() {
        var session = QuizSession.create(createValidPlayer())
        session = session.addNewQuestion(createValidQuestion("q1")).getOrThrow()

        val result = session.answerQuestion(
            questionId = "q1",
            optionValue = "A",
            isCorrect = true
        )

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()

        assertEquals(1, updatedSession.score, "Score should increase to 1")
        assertEquals(1, updatedSession.answers.size)
    }

    @Test
    fun `should NOT increase score when answer is incorrect`() {
        var session = QuizSession.create(createValidPlayer())
        session = session.addNewQuestion(createValidQuestion("q1")).getOrThrow()

        val result = session.answerQuestion(
            questionId = "q1",
            optionValue = "B",
            isCorrect = false
        )

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()

        assertEquals(0, updatedSession.score, "Score should remain 0")
        assertEquals(1, updatedSession.answers.size)
    }

    @Test
    fun `should fail when answering non-existent question`() {
        val session = QuizSession.create(createValidPlayer())

        val result = session.answerQuestion("q99", "A", true)

        assertTrue(result.isFailure)
        assertEquals("Question not found in current session", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when answering the same question twice`() {
        var session = QuizSession.create(createValidPlayer())
        session = session.addNewQuestion(createValidQuestion("q1")).getOrThrow()

        val firstAnswerSession = session.answerQuestion("q1", "A", true).getOrThrow()

        val result = firstAnswerSession.answerQuestion("q1", "B", false)

        assertTrue(result.isFailure)
        assertEquals("Question already answered", result.exceptionOrNull()?.message)
    }
}