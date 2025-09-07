document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const messageList = document.getElementById("message-list");
  const roomNameElement = document.getElementById("room-name");
  const roomImageElement = document.getElementById("room-image");

  // ID user
  const currentUserID = "customer@mail.com";

  // Main function
  async function loadMessages() {
    try {
      const response = await fetch("extended_payload.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const roomData = data.results[0].room;
      const comments = data.results[0].comments;
      const participants = data.results[0].room.participant;

      roomNameElement.textContent = roomData.name;
      roomImageElement.src = roomData.image_url;
      roomImageElement.alt = roomData.name;

      const participantMap = new Map();
      participants.forEach((p) => participantMap.set(p.id, p.name));

      messageList.innerHTML = "";

      // Render each message
      comments.forEach((message) => {
        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");

        if (message.sender === currentUserID) {
          bubble.classList.add("sent");
        }

        const senderName = document.createElement("div");
        senderName.classList.add("sender-name");
        senderName.textContent =
          participantMap.get(message.sender) || "Unknown User";

        const content = document.createElement("div");
        content.classList.add("message-content");

        // Render by message type
        switch (message.type) {
            case "text":
            content.textContent = message.message;
            break;
            case "image":
            content.innerHTML = `<img src="${message.message}" alt="Image from ${senderName.textContent}">`;
            break;
            case "video":
            content.innerHTML = `<video controls width="250"><source src="${message.message}" type="video/mp4">Your browser does not support the video tag.</video>`;
            break;
            case "pdf":
            const filename = message.extras
                ? message.extras.filename
                : "Document.pdf";
            content.innerHTML = `
                    <div>
                        <div class="pdf-info">
                            <span>📄</span>
                            <span>${filename}</span>
                        </div>
                        <a href="${message.message}" target="_blank" class="open-button">Open</a>
                    </div>`;
            break;
            default:
            content.textContent = "[Unsupported message type]";
        }

        if (message.sender !== currentUserID) {
          bubble.appendChild(senderName);
        }
        bubble.appendChild(content);
        messageList.appendChild(bubble);
      });

      // Scroll to bottom
      messageList.scrollTop = messageList.scrollHeight;
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
      messageList.textContent = "Gagal memuat pesan. Silakan cek console.";
    }
  }

  loadMessages();
});
