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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { id  } = req.query;\n        const data = await prisma.machine.findMany({\n            where: {\n                userId: Number(id)\n            }\n        });\n        return res.status(200).json(data);\n    } catch (error) {\n        return res.status(500).json(error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2dldE1hY2hpbmVzL1tpZF0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzhDO0FBQzlDLE1BQU1DLFNBQVMsSUFBSUQsd0RBQVlBO0FBRWhCLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0I7SUFFcEIsSUFBSTtRQUNGLE1BQU0sRUFBRUMsR0FBRSxFQUFFLEdBQUdGLElBQUlHO1FBQ25CLE1BQU1DLE9BQU8sTUFBTU4sT0FBT08sUUFBUUMsU0FBUztZQUN6Q0MsT0FBTztnQkFDTEMsUUFBUUMsT0FBT1A7WUFDakI7UUFDRjtRQUNBLE9BQU9ELElBQUlTLE9BQU8sS0FBS0MsS0FBS1A7SUFDOUIsRUFBRSxPQUFPUSxPQUFPO1FBQ2QsT0FBT1gsSUFBSVMsT0FBTyxLQUFLQyxLQUFLQztJQUM5QjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFjaGluZS1tYWtlci8uL3NyYy9wYWdlcy9hcGkvZ2V0TWFjaGluZXMvW2lkXS50cz85YThmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gXCJuZXh0XCI7XG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcHJpc21hLm1hY2hpbmUuZmluZE1hbnkoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgdXNlcklkOiBOdW1iZXIoaWQpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKGVycm9yKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsInByaXNtYSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJpZCIsInF1ZXJ5IiwiZGF0YSIsIm1hY2hpbmUiLCJmaW5kTWFueSIsIndoZXJlIiwidXNlcklkIiwiTnVtYmVyIiwic3RhdHVzIiwianNvbiIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/getMachines/[id].ts\n");

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