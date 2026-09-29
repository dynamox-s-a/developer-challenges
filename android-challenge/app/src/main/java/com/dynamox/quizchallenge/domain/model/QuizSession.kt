package com.dynamox.quizchallenge.domain.model

/**
 * Immutable snapshot of an in-progress (or finished) quiz run for a single player.
 *
 * Keeping the quiz progress as a single immutable value (instead of scattering mutable
 * `var`s across the ViewModel) makes the scoring/progression rules easy to unit test in
 * isolation and easy to reason about: every transition produces a brand new [QuizSession].
 */
data class QuizSession(
    val playerName: String,
    val totalQuestions: Int = TOTAL_QUESTIONS,
    val answeredCount: Int = 0,
    val correctCount: Int = 0,
    val seenQuestionIds: Set<String> = emptySet(),
) {
    val isFinished: Boolean get() = answeredCount >= totalQuestions

    /** Returns a new session reflecting the outcome of answering [questionId]. */
    fun withAnswer(questionId: String, wasCorrect: Boolean): QuizSession = copy(
        answeredCount = answeredCount + 1,
        correctCount = if (wasCorrect) correctCount + 1 else correctCount,
        seenQuestionIds = seenQuestionIds + questionId,
    )

    companion object {
        const val TOTAL_QUESTIONS = 10
    }
}
