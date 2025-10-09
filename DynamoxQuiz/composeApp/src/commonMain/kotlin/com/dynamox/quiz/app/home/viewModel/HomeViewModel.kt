package com.dynamox.quiz.app.home.viewModel

import com.dynamox.quiz.database.UserBestScore
import kotlinx.coroutines.flow.StateFlow

interface HomeViewModel {
    val bestScores: StateFlow<List<UserBestScore>>
}