import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import randomNameGenerator from './randomNameGenerator';

const r = require("rethinkdbdash")({db: 'algolia'});

// Setup database and table
(async()=> {
    await r.dbList().contains('algolia')
        .do(exists =>r.branch(exists, true, r.dbCreate('algolia')));

    await r.tableList().contains('users')
        .do(exists =>r.branch(exists, true, r.tableCreate('users')));
})();

const app = express();
app.use(express.static('front/build'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/populate', async(req, res) =>
    res.send({msg: 'DB response of adding 100 random names', ...(await r.table('users').insert(randomNameGenerator(100)))}));

const port = process.env.PORT || 3006;

app.listen(port, () => {
    console.info(`Listing on port ${port}`);
});
