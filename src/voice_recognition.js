import "./script.js";
export function init() {
    try {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
    } catch (error) {
        console.error(error);
    }

    recognition.onstart = function () {
        animations.listenVoiceSearchButton("start");
    }

    recognition.onerror = function (event) {
        animations.listenVoiceSearchButton("stop");
        if (event.error == "no-speech") {
            alert("No speech was detected. Try again.");
        };
    }

    recognition.onresult = function (event) {
        animations.listenVoiceSearchButton("stop");
        elements.searchInput.focus();
        setTimeout(() => {
            console.log(event.results[0][0].transcript);
            elements.searchInput.value = event.results[0][0].transcript;
            dataProcessing.fetchData(elements.searchInput.value);
        }, 400);
    }

    elements.voiceSearchButton.addEventListener("click", () => {
        recognition.start();
    });
}
