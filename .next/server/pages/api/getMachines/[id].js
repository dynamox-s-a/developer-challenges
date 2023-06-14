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
exports.id = "pages/api/getMachines/[id]";
exports.ids = ["pages/api/getMachines/[id]"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/getMachines/[id].ts":
/*!*******************************************!*\
  !*** ./src/pages/api/getMachines/[id].ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { id  } = req.query;\n        const data = await prisma.machine.findMany({\n            where: {\n                userId: Number(id)\n            }\n        });\n        if (data.length === 0) {\n            return res.status(404).json({\n                error: \"No machines found.\"\n            });\n        }\n        return res.status(200).json(data);\n    } catch (error) {\n        return res.status(500).json({\n            error: \"Internal server error.\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2dldE1hY2hpbmVzL1tpZF0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzhDO0FBQzlDLE1BQU1DLFNBQVMsSUFBSUQsd0RBQVlBO0FBRWhCLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0I7SUFFcEIsSUFBSTtRQUNGLE1BQU0sRUFBRUMsR0FBRSxFQUFFLEdBQUdGLElBQUlHO1FBQ25CLE1BQU1DLE9BQU8sTUFBTU4sT0FBT08sUUFBUUMsU0FBUztZQUN6Q0MsT0FBTztnQkFDTEMsUUFBUUMsT0FBT1A7WUFDakI7UUFDRjtRQUVBLElBQUlFLEtBQUtNLFdBQVcsR0FBRztZQUNyQixPQUFPVCxJQUFJVSxPQUFPLEtBQUtDLEtBQUs7Z0JBQUVDLE9BQU87WUFBcUI7UUFDNUQ7UUFFQSxPQUFPWixJQUFJVSxPQUFPLEtBQUtDLEtBQUtSO0lBQzlCLEVBQUUsT0FBT1MsT0FBTztRQUNkLE9BQU9aLElBQUlVLE9BQU8sS0FBS0MsS0FBSztZQUFFQyxPQUFPO1FBQXlCO0lBQ2hFO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWNoaW5lLW1ha2VyLy4vc3JjL3BhZ2VzL2FwaS9nZXRNYWNoaW5lcy9baWRdLnRzPzlhOGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKFxuICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICByZXM6IE5leHRBcGlSZXNwb25zZVxuKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpZCB9ID0gcmVxLnF1ZXJ5O1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBwcmlzbWEubWFjaGluZS5maW5kTWFueSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICB1c2VySWQ6IE51bWJlcihpZCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJObyBtYWNoaW5lcyBmb3VuZC5cIiB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiSW50ZXJuYWwgc2VydmVyIGVycm9yLlwiIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImlkIiwicXVlcnkiLCJkYXRhIiwibWFjaGluZSIsImZpbmRNYW55Iiwid2hlcmUiLCJ1c2VySWQiLCJOdW1iZXIiLCJsZW5ndGgiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/getMachines/[id].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/getMachines/[id].ts"));
module.exports = __webpack_exports__;

})();