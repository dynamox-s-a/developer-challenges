package br.com.govanidebastiani.dynamoxquiz.quiz.presentation

import br.com.govanidebastiani.dynamoxquiz.quiz.domain.Question
import org.jetbrains.compose.resources.StringResource

data class QuizUIState(
    val currentQuestion: Question? = null,
    val isCorrect: Boolean? = null,
    val currentOption: String? = null,
    val isLastQuestion: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: StringResource? = null,
    val navigateToFinalScore: Boolean = false,
    val quizId: Long? = null,
    val ignoreIds: List<String> = emptyList()
)