package com.dynamox.quiz.app.home.view

import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dynamox.quiz.app.home.profile.view.ProfileTab
import com.dynamox.quiz.app.home.viewModel.HomeViewModel
import dynamoxquiz.composeapp.generated.resources.Res
import dynamoxquiz.composeapp.generated.resources.home
import dynamoxquiz.composeapp.generated.resources.profile
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.koinInject

@Composable
fun HomeScreen(
    onStartQuizRequest: () -> Unit,
) {
    val viewModel: HomeViewModel = koinInject()
    val bestScores by viewModel.bestScores.collectAsState()

    var selectedTabIndex by remember { mutableStateOf(0) }

    Scaffold(
        bottomBar = {
            TabRow(selectedTabIndex) {
                Tab(
                    selected = selectedTabIndex == 0,
                    onClick = { selectedTabIndex = 0 },
                    text = { Text(stringResource(Res.string.home)) },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = stringResource(Res.string.home)
                        )
                    }
                )
                Tab(
                    selected = selectedTabIndex == 1,
                    onClick = { selectedTabIndex = 1 },
                    text = {
                        Text(stringResource(Res.string.profile))
                    },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = stringResource(Res.string.profile)
                        )
                    }
                )
            }
        }
    ) { paddingValues ->
        AnimatedContent(
            targetState = selectedTabIndex,
            modifier = Modifier.padding(paddingValues).padding(16.dp)
        ) { tabIndex ->
            when (tabIndex) {
                0 -> {
                    HomeTab(
                        bestScores = bestScores,
                        onStartQuiz = onStartQuizRequest,
                        modifier = Modifier.fillMaxSize().padding(paddingValues)
                    )
                }

                1 -> ProfileTab(
                    modifier = Modifier.fillMaxSize().padding(paddingValues)
                )
            }
        }
    }
}