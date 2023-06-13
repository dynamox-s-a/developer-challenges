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
exports.id = "pages/api/editMachine/[id]";
exports.ids = ["pages/api/editMachine/[id]"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/editMachine/[id].ts":
/*!*******************************************!*\
  !*** ./src/pages/api/editMachine/[id].ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        const { id  } = req.query;\n        const { title , type  } = req.body;\n        const parsedId = parseInt(id);\n        const edited = await prisma.machine.update({\n            where: {\n                id: parsedId\n            },\n            data: {\n                title: title,\n                type: type\n            }\n        });\n        return res.status(200).json(edited);\n    } catch (error) {\n        console.error(`An error occurred while trying to edit machine ${error}`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2VkaXRNYWNoaW5lL1tpZF0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzhDO0FBQzlDLE1BQU1DLFNBQVMsSUFBSUQsd0RBQVlBO0FBRWhCLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0I7SUFFcEIsSUFBSTtRQUNGLE1BQU0sRUFBRUMsR0FBRSxFQUFFLEdBQUdGLElBQUlHO1FBQ25CLE1BQU0sRUFBRUMsTUFBSyxFQUFFQyxLQUFJLEVBQUUsR0FBR0wsSUFBSU07UUFDNUIsTUFBTUMsV0FBV0MsU0FBU047UUFDMUIsTUFBTU8sU0FBUyxNQUFNWCxPQUFPWSxRQUFRQyxPQUFPO1lBQ3pDQyxPQUFPO2dCQUNMVixJQUFJSztZQUNOO1lBQ0FNLE1BQU07Z0JBQ0pULE9BQU9BO2dCQUNQQyxNQUFNQTtZQUNSO1FBQ0Y7UUFDQSxPQUFPSixJQUFJYSxPQUFPLEtBQUtDLEtBQUtOO0lBQzlCLEVBQUUsT0FBT08sT0FBTztRQUNkQyxRQUFRRCxNQUFNLENBQUMsK0NBQStDLEVBQUVBLE1BQU0sQ0FBQztJQUN6RTtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFjaGluZS1tYWtlci8uL3NyYy9wYWdlcy9hcGkvZWRpdE1hY2hpbmUvW2lkXS50cz81M2I1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gXCJuZXh0XCI7XG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcbiAgICBjb25zdCB7IHRpdGxlLCB0eXBlIH0gPSByZXEuYm9keTtcbiAgICBjb25zdCBwYXJzZWRJZCA9IHBhcnNlSW50KGlkIGFzIHN0cmluZyk7XG4gICAgY29uc3QgZWRpdGVkID0gYXdhaXQgcHJpc21hLm1hY2hpbmUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiBwYXJzZWRJZCxcbiAgICAgIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKGVkaXRlZCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgdHJ5aW5nIHRvIGVkaXQgbWFjaGluZSAke2Vycm9yfWApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImlkIiwicXVlcnkiLCJ0aXRsZSIsInR5cGUiLCJib2R5IiwicGFyc2VkSWQiLCJwYXJzZUludCIsImVkaXRlZCIsIm1hY2hpbmUiLCJ1cGRhdGUiLCJ3aGVyZSIsImRhdGEiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/editMachine/[id].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/editMachine/[id].ts"));
module.exports = __webpack_exports__;

})();