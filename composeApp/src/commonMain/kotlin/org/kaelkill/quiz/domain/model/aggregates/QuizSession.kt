package org.kaelkill.quiz.domain.model.aggregates

import org.kaelkill.quiz.domain.model.entities.Answer
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.model.valueobjects.Score

data class QuizSession(
    val id: QuizSessionId,
    val playerId: PlayerId,
    val questions: List<Question> = emptyList(),
    val answers: List<Answer> = emptyList(),
    val score: Score = Score.zero()
) {

    val isFinished: Boolean
        get() = questions.size == 10 && answers.size == 10

    companion object {
        private const val MAX_QUESTIONS = 10

        fun create(playerId: PlayerId): QuizSession {
            return QuizSession(
                id = QuizSessionId.generate(),
                playerId = playerId
            )
        }
    }

    fun addNewQuestion(question: Question): Result<QuizSession> {
        if (questions.size >= MAX_QUESTIONS) {
            return Result.failure(IllegalStateException("Quiz is already full (10 questions)"))
        }

        if (questions.any { it.id == question.id }) {
            return Result.success(this)
        }

        return Result.success(copy(questions = questions + question))
    }

    fun answerQuestion(questionId: String, optionValue: String, isCorrect: Boolean): Result<QuizSession> {
        val question = questions.find { it.id.value == questionId }
            ?: return Result.failure(IllegalArgumentException("Question not found in current session"))

        if (isQuestionAlreadyAnswered(question)) {
            return Result.failure(IllegalStateException("Question already answered"))
        }

        val selectedOption = parseAndValidateOption(question, optionValue).getOrElse { error ->
            return Result.failure(error)
        }

        val newAnswer = Answer(question.id, selectedOption)
        val newScore = if (isCorrect) score.increment() else score

        return Result.success(
            copy(
                answers = answers + newAnswer,
                score = newScore
            )
        )
    }

    private fun isQuestionAlreadyAnswered(question: Question): Boolean {
        return answers.any { it.questionId == question.id }
    }

    private fun parseAndValidateOption(question: Question, optionValue: String): Result<AnswerOption> {
        val optionResult = AnswerOption.create(optionValue)

        if (optionResult.isFailure) return optionResult

        val option = optionResult.getOrThrow()
        if (option !in question.options) {
            return Result.failure(IllegalArgumentException("Selected option is not valid for this question"))
        }

        return Result.success(option)
    }
}