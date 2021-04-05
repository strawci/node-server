const StrawServer = require("../");

const sourceKey = "12345";
const deployKey = "abcde";

const straw = new StrawServer({
    port: 5000,
    secure: false,
});

straw.on("server-commit", (ctx) => {
    if (straw.calculateSignature(ctx, sourceKey)) {
        console.log("Deploying project: " + ctx.projectID);
        straw.deploy(ctx.projectID, (_, count) => {
            console.log("Deployed for " + count + " clients");
        });
    }
});

straw.on("client-auth", (ctx) => {
    if (ctx.deployKey == deployKey) {
        console.log("A new client is listening for project: " + ctx.projectID);
        straw.authenticate(ctx);
    }
});

straw.listen((port) => {
    console.log("Listening on port " + port);
});
