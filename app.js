const user = localStorage.getItem("chatUser");
const repo = "drqg"; // your repo
const file = "messages.json";

async function fetchMessages() {
  const res = await fetch(`https://raw.githubusercontent.com/YOUR_USERNAME/${repo}/main/${file}?t=${Date.now()}`);
  return await res.json();
}

async function render() {
  const data = await fetchMessages();
  const now = Date.now();

  const valid = data.filter(m => now - m.time < 60000);

  const box = document.getElementById("messages");
  box.innerHTML = "";

  valid.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + (m.user === user ? "self" : "");
    div.innerText = m.user + ": " + m.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value;

  if (!text) return;

  const data = await fetchMessages();

  data.push({
    user: user,
    text: text,
    time: Date.now()
  });

  // ⚠️ GitHub can't be written directly from frontend
  alert("To fully work, you need GitHub API or a small backend.\nThis demo only reads.");
  
  input.value = "";
}

setInterval(render, 2000);
render();