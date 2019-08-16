const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const data = require("./localization")

const app = new Koa();
const router = new Router();

// Use the bodyparser middlware
app.use(BodyParser());

require("./mongo")(app);

const filteredData = data.map((el) => {
    return {
        id: el['№'],
        name: el['ФИО']
    }
})

router.get("/", async function (ctx) {
    let name = ctx.request.body.name || "World";
    ctx.body = {message: `Hello ${name}!`}
});

router.get("/people", async (ctx) => {
    // await app.people.remove({})
    let countDocuments = await app.people.countDocuments()
    if (countDocuments === 0) {
        await app.people.insertMany(filteredData)
    }

    countDocuments = await app.people.countDocuments()
    ctx.body = await ctx.app.people.find().toArray();
});

const logger = require('koa-logger');
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);