package br.com.govanidebastiani.dynamoxquiz.core.data

import br.com.geovanidebastiani.dynamoxquiz.db.DynamoxQuizDatabase

internal class DatabaseFactory(private val driverFactory: DatabaseDriverFactory) {
    val database: DynamoxQuizDatabase by lazy {
        DynamoxQuizDatabase(driverFactory.createDriver())
    }
}