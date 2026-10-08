package br.com.govanidebastiani.dynamoxquiz.data

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.native.NativeSqliteDriver
import br.com.geovanidebastiani.dynamoxquiz.db.DynamoxQuizDatabase
import br.com.govanidebastiani.dynamoxquiz.core.data.DB_NAME
import br.com.govanidebastiani.dynamoxquiz.core.data.DatabaseDriverFactory

class IOSDatabaseDriverFactory: DatabaseDriverFactory {
    override fun createDriver(): SqlDriver {
        return NativeSqliteDriver(DynamoxQuizDatabase.Schema, DB_NAME)
    }
}