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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { id  } = req.query;\n        const parsedId = parseInt(id);\n        const deletedMonitoringPoints = await prisma.monitoringPoint.deleteMany({\n            where: {\n                machineId: parsedId\n            }\n        });\n        const deleted = await prisma.machine.delete({\n            where: {\n                id: parsedId\n            }\n        });\n        return res.status(200).json(deleted);\n    } catch (error) {\n        console.error(`An error occurred while trying to delete the machine: ${error}`);\n        return res.status(500).json({\n            error: \"Internal server error\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2RlbGV0ZU1hY2hpbmUvW2lkXS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDOEM7QUFFOUMsTUFBTUMsU0FBUyxJQUFJRCx3REFBWUE7QUFFaEIsZUFBZUUsUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUFvQjtJQUVwQixJQUFJO1FBQ0YsTUFBTSxFQUFFQyxHQUFFLEVBQUUsR0FBR0YsSUFBSUc7UUFDbkIsTUFBTUMsV0FBV0MsU0FBU0g7UUFFMUIsTUFBTUksMEJBQTBCLE1BQU1SLE9BQU9TLGdCQUFnQkMsV0FBVztZQUN0RUMsT0FBTztnQkFDTEMsV0FBV047WUFDYjtRQUNGO1FBRUEsTUFBTU8sVUFBVSxNQUFNYixPQUFPYyxRQUFRQyxPQUFPO1lBQzFDSixPQUFPO2dCQUNMUCxJQUFJRTtZQUNOO1FBQ0Y7UUFFQSxPQUFPSCxJQUFJYSxPQUFPLEtBQUtDLEtBQUtKO0lBQzlCLEVBQUUsT0FBT0ssT0FBTztRQUNkQyxRQUFRRCxNQUNOLENBQUMsc0RBQXNELEVBQUVBLE1BQU0sQ0FBQztRQUVsRSxPQUFPZixJQUFJYSxPQUFPLEtBQUtDLEtBQUs7WUFBRUMsT0FBTztRQUF3QjtJQUMvRDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFjaGluZS1tYWtlci8uL3NyYy9wYWdlcy9hcGkvZGVsZXRlTWFjaGluZS9baWRdLnRzPzExNTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoXG4gIHJlcTogTmV4dEFwaVJlcXVlc3QsXG4gIHJlczogTmV4dEFwaVJlc3BvbnNlXG4pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGlkIH0gPSByZXEucXVlcnk7XG4gICAgY29uc3QgcGFyc2VkSWQgPSBwYXJzZUludChpZCBhcyBzdHJpbmcpO1xuXG4gICAgY29uc3QgZGVsZXRlZE1vbml0b3JpbmdQb2ludHMgPSBhd2FpdCBwcmlzbWEubW9uaXRvcmluZ1BvaW50LmRlbGV0ZU1hbnkoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgbWFjaGluZUlkOiBwYXJzZWRJZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWxldGVkID0gYXdhaXQgcHJpc21hLm1hY2hpbmUuZGVsZXRlKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiBwYXJzZWRJZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oZGVsZXRlZCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcbiAgICAgIGBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSB0cnlpbmcgdG8gZGVsZXRlIHRoZSBtYWNoaW5lOiAke2Vycm9yfWBcbiAgICApO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkludGVybmFsIHNlcnZlciBlcnJvclwiIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImlkIiwicXVlcnkiLCJwYXJzZWRJZCIsInBhcnNlSW50IiwiZGVsZXRlZE1vbml0b3JpbmdQb2ludHMiLCJtb25pdG9yaW5nUG9pbnQiLCJkZWxldGVNYW55Iiwid2hlcmUiLCJtYWNoaW5lSWQiLCJkZWxldGVkIiwibWFjaGluZSIsImRlbGV0ZSIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/deleteMachine/[id].ts\n");

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