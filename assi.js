let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let assistantMsg = document.querySelector("#assistantMsg");
let voice = document.querySelector("#voice");

let historyBtn = document.querySelector("#historyBtn");
let historyPanel = document.querySelector("#historyPanel");
let historyList = document.querySelector("#historyList");
let closeHistory = document.querySelector("#closeHistory");
let internetStatus = document.getElementById("internetStatus");

let historyArray = [];
let selectedVoice = null;


// ------------ LOAD VOICES ------------
window.speechSynthesis.onvoiceschanged = () => {
    let voices = speechSynthesis.getVoices();
    selectedVoice =
        voices.find(v => v.name.includes("Google US English Female")) ||
        voices.find(v => v.name.includes("Microsoft Zira")) ||
        voices.find(v => v.name.includes("Samantha")) ||
        voices.find(v => v.name.includes("Victoria")) ||
        voices.find(v => v.lang === "en-US") ||
        voices[0];
};


// ------------ SPEAK FUNCTION ------------
function speak(text) {
    assistantMsg.innerText = text;

    setTimeout(() => {
        let msg = new SpeechSynthesisUtterance(text);

        if (!selectedVoice) {
            let voices = speechSynthesis.getVoices();
            selectedVoice = voices.find(v => v.lang === "en-US") || voices[0];
        }

        msg.voice = selectedVoice;
        msg.rate = 0.95;
        msg.pitch = 1.15;

        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    }, 150);
}


// ------------ WISH MESSAGE ------------
function Wishme() {
    let hours = new Date().getHours();
    if (hours < 12) speak("Hello, good morning, how can I help you?");
    else if (hours < 16) speak("Hello, good afternoon, how can I help you?");
    else if (hours < 19) speak("Hello, good evening, how can I help you?");
    else speak("Hello, how can I help you?");
}



// ------------ UPDATE HISTORY PANEL (NEWEST FIRST + DELETE) ------------
function updateHistory() {
    historyList.innerHTML = "";

    historyArray.slice().reverse().forEach((msg, reversedIndex) => {

        let index = historyArray.length - 1 - reversedIndex;

        let li = document.createElement("li");

        li.innerHTML = 
        
        `${msg}
        <button class="cancelBtn" data-index="${index}">✖</button>`;

        // click message = run command
        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("cancelBtn")) return;
            takeCommand(msg);
        });

        // delete
        li.querySelector(".cancelBtn").addEventListener("click", (e) => {
            e.stopPropagation();
            historyArray.splice(index, 1);
            updateHistory();
        });

        historyList.appendChild(li);
    });
}


// ------------ SPEECH RECOGNITION ------------
let SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SR) {
    recognition = new SR();
} else {
    speak("Sorry, your browser does not support speech recognition.");
}

recognition.onresult = (event) => {
    let transcript = event.results[event.resultIndex][0].transcript;
    content.innerText = transcript;

    historyArray.push(transcript);

    if (historyArray.length > 10) historyArray.shift();
    updateHistory();

    takeCommand(transcript);
};

recognition.onend = () => {
    content.innerText = "Click here for Talk to me!";
    voice.style.display = "none";
    btn.style.display = "flex";
};


// ------------ BUTTON CLICK ------------
btn.addEventListener("click", () => {

    if (!navigator.onLine) {
        speak("Internet is not connected. Please check your connection.");
        return;
    }

    content.innerText = "Listening...";
    assistantMsg.innerText = "........";
    voice.style.display = "block";
    btn.style.display = "none";
    recognition.start();
});


// ------------ HISTORY PANEL ------------
closeHistory.addEventListener("click", () => {
    historyPanel.style.display = "none";
});

historyBtn.addEventListener("click", () => {
    let current = window.getComputedStyle(historyPanel).display;
    historyPanel.style.display = current === "none" ? "block" : "none";
});


// ------------ INTERNET STATUS ------------
window.addEventListener("offline", () => {
    internetStatus.style.display = "block";
    speak("Internet connection lost");
});

window.addEventListener("online", () => {
    internetStatus.style.display = "none";
    speak("Internet connected");
});

window.onload = function () {

    // Select opening video
    let video = document.getElementById("openingVideo");

    // Set video speed (change value as you want: 1, 1.5, 2, 3...)
    video.playbackRate = 1.7;

    // Speak startup line
    speak("Opening your virtual assistant");

    setTimeout(() => {
        document.getElementById("openingScreen").style.display = "none";

        // After loader hides → say greeting
        Wishme();

    }, 3000);
};



function takeCommand(message) {

    message = message.toLowerCase();

    if (message.includes("hello")) {
        speak("Hello, what can I help you?");
    }
    else if (message.includes("who are you")) {
        speak("I'm Sahra, your virtual assistant created by Gajanan Gowda...");
    }

    else if (message.includes("sahra, who are you")) {
        speak("I'm your virtual assistant created by Gajanan Gowda...");
    }
    else if (
    message.includes("who  creating this virtual assistant?") ||
    message.includes("who  creating you")) {
    speak("Mister Gajanan Gowda...");
}

    else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com");
    }
    else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com");
    }
    else if (message.includes("open spotify")) {
        speak("Opening Spotify...");
        window.open("https://spotify.com");
    }
    else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.location.href = "whatsapp://";

    }

    // ---------- TIME ----------
    else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
        speak(time);
    }

    // ---------- DATE ----------
    else if (message.includes("date")) {
        let date = new Date().toLocaleDateString();
        speak( date);
    }else if (message.includes("open chrome")) {
        speak("Opening Chrome...");
        window.open("https://chrome.com");
    }
    // ---------- FINAL FALLBACK SEARCH ----------
        // -------------------------------------------------
//  NEW FEATURE — GOODBYE ANIMATION + CLOSE APP
// -------------------------------------------------
else if (
    message.includes("close") ||
    message.includes("close app") ||
    message.includes("close yourself") ||
    message.includes("exit") ||
    message.includes("quit") ||
    message.includes("go home") ||
    message.includes("power off")
) {
    speak("Closing,Goodbye!");

    setTimeout(() => {
        let bye = document.getElementById("goodbyeScreen");

        // Show goodbye screen
        bye.classList.add("show");

        // After animation → close or redirect
        setTimeout(() => {
            window.close();
            window.location.href = "about:blank";
        }, 3000);

    }, 1000);

    return;
}

    // ---------- FINAL FALLBACK SEARCH ----------
    else {
        speak("This is what I found on internet regarding " + message);
        window.open("https://www.google.com/search?q=" + encodeURIComponent(message), "_blank");
    }
}
