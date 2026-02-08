package org.kaelkill.quiz.domain.model.aggregates

import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName

data class QuizSession(val player: PlayerName, val questions: List<Question>) {

    companion object {
        fun create(player: PlayerName, questions: List<Question>): Result<QuizSession> {
            val uniqueQuestion = questions.distinctBy { it.id }
            if(uniqueQuestion.size != 10) return Result.failure(IllegalArgumentException("A session must have exactly 10 unique questions"))
            return Result.success( value = QuizSession(player, uniqueQuestion))
        }

    }
}