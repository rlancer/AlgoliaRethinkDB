import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import request from 'superagent';
import algoliasearch from 'algoliasearch/lite';


class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {result: false, ready: false};
  }

  search = async e =>
    this.setState({result: await this.usersIndex.search(e.target.value)});

  async  componentDidMount() {
    try {
      // Generally config will not be included like this, just a hack to make setup easier
      const config = process.env.NODE_ENV === 'development' ? require('../config') : (await request.get('/searchClientKeys')).body;
      this.searchClient = algoliasearch(config.applicationId, config.searchOnlyApiKey);
      this.usersIndex = this.searchClient.initIndex('users');
      this.setState({ready: true});
    } catch (err) {
      console.log(err);
    }
  }

  render() {

    const {result, ready} = this.state;

    if (!ready)
      return <div>Search initializing...</div>;

    return (
      <div>
        <TextField onChange={this.search} floatingLabelText='Search...'/>
        {result ? result.hits.map(hit=> <div key={hit.id}>{hit.first} {hit.last}</div>) : false}
      </div>
    );
  }
}

export
default
Search;
