package br.com.govanidebastiani.dynamoxquiz.quiz.domain

import kotlin.time.Clock

data class Quiz(
    var id: Long = 0,
    val playerNickname: String,
    val createdAt: Long,
    val amountCorrectAnswers: Long,
    val amountQuestions: Long
)

val quizMock = Quiz(
    id = 1,
    playerNickname = "Geovani",
    amountCorrectAnswers = 10,
    amountQuestions = 10,
    createdAt = Clock.System.now().toEpochMilliseconds()
)