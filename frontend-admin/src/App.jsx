
import './App.css'
import { useEffect } from 'react';

function App() {
const HOST = "http://127.0.0.1:8000"
// const HOST = "/api"

async function deleteFile(filename) {
    const res = await fetch(`${HOST}/admin/delete?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE"
    });
    const data = await res.json();
    if (data.status === "deleted") {
        alert("File deleted!");
        loadImages();
    } else {
        alert("Error: " + (data.detail || JSON.stringify(data)));
    }
}
async function loadImages() {
    const res = await fetch(`${HOST}/admin/list-images`);
    const data = await res.json();
    const list = document.getElementById("images-list");
    list.innerHTML = "";

    if (!data.files || data.files.length === 0) {
        list.innerHTML = "<li>No images found</li>";
        return;
    }

    data.files.forEach(file => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = file.url;
        link.target = "_blank";
        link.innerText = file.key;

        const btn = document.createElement("button");
        btn.innerText = "Delete";
        btn.onclick = () => deleteFile(file.key);

        li.appendChild(link);
        li.appendChild(btn);
        list.appendChild(li);
    });
}
useEffect(() => {
  async function fetchImages() {
    await loadImages();
  }
  fetchImages();
}, [])
  async function uploadFile() {
    const file = document.getElementById("file").files[0];
    if (!file) {
        alert("Select a file first!");
        return;
    }

    

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", document.getElementById("user_id").value) || 1;

    const res = await fetch(`${HOST}/admin/upload`, { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
        alert("File uploaded!");
        loadImages();
    } else {
        alert("Upload failed");
    }
}
async function updateMessage() {
   
    const text = document.getElementById("message-text").value;
    if (!text) return alert("Enter a message");

    const res = await fetch(`${HOST}/update-message`, {  // <- changed endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const data = await res.json();
    if (data.status === "updated") {
        alert("Message updated!");
    } else {
        alert("Error: " + (data.error || JSON.stringify(data)));
    }
}

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Upload Image</h2>
      <input type="file" id="file" />
      <input type="numbere" id="user_id" />
      <button onClick={uploadFile}>Upload</button>
      <h2>Update Message</h2>
      <input type="text" id="message-text" placeholder="Enter message" />
      <button onClick={updateMessage}>Update Message</button>
      <h2>Current Images</h2>
      <ul id="images-list"></ul>
    </div>
  )



}

export default App
