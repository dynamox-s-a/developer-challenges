package br.com.govanidebastiani.dynamoxquiz.core.data

import app.cash.sqldelight.db.SqlDriver

interface DatabaseDriverFactory {
    fun createDriver(): SqlDriver
}

const val DB_NAME = "DynamoxQuizDatabase"