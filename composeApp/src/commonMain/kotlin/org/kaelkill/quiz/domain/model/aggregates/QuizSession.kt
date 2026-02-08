package org.kaelkill.quiz.domain.model.aggregates

import org.kaelkill.quiz.domain.model.entities.Answer
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName

data class QuizSession(
    val player: PlayerName,
    val questions: List<Question>,
    val answers: List<Answer> = emptyList()
) {

    companion object {
        private const val QUESTIONS_PER_SESSION = 10

        fun create(player: PlayerName, questions: List<Question>): Result<QuizSession> {
            val uniqueQuestions = questions.distinctBy { it.id }

            if (uniqueQuestions.size != QUESTIONS_PER_SESSION) {
                return Result.failure(IllegalArgumentException("A session must have exactly $QUESTIONS_PER_SESSION unique questions"))
            }

            return Result.success(QuizSession(player, uniqueQuestions))
        }
    }

    fun answerQuestion(questionId: String, optionValue: String): Result<QuizSession> {
        val question = questions.find { it.id.value == questionId }
            ?: return Result.failure(IllegalArgumentException("Question not found in this session"))

        if (isQuestionAlreadyAnswered(question)) {
            return Result.failure(IllegalStateException("Question already answered"))
        }

        val selectedOption = parseAndValidateOption(question, optionValue).getOrElse { error ->
            return Result.failure(error)
        }

        val newAnswer = Answer(question.id, selectedOption)
        return Result.success(copy(answers = answers + newAnswer))
    }

    private fun isQuestionAlreadyAnswered(question: Question): Boolean {
        return answers.any { it.questionId == question.id }
    }

    private fun parseAndValidateOption(
        question: Question,
        optionValue: String
    ): Result<AnswerOption> {
        val optionResult = AnswerOption.create(optionValue)

        if (optionResult.isFailure) return optionResult

        val option = optionResult.getOrThrow()
        if (option !in question.options) {
            return Result.failure(IllegalArgumentException("Selected option is not valid for this question"))
        }

        return Result.success(option)
    }
}