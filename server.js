import express from 'express';
import bodyParser from 'body-parser';
import rethinkdbdash from 'rethinkdbdash';
import algoliasearch from 'algoliasearch';
import config from './config';

// RethinkDB client, using rethinkdbdash for async await
const r = rethinkdbdash({db: 'algolia'});

// Algolia client
const algolia = algoliasearch(config.applicationId, config.adminApiKey);

// Create `users` index
const userIndex = algolia.initIndex('users');

// Sets the attributes to index
userIndex.setSettings({attributesToIndex: ['first', 'last']}).then();

(async()=> {
  // Create database `algolia` if it doesn't exist
  await r.dbList().contains('algolia').branch(true, r.dbCreate('algolia'));

  // Create table `users` if it doesn't exist
  await r.tableList().contains('users').branch(true, r.tableCreate('users'));

  // Listen to changes on tabale `users`
  (await r.table('users').changes()).each(async(err, item)=> {
    const {new_val, old_val} = item;
    if (new_val) {
      // Add changed values to the `users` index
      const resp = await userIndex.addObject({objectID: new_val.id, ...new_val});
      console.log('Added', new_val, '\nTo the `users` index', resp);
    }
  });
})();

const app = express();
app.use(express.static('front/build'));

app.use(bodyParser.urlencoded({
  extended: true
}));


const chance = require('chance').Chance();
app.get('/populate', async(req, res) => {

  // generates 100 random names with the help of chance.js
  const names = [];
  for (let i = 0; i < 100; i++)
    names.push({
      first: chance.first(),
      last: chance.last()
    });

  res.send({msg: 'DB response of adding 100 random names', ...(await r.table('users').insert(names))})

});

app.get('/searchClientKeys', (req, res) =>
  res.send({applicationId: config.applicationId, searchOnlyApiKey: config.searchOnlyApiKey}));

const port = process.env.PORT || 3006;

app.listen(port, ()=>console.info(`Listing on port ${port}`));
