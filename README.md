# 🍓 StrawCI Server

This package is in charge of communicating the client with Github.

## 👷 Constructor

```javascript
const StrawServer = require("@strawci/server");
const server = new StrawServer({
    port: 3000,
});
```

### 💻 Functions

#### Listen HTTP Server

```javascript
server.listen((port) => {
    console.log("Listening on port " + port);
});
```

#### Listen for Commits

```javascript
server.on("server-commit", (ctx) => {
    ctx.blob; // Returns the Github's request as a String
    ctx.projectID; // Returns the ProjectID
    ctx.branch; // Returns the commit branch
    ctx.remoteSignature; // Returns the Github's signature
});
```

### Listen for Client Authentication

```javascript
server.on("client-auth", (ctx) => {
    ctx.deployKey; // Returns the client's deploy key.
    ctx.projectID; // Returns the client's project ID.
    ctx.socket; // Returns the client's socket.
});
```

### Authenticate Clients

```javascript
server.on("client-auth", (ctx) => {
    if (ctx.deployKey == "my_deploy_key") {
        server.authenticate(ctx);
    }
});
```

### Check Github signature

```javascript
server.on("server-commit", (ctx) => {
    if (server.calculateSignature(ctx, "my_source_key")) {
        console.log("Verified commit from Github!");
    }
});
```

### Deploy a project

```javascript
server.deploy("project-id", (projectID, count) => {
    console.log(ProjectID + " deployed for " + count + " clients.");
});
```

### ❤️ The End

Made with Love by [Sammwy](https://twitter.com/sammwy)</a>
