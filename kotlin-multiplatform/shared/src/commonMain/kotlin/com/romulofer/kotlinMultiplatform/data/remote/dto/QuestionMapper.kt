package com.romulofer.kotlinMultiplatform.data.remote.dto

import com.romulofer.kotlinMultiplatform.domain.model.Question

internal fun QuestionDto.toDomain(): Question = Question(id = id, statement = statement, options = options)
