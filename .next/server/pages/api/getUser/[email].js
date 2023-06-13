"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/getUser/[email]";
exports.ids = ["pages/api/getUser/[email]"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/getUser/[email].ts":
/*!******************************************!*\
  !*** ./src/pages/api/getUser/[email].ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { email  } = req.query;\n        const user = await prisma.user.findFirst({\n            where: {\n                email: String(email)\n            }\n        });\n        if (!user) {\n            return res.status(404).json({\n                error: \"User not found\"\n            });\n        }\n        return res.status(200).json(user);\n    } catch (error) {\n        return res.status(500).json(error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2dldFVzZXIvW2VtYWlsXS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDOEM7QUFDOUMsTUFBTUMsU0FBUyxJQUFJRCx3REFBWUE7QUFFaEIsZUFBZUUsUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUFvQjtJQUVwQixJQUFJO1FBQ0YsTUFBTSxFQUFFQyxNQUFLLEVBQUUsR0FBR0YsSUFBSUc7UUFDdEIsTUFBTUMsT0FBTyxNQUFNTixPQUFPTSxLQUFLQyxVQUFVO1lBQ3ZDQyxPQUFPO2dCQUFFSixPQUFPSyxPQUFPTDtZQUFPO1FBQ2hDO1FBRUEsSUFBSSxDQUFDRSxNQUFNO1lBQ1QsT0FBT0gsSUFBSU8sT0FBTyxLQUFLQyxLQUFLO2dCQUFFQyxPQUFPO1lBQWlCO1FBQ3hEO1FBRUEsT0FBT1QsSUFBSU8sT0FBTyxLQUFLQyxLQUFLTDtJQUM5QixFQUFFLE9BQU9NLE9BQU87UUFDZCxPQUFPVCxJQUFJTyxPQUFPLEtBQUtDLEtBQUtDO0lBQzlCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWNoaW5lLW1ha2VyLy4vc3JjL3BhZ2VzL2FwaS9nZXRVc2VyL1tlbWFpbF0udHM/N2MxNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tIFwibmV4dFwiO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoXG4gIHJlcTogTmV4dEFwaVJlcXVlc3QsXG4gIHJlczogTmV4dEFwaVJlc3BvbnNlXG4pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsIH0gPSByZXEucXVlcnk7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZTogeyBlbWFpbDogU3RyaW5nKGVtYWlsKSB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJVc2VyIG5vdCBmb3VuZFwiIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih1c2VyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oZXJyb3IpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImVtYWlsIiwicXVlcnkiLCJ1c2VyIiwiZmluZEZpcnN0Iiwid2hlcmUiLCJTdHJpbmciLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/getUser/[email].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/getUser/[email].ts"));
module.exports = __webpack_exports__;

})();