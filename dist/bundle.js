/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/audio/index.js":
/*!****************************!*\
  !*** ./src/audio/index.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/*\n  Making sounds with: https://xem.github.io/miniMusic/simple.html\n*/\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  play(data, tempo = 0.1) {\n    const audioCtx = new AudioContext()\n    const gainNode = audioCtx.createGain()\n    for (let i in data) {\n      const oscillator = audioCtx.createOscillator()\n      if (data[i]) {\n        oscillator.connect(gainNode)\n        gainNode.connect(audioCtx.destination)\n        oscillator.start(i * tempo)\n        oscillator.frequency.setValueAtTime(440 * 1.06 ** (13 - data[i]), i * tempo)\n        oscillator.type='triangle'\n        gainNode.gain.setValueAtTime(1, i * tempo)\n        gainNode.gain.setTargetAtTime(0.0001, i * tempo + 0.08, 0.005)\n        oscillator.stop(i * tempo + 0.09)\n      }\n    }\n  },\n  jump() {\n    this.play([25,20,15])\n  },\n  die() {\n    this.play([13,14,15,,16,17,18,,19,20,21], 0.2)\n  }\n});\n\n\n//# sourceURL=webpack:///./src/audio/index.js?");

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! exports provided: EVENTS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EVENTS\", function() { return EVENTS; });\nconst EVENTS = {\n  LEVEL_FAIL: 'LEVEL_FAIL',\n  LEVEL_COMPLETED: 'LEVEL_COMPLETED',\n  BATTERY_UPGRADE_SML: 'BATTERY_UPGRADE_SML',\n  BATTERY_UPGRADE_MED: 'BATTERY_UPGRADE_MED',\n  BATTERY_UPGRADE_LRG: 'BATTERY_UPGRADE_LRG',\n  RETRY: 'RETRY'\n};\n\n\n//# sourceURL=webpack:///./src/constants.js?");

/***/ }),

/***/ "./src/controls/index.js":
/*!*******************************!*\
  !*** ./src/controls/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction getControls() {\n  const keys = {\n    jump: [38, 32, 87],\n    right: [39, 68],\n    left: [37, 65]\n  }\n  const controls = {\n    jump: false,\n    right: false,\n    left: false\n  }\n  const setControl = flag => {\n    Object.keys(controls).forEach(control => {\n      if (keys[control].indexOf(event.keyCode) > -1) controls[control] = flag\n    })\n  }\n  document.body.addEventListener('keydown', event => setControl(true))\n  document.body.addEventListener('keyup', event => setControl(false))\n  return controls\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (getControls());\n\n\n//# sourceURL=webpack:///./src/controls/index.js?");

/***/ }),

/***/ "./src/engine.js":
/*!***********************!*\
  !*** ./src/engine.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Engine; });\n/* harmony import */ var _controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controls */ \"./src/controls/index.js\");\n/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map */ \"./src/map/index.js\");\n/* harmony import */ var _audio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./audio */ \"./src/audio/index.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _utils_dispatcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/dispatcher */ \"./src/utils/dispatcher.js\");\n\n\n\n\n\n\n\n\nclass Engine{\n  constructor(canvas){\n    this.canvas = canvas\n    this.context = canvas.getContext('2d')\n    // Level Generation, get all objects that will be in the game\n    // obstacles, monsters, powerps, player, end\n    this.game = {...(Object(_map__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(this.canvas, this.context))}\n  }\n\n  start(){\n    this.loop();\n  }\n\n  stop() {\n    // TODO - Stop engine\n  }\n\n  loop(){\n    // Clear drawing\n    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)\n\n    // Draw background\n    this.context.globalAlpha = 1\n    this.context.fillStyle = `#121212`\n    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)\n\n    // Update player from controls\n    if (_controls__WEBPACK_IMPORTED_MODULE_0__[\"default\"].jump && (!this.game.player.jump && this.game.player.grnd)) {\n      this.game.player.jump = true\n      this.game.player.grnd = false\n      this.game.player.v.y = -this.game.player.speed * 2.5 // jump height\n      _audio__WEBPACK_IMPORTED_MODULE_2__[\"default\"].jump()\n    }\n    if (_controls__WEBPACK_IMPORTED_MODULE_0__[\"default\"].right && (this.game.player.v.x < this.game.player.speed)) this.game.player.v.x++\n    if (_controls__WEBPACK_IMPORTED_MODULE_0__[\"default\"].left && (this.game.player.v.x > -this.game.player.speed)) this.game.player.v.x--\n\n    // Apply environment settings\n    this.game.player.v.x *= 0.8 // friction\n    // TODO - make this variable based on screen size\n    this.game.player.v.y += 0.25 // gravity\n    this.game.player.grnd = false\n\n    // Check for a collision with an obstacle\n    this.game.obstacles.forEach(obstacle => {\n      const [direction, adjustment] = obstacle.collides(this.game.player)\n      if (direction === 'left' || direction === 'right') {\n        this.game.player.v.x = 0\n        this.game.player.jump = false\n        this.game.player.x += adjustment\n      } else if (direction === 'bottom') {\n        this.game.player.grnd = true\n        this.game.player.jump = false\n        this.game.player.y += adjustment\n      } else if (direction === 'top') {\n        this.game.player.v.y *= -1\n        this.game.player.y += adjustment\n      }\n      obstacle.draw()\n\n      // Game end - Fail!\n      if(direction !== null && obstacle.deadzone) {\n        Object(_utils_dispatcher__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(this.canvas, _constants__WEBPACK_IMPORTED_MODULE_3__[\"EVENTS\"].LEVEL_FAIL)\n      }\n    })\n\n    // Apply player v to position\n    if (this.game.player.grnd) this.game.player.v.y = 0\n    this.game.player.x += this.game.player.v.x\n    this.game.player.y += this.game.player.v.y\n    this.game.player.draw()\n\n\n    // TODO: Test for collision with enemies and kill player\n    // TODO: Test for collision outside of canvas, and kill player\n    // TODO: Test for collision with battery-packs and reset lighting\n\n    requestAnimationFrame(this.loop.bind(this))\n  }\n\n}\n\n\n//# sourceURL=webpack:///./src/engine.js?");

/***/ }),

/***/ "./src/gameObjects/GameObject.js":
/*!***************************************!*\
  !*** ./src/gameObjects/GameObject.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return GameObject; });\n/* harmony import */ var _utils_collision__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/collision */ \"./src/utils/collision.js\");\n\n\nclass GameObject {\n  constructor({x, y, width, height, fill, context}) {\n    this.x = x\n    this.y = y\n    this.width = width\n    this.height = height\n    this.fill = fill\n    this.context = context\n  }\n\n  collides(player) {\n    return Object(_utils_collision__WEBPACK_IMPORTED_MODULE_0__[\"checkCollision\"])(player, this)\n  }\n\n  draw() {\n    this.context.fillStyle = this.fill\n    this.x -= 1\n    this.context.fillRect(this.x, this.y, this.width, this.height)\n  }\n}\n\n\n//# sourceURL=webpack:///./src/gameObjects/GameObject.js?");

/***/ }),

/***/ "./src/gameObjects/index.js":
/*!**********************************!*\
  !*** ./src/gameObjects/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_collision__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/collision */ \"./src/utils/collision.js\");\n/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameObject */ \"./src/gameObjects/GameObject.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (context => ({\n  player: {\n    x: 0,\n    y: 0,\n    width: 25,\n    height: 25,\n    speed: 3,\n    v: {\n      x: 0,\n      y: 0\n    },\n    jump: false,\n    grnd: false,\n    draw() {\n      // Update player based on movement (TODO: use a sprite)\n      context.fillStyle = 'lightblue'\n      if (this.jump) context.fillStyle = 'orange'\n      // if (controls.right) context.fillStyle = 'red'\n      // if (controls.left) context.fillStyle = 'lightgreen'\n      context.fillRect(this.x, this.y, this.width, this.height)\n    }\n  },\n  obstacle(x, y, width, height) {\n    const fill = '#212121'\n    return new _GameObject__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({ x, y, width, height, fill, context })\n  },\n  endSuccess(x, y, width, height) {\n    const fill = '#f00'\n    return new _GameObject__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({ x, y, width, height, fill, context })\n  },\n  deadzone(x, y, width = 25, height = 10) {\n    const fill = '#f00'\n    const dz = new _GameObject__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({ x, y, width, height, fill, context })\n    dz.deadzone = true\n    return dz\n  },\n}));\n\n\n//# sourceURL=webpack:///./src/gameObjects/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _stage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stage */ \"./src/stage.js\");\n/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./engine */ \"./src/engine.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _audio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./audio */ \"./src/audio/index.js\");\n\n\n\n\n\n\nconst game = {\n  start() {\n    this.canvas = Object(_stage__WEBPACK_IMPORTED_MODULE_0__[\"default\"])('#gameStage')\n    this.engine = new _engine__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.canvas)\n\n    // Add Events\n    this._gameFailSequence = this.gameFailSequence.bind(this)\n    this.canvas.addEventListener(_constants__WEBPACK_IMPORTED_MODULE_2__[\"EVENTS\"].LEVEL_FAIL, this._gameFailSequence)\n\n    // Start game loop\n    this.engine.start()\n  },\n  gameFailSequence() {\n    this.canvas.removeEventListener(_constants__WEBPACK_IMPORTED_MODULE_2__[\"EVENTS\"].LEVEL_FAIL, this._gameFailSequence);\n    console.log('Yo, don\\'t suck');\n    _audio__WEBPACK_IMPORTED_MODULE_3__[\"default\"].die()\n    this.engine.stop();\n    // TODO - Display Retry Screen\n    setTimeout(() => window.location.reload(), 3000);\n  }\n}\n\n\n\n// Screen initializers\nfunction initStartScreen(){\n  const ss = document.getElementById('startScreen')\n  ss.classList.add('is-active');\n  ss.querySelector('.start-game-cta').addEventListener('click', () => {\n    closeCurrentScreen();\n    game.start();\n  })\n}\n\nfunction closeCurrentScreen() {\n  document.querySelector('.screen-state.is-active').classList.remove('is-active')\n}\n\n\nwindow.game = game // For debugging\ninitStartScreen()\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/map/index.js":
/*!**************************!*\
  !*** ./src/map/index.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gameObjects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gameObjects */ \"./src/gameObjects/index.js\");\n/* harmony import */ var _levels__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./levels */ \"./src/map/levels/index.js\");\n\n\n\nlet currentLevel = _levels__WEBPACK_IMPORTED_MODULE_1__[\"default\"][0];\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ((canvas, context) => {\n  // Object factories\n  const { player, obstacle, deadzone } = Object(_gameObjects__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(context)\n\n  // Collections for map\n  const obstacles = []\n  const monsters = []\n  const powerps = []\n  const end = { x: 0, y: 0 }\n\n  const size = Math.floor(canvas.height / currentLevel.length)\n  currentLevel.forEach((row, i) => {\n    const y = i * size\n    row.split('').forEach((block, j) => {\n      const x = j * size\n      switch (block) {\n        case '*':\n          obstacles.push(obstacle(x, y, size, 25))\n          break\n        case '%':\n          // TODO: Monster\n          break\n        case '#':\n          // TODO: Powerup\n          break\n        case '$':\n          end.x = x\n          end.y = y\n          break\n        case 'P':\n          player.x = x\n          player.y = y\n          break\n        default:\n          void 0\n      }\n    })\n  })\n\n  // Add deadzone\n  for(let i = 0; i < currentLevel[0].length; i ++) {\n    obstacles.push(deadzone(i * size, canvas.height + 50, size))\n  }\n\n  return { obstacles, monsters, powerps, player, end }\n});\n\n\n//# sourceURL=webpack:///./src/map/index.js?");

/***/ }),

/***/ "./src/map/levels/index.js":
/*!*********************************!*\
  !*** ./src/map/levels/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _level_1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./level-1 */ \"./src/map/levels/level-1.js\");\n/* harmony import */ var _level_2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./level-2 */ \"./src/map/levels/level-2.js\");\n/* harmony import */ var _level_3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./level-3 */ \"./src/map/levels/level-3.js\");\n/* harmony import */ var _level_4__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./level-4 */ \"./src/map/levels/level-4.js\");\n/* harmony import */ var _level_5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./level-5 */ \"./src/map/levels/level-5.js\");\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ([\n  _level_1__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  _level_2__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _level_3__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  _level_4__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  _level_5__WEBPACK_IMPORTED_MODULE_4__[\"default\"]\n]);\n\n\n//# sourceURL=webpack:///./src/map/levels/index.js?");

/***/ }),

/***/ "./src/map/levels/level-1.js":
/*!***********************************!*\
  !*** ./src/map/levels/level-1.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ([\n  '                  #                       %            $',\n  ' ***  ** ***  ** ***  ** ***  ** ***  ** ***  ** ***  **',\n  '                      %             %                   ',\n  '** ******  **** **  ****** ******  ****. * ******* *****',\n  '    #         %                                         ',\n  '******  ** **  ***   **** ***  *      ***    ***   *****',\n  '    #         %                                         ',\n  '** ***  ** ******* ******* ***  * ***     ** ***   *****',\n  ' P    **          **    %              #         %      ',\n  '***** *  *** ******* ******* **  *** *******  ******* **',\n]);\n\n\n//# sourceURL=webpack:///./src/map/levels/level-1.js?");

/***/ }),

/***/ "./src/map/levels/level-2.js":
/*!***********************************!*\
  !*** ./src/map/levels/level-2.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ([\n  '                  #                       %            $',\n  ' ***  ** ***  ** ***  ** ***  ** ***  ** ***  ** ***  **',\n  '                      %             %                   ',\n  '** ******  **** **  ****** ******  ****. * ******* *****',\n  '    #         %                                         ',\n  '******  ** **  ***   **** ***  *      ***    ***   *****',\n  '    #         %                                         ',\n  '** ***  ** ******* ******* ***  * ***     ** ***   *****',\n  ' P    **          **    %              #         %      ',\n  '***** *  *** ******* ******* **  *** *******  ******* **',\n]);\n\n\n//# sourceURL=webpack:///./src/map/levels/level-2.js?");

/***/ }),

/***/ "./src/map/levels/level-3.js":
/*!***********************************!*\
  !*** ./src/map/levels/level-3.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ([\n  '                  #                       %            $',\n  ' ***  ** ***  ** ***  ** ***  ** ***  ** ***  ** ***  **',\n  '                      %             %                   ',\n  '** ******  **** **  ****** ******  ****. * ******* *****',\n  '    #         %                                         ',\n  '******  ** **  ***   **** ***  *      ***    ***   *****',\n  '    #         %                                         ',\n  '** ***  ** ******* ******* ***  * ***     ** ***   *****',\n  ' P    **          **    %              #         %      ',\n  '***** *  *** ******* ******* **  *** *******  ******* **',\n]);\n\n\n//# sourceURL=webpack:///./src/map/levels/level-3.js?");

/***/ }),

/***/ "./src/map/levels/level-4.js":
/*!***********************************!*\
  !*** ./src/map/levels/level-4.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ([\n  '                  #                       %            $',\n  ' ***  ** ***  ** ***  ** ***  ** ***  ** ***  ** ***  **',\n  '                      %             %                   ',\n  '** ******  **** **  ****** ******  ****. * ******* *****',\n  '    #         %                                         ',\n  '******  ** **  ***   **** ***  *      ***    ***   *****',\n  '    #         %                                         ',\n  '** ***  ** ******* ******* ***  * ***     ** ***   *****',\n  ' P    **          **    %              #         %      ',\n  '***** *  *** ******* ******* **  *** *******  ******* **',\n]);\n\n\n//# sourceURL=webpack:///./src/map/levels/level-4.js?");

/***/ }),

/***/ "./src/map/levels/level-5.js":
/*!***********************************!*\
  !*** ./src/map/levels/level-5.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ([\n  '                  #                       %            $',\n  ' ***  ** ***  ** ***  ** ***  ** ***  ** ***  ** ***  **',\n  '                      %             %                   ',\n  '** ******  **** **  ****** ******  ****. * ******* *****',\n  '    #         %                                         ',\n  '******  ** **  ***   **** ***  *      ***    ***   *****',\n  '    #         %                                         ',\n  '** ***  ** ******* ******* ***  * ***     ** ***   *****',\n  ' P    **          **    %              #         %      ',\n  '***** *  *** ******* ******* **  *** *******  ******* **',\n]);\n\n\n//# sourceURL=webpack:///./src/map/levels/level-5.js?");

/***/ }),

/***/ "./src/stage.js":
/*!**********************!*\
  !*** ./src/stage.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return initStage; });\nfunction initStage(selector, callback) {\n  const stageParent = document.querySelector(selector);\n  if(!stageParent) throw(new Error(`Selector ${selector} doesn't return an element.`))\n\n  const bbox = stageParent.getBoundingClientRect()\n\n  // Set width and height here\n  const canvas = getCanvas(bbox.width, bbox.height)\n  // Add dynamicly sized canvas to dom\n  stageParent.appendChild(canvas)\n\n  return canvas\n}\n\nfunction getCanvas(w, h){\n  const c = document.createElement('canvas')\n  c.setAttribute('width', w)\n  c.setAttribute('height', h)\n  return c\n}\n\n\n//# sourceURL=webpack:///./src/stage.js?");

/***/ }),

/***/ "./src/utils/collision.js":
/*!********************************!*\
  !*** ./src/utils/collision.js ***!
  \********************************/
/*! exports provided: checkCollision */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkCollision\", function() { return checkCollision; });\nfunction checkCollision(a, b) {\n  const vec = [\n    (a.x + (a.width / 2)) - (b.x + (b.width / 2)),\n    (a.y + (a.height / 2)) - (b.y + (b.height / 2)),\n  ]\n  const overlap = [\n    (a.width / 2) + (b.width / 2),\n    (a.height / 2) + (b.height / 2),\n  ]\n\n  if (Math.abs(vec[0]) < overlap[0] && Math.abs(vec[1]) < overlap[1]) {\n    const oDiff = [\n      overlap[0] - Math.abs(vec[0]),\n      overlap[1] - Math.abs(vec[1]),\n    ]\n    if (oDiff[0] >= oDiff[1]) {\n      if (vec[1] > 0) return ['top', oDiff[1]]\n      else return ['bottom', -oDiff[1]]\n    } else {\n      if (vec[0] > 0) return ['left', oDiff[0]]\n      else return ['right', -oDiff[0]]\n    }\n  }\n  return [null, null]\n}\n\n\n//# sourceURL=webpack:///./src/utils/collision.js?");

/***/ }),

/***/ "./src/utils/dispatcher.js":
/*!*********************************!*\
  !*** ./src/utils/dispatcher.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return dispatcher; });\nconst defaultOptions = {bubbles: true, cancellable: true}\n\nfunction dispatcher(node = document, type, eventOptions = defaultOptions) {\n  if (typeof window.CustomEvent === 'function') {\n    node.dispatchEvent(new Event(type));\n  } else {\n    const {bubbles, cancellable} = eventOptions;\n    const event = document.createEvent('CustomEvent');\n    event.initEvent(type, bubbles, cancellable);\n    node.dispatchEvent(event);\n  }\n}\n\n\n//# sourceURL=webpack:///./src/utils/dispatcher.js?");

/***/ })

/******/ });