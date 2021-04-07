const EventEmitter = require("events");
const HTTP = require("http");
const HTTPS = require("https");
const SocketIO = require("socket.io");
const crypto = require("crypto");

const app = require("./app");
const io = require("./io");

class StrawServer extends EventEmitter {
    constructor(config) {
        super();

        app.set("straw", this);
        this.config = config;
        this.serverLib = config.secure ? HTTPS : HTTP;
        this.server = this.serverLib.createServer(app);
        this.clients = [];
        io(this, SocketIO(this.server));
    }

    calculateSignature(ctx, secret) {
        const { blob, remoteSignature } = ctx;
        const hmac = crypto.createHmac("sha1", secret);
        const localSignature = `sha1=${hmac.update(blob).digest("hex")}`;

        const localBuffer = Buffer.from(localSignature, "utf8");
        const remoteBuffer = Buffer.from(remoteSignature, "utf8");

        const isValid = crypto.timingSafeEqual(localBuffer, remoteBuffer);
        return isValid;
    }

    authenticate(ctx) {
        delete ctx.deployKey;
        let index = this.clients.push(ctx) - 1;
        ctx.socket.on("disconnect", () => {
            this.clients.splice(index, 1);
        });
        ctx.socket.emit("authSuccess", ctx.projectID);
    }

    denyAuthentication (ctx, reason) {
        ctx.socket.emit("authFailed", ctx.projectID, reason);
    }

    listen(callback) {
        let port = this.config.port || 3000;
        this.server.listen(port);

        if (callback) {
            callback(port);
        }
    }

    deploy(ctx, callback) {
        let clientCount = 0;
        for (let client of this.clients) {
            if (client.projectID == ctx.projectID) {
                clientCount++;
                client.socket.emit("deploy", {
			projectID: ctx.projectID,
			branch: ctx.branch
		});
            }
        }

        if (callback) {
            callback(ctx.projectID, clientCount);
        }
    }
}

module.exports = StrawServer;
