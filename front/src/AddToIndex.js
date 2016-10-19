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
      <div>
        <RaisedButton label='Add 100 random names to index' onClick={this.populate100Names}/>
      </div>
    );
  }
}

export default AddToIndex;
