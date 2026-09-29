package com.dynamox.quizchallenge.domain.repository

import com.dynamox.quizchallenge.domain.model.Question

/**
 * Access to the remote quiz questions and answer checking.
 * Implemented by the data layer; the domain and UI layers only depend on this interface.
 */
interface QuizRepository {

    /** Fetches a random question from the backend. */
    suspend fun fetchQuestion(): Result<Question>

    /** Submits [answer] for [questionId] and returns whether it was correct. */
    suspend fun submitAnswer(questionId: String, answer: String): Result<Boolean>
}
