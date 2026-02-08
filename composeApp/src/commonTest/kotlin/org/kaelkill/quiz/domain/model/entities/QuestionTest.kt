package org.kaelkill.quiz.domain.model.entities

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class QuestionTest {

    @Test
    fun `should create valid question`() {
        val rawOptions = listOf("A", "B", "C", "D", "E")
        val result = Question.create(
            id = "q1",
            statement = "What is Kotlin?",
            options = rawOptions
        )

        assertTrue(result.isSuccess)
        val question = result.getOrNull()
        
        assertEquals("q1", question?.id?.value)
        assertEquals("What is Kotlin?", question?.statement?.value)
        assertEquals(5, question?.options?.size)
        assertEquals("A", question?.options?.first()?.value)
    }


    @Test
    fun `should fail when id is invalid`() {
        val result = Question.create(
            id = "",
            statement = "Valid Statement",
            options = listOf("A", "B", "C", "D", "E")
        )

        assertTrue(result.isFailure)
        assertEquals("QuestionId cannot be empty", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when statement is invalid`() {
        val result = Question.create(
            id = "q1",
            statement = "   ", 
            options = listOf("A", "B", "C", "D", "E")
        )

        assertTrue(result.isFailure)
        assertEquals("QuestionStatement cannot be empty", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when any option is invalid`() {
        val result = Question.create(
            id = "q1",
            statement = "Valid Statement",
            options = listOf("A", "B", " ", "D", "E")
        )

        assertTrue(result.isFailure)
        assertEquals("AnswerOption cannot be empty", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when options count is not 5`() {
        val result = Question.create(
            id = "q1",
            statement = "Statement",
            options = listOf("A", "B", "C")
        )

        assertTrue(result.isFailure)
        assertEquals("A question must have exactly 5 unique options", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail when options contain duplicates`() {
        val result = Question.create(
            id = "q1",
            statement = "Statement",
            options = listOf("A", "B", "A", "D", "E")
        )

        assertTrue(result.isFailure)
        assertEquals("A question must have exactly 5 unique options", result.exceptionOrNull()?.message)
    }
}