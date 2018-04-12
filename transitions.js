import {
    elements
} from './script.js';

//DATA-STATE TRANSITIONS
export const searchToResults = (onTweenTime) => {
    return new Promise(function (resolve, reject) {
        // first 
        let initFormBounding = elements.form.getBoundingClientRect().toJSON();
        // last
        elements.blueContainer.setAttribute("data-state", "results");
        let finalLogoBounding = {
            fontSize: getComputedStyle(elements.logo).fontSize,
            margin: getComputedStyle(elements.logo).margin
        }
        let finalFormBounding = elements.form.getBoundingClientRect().toJSON();
        let finalInputBounding = elements.form.children[0].getBoundingClientRect().toJSON();
        finalInputBounding.fontSize = getComputedStyle(elements.form.children[0]).fontSize;
        finalInputBounding.color = getComputedStyle(elements.form.children[0]).color;
        let finalLabelBounding = elements.form.children[1].getBoundingClientRect().toJSON();
        finalLabelBounding.fontSize = getComputedStyle(elements.form.children[1]).fontSize;
        finalFormBounding.margin = getComputedStyle(elements.form).margin;
        let finalBlueContanerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
        //invert
        elements.blueContainer.setAttribute("data-state", "search");
        //play
        elements.mainContent.innerHTML = "";
        TweenLite.to(elements.logo, onTweenTime, {
            fontSize: finalLogoBounding.fontSize,
            margin: finalLogoBounding.margin
        });

        TweenLite.fromTo(elements.form, onTweenTime, {
            position: "absolute",
            top: initFormBounding.top,
            left: initFormBounding.left,
        }, {
            top: finalFormBounding.top,
            left: finalFormBounding.left,
        });

        TweenLite.to(elements.form.children[0], onTweenTime, {
            width: finalInputBounding.width,
            height: finalInputBounding.height,
            color: finalInputBounding.color,
            fontSize: finalInputBounding.fontSize
        });

        TweenLite.to(elements.form.children[1], onTweenTime, {
            fontSize: finalLabelBounding.fontSize
        });

        TweenLite.fromTo(elements.sideLogo, onTweenTime, {
            opacity: 1
        }, {
            opacity: 0,
            paddingTop: 800,
            ease: Power4.easeInOut,
            onComplete: () => elements.sideLogo.removeAttribute("style")
        });

        TweenLite.to(elements.blueContainer, onTweenTime, {
            width: finalBlueContanerBounding.width,
            height: finalBlueContanerBounding.height,
            onComplete: () => {
                elements.logo.removeAttribute("style");
                elements.form.children[0].removeAttribute("style");
                elements.form.children[1].removeAttribute("style");
                elements.form.removeAttribute("style");
                elements.blueContainer.removeAttribute("style");
                elements.blueContainer.setAttribute("data-state", "results");
                TweenLite.set(elements.mainContent, {
                    opacity: 1
                });
            }
        }).then(() => resolve(true)).catch(() => reject(true));

    });
}

export const preloaderToSearch = (offTweenTime, onTweenTime) => {
    //first
    let initLogoBounding = elements.logo.getBoundingClientRect().toJSON();
    let initSloganBounding = elements.slogan.getBoundingClientRect().toJSON();
    //last
    elements.blueContainer.setAttribute("data-state", "search");
    let finalLogoBounding = {};
    finalLogoBounding.left = elements.logo.clientLeft;
    finalLogoBounding.top = elements.logo.clientTop;
    finalLogoBounding.margin = getComputedStyle(elements.logo).margin;
    finalLogoBounding.fontSize = getComputedStyle(elements.logo).fontSize;
    finalLogoBounding.margin = getComputedStyle(elements.logo).margin;
    //invert&play
    elements.blueContainer.setAttribute("data-state", "preloader");
    TweenLite.fromTo(elements.logo, offTweenTime, {
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
    TweenLite.fromTo(elements.slogan, offTweenTime, {
        position: "absolute",
        left: initSloganBounding.left,
        top: initSloganBounding.top
    }, {
        opacity: 0,
        onComplete: () => {
            elements.blueContainer.setAttribute("data-state", "search");
            elements.logo.removeAttribute("style");
            elements.slogan.removeAttribute("style");

            TweenLite.fromTo(elements.sideLogo, onTweenTime, {
                opacity: 0,
                paddingTop: 1000
            }, {
                opacity: 1,
                paddingTop: 0,
                ease: Power4.easeInOut,
                onComplete: () => elements.sideLogo.removeAttribute("style")
            });
            TweenLite.fromTo((elements.form.children[0]), onTweenTime, {
                marginBottom: getComputedStyle(elements.form.children[0]).fontSize,
                opacity: 0
            }, {
                marginBottom: 0,
                opacity: 1,
                ease: Power4.easeInOut,
                onComplete: () => elements.form.children[0].removeAttribute("style"),
                delay: 0.2
            });
            TweenLite.fromTo((elements.form.children[1]), onTweenTime, {
                marginTop: 100,
                opacity: 0
            }, {
                marginTop: 0,
                opacity: 1,
                ease: Power4.easeInOut,
                onComplete: () => elements.form.children[1].removeAttribute("style"),
                delay: 0.2
            });
        }
    });
}

export const resultsCollapse = (onTweenTime) => {
    //first
    let initContainerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
    //last
    elements.blueContainer.setAttribute("data-state", "results-collapsed");
    let finalContainerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
    //invert&play
    elements.blueContainer.setAttribute("data-state", "results");
    TweenLite.to(elements.blueContainer, onTweenTime, {
        width: finalContainerBounding.width,
        ease: Power4.easeInOut,
        onComplete: () => {
            elements.blueContainer.setAttribute("data-state", "results-collapsed");
            elements.blueContainer.removeAttribute("style");
        }
    });
    let blueContainerChildren = [];
    elements.blueContainer.childNodes.forEach(element => {
        if (element.id != "logo") {
            blueContainerChildren.push(TweenLite.to(element, onTweenTime, {
                y: -100,
                opacity: 0,
                ease: Power4.easeInOut,

            }));
        }
    });

}

export const resultsUncollapse = (onTweenTime) => {
    //first
    let initContainerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
    //last
    elements.blueContainer.setAttribute("data-state", "results");
    let finalContainerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
    //invert&play
    TweenLite.fromTo(elements.blueContainer, onTweenTime, {
        width: initContainerBounding.width
    }, {
        width: finalContainerBounding.width,
        ease: Power4.easeInOut,
        onComplete: () => {
            elements.blueContainer.removeAttribute("style");
        }
    });
    let blueContainerChildren = [];
    elements.blueContainer.childNodes.forEach(element => {
        if (element.id != "logo") {
            blueContainerChildren.push(TweenLite.to(element, onTweenTime, {
                y: 0,
                opacity: 1,
                ease: Power4.easeInOut
            }));
        }
    });
}

export const resultsToSearch = (onTweenTime) => {
    // first 
    let initFormBounding = elements.form.getBoundingClientRect().toJSON();
    let initBlueContainerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
    let initLogoBounding = elements.logo.getBoundingClientRect().toJSON();
    let initInputBounding = elements.form.children[0].getBoundingClientRect().toJSON();
    // last
    elements.blueContainer.setAttribute("data-state", "search");
    let finalLogoBounding = elements.logo.getBoundingClientRect().toJSON();
    finalLogoBounding.fontSize = getComputedStyle(elements.logo).fontSize;
    finalLogoBounding.marginTop = getComputedStyle(elements.logo).marginTop;
    finalLogoBounding.marginBottom = getComputedStyle(elements.logo).marginBottom;
    finalLogoBounding.marginLeft = getComputedStyle(elements.logo).marginLeft;
    finalLogoBounding.marginRight = getComputedStyle(elements.logo).marginRight;
    let finalFormBounding = elements.form.getBoundingClientRect().toJSON();
    finalFormBounding.margin = getComputedStyle(elements.form).margin;
    let finalInputBounding = elements.form.children[0].getBoundingClientRect().toJSON();
    finalInputBounding.fontSize = getComputedStyle(elements.form.children[0]).fontSize;
    finalInputBounding.color = getComputedStyle(elements.form.children[0]).color;
    let finalLabelBounding = elements.form.children[1].getBoundingClientRect().toJSON();
    finalLabelBounding.fontSize = getComputedStyle(elements.form.children[1]).fontSize;
    finalLabelBounding.margin = getComputedStyle(elements.logo).margin;
    let finalBlueContanerBounding = elements.blueContainer.getBoundingClientRect().toJSON();
    //invert
    elements.blueContainer.setAttribute("data-state", "results");
    TweenLite.fromTo(elements.logo, onTweenTime, {
        alignSelf: "baseline"
    }, {
        fontSize: finalLogoBounding.fontSize,
        marginTop: finalLogoBounding.marginTop,
        marginBottom: finalLogoBounding.marginBottom,
        marginLeft: finalLogoBounding.marginLeft,
        marginRight: finalLogoBounding.marginRight
    });

    TweenLite.fromTo(elements.form, onTweenTime, {
        position: "absolute",
        top: initFormBounding.top,
        left: initFormBounding.left,
    }, {
        top: finalFormBounding.top,
        left: finalFormBounding.left,
        margin: finalFormBounding.margin
    });

    TweenLite.fromTo(elements.form.children[0], onTweenTime, {
        width: initInputBounding.width
    }, {
        width: finalInputBounding.width,
        height: finalInputBounding.height,
        color: finalInputBounding.color,
        fontSize: finalInputBounding.fontSize
    });

    TweenLite.to(elements.form.children[1], onTweenTime, {
        fontSize: finalLabelBounding.fontSize
    });

    TweenLite.fromTo(elements.sideLogo, onTweenTime, {
        opacity: 0,
        paddingTop: 800,
        display: "inline-block"
    }, {
        opacity: 1,
        paddingTop: 0,
        ease: Power4.easeInOut,
        onComplete: () => elements.sideLogo.removeAttribute("style")
    });

    TweenLite.set(elements.mainContent, {
        opacity: 0
    })

    TweenLite.fromTo(elements.blueContainer, onTweenTime, {
        height: initBlueContainerBounding.height
    }, {
        width: finalBlueContanerBounding.width,
        height: finalBlueContanerBounding.height,
        ease: Power4.easeOut,
        onComplete: () => {
            elements.logo.removeAttribute("style");
            elements.form.children[0].removeAttribute("style");
            elements.form.children[1].removeAttribute("style");
            elements.form.removeAttribute("style");
            elements.blueContainer.removeAttribute("style");
            elements.blueContainer.setAttribute("data-state", "search");
            elements.mainContent.innerText = "";
            animateSearchInput();
        }
    });
}

//ANIMATIONS
//search input
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
