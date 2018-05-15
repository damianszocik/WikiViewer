export const animateSearchInput = () => {
    let topValue = "-2rem";
    if (elements.blueContainer.getAttribute("data-state") == "results") {
        topValue = "-0.7rem";
    };
    if (elements.searchInput.value != "") {
        TweenLite.set(elements.formLabel, {
            top: topValue,
            opacity: "0"
        });
    };
    elements.searchInput.addEventListener("focus", () => {
        TweenLite.to(elements.formLabel, 0.3, {
            top: topValue,
            opacity: "0",
            ease: Back.easeIn.config(1.7)
        });
    });
    elements.searchInput.addEventListener("blur", () => {
        if (elements.searchInput.value == "") {
            TweenLite.to(elements.formLabel, 0.3, {
                top: "0",
                opacity: "1",
                ease: Back.easeOut.config(1.7)
            });
        }
    });
}
export const listenVoiceSearchButton = (state) => {
    TweenLite.set(elements.voiceSearchButton, {
        transformOrigin: "50% 50%"
    });
    TweenLite.to(elements.voiceSearchButton, 0.3, {
        scale: 0,
        rotation: 360,
        onComplete: () => {
            let icon;
            if (state == "start") {
                icon = "rec";
            } else if (state == "stop") {
                icon = "microphone";
            }
            elements.voiceSearchButton.setAttribute("src", `icons\\${icon}.svg`);
            TweenLite.to(elements.voiceSearchButton, 0.3, {
                scale: 1,
                rotation: 0,
                onComplete: ()=>{
                    elements.voiceSearchButton.removeAttribute("style");
                }
            });
        }
    });
}

export const triggerFetchPreloader = (toggle) => {
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
            onComplete: () => {
                elements.preloader.style.display = "none";
            }
        });
        break;
    }
}

export const initHeaderCollapsing = () => {
    let collapsingStatus;
    document.body.addEventListener("scroll", function () {
        let navHeight = elements.blueContainer.getBoundingClientRect().height;
        let currentTopOffset = this.scrollTop;
        if ((currentTopOffset >= navHeight / 2) && (elements.blueContainer.getAttribute("data-state") == "results") && (collapsingStatus != "during")) {
            collapsingStatus = "during";
            transitions.resultsCollapse(0.5);
            setTimeout(function () {
                collapsingStatus = "stopped";
            }, 500);
        } else if ((currentTopOffset < navHeight / 2) && (elements.blueContainer.getAttribute("data-state") == "results-collapsed") && (collapsingStatus != "during")) {
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
}