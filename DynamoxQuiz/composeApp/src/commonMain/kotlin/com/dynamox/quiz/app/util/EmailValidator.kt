package com.dynamox.quiz.app.util

/**
 * Utility object for validating email addresses.
 *
 * This object provides methods to validate the format of email addresses,
 * including checks for the local part and domain part according to standard
 * email formatting rules.
 */
object EmailValidator {
    const val MAX_LOCAL_PART_LENGTH = 64
    private const val LOCAL_PART_ATOM = "[a-z0-9!#$%&'*+/=?^_`{|}~\u0080-\uFFFF-]"

    private const val LOCAL_PART_INSIDE_QUOTES_ATOM =
        "(?:[a-z0-9!#$%&'*.(),<>\\[\\]:;@+/=?^_`{|}~\u0080-\uFFFF-]|\\\\\\\\|\\\\\\\")"

    private val LOCAL_PART_REGEX: Regex = (
            "(?:" + LOCAL_PART_ATOM + "+|\"" + LOCAL_PART_INSIDE_QUOTES_ATOM + "+\")" +
                    "(?:\\." + "(?:" + LOCAL_PART_ATOM + "+|\"" + LOCAL_PART_INSIDE_QUOTES_ATOM + "+\")" + ")*"
            ).toRegex(RegexOption.IGNORE_CASE)

    const val MAX_DOMAIN_PART_LENGTH = 255

    private const val DOMAIN_CHARS_BASE = "a-z0-9\u0080-\uFFFF"

    private const val STANDARD_DOMAIN_LABEL = "[$DOMAIN_CHARS_BASE](?:[$DOMAIN_CHARS_BASE-]{0,61}[$DOMAIN_CHARS_BASE])?"

    private const val TLD_LABEL = "(?:[a-z\u0080-\uFFFF]{2,}|xn--[a-z0-9-]{2,})"

    private const val HOSTNAME_DOMAIN = "(?:$STANDARD_DOMAIN_LABEL\\.)+$TLD_LABEL"

    private const val IP_DOMAIN = "\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]"

    private const val IP_V6_DOMAIN =
        "\\[IPv6:(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(:0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\]"

    private val EMAIL_DOMAIN_REGEX: Regex = (
            "$HOSTNAME_DOMAIN|$IP_DOMAIN|$IP_V6_DOMAIN"
            ).toRegex(RegexOption.IGNORE_CASE)


    fun isValidEmail(value: String?): Boolean {
        return isValidEmail(value, MAX_LOCAL_PART_LENGTH)
    }

    fun isValidEmail(value: String?, maxEmailLocalPartLength: Int): Boolean {
        if (value.isNullOrEmpty()) {
            return false
        }

        val splitPosition = value.lastIndexOf('@')

        if (splitPosition < 1) {
            return false
        }

        val localPart = value.substring(0, splitPosition)
        val domainPart = value.substring(splitPosition + 1)

        if (domainPart.isEmpty()) {
            return false
        }

        if (!isValidEmailLocalPart(localPart, maxEmailLocalPartLength)) {
            return false
        }

        return isValidEmailDomainAddress(domainPart)
    }

    private fun isValidEmailLocalPart(localPart: String, maxEmailLocalPartLength: Int): Boolean {
        if (localPart.length > maxEmailLocalPartLength) {
            return false
        }
        return LOCAL_PART_REGEX.matches(localPart)
    }

    private fun isValidEmailDomainAddress(domain: String): Boolean {
        if (domain.endsWith(".") || domain.startsWith("-") || domain.endsWith("-")) {
            return false
        }

        if (!EMAIL_DOMAIN_REGEX.matches(domain)) {
            return false
        }

        val asciiString: String = toAsciiPlatform(domain) ?: return false

        return asciiString.length <= MAX_DOMAIN_PART_LENGTH
    }
}

/**
 * Converts a Unicode domain name to its ASCII-compatible encoding (ACE) using Punycode.
 *
 * This function is platform-specific and should be implemented for each target platform.
 *
 * @param domain The Unicode domain name to convert.
 * @return The ASCII-compatible encoding of the domain name, or null if conversion fails.
 */
expect fun toAsciiPlatform(domain: String): String?