const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/integration/hook/:project", (req, res) => {
    if (req.headers["x-github-event"] == "push") {
        const refs = req.body["ref"].split("/");

        const branch = refs[refs.length - 1];
        const projectID = req.params["project"];
        const blob = JSON.stringify(req.body);

        const ctx = {
            blob,
            branch,
            projectID,
            remoteSignature: req.get("X-Hub-Signature"),
        };

        app.get("straw").emit("server-commit", ctx);
    } else if (req.headers["x-github-event"] == "ping") {
        app.get("straw").emit("server-ping", req.params["project"]);
    }

    res.end();
});

/*
app.all("*", (req, res) => {
    res.redirect("https://strawci.com");
});
*/

module.exports = app;
