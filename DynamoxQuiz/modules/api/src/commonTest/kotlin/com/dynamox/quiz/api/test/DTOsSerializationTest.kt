package com.dynamox.quiz.api.test

import com.dynamox.quiz.api.model.QuizAnswer
import com.dynamox.quiz.api.model.QuizQuestion
import com.dynamox.quiz.api.model.QuizResult
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertTrue

class DTOsSerializationTest {

    @Test
    fun `test QuizQuestion serialization`() {
        val questionJson = """
            {
              "id": "22",
              "statement": "What is the capital of France?",
              "options": ["Berlin", "Madrid", "Paris", "Rome", "Lisbon"]
            }
        """.trimIndent()
            .replace("\\s".toRegex(), "")
        println("Original JSON: $questionJson")
        val question = Json.decodeFromString<QuizQuestion>(questionJson)
        assertTrue(question.id == "22")
        val serializedJson = Json.encodeToString(question)
        println("Serialized JSON: $serializedJson")
        assertTrue(serializedJson == questionJson)
    }

    @Test
    fun `test QuizAnswer serialization`() {
        val answerJson = """{"answer":"Paris"}"""
        println("Original JSON: $answerJson")
        val answer = Json.decodeFromString<QuizAnswer>(answerJson)
        assertTrue(answer.answer == "Paris")
        val serializedJson = Json.encodeToString(answer)
        println("Serialized JSON: $serializedJson")
        assertTrue(serializedJson == answerJson)
    }

    @Test
    fun `test QuizResult serialization`() {
        val resultJson = """{"result":true}"""
        println("Original JSON: $resultJson")
        val result = Json.decodeFromString<QuizResult>(resultJson)
        assertTrue(result.result)
        val serializedJson = Json.encodeToString(result)
        println("Serialized JSON: $serializedJson")
        assertTrue(serializedJson == resultJson)
    }
}