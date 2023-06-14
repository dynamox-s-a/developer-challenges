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
exports.id = "pages/api/postMonitoringPoint";
exports.ids = ["pages/api/postMonitoringPoint"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/postMonitoringPoint.ts":
/*!**********************************************!*\
  !*** ./src/pages/api/postMonitoringPoint.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        if (req.method !== \"POST\") {\n            return res.status(405).json({\n                error: \"Method Not Allowed\"\n            });\n        }\n        const { title , sensor , machineId , machineTitle , machineType , userId  } = req.body;\n        const newMonitoringPoint = await prisma.monitoringPoint.create({\n            data: {\n                title: title,\n                sensor: sensor,\n                userId: userId,\n                machineId: machineId,\n                machineTitle: machineTitle,\n                machineType: machineType\n            }\n        });\n        return res.status(200).json(newMonitoringPoint);\n    } catch (error) {\n        return res.status(500).json({\n            error\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3Bvc3RNb25pdG9yaW5nUG9pbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzhDO0FBQzlDLE1BQU1DLFNBQVMsSUFBSUQsd0RBQVlBO0FBRWhCLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0I7SUFFcEIsSUFBSTtRQUNGLElBQUlELElBQUlFLFdBQVcsUUFBUTtZQUN6QixPQUFPRCxJQUFJRSxPQUFPLEtBQUtDLEtBQUs7Z0JBQUVDLE9BQU87WUFBcUI7UUFDNUQ7UUFDQSxNQUFNLEVBQUVDLE1BQUssRUFBRUMsT0FBTSxFQUFFQyxVQUFTLEVBQUVDLGFBQVksRUFBRUMsWUFBVyxFQUFFQyxPQUFNLEVBQUUsR0FDbkVYLElBQUlZO1FBRU4sTUFBTUMscUJBQXFCLE1BQU1mLE9BQU9nQixnQkFBZ0JDLE9BQU87WUFDN0RDLE1BQU07Z0JBQ0pWLE9BQU9BO2dCQUNQQyxRQUFRQTtnQkFDUkksUUFBUUE7Z0JBQ1JILFdBQVdBO2dCQUNYQyxjQUFjQTtnQkFDZEMsYUFBYUE7WUFDZjtRQUNGO1FBRUEsT0FBT1QsSUFBSUUsT0FBTyxLQUFLQyxLQUFLUztJQUM5QixFQUFFLE9BQU9SLE9BQU87UUFDZCxPQUFPSixJQUFJRSxPQUFPLEtBQUtDLEtBQUs7WUFBRUM7UUFBTTtJQUN0QztBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFjaGluZS1tYWtlci8uL3NyYy9wYWdlcy9hcGkvcG9zdE1vbml0b3JpbmdQb2ludC50cz9lYjU4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gXCJuZXh0XCI7XG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgZXJyb3I6IFwiTWV0aG9kIE5vdCBBbGxvd2VkXCIgfSk7XG4gICAgfVxuICAgIGNvbnN0IHsgdGl0bGUsIHNlbnNvciwgbWFjaGluZUlkLCBtYWNoaW5lVGl0bGUsIG1hY2hpbmVUeXBlLCB1c2VySWQgfSA9XG4gICAgICByZXEuYm9keTtcblxuICAgIGNvbnN0IG5ld01vbml0b3JpbmdQb2ludCA9IGF3YWl0IHByaXNtYS5tb25pdG9yaW5nUG9pbnQuY3JlYXRlKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICBzZW5zb3I6IHNlbnNvcixcbiAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgIG1hY2hpbmVJZDogbWFjaGluZUlkLFxuICAgICAgICBtYWNoaW5lVGl0bGU6IG1hY2hpbmVUaXRsZSxcbiAgICAgICAgbWFjaGluZVR5cGU6IG1hY2hpbmVUeXBlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbihuZXdNb25pdG9yaW5nUG9pbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsInRpdGxlIiwic2Vuc29yIiwibWFjaGluZUlkIiwibWFjaGluZVRpdGxlIiwibWFjaGluZVR5cGUiLCJ1c2VySWQiLCJib2R5IiwibmV3TW9uaXRvcmluZ1BvaW50IiwibW9uaXRvcmluZ1BvaW50IiwiY3JlYXRlIiwiZGF0YSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/postMonitoringPoint.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/postMonitoringPoint.ts"));
module.exports = __webpack_exports__;

})();