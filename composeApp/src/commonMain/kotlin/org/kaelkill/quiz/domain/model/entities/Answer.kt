package org.kaelkill.quiz.domain.model.entities

import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.QuestionId

data class Answer(val questionId: QuestionId, val selectedOption: AnswerOption)


