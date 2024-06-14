// Replace with your actual API key
const API_KEY = "AIzaSyA6w6c2GXPenDgXIHdqIFRSywsYy9QrI_4";

const chatContainer = $("#chat-container");
let selectedVoiceIndex = 0; // Initialize selected voice index

function populateVoiceList() {
  const voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voices');
  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });

  // Set default selected voice
  setDefaultVoice();
}

// Function to set the default selected voice
function setDefaultVoice() {
  const storedVoiceIndex = localStorage.getItem('selectedVoiceIndex');
  if (storedVoiceIndex !== null) {
    selectedVoiceIndex = parseInt(storedVoiceIndex, 10);
    setVoiceSelection(selectedVoiceIndex);
  }
}

function setVoiceSelection(index) {
  const voiceSelect = document.getElementById('voices');
  voiceSelect.selectedIndex = index;
  voiceSelect.disabled = true; // Disable voice selection once a voice is selected
}

function speak(text) {
  const voices = window.speechSynthesis.getVoices();

  if (voices.length === 0) {
    alert('No voices available');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[selectedVoiceIndex];
  window.speechSynthesis.speak(utterance);
}

$("#send-button").click(function() {
  processInput($("#user-input").val());
});

function processInput(userInput) {
  const whom = document.getElementById("Whom").value;

    if (whom === "Friend") {
    userInput += " answer all queries and respond as if you are my friend";
    } 

  if (userInput.trim() === "") {
    alert("Please enter a message.");
    return;
  }

  selectedVoiceIndex = document.getElementById('voices').value; // Update selected voice index
  localStorage.setItem('selectedVoiceIndex',      selectedVoiceIndex); // Store selected voice index

// Ensure voices are loaded
if (window.speechSynthesis.getVoices().length === 0) {
window.speechSynthesis.onvoiceschanged = function() {
populateVoiceList();
window.speechSynthesis.onvoiceschanged = null;  // Remove the event listener after loading voices
processUserInput(userInput);
};
} else {
populateVoiceList();
processUserInput(userInput);
}
}

function processUserInput(userInput) {
// Send request to Google Gemini API
$.ajax({
url: "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=" + API_KEY,
method: "POST",
contentType: "application/json",
data: JSON.stringify({
prompt: {
  text: userInput
}
}),
success: function(response) {
const aiResponse = response.candidates && response.candidates.length > 0
  ? response.candidates[0].output
  : "I'm not sure how to respond to that.";

speak(aiResponse);

// Add user and AI messages to chat container
// chatContainer.append(`<div class="message user-message"><strong>You:</strong> ${userInput}</div>`);
chatContainer.append(`<div class="message ai-message"><strong>Jarvis:</strong> ${aiResponse}</div>`);

// Scroll chat container to bottom
chatContainer.scrollTop(chatContainer[0].scrollHeight);

// Clear user input field
$("#user-input").val("");
},
error: function(error) {
console.error("Error:", error);
alert("An error occurred. Please try again.");
}
});
}

// Allow pressing Enter to send the message
$("#user-input").keypress(function(event) {
if (event.keyCode === 13) {
$("#send-button").click();
}
});

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

$("#speak-button").click(function() {
recognition.start();
});

recognition.onresult = function(event) {
const speechResult = event.results[0][0].transcript;
$("#user-input").val(speechResult);
processInput(speechResult);
};

recognition.onerror = function(event) {
console.error('Speech recognition error:', event.error);
alert('Speech recognition error: ' + event.error);
};

recognition.onspeechend = function() {
recognition.stop();
};

// Populate voices initially and on change
if (speechSynthesis.onvoiceschanged !== undefined) {
speechSynthesis.onvoiceschanged = populateVoiceList;
}

function ChangeVoice() {
localStorage.clear();
location.reload();
}

function settings() {
document.getElementById("settings").style.display = "inline";
document.getElementById("setting").style.display = "none";
document.getElementById("hideSetting").style.display = "inline";
}

function hideSetting() {
document.getElementById("settings").style.display = "none";
document.getElementById("setting").style.display = "inline";
document.getElementById("hideSetting").style.display = "none";
}
