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
exports.id = "pages/api/getMonitoringPoints/[id]";
exports.ids = ["pages/api/getMonitoringPoints/[id]"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/getMonitoringPoints/[id].ts":
/*!***************************************************!*\
  !*** ./src/pages/api/getMonitoringPoints/[id].ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { id  } = req.query;\n        const data = await prisma.monitoringPoint.findMany({\n            where: {\n                userId: Number(id)\n            }\n        });\n        return res.status(200).json(data);\n    } catch (error) {\n        return res.status(500).json(error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2dldE1vbml0b3JpbmdQb2ludHMvW2lkXS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDOEM7QUFDOUMsTUFBTUMsU0FBUyxJQUFJRCx3REFBWUE7QUFFaEIsZUFBZUUsUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUFvQjtJQUVwQixJQUFJO1FBQ0YsTUFBTSxFQUFFQyxHQUFFLEVBQUUsR0FBR0YsSUFBSUc7UUFDbkIsTUFBTUMsT0FBTyxNQUFNTixPQUFPTyxnQkFBZ0JDLFNBQVM7WUFDakRDLE9BQU87Z0JBQ0xDLFFBQVFDLE9BQU9QO1lBQ2pCO1FBQ0Y7UUFDQSxPQUFPRCxJQUFJUyxPQUFPLEtBQUtDLEtBQUtQO0lBQzlCLEVBQUUsT0FBT1EsT0FBTztRQUNkLE9BQU9YLElBQUlTLE9BQU8sS0FBS0MsS0FBS0M7SUFDOUI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL21hY2hpbmUtbWFrZXIvLi9zcmMvcGFnZXMvYXBpL2dldE1vbml0b3JpbmdQb2ludHMvW2lkXS50cz81OGQ0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gXCJuZXh0XCI7XG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcHJpc21hLm1vbml0b3JpbmdQb2ludC5maW5kTWFueSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICB1c2VySWQ6IE51bWJlcihpZCksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbihkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oZXJyb3IpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImlkIiwicXVlcnkiLCJkYXRhIiwibW9uaXRvcmluZ1BvaW50IiwiZmluZE1hbnkiLCJ3aGVyZSIsInVzZXJJZCIsIk51bWJlciIsInN0YXR1cyIsImpzb24iLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/getMonitoringPoints/[id].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/getMonitoringPoints/[id].ts"));
module.exports = __webpack_exports__;

})();