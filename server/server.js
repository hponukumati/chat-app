const { Server } = require("socket.io");
const io = new Server(5000, {
    cors: {
        origin: "*",
    },
});

let users = {}; // Object to store users with socketId as key and username as value
let messages = []; // Array to store messages

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("newUser", (username) => {
        users[socket.id] = username;
        io.emit("userList", Object.values(users));
        socket.emit("existingMessages", messages);
    });

    socket.on("sendMessage", (message) => {
        const msg = { user: users[socket.id], text: message, timestamp: new Date() };
        messages.push(msg);
        io.emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id];
        io.emit("userList", Object.values(users));
    });
});

console.log("Server is running on port 5000");
