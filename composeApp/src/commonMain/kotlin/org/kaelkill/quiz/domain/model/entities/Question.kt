package org.kaelkill.quiz.domain.model.entities

import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.QuestionId
import org.kaelkill.quiz.domain.model.valueobjects.QuestionStatement

data class Question(
        val id: QuestionId,
        val statement: QuestionStatement,
        val options: List<AnswerOption>
) {
    companion object {
        fun create(id: String, statement: String, options: List<String>): Result<Question> {
            val uniqueOptions = options.distinct()
            if (uniqueOptions.size != 5)
                    return Result.failure(
                            IllegalArgumentException(
                                    "A question must have exactly 5 unique options"
                            )
                    )
            val idResult = QuestionId.create(id)
            val statementResult = QuestionStatement.create(statement)
            val optionsResult = options.map { AnswerOption.create(it) }
            val firstOptionResult = optionsResult.firstOrNull { it.isFailure }

            return when {
                idResult.isFailure -> Result.failure(idResult.exceptionOrNull()!!)
                statementResult.isFailure -> Result.failure(statementResult.exceptionOrNull()!!)
                firstOptionResult != null -> Result.failure(firstOptionResult.exceptionOrNull()!!)
                else ->
                        Result.success(
                                Question(
                                        id = idResult.getOrNull()!!,
                                        statement = statementResult.getOrNull()!!,
                                        options = optionsResult.map { it.getOrNull()!! }
                                )
                        )
            }
        }
    }
}
