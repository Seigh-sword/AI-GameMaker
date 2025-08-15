const backendURL = "https://057b86a0-5774-4427-8f3f-356a021d37a4-00-gi58ysiy5y5c.pike.replit.dev";

const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const editorScreen = document.getElementById("editor-screen");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const welcomeUser = document.getElementById("welcome-user");

const chatHistory = document.getElementById("chat-history");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const goToEditorBtn = document.getElementById("go-to-editor");
const backToChatBtn = document.getElementById("back-to-chat");
const codeEditor = document.getElementById("code-editor");
const runCodeBtn = document.getElementById("run-code");
const previewFrame = document.getElementById("preview");

const darkModeToggle = document.getElementById("dark-mode-toggle");

// Load saved user & messages
let currentUser = localStorage.getItem("username") || "";
let messages = JSON.parse(localStorage.getItem("messages") || "[]");

if (currentUser) {
  welcomeUser.textContent = `Welcome, ${currentUser}!`;
  loginScreen.classList.remove("active");
  chatScreen.classList.add("active");
  renderMessages();
}

// Login
loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  if (user) {
    currentUser = user;
    localStorage.setItem("username", currentUser);
    welcomeUser.textContent = `Welcome, ${currentUser}!`;
    loginScreen.classList.remove("active");
    chatScreen.classList.add("active");
    renderMessages();
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  currentUser = "";
  chatHistory.innerHTML = "";
  messages = [];
  localStorage.removeItem("messages");
  chatScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

// Send Message
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(currentUser, text);
  chatInput.value = "";

  // Ask backend
  addTypingMessage("AI");
  fetch(`${backendURL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      removeTypingMessage();
      typeWriterMessage("AI", data.reply || "Hmm, I got nothing 🤔");
    })
    .catch(err => {
      removeTypingMessage();
      addMessage("AI", "⚠️ Error connecting to backend");
    });
}

// Render Messages
function renderMessages() {
  chatHistory.innerHTML = "";
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.user === currentUser ? "user" : "ai"}`;
    div.textContent = `${msg.user}: ${msg.text}`;
    chatHistory.appendChild(div);
  });
}

// Add Message to History
function addMessage(user, text) {
  messages.push({ user, text });
  localStorage.setItem("messages", JSON.stringify(messages));
  renderMessages();
}

// Typing animation placeholder
function addTypingMessage(user) {
  const div = document.createElement("div");
  div.id = "typing";
  div.className = `message ai`;
  div.textContent = `${user} is typing...`;
  chatHistory.appendChild(div);
}

// Remove typing animation
function removeTypingMessage() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv) typingDiv.remove();
}

// Typewriter effect
function typeWriterMessage(user, text) {
  let i = 0;
  const div = document.createElement("div");
  div.className = `message ai`;
  div.textContent = `${user}: `;
  chatHistory.appendChild(div);

  function typeChar() {
    if (i < text.length) {
      div.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, 30); // typing speed
    }
  }
  typeChar();
  messages.push({ user, text });
  localStorage.setItem("messages", JSON.stringify(messages));
}

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Editor navigation
goToEditorBtn.addEventListener("click", () => {
  chatScreen.classList.remove("active");
  editorScreen.classList.add("active");
});

backToChatBtn.addEventListener("click", () => {
  editorScreen.classList.remove("active");
  chatScreen.classList.add("active");
});

// Run code in editor
runCodeBtn.addEventListener("click", () => {
  const code = codeEditor.value;
  previewFrame.srcdoc = code;
});
