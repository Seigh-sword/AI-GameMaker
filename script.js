// script.js for AI GameMaker Frontend

const backendURL = "https://057b86a0-5774-4427-8f3f-356a021d37a4-00-gi58ysiy5y5c.pike.replit.dev";

const chatDiv = document.getElementById('chat');
const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');
const editBtn = document.getElementById('editBtn');
const runBtn = document.getElementById('runBtn');
const preview = document.getElementById('preview');
const editor = document.getElementById('editor');
const warningBox = document.getElementById('warningBox');
const nameBox = document.getElementById('nameBox');

let userName = 'Player';
nameBox.onchange = () => { userName = nameBox.value || 'Player'; };

const userId = Math.random().toString(36).substr(2,9);

function addMessage(sender, msg) {
  const p = document.createElement('p');
  p.innerHTML = `<b>${sender}:</b> ${msg}`;
  chatDiv.appendChild(p);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function showWarning(msg) {
  warningBox.style.display = 'block';
  warningBox.innerText = msg;
  setTimeout(() => { warningBox.style.display = 'none'; }, 4000);
}

sendBtn.onclick = async () => {
  const msg = inputBox.value.trim();
  if (!msg) { showWarning('Please type something!'); return; }
  addMessage(userName, msg);
  inputBox.value = '';

  try {
    const response = await fetch(`${backendURL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: msg })
    });
    const data = await response.json();
    addMessage('AI', data.reply);

    if (msg.toLowerCase().includes('no')) {
      const prompt = chatDiv.innerText.replace(new RegExp(`${userName}:|AI:`, 'g'), '').trim();
      const genRes = await fetch(`${backendURL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const codeData = await genRes.json();
      editor.value = codeData.code;
      preview.srcdoc = codeData.code;
    }
  } catch (err) {
    console.error(err);
    showWarning('Error contacting backend — check it’s running.');
  }
};

editBtn.onclick = () => {
  editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
};

runBtn.onclick = () => {
  preview.srcdoc = editor.value;
};
