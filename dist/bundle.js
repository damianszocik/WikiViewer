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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/animations.js":
/*!***************************!*\
  !*** ./src/animations.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var animateSearchInput = exports.animateSearchInput = function animateSearchInput() {
    var topValue = "-2rem";
    if (elements.blueContainer.getAttribute("data-state") == "results") {
        topValue = "-0.7rem";
    };
    if (elements.searchInput.value != "") {
        TweenLite.set(elements.formLabel, {
            top: topValue,
            opacity: "0"
        });
    };
    elements.searchInput.addEventListener("focus", function () {
        TweenLite.to(elements.formLabel, 0.3, {
            top: topValue,
            opacity: "0",
            ease: Back.easeIn.config(1.7)
        });
    });
    elements.searchInput.addEventListener("blur", function () {
        if (elements.searchInput.value == "") {
            TweenLite.to(elements.formLabel, 0.3, {
                top: "0",
                opacity: "1",
                ease: Back.easeOut.config(1.7)
            });
        }
    });
};
var listenVoiceSearchButton = exports.listenVoiceSearchButton = function listenVoiceSearchButton(state) {
    TweenLite.set(elements.voiceSearchButton, {
        transformOrigin: "50% 50%"
    });
    TweenLite.to(elements.voiceSearchButton, 0.3, {
        scale: 0,
        rotation: 360,
        onComplete: function onComplete() {
            var icon = void 0;
            if (state == "start") {
                icon = "rec";
            } else if (state == "stop") {
                icon = "microphone";
            }
            elements.voiceSearchButton.setAttribute("src", "icons\\" + icon + ".svg");
            TweenLite.to(elements.voiceSearchButton, 0.3, {
                scale: 1,
                rotation: 0,
                onComplete: function onComplete() {
                    elements.voiceSearchButton.removeAttribute("style");
                }
            });
        }
    });
};

var triggerFetchPreloader = exports.triggerFetchPreloader = function triggerFetchPreloader(toggle) {
    switch (toggle) {
        case "on":
            elements.preloader.style.display = "flex";
            TweenLite.to(elements.preloader, 0.2, {
                opacity: 1
            });
            break;
        case "off":
            TweenLite.to(elements.preloader, 0.2, {
                opacity: 0,
                onComplete: function onComplete() {
                    elements.preloader.style.display = "none";
                }
            });
            break;
    }
};

/***/ }),

/***/ "./src/data_processing.js":
/*!********************************!*\
  !*** ./src/data_processing.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchData = exports.lang = undefined;

__webpack_require__(/*! ./script.js */ "./src/script.js");

var lang = exports.lang = "pl";
var fetchData = exports.fetchData = function fetchData(searchValue) {
    animations.triggerFetchPreloader("on");
    fetch("https://" + dataProcessing.lang + ".wikipedia.org/w/api.php?action=opensearch&limit=20&format=json&search=" + searchValue + "&origin=*").then(function (response) {
        return response.json();
    }).then(function (data) {
        if (elements.blueContainer.getAttribute("data-state") == "search") {
            transitions.searchToResults(0.5).then(function () {
                animations.animateSearchInput();
                injectApiResults(data);
            });
        } else {
            injectApiResults(data);
        };
    });
};
var injectApiResults = function injectApiResults(data) {
    if (elements.mainContent.innerText != "") {
        elements.mainContent.innerText = "";
    }
    if (data[1].length < 1) {
        animations.triggerFetchPreloader("off");
    }
    for (var i = 0; i < data[1].length; i++) {
        if (data[1][i] != "" && data[3][i] != "") {
            // ELEMENTS CREATION 
            var resultContainer = document.createElement("div");
            resultContainer.classList = "result-container";
            var resultTitle = document.createElement("div");
            resultTitle.classList = "result-title";
            resultTitle.innerHTML = data[1][i];
            var resultContent = document.createElement("div");
            resultContent.classList = "result-content";
            var resultContentP = document.createElement("p");
            resultContentP.innerHTML = data[2][i];
            var resultContentLink = document.createElement("a");
            resultContentLink.setAttribute("target", "_blank");
            resultContentLink.setAttribute("href", data[3][i]);
            resultContentLink.innerHTML = data[3][i];
            resultContent.appendChild(resultContentP);
            resultContent.appendChild(resultContentLink);
            resultContainer.appendChild(resultTitle);
            resultContainer.appendChild(resultContent);
            elements.mainContent.appendChild(resultContainer);
            var hr = document.createElement("hr");
            elements.mainContent.appendChild(hr);
            // ANIMATIONS
            var tweenDelay = i / 8;
            var tweenTime = 1;
            TweenLite.fromTo(resultTitle, tweenTime, {
                opacity: 0,
                x: -100
            }, {
                opacity: 1,
                x: 0,
                delay: tweenDelay
            });
            TweenLite.fromTo(resultContentP, tweenTime, {
                opacity: 0,
                x: 100
            }, {
                opacity: 1,
                x: 0,
                delay: tweenDelay
            });
            TweenLite.fromTo(resultContentLink, tweenTime, {
                opacity: 0,
                x: -50
                // transform: "rotateX(90deg)"
            }, {
                opacity: 1,
                x: 0,
                // transform: "rotateX(0deg)",
                delay: tweenDelay
            });
            TweenLite.fromTo(hr, tweenTime, {
                width: 0
            }, {
                width: "100%",
                delay: tweenDelay * 1.5,
                onComplete: function onComplete() {
                    animations.triggerFetchPreloader("off");
                }
            });
        };
    };
};

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.elements = exports.animations = exports.dataProcessing = exports.voiceRecognition = exports.transitions = undefined;

var _transitions = __webpack_require__(/*! ./transitions.js */ "./src/transitions.js");

var transitions = _interopRequireWildcard(_transitions);

var _data_processing = __webpack_require__(/*! ./data_processing.js */ "./src/data_processing.js");

var dataProcessing = _interopRequireWildcard(_data_processing);

var _voice_recognition = __webpack_require__(/*! ./voice_recognition.js */ "./src/voice_recognition.js");

var voiceRecognition = _interopRequireWildcard(_voice_recognition);

var _animations = __webpack_require__(/*! ./animations.js */ "./src/animations.js");

var animations = _interopRequireWildcard(_animations);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.transitions = transitions; //MODULES IMPORTS

window.dataProcessing = dataProcessing;

window.voiceRecognition = voiceRecognition;

window.animations = animations;

//DOM ELEMENTS
var elements = {
    mainContent: document.querySelector("#main-content"),
    blueContainer: document.querySelector("#blue-container"),
    preloader: document.querySelector("#preloader"),
    logo: document.querySelector("#logo"),
    slogan: document.querySelector("#slogan"),
    formLabel: document.querySelector("label"),
    searchInput: document.querySelector("input"),
    form: document.querySelector("form"),
    sideLogo: document.querySelector("#side-logo"),
    voiceSearchButton: document.querySelector("#voice-search"),
    langSelector: document.querySelector("#lang-selector")
};
window.elements = elements;

//INITIAL PRELOADER
window.addEventListener("load", function () {
    if (elements.blueContainer.getAttribute("data-state") == "preloader") {
        transitions.preloaderToSearch(0.5, 0.5);
        animations.animateSearchInput();
        voiceRecognition.init();
    }
});

//SEARCHING AND DISPLAYING RESULTS
elements.form.addEventListener("submit", function (el) {
    elements.form.children[0].blur();
    el.preventDefault();
    dataProcessing.fetchData(this.childNodes[1].value);
});

//LOGO CLICK GETS TO SEARCH PAGE
elements.logo.addEventListener("click", function () {
    if (elements.blueContainer.getAttribute("data-state") == "results") {
        transitions.resultsToSearch(0.5);
    } else if (elements.blueContainer.getAttribute("data-state") == "results-collapsed") {
        transitions.resultsUncollapse(0.5);
    }
});

// HEADER COLLAPSE
var collapsingStatus = void 0;
document.body.addEventListener("scroll", function () {
    var navHeight = elements.blueContainer.getBoundingClientRect().height;
    var currentTopOffset = this.scrollTop;
    if (currentTopOffset >= navHeight / 2 && elements.blueContainer.getAttribute("data-state") == "results" && collapsingStatus != "during") {
        collapsingStatus = "during";
        transitions.resultsCollapse(0.5);
        setTimeout(function () {
            collapsingStatus = "stopped";
        }, 500);
    } else if (currentTopOffset < navHeight / 2 && elements.blueContainer.getAttribute("data-state") == "results-collapsed" && collapsingStatus != "during") {
        collapsingStatus = "during";
        transitions.resultsUncollapse(0.5);
        setTimeout(function () {
            collapsingStatus = "stopped";
        }, 500);
    }
});
elements.blueContainer.addEventListener("mouseenter", function () {
    var navHeight = elements.blueContainer.getBoundingClientRect().height;
    var currentTopOffset = document.body.scrollTop;
    if (elements.blueContainer.getAttribute("data-state") == "results-collapsed" && currentTopOffset >= navHeight / 2 && (typeof collapsingStatus === "undefined" || collapsingStatus != "during")) {
        collapsingStatus = "during";
        transitions.resultsUncollapse(0.5);
        setTimeout(function () {
            collapsingStatus = "stopped";
        }, 500);
    }
});

//LANGUAGE SELECTION
elements.langSelector.addEventListener("click", function () {
    if (this.children[0].classList.contains("lang-active")) {
        this.children[0].classList.toggle("lang-active");
        this.children[1].classList.toggle("lang-active");
        dataProcessing.lang = "en";
    } else {
        this.children[1].classList.toggle("lang-active");
        this.children[0].classList.toggle("lang-active");
        dataProcessing.lang = "pl";
    }
    dataProcessing.fetchData(elements.searchInput.value);
});

//EXPORTS
exports.transitions = transitions;
exports.voiceRecognition = voiceRecognition;
exports.dataProcessing = dataProcessing;
exports.animations = animations;
exports.elements = elements;

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/transitions.js":
/*!****************************!*\
  !*** ./src/transitions.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resultsToSearch = exports.resultsUncollapse = exports.resultsCollapse = exports.preloaderToSearch = exports.searchToResults = undefined;

var _script = __webpack_require__(/*! ./script.js */ "./src/script.js");

//DATA-STATE TRANSITIONS
var searchToResults = exports.searchToResults = function searchToResults(onTweenTime) {
    return new Promise(function (resolve, reject) {
        // first 
        var initFormBounding = _script.elements.form.getBoundingClientRect();
        // last
        _script.elements.blueContainer.setAttribute("data-state", "results");
        var finalLogoBounding = {
            fontSize: getComputedStyle(_script.elements.logo).fontSize,
            margin: getComputedStyle(_script.elements.logo).margin
        };
        var finalVoiceSearchButtonBounding = _script.elements.voiceSearchButton.getBoundingClientRect();
        var finalFormBounding = _script.elements.form.getBoundingClientRect();
        var finalInputBounding = _script.elements.form.children[0].getBoundingClientRect();
        finalInputBounding.fontSize = getComputedStyle(_script.elements.form.children[0]).fontSize;
        finalInputBounding.color = getComputedStyle(_script.elements.form.children[0]).color;
        var finalLabelBounding = _script.elements.form.children[1].getBoundingClientRect();
        finalLabelBounding.fontSize = getComputedStyle(_script.elements.form.children[1]).fontSize;
        finalFormBounding.margin = getComputedStyle(_script.elements.form).margin;
        var finalBlueContanerBounding = _script.elements.blueContainer.getBoundingClientRect();
        //invert
        _script.elements.blueContainer.setAttribute("data-state", "search");
        //play
        _script.elements.mainContent.innerHTML = "";
        TweenLite.to(_script.elements.logo, onTweenTime, {
            fontSize: finalLogoBounding.fontSize,
            margin: finalLogoBounding.margin
        });

        TweenLite.fromTo(_script.elements.form, onTweenTime, {
            position: "absolute",
            top: initFormBounding.top,
            left: initFormBounding.left
        }, {
            top: finalFormBounding.top,
            left: finalFormBounding.left
        });

        TweenLite.to(_script.elements.form.children[0], onTweenTime, {
            width: finalInputBounding.width,
            height: finalInputBounding.height,
            color: finalInputBounding.color,
            fontSize: finalInputBounding.fontSize
        });

        TweenLite.to(_script.elements.form.children[1], onTweenTime, {
            fontSize: finalLabelBounding.fontSize
        });

        TweenLite.fromTo(_script.elements.sideLogo, onTweenTime, {
            opacity: 1
        }, {
            opacity: 0,
            paddingTop: 800,
            ease: Power4.easeInOut,
            onComplete: function onComplete() {
                return _script.elements.sideLogo.removeAttribute("style");
            }
        });

        TweenLite.to(_script.elements.blueContainer, onTweenTime, {
            width: finalBlueContanerBounding.width,
            height: finalBlueContanerBounding.height,
            onComplete: function onComplete() {
                _script.elements.logo.removeAttribute("style");
                _script.elements.form.children[0].removeAttribute("style");
                _script.elements.form.children[1].removeAttribute("style");
                _script.elements.form.removeAttribute("style");
                _script.elements.blueContainer.removeAttribute("style");
                _script.elements.blueContainer.setAttribute("data-state", "results");
                TweenLite.set(_script.elements.mainContent, {
                    opacity: 1
                });
            }
        }).then(function () {
            return resolve(true);
        }).catch(function () {
            return reject(true);
        });
    });
};

var preloaderToSearch = exports.preloaderToSearch = function preloaderToSearch(offTweenTime, onTweenTime) {
    //first
    var initLogoBounding = _script.elements.logo.getBoundingClientRect();
    var initSloganBounding = _script.elements.slogan.getBoundingClientRect();
    //last
    _script.elements.blueContainer.setAttribute("data-state", "search");
    var finalLogoBounding = {};
    finalLogoBounding.left = _script.elements.logo.clientLeft;
    finalLogoBounding.top = _script.elements.logo.clientTop;
    finalLogoBounding.margin = getComputedStyle(_script.elements.logo).margin;
    finalLogoBounding.fontSize = getComputedStyle(_script.elements.logo).fontSize;
    finalLogoBounding.margin = getComputedStyle(_script.elements.logo).margin;
    var finalVoiceSearchButtonBounding = {};
    finalVoiceSearchButtonBounding.opacity = getComputedStyle(_script.elements.voiceSearchButton).opacity;
    //invert&play
    _script.elements.blueContainer.setAttribute("data-state", "preloader");
    TweenLite.fromTo(_script.elements.logo, offTweenTime, {
        position: "absolute",
        left: initLogoBounding.left,
        top: initLogoBounding.top
    }, {
        margin: finalLogoBounding.margin,
        left: finalLogoBounding.left,
        top: finalLogoBounding.top,
        fontSize: finalLogoBounding.fontSize,
        ease: Power4.easeInOut
    });
    TweenLite.fromTo(_script.elements.slogan, offTweenTime, {
        position: "absolute",
        left: initSloganBounding.left,
        top: initSloganBounding.top
    }, {
        opacity: 0,
        onComplete: function onComplete() {
            _script.elements.blueContainer.setAttribute("data-state", "search");
            _script.elements.logo.removeAttribute("style");
            _script.elements.slogan.removeAttribute("style");

            TweenLite.fromTo(_script.elements.sideLogo, onTweenTime, {
                opacity: 0,
                paddingTop: 1000
            }, {
                opacity: 1,
                paddingTop: 0,
                ease: Power4.easeInOut,
                onComplete: function onComplete() {
                    return _script.elements.sideLogo.removeAttribute("style");
                }
            });
            TweenLite.fromTo(_script.elements.form.children[0], onTweenTime, {
                marginBottom: getComputedStyle(_script.elements.form.children[0]).fontSize,
                opacity: 0
            }, {
                marginBottom: 0,
                opacity: 1,
                ease: Power4.easeInOut,
                onComplete: function onComplete() {
                    return _script.elements.form.children[0].removeAttribute("style");
                },
                delay: 0.2
            });
            TweenLite.fromTo(_script.elements.form.children[1], onTweenTime, {
                marginTop: 100,
                opacity: 0
            }, {
                marginTop: 0,
                opacity: 1,
                ease: Power4.easeInOut,
                onComplete: function onComplete() {
                    return _script.elements.form.children[1].removeAttribute("style");
                },
                delay: 0.2
            });
            TweenLite.fromTo(_script.elements.voiceSearchButton, offTweenTime, {
                opacity: 0,
                right: "-2rem"
            }, {
                opacity: finalVoiceSearchButtonBounding.opacity,
                right: 0,
                ease: Power4.easeInOut,
                onComplete: function onComplete() {
                    return _script.elements.voiceSearchButton.removeAttribute("style");
                },
                delay: 0.2
            });
        }
    });
};

var resultsCollapse = exports.resultsCollapse = function resultsCollapse(onTweenTime) {
    //first
    var initContainerBounding = _script.elements.blueContainer.getBoundingClientRect();
    //last
    _script.elements.blueContainer.setAttribute("data-state", "results-collapsed");
    var finalContainerBounding = _script.elements.blueContainer.getBoundingClientRect();
    //invert&play
    _script.elements.blueContainer.setAttribute("data-state", "results");
    TweenLite.to(_script.elements.blueContainer, onTweenTime, {
        width: finalContainerBounding.width,
        height: finalContainerBounding.height,
        ease: Power4.easeInOut,
        onComplete: function onComplete() {
            _script.elements.blueContainer.setAttribute("data-state", "results-collapsed");
            _script.elements.blueContainer.removeAttribute("style");
        }
    });
    var blueContainerChildren = [];
    _script.elements.blueContainer.childNodes.forEach(function (element) {
        if (element.id != "logo") {
            blueContainerChildren.push(TweenLite.to(element, onTweenTime, {
                y: -100,
                opacity: 0,
                ease: Power4.easeInOut

            }));
        }
    });
};

var resultsUncollapse = exports.resultsUncollapse = function resultsUncollapse(onTweenTime) {
    //first
    var initContainerBounding = _script.elements.blueContainer.getBoundingClientRect();
    //last
    _script.elements.blueContainer.setAttribute("data-state", "results");
    var finalContainerBounding = _script.elements.blueContainer.getBoundingClientRect();
    //invert&play
    TweenLite.fromTo(_script.elements.blueContainer, onTweenTime, {
        width: initContainerBounding.width,
        height: initContainerBounding.height
    }, {
        width: finalContainerBounding.width,
        height: finalContainerBounding.height,
        ease: Power4.easeInOut,
        onComplete: function onComplete() {
            _script.elements.blueContainer.removeAttribute("style");
        }
    });
    var blueContainerChildren = [];
    _script.elements.blueContainer.childNodes.forEach(function (element) {
        if (element.id != "logo") {
            blueContainerChildren.push(TweenLite.to(element, onTweenTime, {
                y: 0,
                opacity: 1,
                ease: Power4.easeInOut
            }));
        }
    });
};

var resultsToSearch = exports.resultsToSearch = function resultsToSearch(onTweenTime) {
    // first 
    var initFormBounding = _script.elements.form.getBoundingClientRect();
    var initBlueContainerBounding = _script.elements.blueContainer.getBoundingClientRect();
    var initLogoBounding = _script.elements.logo.getBoundingClientRect();
    var initInputBounding = _script.elements.form.children[0].getBoundingClientRect();
    // last
    _script.elements.blueContainer.setAttribute("data-state", "search");
    var finalLogoBounding = _script.elements.logo.getBoundingClientRect();
    finalLogoBounding.fontSize = getComputedStyle(_script.elements.logo).fontSize;
    finalLogoBounding.marginTop = getComputedStyle(_script.elements.logo).marginTop;
    finalLogoBounding.marginBottom = getComputedStyle(_script.elements.logo).marginBottom;
    finalLogoBounding.marginLeft = getComputedStyle(_script.elements.logo).marginLeft;
    finalLogoBounding.marginRight = getComputedStyle(_script.elements.logo).marginRight;
    var finalFormBounding = _script.elements.form.getBoundingClientRect();
    finalFormBounding.margin = getComputedStyle(_script.elements.form).margin;
    var finalInputBounding = _script.elements.form.children[0].getBoundingClientRect();
    finalInputBounding.fontSize = getComputedStyle(_script.elements.form.children[0]).fontSize;
    finalInputBounding.color = getComputedStyle(_script.elements.form.children[0]).color;
    var finalLabelBounding = _script.elements.form.children[1].getBoundingClientRect();
    finalLabelBounding.fontSize = getComputedStyle(_script.elements.form.children[1]).fontSize;
    finalLabelBounding.margin = getComputedStyle(_script.elements.logo).margin;
    var finalBlueContanerBounding = _script.elements.blueContainer.getBoundingClientRect();
    //invert
    _script.elements.blueContainer.setAttribute("data-state", "results");
    TweenLite.fromTo(_script.elements.logo, onTweenTime, {
        alignSelf: "baseline"
    }, {
        fontSize: finalLogoBounding.fontSize,
        marginTop: finalLogoBounding.marginTop,
        marginBottom: finalLogoBounding.marginBottom,
        marginLeft: finalLogoBounding.marginLeft,
        marginRight: finalLogoBounding.marginRight
    });

    TweenLite.fromTo(_script.elements.form, onTweenTime, {
        position: "absolute",
        top: initFormBounding.top,
        left: initFormBounding.left
    }, {
        top: finalFormBounding.top,
        left: finalFormBounding.left,
        margin: finalFormBounding.margin
    });

    TweenLite.fromTo(_script.elements.form.children[0], onTweenTime, {
        width: initInputBounding.width
    }, {
        width: finalInputBounding.width,
        height: finalInputBounding.height,
        color: finalInputBounding.color,
        fontSize: finalInputBounding.fontSize
    });

    TweenLite.to(_script.elements.form.children[1], onTweenTime, {
        fontSize: finalLabelBounding.fontSize
    });

    TweenLite.fromTo(_script.elements.sideLogo, onTweenTime, {
        opacity: 0,
        paddingTop: 800,
        display: "inline-block"
    }, {
        opacity: 1,
        paddingTop: 0,
        ease: Power4.easeInOut,
        onComplete: function onComplete() {
            return _script.elements.sideLogo.removeAttribute("style");
        }
    });

    TweenLite.set(_script.elements.mainContent, {
        opacity: 0
    });

    TweenLite.fromTo(_script.elements.blueContainer, onTweenTime, {
        height: initBlueContainerBounding.height
    }, {
        width: finalBlueContanerBounding.width,
        height: finalBlueContanerBounding.height,
        ease: Power4.easeOut,
        onComplete: function onComplete() {
            _script.elements.logo.removeAttribute("style");
            _script.elements.form.children[0].removeAttribute("style");
            _script.elements.form.children[1].removeAttribute("style");
            _script.elements.form.removeAttribute("style");
            _script.elements.blueContainer.removeAttribute("style");
            _script.elements.blueContainer.setAttribute("data-state", "search");
            _script.elements.mainContent.innerText = "";
            animations.animateSearchInput();
        }
    });
};

/***/ }),

/***/ "./src/voice_recognition.js":
/*!**********************************!*\
  !*** ./src/voice_recognition.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

__webpack_require__(/*! ./script.js */ "./src/script.js");

function init() {
    elements.voiceSearchButton.addEventListener("click", function () {
        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();

            recognition.onstart = function () {
                animations.listenVoiceSearchButton("start");
            };

            recognition.onerror = function (event) {
                animations.listenVoiceSearchButton("stop");
                if (event.error == "no-speech") {
                    alert("No speech was detected. Try again.");
                };
            };

            recognition.onresult = function (event) {
                animations.listenVoiceSearchButton("stop");
                elements.searchInput.focus();
                setTimeout(function () {
                    console.log(event.results[0][0].transcript);
                    elements.searchInput.value = event.results[0][0].transcript;
                    dataProcessing.fetchData(elements.searchInput.value);
                }, 400);
            };
            recognition.start();
        } catch (error) {
            alert("Can't access speech recognition API. Your browser may not support that functionality.");
            console.log(error);
        }
    });
}

/***/ }),

/***/ 0:
/*!*********************************************!*\
  !*** multi ./src/script.js ./src/style.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./src/script.js */"./src/script.js");
module.exports = __webpack_require__(/*! ./src/style.css */"./src/style.css");


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map