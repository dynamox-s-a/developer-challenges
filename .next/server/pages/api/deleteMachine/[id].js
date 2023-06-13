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
exports.id = "pages/api/deleteMachine/[id]";
exports.ids = ["pages/api/deleteMachine/[id]"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/deleteMachine/[id].ts":
/*!*********************************************!*\
  !*** ./src/pages/api/deleteMachine/[id].ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { id  } = req.query;\n        const parsedId = parseInt(id);\n        const deleted = await prisma.machine.delete({\n            where: {\n                id: parsedId\n            }\n        });\n        return res.status(200).json(deleted);\n    } catch (error) {\n        console.error(`An error occurred while trying to delete person ${error}`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2RlbGV0ZU1hY2hpbmUvW2lkXS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDOEM7QUFDOUMsTUFBTUMsU0FBUyxJQUFJRCx3REFBWUE7QUFFaEIsZUFBZUUsUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUFvQjtJQUVwQixJQUFJO1FBQ0YsTUFBTSxFQUFFQyxHQUFFLEVBQUUsR0FBR0YsSUFBSUc7UUFDbkIsTUFBTUMsV0FBV0MsU0FBU0g7UUFDMUIsTUFBTUksVUFBVSxNQUFNUixPQUFPUyxRQUFRQyxPQUFPO1lBQzFDQyxPQUFPO2dCQUNMUCxJQUFJRTtZQUNOO1FBQ0Y7UUFDQSxPQUFPSCxJQUFJUyxPQUFPLEtBQUtDLEtBQUtMO0lBQzlCLEVBQUUsT0FBT00sT0FBTztRQUNkQyxRQUFRRCxNQUFNLENBQUMsZ0RBQWdELEVBQUVBLE1BQU0sQ0FBQztJQUMxRTtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFjaGluZS1tYWtlci8uL3NyYy9wYWdlcy9hcGkvZGVsZXRlTWFjaGluZS9baWRdLnRzPzExNTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKFxuICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICByZXM6IE5leHRBcGlSZXNwb25zZVxuKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpZCB9ID0gcmVxLnF1ZXJ5O1xuICAgIGNvbnN0IHBhcnNlZElkID0gcGFyc2VJbnQoaWQgYXMgc3RyaW5nKTtcbiAgICBjb25zdCBkZWxldGVkID0gYXdhaXQgcHJpc21hLm1hY2hpbmUuZGVsZXRlKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiBwYXJzZWRJZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKGRlbGV0ZWQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHRyeWluZyB0byBkZWxldGUgcGVyc29uICR7ZXJyb3J9YCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiaWQiLCJxdWVyeSIsInBhcnNlZElkIiwicGFyc2VJbnQiLCJkZWxldGVkIiwibWFjaGluZSIsImRlbGV0ZSIsIndoZXJlIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/deleteMachine/[id].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/deleteMachine/[id].ts"));
module.exports = __webpack_exports__;

})();