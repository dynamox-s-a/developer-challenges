package com.dynamox.quiz.app.home.profile.viewModel

import com.dynamox.quiz.database.QuizScore
import kotlinx.coroutines.flow.StateFlow
import kotlin.uuid.Uuid

interface ProfileViewModel {
    val name: StateFlow<String>
    val email: StateFlow<String>
    val isLoading: StateFlow<Boolean>
    val errorMessage: StateFlow<String?>

    val scores: StateFlow<List<QuizScore>>

    fun updateName(newName: String)
    fun updateEmail(newEmail: String)

    fun saveProfile()

    fun deleteScore(scoreId: Uuid)

    fun logout()
}