package com.dynamox.quiz.app.test

import com.dynamox.quiz.app.util.EmailValidator
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class EmailValidatorTest {

    @Test
    fun `valid simple email`() {
        assertTrue(EmailValidator.isValidEmail("test@example.com"), "Simple email should be valid")
    }

    @Test
    fun `valid email with subdomain`() {
        assertTrue(
            EmailValidator.isValidEmail("test@mail.example.com"),
            "Email with subdomain should be valid"
        )
    }

    @Test
    fun `valid email with hyphen in domain`() {
        assertTrue(
            EmailValidator.isValidEmail("test@example-domain.com"),
            "Email with hyphen in domain should be valid"
        )
    }

    @Test
    fun `valid email with numbers in domain`() {
        assertTrue(
            EmailValidator.isValidEmail("test@example123.com"),
            "Email with numbers in domain should be valid"
        )
    }

    @Test
    fun `valid email with plus in local part`() {
        assertTrue(
            EmailValidator.isValidEmail("firstname+lastname@example.com"),
            "Email with plus in local part should be valid"
        )
    }

    @Test
    fun `valid email with dot in local part`() {
        assertTrue(
            EmailValidator.isValidEmail("first.last@example.com"),
            "Email with dot in local part should be valid"
        )
    }

    @Test
    fun `valid email with hyphen in local part`() {
        assertTrue(
            EmailValidator.isValidEmail("first-last@example.com"),
            "Email with hyphen in local part should be valid"
        )
    }

    @Test
    fun `valid email with underscore in local part`() {
        assertTrue(
            EmailValidator.isValidEmail("first_last@example.com"),
            "Email with underscore in local part should be valid"
        )
    }

    @Test
    fun `valid email with numbers in local part`() {
        assertTrue(
            EmailValidator.isValidEmail("user123@example.com"),
            "Email with numbers in local part should be valid"
        )
    }

    @Test
    fun `valid email with single letter domain`() {
        assertTrue(
            EmailValidator.isValidEmail("test@e.com"),
            "Email with single letter subdomain part (e.g. e.com) should be valid"
        )
    }

    @Test
    fun `valid email with long TLD`() {
        assertTrue(
            EmailValidator.isValidEmail("test@example.foundation"),
            "Email with long TLD should be valid"
        )
    }

    @Test
    fun `valid email in all caps`() {
        assertTrue(
            EmailValidator.isValidEmail("TEST@EXAMPLE.COM"),
            "All caps email should be valid"
        )
    }

    @Test
    fun `valid email with mixed case`() {
        assertTrue(EmailValidator.isValidEmail("Test.User@Example.CoM"), "Mixed case email should be valid")
    }

    @Test
    fun `valid email with quoted local part`() {
        assertTrue(EmailValidator.isValidEmail("\"test@example\"@example.com"), "Email with quoted local part containing @ should be valid")
    }

    @Test
    fun `valid email with IP address domain`() {
        assertTrue(EmailValidator.isValidEmail("test@[192.168.1.1]"), "Email with IPv4 domain should be valid")
    }

    @Test
    fun `valid email with IPv6 address domain`() {
        assertTrue(EmailValidator.isValidEmail("test@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]"), "Email with IPv6 domain should be valid")
    }

    @Test
    fun `valid email with short IPv6 address domain`() {
        assertTrue(EmailValidator.isValidEmail("test@[IPv6:::1]"), "Email with short IPv6 domain should be valid")
    }

    @Test
    fun `valid IDN email`() {
        assertTrue(EmailValidator.isValidEmail("test@bücher.example"), "IDN email should be valid (depends on toAsciiPlatform)")
    }

    @Test
    fun `valid email with unicode characters in local part`() {
        assertTrue(EmailValidator.isValidEmail("josé@example.com"), "Email with unicode in local part should be valid")
    }

    @Test
    fun `invalid email missing at symbol`() {
        assertFalse(EmailValidator.isValidEmail("testexample.com"), "Email missing @ symbol should be invalid")
    }

    @Test
    fun `invalid email missing domain`() {
        assertFalse(EmailValidator.isValidEmail("test@"), "Email missing domain should be invalid")
    }

    @Test
    fun `invalid email missing local part`() {
        assertFalse(EmailValidator.isValidEmail("@example.com"), "Email missing local part should be invalid")
    }

    @Test
    fun `invalid email with space in local part unquoted`() {
        assertFalse(EmailValidator.isValidEmail("test user@example.com"), "Email with unquoted space in local part should be invalid")
    }

    @Test
    fun `invalid email with space in domain`() {
        assertFalse(EmailValidator.isValidEmail("test@exam ple.com"), "Email with space in domain should be invalid")
    }

    @Test
    fun `invalid email starting with dot in domain`() {
        assertFalse(EmailValidator.isValidEmail("test@.example.com"), "Email starting with dot in domain should be invalid")
    }

    @Test
    fun `invalid email ending with dot in domain`() {
        assertFalse(EmailValidator.isValidEmail("test@example.com."), "Email ending with dot in domain should be invalid")
    }

    @Test
    fun `invalid email with consecutive dots in domain`() {
        assertFalse(EmailValidator.isValidEmail("test@example..com"), "Email with consecutive dots in domain should be invalid")
    }

    @Test
    fun `invalid email with consecutive dots in local part`() {
        assertFalse(EmailValidator.isValidEmail("test..user@example.com"), "Email with consecutive dots in local part (unquoted) should be invalid")
    }

    @Test
    fun `invalid email with TLD too short`() {
        assertFalse(EmailValidator.isValidEmail("test@example.c"), "Email with TLD too short should be invalid (domain regex expects at least 2 chars for TLD)")
    }

    @Test
    fun `invalid email with only at symbol`() {
        assertFalse(EmailValidator.isValidEmail("@"), "Email with only @ should be invalid")
    }

    @Test
    fun `empty string is invalid email`() {
        assertFalse(EmailValidator.isValidEmail(""), "Empty string should be invalid")
    }

    @Test
    fun `null is invalid email`() {
        assertFalse(EmailValidator.isValidEmail(null), "Null should be invalid")
    }

    @Test
    fun `invalid IP address format`() {
        assertFalse(EmailValidator.isValidEmail("test@[192.168.1]"), "Invalid IPv4 format should be invalid")
    }

    @Test
    fun `invalid IPv6 address format`() {
        assertFalse(EmailValidator.isValidEmail("test@[IPv6:notaipv6]"), "Invalid IPv6 format should be invalid")
    }

    @Test
    fun `local part too long`() {
        val longLocalPart = "a".repeat(EmailValidator.MAX_LOCAL_PART_LENGTH + 1)
        assertFalse(EmailValidator.isValidEmail("$longLocalPart@example.com"), "Email with local part exceeding max length should be invalid")
    }

    @Test
    fun `local part at max length`() {
        val maxLocalPart = "a".repeat(EmailValidator.MAX_LOCAL_PART_LENGTH)
        assertTrue(EmailValidator.isValidEmail("$maxLocalPart@example.com"), "Email with local part at max length should be valid")
    }

    @Test
    fun `domain part too long`() {
        val overlyLongAsciiDomain = "a".repeat(EmailValidator.MAX_DOMAIN_PART_LENGTH - ".com".length + 1) + ".com"
        assertFalse(EmailValidator.isValidEmail("test@$overlyLongAsciiDomain"), "Email with ASCII domain part exceeding max length should be invalid")
    }

    @Test
    fun `invalid email without TLD`() {
        assertFalse(EmailValidator.isValidEmail("test@example"), "Email without TLD should be invalid")
    }

    @Test
    fun `invalid characters in local part`() {
        assertFalse(EmailValidator.isValidEmail("test()user@example.com"), "Email with invalid characters '()' in local part should be invalid")
    }

    @Test
    fun `domain starting with hyphen`() {
        assertFalse(EmailValidator.isValidEmail("test@-example.com"), "Domain starting with hyphen should be invalid")
    }
}