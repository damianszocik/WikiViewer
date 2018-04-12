import * as transitions from './transitions.js';
//for debugging purposes - allows to access obcjects from console

window.transitions = transitions; 

export const elements = {
    mainContent: document.querySelector("#main-content"),
    blueContainer: document.querySelector("#blue-container"),
    logo: document.querySelector("#logo"),
    slogan: document.querySelector("#slogan"),
    formLabel: document.querySelector("label"),
    searchInput: document.querySelector("input"),
    form: document.querySelector("form"),
    sideLogo: document.querySelector("#side-logo")
};
window.elements = elements;

var fetchData = (searchValue) => {
    fetch(`https://pl.wikipedia.org/w/api.php?action=opensearch&limit=20&format=json&search=${searchValue}&origin=*`).then((response) => {
        return response.json();
    }).then(data => {
        if (elements.blueContainer.getAttribute("data-state") == "search") {
            transitions.searchToResults(0.5).then(() =>{
                transitions.animateSearchInput();
                injectApiResults(data);
            });
        } else {
            injectApiResults(data);
        };  
    });
};
var injectApiResults = data => {
    if (elements.mainContent.innerText != "") {
        elements.mainContent.innerText = "";
    }
    for (let i = 0; i < data[1].length; i++) {
        if (data[1][i] != "" && data[2][i] != ""){
            // ELEMENTS CREATION
            let resultContainer = document.createElement("div");
            resultContainer.classList = "result-container";
            let resultTitle = document.createElement("div");
            resultTitle.classList = "result-title";
            resultTitle.innerHTML = data[1][i];
            let resultContent = document.createElement("div");
            resultContent.classList = "result-content";  
            let resultContentP = document.createElement("p");
            resultContentP.innerHTML = data[2][i];
            let resultContentLink = document.createElement("a");
            resultContentLink.setAttribute("target", "_blank");
            resultContentLink.setAttribute("href", data[3][i]);
            resultContentLink.innerHTML = data[3][i];
            resultContent.appendChild(resultContentP);
            resultContent.appendChild(resultContentLink);
            resultContainer.appendChild(resultTitle);
            resultContainer.appendChild(resultContent);
            elements.mainContent.appendChild(resultContainer);
            let hr = document.createElement("hr");
            elements.mainContent.appendChild(hr);
            // ANIMATIONS
            let tweenDelay = i/8;
            let tweenTime = 1;
            TweenLite.fromTo(resultTitle, tweenTime, {
                opacity: 0,
                x: -100
            },{
                opacity: 1,
                x: 0,
                delay: tweenDelay 
            });
            TweenLite.fromTo(resultContentP, tweenTime, {
                opacity: 0,
                x: 100
            },{
                opacity: 1,
                x: 0,
                delay: tweenDelay
            });
            TweenLite.fromTo(resultContentLink, tweenTime, {
                opacity: 0,
                x: -50,
                // transform: "rotateX(90deg)"
            },{
                opacity: 1,
                x: 0,
                // transform: "rotateX(0deg)",
                delay: tweenDelay
            });
            TweenLite.fromTo(hr, tweenTime, {
                width: 0
            },{
                width: "100%",
                delay: tweenDelay*1.5
            });

        };      
    };
};

//PRELOADER
window.addEventListener("load", ()=> {
    if (elements.blueContainer.getAttribute("data-state") == "preloader") {
        transitions.preloaderToSearch(0.5, 0.5);
        transitions.animateSearchInput();
    }
});

//SEARCHING AND DISPLAYING RESULTS
elements.form.addEventListener("submit",function(el) {
    el.preventDefault();
    fetchData(this.childNodes[1].value);
});

//LOGO CLICK TO SEARCH PAGE
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




