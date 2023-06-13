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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        if (req.method !== \"POST\") {\n            return res.status(405).json({\n                error: \"Method Not Allowed\"\n            });\n        }\n        const { title , sensor , machineId , machineTitle , machineType  } = req.body;\n        const newMonitoringPoint = await prisma.monitoringPoint.create({\n            data: {\n                title: title,\n                sensor: sensor,\n                userId: 1,\n                machineId: machineId,\n                machineTitle: machineTitle,\n                machineType: machineType\n            }\n        });\n        return res.status(200).json(newMonitoringPoint);\n    } catch (error) {\n        return res.status(500).json({\n            error\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3Bvc3RNb25pdG9yaW5nUG9pbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzhDO0FBQzlDLE1BQU1DLFNBQVMsSUFBSUQsd0RBQVlBO0FBRWhCLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0I7SUFFcEIsSUFBSTtRQUNGLElBQUlELElBQUlFLFdBQVcsUUFBUTtZQUN6QixPQUFPRCxJQUFJRSxPQUFPLEtBQUtDLEtBQUs7Z0JBQUVDLE9BQU87WUFBcUI7UUFDNUQ7UUFDQSxNQUFNLEVBQUVDLE1BQUssRUFBRUMsT0FBTSxFQUFFQyxVQUFTLEVBQUVDLGFBQVksRUFBRUMsWUFBVyxFQUFFLEdBQUdWLElBQUlXO1FBRXBFLE1BQU1DLHFCQUFxQixNQUFNZCxPQUFPZSxnQkFBZ0JDLE9BQU87WUFDN0RDLE1BQU07Z0JBQ0pULE9BQU9BO2dCQUNQQyxRQUFRQTtnQkFDUlMsUUFBUTtnQkFDUlIsV0FBV0E7Z0JBQ1hDLGNBQWNBO2dCQUNkQyxhQUFhQTtZQUNmO1FBQ0Y7UUFFQSxPQUFPVCxJQUFJRSxPQUFPLEtBQUtDLEtBQUtRO0lBQzlCLEVBQUUsT0FBT1AsT0FBTztRQUNkLE9BQU9KLElBQUlFLE9BQU8sS0FBS0MsS0FBSztZQUFFQztRQUFNO0lBQ3RDO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWNoaW5lLW1ha2VyLy4vc3JjL3BhZ2VzL2FwaS9wb3N0TW9uaXRvcmluZ1BvaW50LnRzP2ViNTgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKFxuICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICByZXM6IE5leHRBcGlSZXNwb25zZVxuKSB7XG4gIHRyeSB7XG4gICAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmpzb24oeyBlcnJvcjogXCJNZXRob2QgTm90IEFsbG93ZWRcIiB9KTtcbiAgICB9XG4gICAgY29uc3QgeyB0aXRsZSwgc2Vuc29yLCBtYWNoaW5lSWQsIG1hY2hpbmVUaXRsZSwgbWFjaGluZVR5cGUgfSA9IHJlcS5ib2R5O1xuXG4gICAgY29uc3QgbmV3TW9uaXRvcmluZ1BvaW50ID0gYXdhaXQgcHJpc21hLm1vbml0b3JpbmdQb2ludC5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIHNlbnNvcjogc2Vuc29yLFxuICAgICAgICB1c2VySWQ6IDEsXG4gICAgICAgIG1hY2hpbmVJZDogbWFjaGluZUlkLFxuICAgICAgICBtYWNoaW5lVGl0bGU6IG1hY2hpbmVUaXRsZSxcbiAgICAgICAgbWFjaGluZVR5cGU6IG1hY2hpbmVUeXBlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbihuZXdNb25pdG9yaW5nUG9pbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsInRpdGxlIiwic2Vuc29yIiwibWFjaGluZUlkIiwibWFjaGluZVRpdGxlIiwibWFjaGluZVR5cGUiLCJib2R5IiwibmV3TW9uaXRvcmluZ1BvaW50IiwibW9uaXRvcmluZ1BvaW50IiwiY3JlYXRlIiwiZGF0YSIsInVzZXJJZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/postMonitoringPoint.ts\n");

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