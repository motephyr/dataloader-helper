# dataloader-helper
handle has-one, has-many, belongs-to relationship.

Help you deal with the DataLoader issue
According to the example of https://github.com/graphql/dataloader

```
{
  me {
    name
    bestFriend {
      name
    }
    friends(first: 5) {
      name
      bestFriend {
        name
      }
    }
  }
}
```

Me and bestFriend are has-one relationships

Me and friends are has-many relationships

Plus the relationship for belongs-to, you need to write three different loaders to correspond to these three different relationships.

```
ex.
  //belong-to
  story: new DataLoader(ids => db.table('stories')
    .whereIn('id', ids).select()
    .then(rows => ids.map(id => rows.find(x => x.id === id)))),

  //has-many
  storiesByAuthorId: new DataLoader(ids => db.table('stories')
    .whereIn('author_id', ids).select()
    .then(rows => ids.map(id => rows.filter(x => x.author_id === id)))),
    
  //has-one
  storyByStoryMetaDataId: new DataLoader(ids => db.table('stories')
    .whereIn('story_meta_data_id', ids).select()
    .then(rows => ids.map(id => rows.find(x => x.story_meta_data_id === id)))),
```


dataloader-helper can help you to handle these situation.


# install
```
  npm install dataloader-helper
  or
  yarn add dataloader-helper
```

# usage

####Create a corresponding loader
Modify the contents of the Data Loader Helper constructor according to the data source you use.

```
const Database = use('Database')
const {DataLoaderHelper} = require('dataloader-helper')
const Loader = new DataLoaderHelper(async function (model, ref_id, keys) {
  // console.log(`*** loading all '${model}' with ids [${keys}] from database`)
  const data =  await Database
    .raw(`select * from ${model} where ${ref_id} = ANY(?)`, [keys])
    return data.rows
})
/**
 * Define your loaders here.
 * Each key should be a valid
 * instance of DataLoader.
 */
const loaders = () => ({
  stories: Loader.create('stories')
})
module.exports = loaders
```

####Put in our context of GraphQL

```
const createLoaders = require('./loaders')

server.use('/graphql', function(req, res) {
    return graphqlExpress({
        schema,
        context: { loaders: createLoaders() }
    })(req, res);
});
```

####Use in resolvers

```
const resolvers = {
  ...
  // author has many stories
  Author: {
    stories(author, _, { loaders: { stories } }) {
      return stories.load({ key: 'author_id', value: author.id, many: true })
    }
  },
  
  // storymetadata belongs to story
  StoryMetaData: {
    story(story_meta_data, _, { loaders: { stories } }) {
      return stories.load({ key: 'id', value: story_meta_data.story_id })
    }
  }
  
  // user borrow one story (has one book)
  User: {
    borrow_story(user, _, { loaders: { stories } }) {
      return stories.load({ key: 'borrower_id', value: user.id })
    }
  }
  ...
}
```

#Happy Coding!!