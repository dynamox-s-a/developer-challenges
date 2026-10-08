package br.com.govanidebastiani.dynamoxquiz.data

import android.content.Context
import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.android.AndroidSqliteDriver
import br.com.geovanidebastiani.dynamoxquiz.db.DynamoxQuizDatabase
import br.com.govanidebastiani.dynamoxquiz.core.data.DB_NAME
import br.com.govanidebastiani.dynamoxquiz.core.data.DatabaseDriverFactory

class AndroidDatabaseDriverFactory(private val context: Context): DatabaseDriverFactory {
    override fun createDriver(): SqlDriver {
        return AndroidSqliteDriver(DynamoxQuizDatabase.Schema, context, DB_NAME)
    }
}