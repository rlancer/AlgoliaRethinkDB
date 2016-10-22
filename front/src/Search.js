import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import request from 'superagent';
import algoliasearch from 'algoliasearch/lite';


class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {result: false, ready: false, selected: false};
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

  select = (hit)=>
    this.setState({selected: hit});

  deleteSelected = async()=> {
    this.clearSelected();
    await request.post(`/delete/${this.state.selected.id}`);
  };

  clearSelected = ()=>
    this.setState({selected: false});

  render() {

    const {selected, result, ready} = this.state;

    if (!ready)
      return <div>Search initializing...</div>;

    return (
      <section style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
        <h2>Search the index </h2>
        {selected ?
          <div>
            <div>
              <span style={{cursor:'pointer'}} onClick={this.deleteSelected}>delete</span>{" "}&middot;{" "}
              <span style={{cursor:'pointer'}} onClick={this.clearSelected}>clear</span>
            </div>
            <pre style={{border:'solid 1px #eee',borderRadius:4}}>
              <code>
                {JSON.stringify(selected, null, 5)}
              </code>
            </pre>
          </div> :
          false}

        <TextField onBlur={e=>window.setTimeout(()=>this.setState({result:false}),500)} onChange={this.search}
                   floatingLabelText='Search...'/>
        {result ? result.hits.map(hit=><div className="result" onClick={(h=>()=>this.select(h))(hit)}
                                            key={hit.id}>{hit.first} {hit.last}</div>) : false}
        <h3>Select any record to inspect it and then delete it</h3>

      </section>
    );
  }
}

export default Search;
