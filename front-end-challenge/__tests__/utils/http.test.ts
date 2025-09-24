import {
  HTTP_HEADERS,
  CONTENT_TYPES,
  isSuccessStatus,
  isClientError,
  isServerError,
} from "@/utils/http";

describe("HTTP Utils", () => {
  describe("HTTP_HEADERS", () => {
    it("should have all common HTTP headers", () => {
      expect(HTTP_HEADERS.CONTENT_TYPE).toBe("Content-Type");
      expect(HTTP_HEADERS.AUTHORIZATION).toBe("Authorization");
      expect(HTTP_HEADERS.ACCEPT).toBe("Accept");
      expect(HTTP_HEADERS.USER_AGENT).toBe("User-Agent");
    });

    it("should contain expected header constants", () => {
      // Test that the object has the expected properties without trying to modify them
      expect(typeof HTTP_HEADERS.CONTENT_TYPE).toBe("string");
      expect(typeof HTTP_HEADERS.AUTHORIZATION).toBe("string");
      expect(typeof HTTP_HEADERS.ACCEPT).toBe("string");
      expect(typeof HTTP_HEADERS.USER_AGENT).toBe("string");
    });

    it("should have correct case for header names", () => {
      // HTTP headers should be in standard format
      expect(HTTP_HEADERS.CONTENT_TYPE).toBe("Content-Type");
      expect(HTTP_HEADERS.AUTHORIZATION).toBe("Authorization");
      expect(HTTP_HEADERS.ACCEPT).toBe("Accept");
      expect(HTTP_HEADERS.USER_AGENT).toBe("User-Agent");
    });
  });

  describe("CONTENT_TYPES", () => {
    it("should have all common content types", () => {
      expect(CONTENT_TYPES.JSON).toBe("application/json");
      expect(CONTENT_TYPES.FORM_DATA).toBe("multipart/form-data");
      expect(CONTENT_TYPES.URL_ENCODED).toBe(
        "application/x-www-form-urlencoded"
      );
      expect(CONTENT_TYPES.TEXT).toBe("text/plain");
    });

    it("should contain expected content type constants", () => {
      expect(typeof CONTENT_TYPES.JSON).toBe("string");
      expect(typeof CONTENT_TYPES.FORM_DATA).toBe("string");
      expect(typeof CONTENT_TYPES.URL_ENCODED).toBe("string");
      expect(typeof CONTENT_TYPES.TEXT).toBe("string");
    });

    it("should have valid MIME types", () => {
      // All content types should follow proper MIME type format
      const mimeTypeRegex = /^[a-z]+\/[a-z0-9\-\+\.]+$/i;

      expect(CONTENT_TYPES.JSON).toMatch(mimeTypeRegex);
      expect(CONTENT_TYPES.FORM_DATA).toMatch(mimeTypeRegex);
      expect(CONTENT_TYPES.URL_ENCODED).toMatch(mimeTypeRegex);
      expect(CONTENT_TYPES.TEXT).toMatch(mimeTypeRegex);
    });
  });

  describe("isSuccessStatus", () => {
    it("should return true for 2xx status codes", () => {
      const successCodes = [200, 201, 202, 204, 206, 299];

      successCodes.forEach((code) => {
        expect(isSuccessStatus(code)).toBe(true);
      });
    });

    it("should return false for non-2xx status codes", () => {
      const nonSuccessCodes = [
        100,
        101, // 1xx Informational
        199,
        300,
        301,
        302,
        304, // 3xx Redirection
        399,
        400,
        401,
        403,
        404,
        422, // 4xx Client Error
        499,
        500,
        501,
        502,
        503,
        504, // 5xx Server Error
        599,
      ];

      nonSuccessCodes.forEach((code) => {
        expect(isSuccessStatus(code)).toBe(false);
      });
    });

    it("should handle edge cases", () => {
      expect(isSuccessStatus(199)).toBe(false); // Just below 200
      expect(isSuccessStatus(200)).toBe(true); // First success code
      expect(isSuccessStatus(299)).toBe(true); // Last success code
      expect(isSuccessStatus(300)).toBe(false); // Just above 299
    });

    it("should handle invalid status codes", () => {
      // Though technically invalid, function should handle them
      expect(isSuccessStatus(0)).toBe(false);
      expect(isSuccessStatus(-1)).toBe(false);
      expect(isSuccessStatus(1000)).toBe(false);
    });
  });

  describe("isClientError", () => {
    it("should return true for 4xx status codes", () => {
      const clientErrorCodes = [
        400, // Bad Request
        401, // Unauthorized
        403, // Forbidden
        404, // Not Found
        405, // Method Not Allowed
        409, // Conflict
        422, // Unprocessable Entity
        429, // Too Many Requests
        499, // Custom client error
      ];

      clientErrorCodes.forEach((code) => {
        expect(isClientError(code)).toBe(true);
      });
    });

    it("should return false for non-4xx status codes", () => {
      const nonClientErrorCodes = [
        100,
        101,
        199, // 1xx Informational
        200,
        201,
        204,
        299, // 2xx Success
        300,
        301,
        302,
        399, // 3xx Redirection
        500,
        501,
        502,
        503,
        599, // 5xx Server Error
      ];

      nonClientErrorCodes.forEach((code) => {
        expect(isClientError(code)).toBe(false);
      });
    });

    it("should handle edge cases", () => {
      expect(isClientError(399)).toBe(false); // Just below 400
      expect(isClientError(400)).toBe(true); // First client error
      expect(isClientError(499)).toBe(true); // Last client error
      expect(isClientError(500)).toBe(false); // Just above 499
    });

    it("should handle common client error scenarios", () => {
      expect(isClientError(400)).toBe(true); // Bad Request
      expect(isClientError(401)).toBe(true); // Unauthorized (login required)
      expect(isClientError(403)).toBe(true); // Forbidden (no permission)
      expect(isClientError(404)).toBe(true); // Not Found
      expect(isClientError(422)).toBe(true); // Validation errors
    });
  });

  describe("isServerError", () => {
    it("should return true for 5xx status codes", () => {
      const serverErrorCodes = [
        500, // Internal Server Error
        501, // Not Implemented
        502, // Bad Gateway
        503, // Service Unavailable
        504, // Gateway Timeout
        505, // HTTP Version Not Supported
        599, // Custom server error
      ];

      serverErrorCodes.forEach((code) => {
        expect(isServerError(code)).toBe(true);
      });
    });

    it("should return false for non-5xx status codes", () => {
      const nonServerErrorCodes = [
        100,
        101,
        199, // 1xx Informational
        200,
        201,
        204,
        299, // 2xx Success
        300,
        301,
        302,
        399, // 3xx Redirection
        400,
        401,
        404,
        499, // 4xx Client Error
      ];

      nonServerErrorCodes.forEach((code) => {
        expect(isServerError(code)).toBe(false);
      });
    });

    it("should handle edge cases", () => {
      expect(isServerError(499)).toBe(false); // Just below 500
      expect(isServerError(500)).toBe(true); // First server error
      expect(isServerError(599)).toBe(true); // Last server error
      expect(isServerError(600)).toBe(false); // Above valid range
    });

    it("should handle common server error scenarios", () => {
      expect(isServerError(500)).toBe(true); // Internal Server Error
      expect(isServerError(502)).toBe(true); // Bad Gateway (proxy issues)
      expect(isServerError(503)).toBe(true); // Service Unavailable (maintenance)
      expect(isServerError(504)).toBe(true); // Gateway Timeout
    });
  });

  describe("status code classification integration", () => {
    it("should classify all standard HTTP status codes correctly", () => {
      const testCases = [
        // 1xx Informational - none should match our functions
        { code: 100, success: false, client: false, server: false },
        { code: 101, success: false, client: false, server: false },

        // 2xx Success
        { code: 200, success: true, client: false, server: false },
        { code: 201, success: true, client: false, server: false },
        { code: 204, success: true, client: false, server: false },

        // 3xx Redirection - none should match our functions
        { code: 300, success: false, client: false, server: false },
        { code: 301, success: false, client: false, server: false },
        { code: 304, success: false, client: false, server: false },

        // 4xx Client Error
        { code: 400, success: false, client: true, server: false },
        { code: 401, success: false, client: true, server: false },
        { code: 404, success: false, client: true, server: false },
        { code: 422, success: false, client: true, server: false },

        // 5xx Server Error
        { code: 500, success: false, client: false, server: true },
        { code: 502, success: false, client: false, server: true },
        { code: 503, success: false, client: false, server: true },
      ];

      testCases.forEach(({ code, success, client, server }) => {
        expect(isSuccessStatus(code)).toBe(success);
        expect(isClientError(code)).toBe(client);
        expect(isServerError(code)).toBe(server);
      });
    });

    it("should ensure mutually exclusive classification", () => {
      // Test range of status codes to ensure they don't overlap
      for (let code = 100; code < 600; code++) {
        const success = isSuccessStatus(code);
        const client = isClientError(code);
        const server = isServerError(code);

        // At most one should be true
        const trueCount = [success, client, server].filter(Boolean).length;
        expect(trueCount).toBeLessThanOrEqual(1);

        // For codes in known ranges, exactly one should be true
        if (code >= 200 && code < 300) {
          expect(success).toBe(true);
          expect(client).toBe(false);
          expect(server).toBe(false);
        } else if (code >= 400 && code < 500) {
          expect(success).toBe(false);
          expect(client).toBe(true);
          expect(server).toBe(false);
        } else if (code >= 500 && code < 600) {
          expect(success).toBe(false);
          expect(client).toBe(false);
          expect(server).toBe(true);
        }
      }
    });
  });

  describe("real-world usage scenarios", () => {
    it("should help with API response handling", () => {
      // Simulate API response handling
      const responses = [
        { status: 200, body: '{"data": "success"}' },
        { status: 401, body: '{"error": "Unauthorized"}' },
        { status: 500, body: '{"error": "Server error"}' },
      ];

      responses.forEach((response) => {
        if (isSuccessStatus(response.status)) {
          expect(response.status).toBe(200);
          expect(response.body).toContain("success");
        } else if (isClientError(response.status)) {
          expect(response.status).toBe(401);
          expect(response.body).toContain("Unauthorized");
        } else if (isServerError(response.status)) {
          expect(response.status).toBe(500);
          expect(response.body).toContain("Server error");
        }
      });
    });

    it("should work with common fetch scenarios", () => {
      // Common HTTP status codes from fetch API
      const fetchScenarios = [
        { status: 200, description: "OK" },
        { status: 201, description: "Created" },
        { status: 400, description: "Bad Request" },
        { status: 401, description: "Authentication required" },
        { status: 403, description: "Forbidden" },
        { status: 404, description: "Not Found" },
        { status: 422, description: "Validation error" },
        { status: 500, description: "Internal Server Error" },
        { status: 503, description: "Service Unavailable" },
      ];

      fetchScenarios.forEach(({ status, description }) => {
        const success = isSuccessStatus(status);
        const clientError = isClientError(status);
        const serverError = isServerError(status);

        // Verify classification makes sense for the description
        if (description.includes("OK") || description.includes("Created")) {
          expect(success).toBe(true);
        } else if (
          description.includes("Bad Request") ||
          description.includes("Forbidden") ||
          description.includes("Not Found")
        ) {
          expect(clientError).toBe(true);
        } else if (
          description.includes("Internal") ||
          description.includes("Service Unavailable")
        ) {
          expect(serverError).toBe(true);
        }
      });
    });

    it("should handle authentication and authorization scenarios", () => {
      // Auth-related status codes
      expect(isClientError(401)).toBe(true); // Need to login
      expect(isClientError(403)).toBe(true); // Logged in but no permission
      expect(isSuccessStatus(200)).toBe(true); // Success after auth

      // These should not be success codes
      expect(isSuccessStatus(401)).toBe(false);
      expect(isSuccessStatus(403)).toBe(false);
    });

    it("should handle form validation scenarios", () => {
      // Form validation typically returns 422
      expect(isClientError(422)).toBe(true);
      expect(isSuccessStatus(422)).toBe(false);
      expect(isServerError(422)).toBe(false);

      // Successful form submission
      expect(isSuccessStatus(201)).toBe(true); // Created
      expect(isSuccessStatus(200)).toBe(true); // Updated
    });
  });

  describe("constants usage in real scenarios", () => {
    it("should provide correct headers for API requests", () => {
      // Simulate building request headers
      const headers = {
        [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        [HTTP_HEADERS.AUTHORIZATION]: "Bearer token123",
        [HTTP_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
      };

      expect(headers["Content-Type"]).toBe("application/json");
      expect(headers["Authorization"]).toBe("Bearer token123");
      expect(headers["Accept"]).toBe("application/json");
    });

    it("should handle different content types correctly", () => {
      // Form data
      expect(CONTENT_TYPES.FORM_DATA).toBe("multipart/form-data");

      // JSON API
      expect(CONTENT_TYPES.JSON).toBe("application/json");

      // Traditional forms
      expect(CONTENT_TYPES.URL_ENCODED).toBe(
        "application/x-www-form-urlencoded"
      );

      // Plain text
      expect(CONTENT_TYPES.TEXT).toBe("text/plain");
    });
  });
});
