[RethinkDB](https://www.rethinkdb.com) + [Algolia](https://www.algolia.com) 
=================

Using realtime change feeds to make indexing a breeze! 
-----------

### Running the code
*Requires [Node.js](https://nodejs.org) v4.x or higher*



**From the terminal** 
```bash  
 $ git clone git@github.com:rlancer/AlgoliaRethinkDB.git
 $ cd AlgoliaRethinkDB
 # Edit config.js with your api keys from Algolia 
 $ vim config.js 
 $ rethinkdb
 $ npm i
 $ npm run dev
```
If that all worked visit [http://localhost:3006](http://localhost:3006) to launch the UI

### Important parts of the code
```javascript
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
```



