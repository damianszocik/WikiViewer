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
    sideLogo: document.querySelector("#side-logo"),
    voiceSearchButton: document.querySelector("#voice-search")
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
    elements.form.children[0].blur();
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


//voice search

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (error) {
    console.error(error);
}

recognition.onstart = function () {
    console.log('Voice recognition activated. Try speaking into the microphone.');

}

recognition.onspeechend = function () {
    console.log('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function (event) {
    transitions.listenVoiceSearchButton("stop");
    if (event.error == 'no-speech') {
        console.log('No speech was detected. Try again.');
    };
}

recognition.onresult = function (event) {
    transitions.listenVoiceSearchButton("stop");
    elements.searchInput.focus();
    setTimeout(() => {
        console.log(event.results[0][0].transcript);
        elements.searchInput.value = event.results[0][0].transcript;
        fetchData(elements.searchInput.value);
    }, 400);
}

elements.voiceSearchButton.addEventListener("click", () => {

    
    transitions.listenVoiceSearchButton("start");
    recognition.start();
});

document.addEventListener("click", ()=> {
    transitions.triggerPreloader();
});

// transitions.triggerPreloader();





