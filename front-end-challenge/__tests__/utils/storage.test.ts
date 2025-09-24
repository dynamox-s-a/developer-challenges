import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  authStorage,
} from "@/utils/storage";

describe("Storage Utils", () => {
  // Mock console.error to avoid noise in tests
  const originalConsoleError = console.error;

  beforeEach(() => {
    localStorage.clear();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe("STORAGE_KEYS", () => {
    it("should have all required storage keys", () => {
      expect(STORAGE_KEYS.AUTH_TOKEN).toBe("authToken");
      expect(STORAGE_KEYS.USER_DATA).toBe("userData");
      expect(STORAGE_KEYS.THEME_PREFERENCE).toBe("themePreference");
      expect(STORAGE_KEYS.LAST_VISITED_PAGE).toBe("lastVisitedPage");
    });

    it("should contain expected key constants", () => {
      expect(typeof STORAGE_KEYS.AUTH_TOKEN).toBe("string");
      expect(typeof STORAGE_KEYS.USER_DATA).toBe("string");
      expect(typeof STORAGE_KEYS.THEME_PREFERENCE).toBe("string");
      expect(typeof STORAGE_KEYS.LAST_VISITED_PAGE).toBe("string");
    });
  });

  describe("getStorageItem", () => {
    it("should return stored value when item exists", () => {
      localStorage.setItem("testKey", "testValue");
      expect(getStorageItem("testKey")).toBe("testValue");
    });

    it("should return null when item does not exist", () => {
      expect(getStorageItem("nonExistentKey")).toBeNull();
    });

    it("should handle empty string values", () => {
      localStorage.setItem("emptyKey", "");
      expect(getStorageItem("emptyKey")).toBe("");
    });

    it("should handle special characters and unicode", () => {
      const specialValue = "Olá! 🌟 Special chars: @#$%^&*()";
      localStorage.setItem("specialKey", specialValue);
      expect(getStorageItem("specialKey")).toBe(specialValue);
    });

    it("should return null and log error when localStorage throws", () => {
      // Mock localStorage to throw an error
      const mockGetItem = jest.spyOn(Storage.prototype, "getItem");
      mockGetItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const result = getStorageItem("testKey");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Error getting item from localStorage (testKey):",
        expect.any(Error)
      );

      mockGetItem.mockRestore();
    });
  });

  describe("setStorageItem", () => {
    it("should store item successfully and return true", () => {
      const result = setStorageItem("testKey", "testValue");

      expect(result).toBe(true);
      expect(localStorage.getItem("testKey")).toBe("testValue");
    });

    it("should handle empty string values", () => {
      const result = setStorageItem("emptyKey", "");

      expect(result).toBe(true);
      expect(localStorage.getItem("emptyKey")).toBe("");
    });

    it("should handle special characters and unicode", () => {
      const specialValue = "Café ☕ & Código 💻";
      const result = setStorageItem("specialKey", specialValue);

      expect(result).toBe(true);
      expect(localStorage.getItem("specialKey")).toBe(specialValue);
    });

    it("should overwrite existing values", () => {
      localStorage.setItem("testKey", "oldValue");
      const result = setStorageItem("testKey", "newValue");

      expect(result).toBe(true);
      expect(localStorage.getItem("testKey")).toBe("newValue");
    });

    it("should return false and log error when localStorage throws", () => {
      const mockSetItem = jest.spyOn(Storage.prototype, "setItem");
      mockSetItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const result = setStorageItem("testKey", "testValue");

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Error setting item in localStorage (testKey):",
        expect.any(Error)
      );

      mockSetItem.mockRestore();
    });
  });

  describe("removeStorageItem", () => {
    it("should remove existing item and return true", () => {
      localStorage.setItem("testKey", "testValue");

      const result = removeStorageItem("testKey");

      expect(result).toBe(true);
      expect(localStorage.getItem("testKey")).toBeNull();
    });

    it("should return true even if item does not exist", () => {
      const result = removeStorageItem("nonExistentKey");
      expect(result).toBe(true);
    });

    it("should return false and log error when localStorage throws", () => {
      const mockRemoveItem = jest.spyOn(Storage.prototype, "removeItem");
      mockRemoveItem.mockImplementation(() => {
        throw new Error("Storage access denied");
      });

      const result = removeStorageItem("testKey");

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Error removing item from localStorage (testKey):",
        expect.any(Error)
      );

      mockRemoveItem.mockRestore();
    });
  });

  describe("authStorage", () => {
    describe("getToken", () => {
      it("should return token when it exists", () => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "test-token-123");
        expect(authStorage.getToken()).toBe("test-token-123");
      });

      it("should return null when token does not exist", () => {
        expect(authStorage.getToken()).toBeNull();
      });
    });

    describe("setToken", () => {
      it("should store token successfully", () => {
        const result = authStorage.setToken("new-token-456");

        expect(result).toBe(true);
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(
          "new-token-456"
        );
      });

      it("should handle JWT-like tokens", () => {
        const jwtToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        const result = authStorage.setToken(jwtToken);

        expect(result).toBe(true);
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(jwtToken);
      });
    });

    describe("removeToken", () => {
      it("should remove token successfully", () => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "token-to-remove");

        const result = authStorage.removeToken();

        expect(result).toBe(true);
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
      });
    });

    describe("hasToken", () => {
      it("should return true when token exists", () => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "existing-token");
        expect(authStorage.hasToken()).toBe(true);
      });

      it("should return false when token does not exist", () => {
        expect(authStorage.hasToken()).toBe(false);
      });

      it("should return false when token is null", () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        expect(authStorage.hasToken()).toBe(false);
      });
    });

    describe("integration flow", () => {
      it("should handle complete auth flow", () => {
        // Initially no token
        expect(authStorage.hasToken()).toBe(false);
        expect(authStorage.getToken()).toBeNull();

        // Set token
        const token = "auth-token-12345";
        expect(authStorage.setToken(token)).toBe(true);
        expect(authStorage.hasToken()).toBe(true);
        expect(authStorage.getToken()).toBe(token);

        // Update token
        const newToken = "new-auth-token-67890";
        expect(authStorage.setToken(newToken)).toBe(true);
        expect(authStorage.getToken()).toBe(newToken);

        // Remove token
        expect(authStorage.removeToken()).toBe(true);
        expect(authStorage.hasToken()).toBe(false);
        expect(authStorage.getToken()).toBeNull();
      });
    });

    describe("error handling in authStorage", () => {
      it("should handle errors gracefully", () => {
        const mockGetItem = jest.spyOn(Storage.prototype, "getItem");
        const mockSetItem = jest.spyOn(Storage.prototype, "setItem");
        const mockRemoveItem = jest.spyOn(Storage.prototype, "removeItem");

        // Mock localStorage to throw errors
        mockGetItem.mockImplementation(() => {
          throw new Error("Get error");
        });
        mockSetItem.mockImplementation(() => {
          throw new Error("Set error");
        });
        mockRemoveItem.mockImplementation(() => {
          throw new Error("Remove error");
        });

        expect(authStorage.getToken()).toBeNull();
        expect(authStorage.setToken("token")).toBe(false);
        expect(authStorage.removeToken()).toBe(false);
        expect(authStorage.hasToken()).toBe(false);

        mockGetItem.mockRestore();
        mockSetItem.mockRestore();
        mockRemoveItem.mockRestore();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle very long values", () => {
      const longValue = "A".repeat(10000);
      const result = setStorageItem("longKey", longValue);

      expect(result).toBe(true);
      expect(getStorageItem("longKey")).toBe(longValue);
    });

    it("should handle keys with special characters", () => {
      const specialKey = "key-with.special@chars#and$numbers123";
      const result = setStorageItem(specialKey, "value");

      expect(result).toBe(true);
      expect(getStorageItem(specialKey)).toBe("value");
    });

    it("should handle rapid successive operations", () => {
      for (let i = 0; i < 100; i++) {
        const key = `rapidKey${i}`;
        const value = `rapidValue${i}`;

        expect(setStorageItem(key, value)).toBe(true);
        expect(getStorageItem(key)).toBe(value);
        expect(removeStorageItem(key)).toBe(true);
        expect(getStorageItem(key)).toBeNull();
      }
    });
  });
});
