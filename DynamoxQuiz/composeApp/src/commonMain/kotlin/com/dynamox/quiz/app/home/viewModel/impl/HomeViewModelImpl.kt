package com.dynamox.quiz.app.home.viewModel.impl

import com.dynamox.quiz.app.home.viewModel.HomeViewModel
import com.dynamox.quiz.database.repository.ClientDataRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn

class HomeViewModelImpl(
    repository: ClientDataRepository
) : HomeViewModel {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override val bestScores = repository
        .observeTopQuizScores()
        .stateIn(scope, SharingStarted.Companion.Eagerly, emptyList())
}