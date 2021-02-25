import React from 'react';
import { connect } from 'react-redux';
import Submarine from '../Submarine';
import { fetchPairs } from '../../actions/submarineActions';
import './style.scss';

function App({ dispatch }) {
  dispatch(fetchPairs());

  return (
    <div className="App">
      <header className="App-header">
        <Submarine />
      </header>
    </div>
  );
}

export default connect()(App);
