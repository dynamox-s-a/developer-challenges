package br.com.govanidebastiani.dynamoxquiz.quiz.presentation.history

import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz

data class HistoryScreenUIState(
    val isLoading: Boolean = true,
    val quizzes: List<Quiz> = emptyList()
)