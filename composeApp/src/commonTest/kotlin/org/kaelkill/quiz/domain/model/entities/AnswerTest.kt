package org.kaelkill.quiz.domain.model.entities

import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.QuestionId
import kotlin.test.Test
import kotlin.test.assertEquals

class AnswerTest {

    @Test
    fun `should create valid answer`() {
        val questionId = QuestionId.create("q1").getOrThrow()
        val selectedOption = AnswerOption.create("Blue").getOrThrow()

        val answer = Answer(questionId, selectedOption)

        assertEquals(questionId, answer.questionId)
        assertEquals(selectedOption, answer.selectedOption)
    }
}