package org.kaelkill.quiz.infrastructure.repositories

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.Serializable
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Answer
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.QuestionId
import org.kaelkill.quiz.domain.model.valueobjects.QuestionStatement
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.model.valueobjects.Score
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import org.kaelkill.quiz.infrastructure.db.QuizDatabase

class SqlDelightQuizSessionRepository(
    private val database: QuizDatabase
) : QuizSessionRepository {

    private val queries = database.quizSessionQueries
    private val json = Json { ignoreUnknownKeys = true }

    override suspend fun save(session: QuizSession): Result<Unit> {
        return runCatching {
            val questionsJson = json.encodeToString(session.questions.map { it.toDto() })
            val answersJson = json.encodeToString(session.answers.map { it.toDto() })

            queries.insert(
                session.id.value,
                session.playerId.value,
                questionsJson,
                answersJson,
                session.score.value.toLong()
            )
        }
    }

    override suspend fun getById(id: QuizSessionId): Result<QuizSession> {
        return runCatching {
            val entity = queries.selectById(id.value).executeAsOneOrNull()
                ?: throw NoSuchElementException("Session not found: ${id.value}")
            entity.toDomain()
        }
    }

    private fun org.kaelkill.quiz.infrastructure.db.QuizSessionEntity.toDomain(): QuizSession {
        val questions = json.decodeFromString<List<QuestionDto>>(questionsJson).map { it.toDomain() }
        val answers = json.decodeFromString<List<AnswerDto>>(answersJson).map { it.toDomain() }

        return QuizSession(
            id = QuizSessionId.create(id).getOrThrow(),
            playerId = PlayerId.create(playerId).getOrThrow(),
            questions = questions,
            answers = answers,
            score = Score.create(scoreValue.toInt()).getOrThrow()
        )
    }

    // DTOs para serialização

    @Serializable
    private data class QuestionDto(
        val id: String,
        val statement: String,
        val options: List<String>
    )

    @Serializable
    private data class AnswerDto(
        val questionId: String,
        val selectedOption: String
    )

    private fun Question.toDto() = QuestionDto(
        id = id.value,
        statement = statement.value,
        options = options.map { it.value }
    )

    private fun Answer.toDto() = AnswerDto(
        questionId = questionId.value,
        selectedOption = selectedOption.value
    )

    private fun QuestionDto.toDomain() = Question(
        id = QuestionId.create(id).getOrThrow(),
        statement = QuestionStatement.create(statement).getOrThrow(),
        options = options.map { AnswerOption.create(it).getOrThrow() }
    )

    private fun AnswerDto.toDomain() = Answer(
        questionId = QuestionId.create(questionId).getOrThrow(),
        selectedOption = AnswerOption.create(selectedOption).getOrThrow()
    )
}
