import React, {Component} from 'react';
import Search from './Search';
import AddToIndex from './AddToIndex';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App" style={{display: 'flex', flexDirection: 'column', alignItems:'center',justifyContent: 'center'}}>
        <h1>Welcome to the Algolia + RethinkDB demo</h1>
        <Search/>
        <AddToIndex/>
      </div>
    );
  }
}

export default App;
