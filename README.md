[RethinkDB](https://www.rethinkdb.com) + [Algolia](https://www.algolia.com) 
=================

Using realtime change feeds to make indexing a breeze! 
------------------------------------------------------

At [Collaborizm](https://www.collaborizm.com) we use search all over our app. 

Initially we used pure ReQL to power our search features, but as we grew, this became problematic as RethinkDB does not support proper indexing for search. 
After evaluating a few technologies, we went with Algolia. Luckily, implementing Algolia with RethinkDB was a breeze. 

This guide should provide the basic structure needed to hook up Algolia with RethinkDB. 
Leveraging realtime change feeds enables you to forget about wiring up all the places where data is changed in your app. 
Instead, you simply let the change feed tell you when data is changed and you send it over to Algolia.       

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

You should see
 
<img width="903" alt="screen shot 2016-10-22 at 1 18 25 am" src="https://cloud.githubusercontent.com/assets/1339007/19617127/e1852ee0-97f5-11e6-9b53-ff47c5e27ef6.png">

Click to add 100 random names to the DB, have the node console open to see the changefeed in action.

Click a search result to inspect it / delete it, have the node console open to see the changefeed handle deletes.

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


# Special considerations 

Since it's impossible to ensure that an update is properly indexed 100% of the time, it's important to provide a mechanism to resync any data that might have failed to sync via the changefeed.

In our app we do this via a Cron, which syncs recently modified data. This does lead to multi Algolia operations per an update, but it's the only reliable way to insure that data is properly synced even in edge case failure scenarios. 

Be sure to not to reindex too much data too frequently or else it could eat into your Algolia operations.
