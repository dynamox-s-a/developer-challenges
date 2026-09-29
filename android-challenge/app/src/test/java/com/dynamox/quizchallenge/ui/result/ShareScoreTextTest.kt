package com.dynamox.quizchallenge.ui.result

import org.junit.Assert.assertEquals
import org.junit.Test

class ShareScoreTextTest {

    private val template = "%1\$s acertou %2\$d de %3\$d perguntas no Quiz Dynamox! 🎉"

    @Test
    fun `substitutes player name, correct count and total questions in order`() {
        val message = buildShareMessage(template, playerName = "Ada", correctCount = 8, totalQuestions = 10)

        assertEquals("Ada acertou 8 de 10 perguntas no Quiz Dynamox! 🎉", message)
    }

    @Test
    fun `handles a perfect score`() {
        val message = buildShareMessage(template, playerName = "Grace", correctCount = 10, totalQuestions = 10)

        assertEquals("Grace acertou 10 de 10 perguntas no Quiz Dynamox! 🎉", message)
    }

    @Test
    fun `handles a zero score`() {
        val message = buildShareMessage(template, playerName = "Ada", correctCount = 0, totalQuestions = 10)

        assertEquals("Ada acertou 0 de 10 perguntas no Quiz Dynamox! 🎉", message)
    }
}
