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
exports.id = "pages/api/postMachine";
exports.ids = ["pages/api/postMachine"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/postMachine.ts":
/*!**************************************!*\
  !*** ./src/pages/api/postMachine.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    try {\n        if (req.method !== \"POST\") {\n            return res.status(405).json({\n                error: \"Method Not Allowed\"\n            });\n        }\n        const { title , type , userId  } = req.body;\n        const newMachine = await prisma.machine.create({\n            data: {\n                title: title,\n                type: type,\n                userId: userId\n            }\n        });\n        return res.status(200).json(newMachine);\n    } catch (error) {\n        return res.status(500).json({\n            error\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3Bvc3RNYWNoaW5lLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM4QztBQUM5QyxNQUFNQyxTQUFTLElBQUlELHdEQUFZQTtBQUVoQixlQUFlRSxRQUM1QkMsR0FBbUIsRUFDbkJDLEdBQW9CO0lBRXBCLElBQUk7UUFDRixJQUFJRCxJQUFJRSxXQUFXLFFBQVE7WUFDekIsT0FBT0QsSUFBSUUsT0FBTyxLQUFLQyxLQUFLO2dCQUFFQyxPQUFPO1lBQXFCO1FBQzVEO1FBQ0EsTUFBTSxFQUFFQyxNQUFLLEVBQUVDLEtBQUksRUFBRUMsT0FBTSxFQUFFLEdBQUdSLElBQUlTO1FBRXBDLE1BQU1DLGFBQWEsTUFBTVosT0FBT2EsUUFBUUMsT0FBTztZQUM3Q0MsTUFBTTtnQkFDSlAsT0FBT0E7Z0JBQ1BDLE1BQU1BO2dCQUNOQyxRQUFRQTtZQUNWO1FBQ0Y7UUFFQSxPQUFPUCxJQUFJRSxPQUFPLEtBQUtDLEtBQUtNO0lBQzlCLEVBQUUsT0FBT0wsT0FBTztRQUNkLE9BQU9KLElBQUlFLE9BQU8sS0FBS0MsS0FBSztZQUFFQztRQUFNO0lBQ3RDO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWNoaW5lLW1ha2VyLy4vc3JjL3BhZ2VzL2FwaS9wb3N0TWFjaGluZS50cz81YTgwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gXCJuZXh0XCI7XG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICB0cnkge1xuICAgIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgZXJyb3I6IFwiTWV0aG9kIE5vdCBBbGxvd2VkXCIgfSk7XG4gICAgfVxuICAgIGNvbnN0IHsgdGl0bGUsIHR5cGUsIHVzZXJJZCB9ID0gcmVxLmJvZHk7XG5cbiAgICBjb25zdCBuZXdNYWNoaW5lID0gYXdhaXQgcHJpc21hLm1hY2hpbmUuY3JlYXRlKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24obmV3TWFjaGluZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3IgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwidGl0bGUiLCJ0eXBlIiwidXNlcklkIiwiYm9keSIsIm5ld01hY2hpbmUiLCJtYWNoaW5lIiwiY3JlYXRlIiwiZGF0YSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/postMachine.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/postMachine.ts"));
module.exports = __webpack_exports__;

})();