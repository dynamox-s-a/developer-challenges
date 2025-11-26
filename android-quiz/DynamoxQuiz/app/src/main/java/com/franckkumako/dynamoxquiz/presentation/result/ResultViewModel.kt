package com.franckkumako.dynamoxquiz.presentation.result

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.franckkumako.dynamoxquiz.domain.model.Score
import com.franckkumako.dynamoxquiz.domain.usecase.GetScoresUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ResultViewModel @Inject constructor(
    private val getScoresUseCase: GetScoresUseCase
) : ViewModel() {

    private val _scores = MutableStateFlow<List<Score>>(emptyList())
    val scores: StateFlow<List<Score>> = _scores

    fun loadScores() {
        viewModelScope.launch {
            getScoresUseCase().collect { list ->
                _scores.value = list
            }
        }
    }
}
