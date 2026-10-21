package com.romulofer.kotlinMultiplatform.data.local

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isNull
import kotlin.test.Test

class PlayerQueriesTest{

    private val queries = createTestDatabase().playerQueries

    @Test
    fun `returns nothing when player does not exist`(){
        val result = queries.selectByName("Ana").executeAsOneOrNull()

        assertThat(result).isNull()
    }

    @Test
    fun `returns a player by name`(){
        queries.insertIgnore("Ana")

        val result = queries.selectByName("Ana").executeAsOneOrNull()
        val expectedResult = Player(id = 1, name = "Ana")

        assertThat(result).isEqualTo(expectedResult)
    }

    @Test
    fun `returns player ignoring case`(){
        queries.insertIgnore("Ana")

        val result = queries.selectByName("ANA").executeAsOneOrNull()
        val expectedResult = Player(id = 1, name = "Ana")

        assertThat(result).isEqualTo(expectedResult)
    }

    @Test
    fun `does not duplicate a name that differs only by case`(){

        queries.insertIgnore("Ana")
        queries.insertIgnore("ANA")

        val result = queries.selectByName("ANA").executeAsOneOrNull()
        val expectedResult = Player(id = 1, name = "Ana")

        assertThat(result).isEqualTo(expectedResult)
    }
}