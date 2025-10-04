package com.dynamox.quiz.database

import app.cash.sqldelight.ColumnAdapter
import com.dynamox.quiz.shared.fromString
import kotlin.uuid.Uuid

internal class DatabaseAdapters {
    object UuidAdapter : ColumnAdapter<Uuid, String> {
        override fun decode(databaseValue: String): Uuid = Uuid.Companion.fromString(databaseValue)

        override fun encode(value: Uuid): String = value.toString()
    }
}