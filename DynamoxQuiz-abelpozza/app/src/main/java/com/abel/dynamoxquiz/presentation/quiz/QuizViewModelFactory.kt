package com.abel.dynamoxquiz.presentation.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.abel.dynamoxquiz.data.local.ScoreDao
import com.abel.dynamoxquiz.domain.repository.QuizRepository

class QuizViewModelFactory(

    private val repository: QuizRepository,
    private val scoreDao: ScoreDao
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(
        modelClass: Class<T>
    ): T {
        if (
            modelClass.isAssignableFrom(
                QuizViewModel::class.java
            )
        ) {
            @Suppress("UNCHECKED_CAST")
            return QuizViewModel(
                repository,
                scoreDao
            ) as T
        }
        throw IllegalArgumentException(
            "Unknown ViewModel class"
        )
    }
}