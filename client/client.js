const io = require("socket.io-client");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    rl.question("Enter your username: ", (username) => {
        socket.emit("newUser", username);
        console.log("Welcome to the chat, " + username + "!");
        listenForUserInput();
    });
});

socket.on("userList", (users) => {
    console.log("Online Users: " + users.join(", "));
});

socket.on("existingMessages", (messages) => {
    messages.forEach((message) => displayMessage(message));
});

socket.on("receiveMessage", (message) => {
    displayMessage(message);
});

function listenForUserInput() {
    rl.on("line", (input) => {
        socket.emit("sendMessage", input);
    });
}

function displayMessage(message) {
    console.log(`[${message.timestamp}] ${message.user}: ${message.text}`);
}

function listenForUserInput() {
    rl.on("line", (input) => {
        if (input === "/exit") {
            console.log("Disconnecting...");
            socket.disconnect();
            rl.close(); // Don't forget to close the readline interface
            process.exit(); // Exit the process
        } else {
            socket.emit("sendMessage", input);
        }
    });
}

// Keep the existing SIGINT handler for graceful exit when using Ctrl+C
process.on("SIGINT", function() {
    console.log("Disconnecting...");
    socket.disconnect();
    rl.close(); // Ensure the readline interface is closed here as well
    process.exit();
});
