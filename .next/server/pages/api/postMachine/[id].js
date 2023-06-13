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
exports.id = "pages/api/postMachine/[id]";
exports.ids = ["pages/api/postMachine/[id]"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/postMachine/[id].ts":
/*!*******************************************!*\
  !*** ./src/pages/api/postMachine/[id].ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        if (req.method !== \"POST\") {\n            return res.status(405).json({\n                error: \"Method Not Allowed\"\n            });\n        }\n        const { title , type  } = req.body;\n        const newMachine = await prisma.machine.create({\n            data: {\n                title: title,\n                type: type,\n                userId: 1\n            }\n        });\n        return res.status(200).json(newMachine);\n    } catch (error) {\n        return res.status(500).json({\n            error\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3Bvc3RNYWNoaW5lL1tpZF0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzhDO0FBQzlDLE1BQU1DLFNBQVMsSUFBSUQsd0RBQVlBO0FBRWhCLGVBQWVFLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBb0I7SUFFcEIsSUFBSTtRQUNGLElBQUlELElBQUlFLFdBQVcsUUFBUTtZQUN6QixPQUFPRCxJQUFJRSxPQUFPLEtBQUtDLEtBQUs7Z0JBQUVDLE9BQU87WUFBcUI7UUFDNUQ7UUFDQSxNQUFNLEVBQUVDLE1BQUssRUFBRUMsS0FBSSxFQUFFLEdBQUdQLElBQUlRO1FBRTVCLE1BQU1DLGFBQWEsTUFBTVgsT0FBT1ksUUFBUUMsT0FBTztZQUM3Q0MsTUFBTTtnQkFDSk4sT0FBT0E7Z0JBQ1BDLE1BQU1BO2dCQUNOTSxRQUFRO1lBQ1Y7UUFDRjtRQUVBLE9BQU9aLElBQUlFLE9BQU8sS0FBS0MsS0FBS0s7SUFDOUIsRUFBRSxPQUFPSixPQUFPO1FBQ2QsT0FBT0osSUFBSUUsT0FBTyxLQUFLQyxLQUFLO1lBQUVDO1FBQU07SUFDdEM7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL21hY2hpbmUtbWFrZXIvLi9zcmMvcGFnZXMvYXBpL3Bvc3RNYWNoaW5lL1tpZF0udHM/OTNiNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tIFwibmV4dFwiO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoXG4gIHJlcTogTmV4dEFwaVJlcXVlc3QsXG4gIHJlczogTmV4dEFwaVJlc3BvbnNlXG4pIHtcbiAgdHJ5IHtcbiAgICBpZiAocmVxLm1ldGhvZCAhPT0gXCJQT1NUXCIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7IGVycm9yOiBcIk1ldGhvZCBOb3QgQWxsb3dlZFwiIH0pO1xuICAgIH1cbiAgICBjb25zdCB7IHRpdGxlLCB0eXBlIH0gPSByZXEuYm9keTtcblxuICAgIGNvbnN0IG5ld01hY2hpbmUgPSBhd2FpdCBwcmlzbWEubWFjaGluZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIHVzZXJJZDogMSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24obmV3TWFjaGluZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3IgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwidGl0bGUiLCJ0eXBlIiwiYm9keSIsIm5ld01hY2hpbmUiLCJtYWNoaW5lIiwiY3JlYXRlIiwiZGF0YSIsInVzZXJJZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/postMachine/[id].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/postMachine/[id].ts"));
module.exports = __webpack_exports__;

})();