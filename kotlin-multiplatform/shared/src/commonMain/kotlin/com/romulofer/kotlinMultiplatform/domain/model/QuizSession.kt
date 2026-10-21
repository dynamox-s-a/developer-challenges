package com.romulofer.kotlinMultiplatform.domain.model

data class QuizSession(
    val answered: Int = 0,
    val correct: Int = 0,
    val seenQuestionIds: Set<String> = emptySet()
) {
    val isFinished: Boolean get() = answered >= TOTAL_QUESTIONS

    fun withQuestionSeen(questionId: String): QuizSession =
        copy(seenQuestionIds = seenQuestionIds + questionId)

    fun withAnswer(isCorrect: Boolean): QuizSession =
        copy(answered = answered + 1, correct = if (isCorrect) correct + 1 else correct)

    companion object {
        const val TOTAL_QUESTIONS = 10
    }
}
