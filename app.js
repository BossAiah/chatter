// 🔥 PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const user = localStorage.getItem("chatUser");
const msgBox = document.getElementById("messages");

// 🔁 Listen for live messages
db.ref("messages").on("value", snapshot => {
  const data = snapshot.val() || {};
  msgBox.innerHTML = "";

  const now = Date.now();

  Object.entries(data).forEach(([id, m]) => {

    // ⏱ Auto delete after 1 min
    if (now - m.time > 60000) {
      db.ref("messages/" + id).remove();
      return;
    }

    const div = document.createElement("div");
    div.className = "msg " + (m.user === user ? "self" : "");
    div.textContent = m.user + ": " + m.text;

    msgBox.appendChild(div);
  });

  msgBox.scrollTop = msgBox.scrollHeight;
});

// 📤 Send message
function send() {
  const input = document.getElementById("msg");
  const text = input.value.trim();
  if (!text) return;

  db.ref("messages").push({
    user: user,
    text: text,
    time: Date.now()
  });

  input.value = "";
}
