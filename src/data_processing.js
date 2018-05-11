import "./script.js";
export var lang = "pl";
export var fetchData = (searchValue) => {
    animations.triggerFetchPreloader("on");
    fetch(`https://${dataProcessing.lang}.wikipedia.org/w/api.php?action=opensearch&limit=20&format=json&search=${searchValue}&origin=*`).then((response) => {
        return response.json();
    }).then(data => {
        if (elements.blueContainer.getAttribute("data-state") == "search") {
            transitions.searchToResults(0.5).then(() =>{
                animations.animateSearchInput();
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
    if (data[1].length < 1) {
        animations.triggerFetchPreloader("off");
    }
    for (let i = 0; i < data[1].length; i++) {
        if (data[1][i] != "" && data[3][i] != "") {
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
                delay: tweenDelay*1.5,
                onComplete: () => {
                    animations.triggerFetchPreloader("off");
                }
            });

        };
    };
};