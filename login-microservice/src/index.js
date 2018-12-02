require("dotenv-safe").load();
const rotas = require('./api/user');
const server = require("./server/server");
const repository = require("./repository/repository");
server.start(rotas, repository, (err, app) => {
    console.log("just started");
});