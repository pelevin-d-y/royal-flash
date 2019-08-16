const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

// Use the bodyparser middlware
app.use(BodyParser());

require("./mongo")(app);

router.get("/", async function (ctx) {
    let name = ctx.request.body.name || "World";
    ctx.body = {message: `Hello ${name}!`}
});

const logger = require('koa-logger');
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);