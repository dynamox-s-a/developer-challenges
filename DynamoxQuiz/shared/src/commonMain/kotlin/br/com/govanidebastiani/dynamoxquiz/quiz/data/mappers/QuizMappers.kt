package br.com.govanidebastiani.dynamoxquiz.quiz.data.mappers

import br.com.govanidebastiani.dynamoxquiz.quiz.data.dto.QuestionDto
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question

fun QuestionDto.toQuestion(): Question {
    return Question(
        id = id,
        statement = statement,
        options = options
    )
}