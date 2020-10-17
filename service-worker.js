importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/3.9.5/typescript.js');



/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 924:
/***/ ((module) => {

module.exports = {extends:'./node_modules/gts/tsconfig-google.json',compilerOptions:{lib:['dom','es2016'],module:'esnext',noEmit:true,allowJs:false,strict:true,noFallthroughCasesInSwitch:true,noImplicitReturns:true,noUnusedLocals:true,moduleResolution:'node',esModuleInterop:false},include:['src/**/*.ts']}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
"use strict";

// CONCATENATED MODULE: external "ts"
const external_ts_namespaceObject = ts;
// CONCATENATED MODULE: ./index.ts
/// <reference no-default-lib="true" />
/// <reference lib="webworker" />

self.addEventListener('install', () => {
    console.debug('Service worker installing');
    return self.skipWaiting();
});
self.addEventListener('activate', () => {
    console.debug('Service worker activated');
    return self.clients.claim();
});
const tsconfig = __webpack_require__(924);
const sourceFileRegex = new RegExp(/(\/src(\/[^\/.]+)+.*?)\.(js|ts)/gm);
self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        console.debug(event.request.url);
        const url = new URL(event.request.url);
        const m = (new RegExp(sourceFileRegex.source, sourceFileRegex.flags)).exec(url.pathname);
        if (m) {
            url.pathname = m[1] + '.ts';
            const filePath = url.toString();
            const request = new Request(filePath, event.request);
            console.debug(' => compiling', request.url);
            const response = await fetch(request);
            const file = await response.text();
            const asModuleKind = (kind) => {
                switch (kind === null || kind === void 0 ? void 0 : kind.toLowerCase()) {
                    case 'commonjs':
                        return external_ts_namespaceObject.ModuleKind.CommonJS;
                    case 'amd':
                        return external_ts_namespaceObject.ModuleKind.AMD;
                    case 'umd':
                        return external_ts_namespaceObject.ModuleKind.UMD;
                    case 'system':
                        return external_ts_namespaceObject.ModuleKind.System;
                    case 'es2015':
                        return external_ts_namespaceObject.ModuleKind.ES2015;
                    case 'es2020':
                        return external_ts_namespaceObject.ModuleKind.ES2020;
                    case 'esnext':
                        return external_ts_namespaceObject.ModuleKind.ESNext;
                    default:
                        return undefined;
                }
            };
            const asScriptTarget = (target) => {
                switch (target === null || target === void 0 ? void 0 : target.toLowerCase()) {
                    case 'es3':
                        return external_ts_namespaceObject.ScriptTarget.ES3;
                    case 'es5':
                        return external_ts_namespaceObject.ScriptTarget.ES5;
                    case 'es2015':
                        return external_ts_namespaceObject.ScriptTarget.ES2015;
                    case 'es2016':
                        return external_ts_namespaceObject.ScriptTarget.ES2016;
                    case 'es2017':
                        return external_ts_namespaceObject.ScriptTarget.ES2017;
                    case 'es2018':
                        return external_ts_namespaceObject.ScriptTarget.ES2018;
                    case 'es2019':
                        return external_ts_namespaceObject.ScriptTarget.ES2019;
                    case 'es2020':
                        return external_ts_namespaceObject.ScriptTarget.ES2020;
                    case 'esnext':
                        return external_ts_namespaceObject.ScriptTarget.ESNext;
                    case 'json':
                        return external_ts_namespaceObject.ScriptTarget.JSON;
                    case 'latest':
                        return external_ts_namespaceObject.ScriptTarget.Latest;
                    default:
                        return undefined;
                }
            };
            const asModuleResolutionKind = (kind) => {
                switch (kind === null || kind === void 0 ? void 0 : kind.toLowerCase()) {
                    case 'classic':
                        return external_ts_namespaceObject.ModuleResolutionKind.Classic;
                    case 'nodejs':
                        return external_ts_namespaceObject.ModuleResolutionKind.NodeJs;
                    default:
                        return undefined;
                }
            };
            const compilerOptions = { ...tsconfig['compilerOptions'] };
            compilerOptions.module = asModuleKind(tsconfig['compilerOptions']['module']);
            compilerOptions.target = asScriptTarget(tsconfig['compilerOptions']['target'] || 'latest');
            compilerOptions.moduleResolution = asModuleResolutionKind(tsconfig['compilerOptions']['moduleResolution']);
            // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
            const output = external_ts_namespaceObject.transpile(file, compilerOptions);
            return new Response(output, {
                headers: {
                    'content-type': 'application/javascript',
                },
            });
        }
        else {
            console.debug(' => ', '(not matched)', m);
        }
        return fetch(event.request);
    })());
});

})();

/******/ })()
;