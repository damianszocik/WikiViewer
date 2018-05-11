//MODULES IMPORTS
import * as transitions from "./transitions.js";
window.transitions = transitions;
import * as dataProcessing from "./data_processing.js";
window.dataProcessing = dataProcessing;
import * as voiceRecognition from "./voice_recognition.js";
window.voiceRecognition = voiceRecognition;
import * as animations from "./animations.js";
window.animations = animations;


//DOM ELEMENTS
const elements = {
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
window.addEventListener("load", () => {
    if (elements.blueContainer.getAttribute("data-state") == "preloader") {
        transitions.preloaderToSearch(0.5, 0.5);
        animations.animateSearchInput();
        voiceRecognition.init();
    }
});

//SEARCHING AND DISPLAYING RESULTS
elements.form.addEventListener("submit",function(el) {
    elements.form.children[0].blur();
    el.preventDefault();
    dataProcessing.fetchData(this.childNodes[1].value);
});

//LOGO CLICK GETS TO SEARCH PAGE
elements.logo.addEventListener("click", () => {
    if (elements.blueContainer.getAttribute("data-state") == "results") {
        transitions.resultsToSearch(0.5);
    } else if (elements.blueContainer.getAttribute("data-state") == "results-collapsed") {
        transitions.resultsUncollapse(0.5);
    }
});


// HEADER COLLAPSE
let collapsingStatus;
document.body.addEventListener("scroll", function () {
    let navHeight = elements.blueContainer.getBoundingClientRect().height;
    let currentTopOffset = this.scrollTop;
    if ((currentTopOffset >= navHeight/2) && (elements.blueContainer.getAttribute("data-state") == "results") && (collapsingStatus != "during")) {
        collapsingStatus = "during";
        transitions.resultsCollapse(0.5);
        setTimeout(function () {
            collapsingStatus = "stopped";
        }, 500);
    } else if ((currentTopOffset < navHeight/2) && (elements.blueContainer.getAttribute("data-state") == "results-collapsed") && (collapsingStatus != "during")) {
        collapsingStatus = "during";
        transitions.resultsUncollapse(0.5);
        setTimeout(function () {
            collapsingStatus = "stopped";
        }, 500);
    }
});
elements.blueContainer.addEventListener("mouseenter", function () {
    let navHeight = elements.blueContainer.getBoundingClientRect().height;
    let currentTopOffset = document.body.scrollTop;
    if ((elements.blueContainer.getAttribute("data-state") == "results-collapsed") && (currentTopOffset >= navHeight / 2) && (typeof collapsingStatus === "undefined" || collapsingStatus != "during")) {
        collapsingStatus = "during";
        transitions.resultsUncollapse(0.5);
        setTimeout(() => {
            collapsingStatus = "stopped";
        }, 500);
    }
});

//LANGUAGE SELECTION
elements.langSelector.addEventListener("click", function() {
    if (this.children[0].classList.contains("lang-active")) {
        this.children[0].classList.toggle("lang-active");
        this.children[1].classList.toggle("lang-active");
        dataProcessing.lang = "en"; 
    } else {
        this.children[1].classList.toggle("lang-active");
        this.children[0].classList.toggle("lang-active");
        dataProcessing.lang = "pl";
    }
    dataProcessing.fetchData(elements.searchInput.value)
});

//EXPORTS
export {transitions, voiceRecognition, dataProcessing, animations, elements};







