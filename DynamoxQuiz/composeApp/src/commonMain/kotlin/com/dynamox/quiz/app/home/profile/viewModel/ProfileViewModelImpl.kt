package com.dynamox.quiz.app.home.profile.viewModel

import com.dynamox.quiz.app.session.SessionManager
import com.dynamox.quiz.app.session.model.SessionState
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.shared.systemEpochMilliseconds
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.failed_to_delete_score
import dynamoxquiz.composeapp.generated.resources.failed_to_update_profile_message
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.getString
import kotlin.uuid.Uuid

class ProfileViewModelImpl(
    private val repository: ClientDataRepository,
    private val sessionManager: SessionManager
) : ProfileViewModel {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override val name = MutableStateFlow("")
    override val email = MutableStateFlow("")
    override val isLoading = MutableStateFlow(false)
    override val errorMessage = MutableStateFlow<String?>(null)

    private val user = sessionManager.state
        .map { it as? SessionState.Authenticated }
        .map { it?.user }
        .stateIn(scope = scope, started = SharingStarted.Eagerly, initialValue = null)

    override val scores = user.flatMapLatest { user ->
        if (user == null) {
            flowOf(emptyList())
        } else {
            repository.observeUserQuizScores(user.id)
                .map { scores -> scores.sortedByDescending { it.score } }
        }
    }.stateIn(scope = scope, started = SharingStarted.Eagerly, initialValue = emptyList())

    init {
        scope.launch {
            user.collect { user ->
                name.update { user?.name.orEmpty() }
                email.update { user?.email.orEmpty() }
            }
        }
    }

    override fun updateName(newName: String) {
        name.update { newName }
    }

    override fun updateEmail(newEmail: String) {
        email.update { newEmail }
    }

    override fun saveProfile() {
        val user = user.value ?: return
        val name = name.value
        val email = email.value

        scope.launch {
            isLoading.update { true }
            errorMessage.update { null }
            val entity = repository.loadUserEntity(user.id).getOrNull() ?: return@launch
            val updated = entity.copy(
                name = name,
                email = email.lowercase(),
                lastModified = systemEpochMilliseconds()
            )
            repository.updateUserEntity(updated)
                .onFailure { exception ->
                    println(exception)
                    errorMessage.update { getString(Res.string.failed_to_update_profile_message) }
                }
            isLoading.update { false }
        }
    }

    override fun deleteScore(scoreId: Uuid) {
        scope.launch {
            isLoading.update { true }
            errorMessage.update { null }
            repository.deleteQuizScore(scoreId)
                .onFailure { exception ->
                    println(exception)
                    errorMessage.update { getString(Res.string.failed_to_delete_score) }
                }
            isLoading.update { false }
        }
    }

    override fun logout() {
        sessionManager.logout()
    }
}