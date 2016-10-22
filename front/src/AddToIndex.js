import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import request from 'superagent';

class AddToIndex extends Component {

  populate100Names = async()=> {
    const queryResponse = await request.get('/populate');
    console.log(queryResponse);
  };

  render() {
    return (

      <section style={{display:'flex', justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
        <h2>Populate the database</h2>

        <RaisedButton label='Add 100 random names to index' onClick={this.populate100Names}/>
        <h3 >
          Have the node console up to see records being pushed to the index via the change feed
        </h3>
      </section>
    );
  }
}

export default AddToIndex;
