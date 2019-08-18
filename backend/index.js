const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const data = require("./localization")
const ObjectID = require("mongodb").ObjectID;
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();
app.use(cors());
// Use the bodyparser middlware
app.use(BodyParser());

require("./mongo")(app);

const filteredData = data.map((el) => {
    return {
        id: el['№'],
        name: el['ФИО'],
        registred: false
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

// Get one
router.get("/people/:id", async (ctx) => {
    ctx.body = await ctx.app.people.findOne({"id": ctx.params.id});
});

router.post("/people/:id", async (ctx) => {
    let documentQuery = {"id": ctx.params.id}; // Used to find the document
    const currentDocument = await ctx.app.people.findOne(documentQuery)
    console.log('currentDocument.registred', currentDocument.registred)
    if (currentDocument.registred === false) {
        let valuesToUpdate = ctx.request.body;
        // { "registred": true, "field1": "крутой1", "field2": "крутой2", "field3": "крутой3"}
        await ctx.app.people.updateOne(documentQuery, {$set: valuesToUpdate});
        ctx.body = {
            response: {
                status: 'true',
                description: 'updated'
            }
        }
    } else {
        ctx.body = {
            response: {
                status: 'true',
                description: 'replay'
            }
        }
    }
});

const logger = require('koa-logger');
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);