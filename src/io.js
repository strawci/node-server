module.exports = (straw, io) => {
    io.on("connect", (socket) => {
        socket.on("auth", (projectID, deployKey) => {
            if (!projectID || !deployKey) {
                return socket.disconnect();
            }

            const ctx = {
                socket,
                projectID,
                deployKey,
            };

            straw.emit("client-auth", ctx);
        });
    });
};
