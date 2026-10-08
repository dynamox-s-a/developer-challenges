package br.com.govanidebastiani.dynamoxquiz.quiz.presentation.finalscore

import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Quiz

data class FinalScoreUIState(
    val isLoading: Boolean = true,
    val quiz: Quiz? = null,
    val ignoreIds: List<String> = emptyList()
)