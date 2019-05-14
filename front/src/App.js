import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Types, action } from './Actions';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Axios from 'axios';
import Admin from './Components/Admin';
import Receiver from './Components/Receiver';
import FromServer from './Components/FromServer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';

class App extends Component {
  componentWillMount() {
    Axios.get('/api/settings/config')
      .then(ret => { 
        this.props.setStoreState({settings: ret.data});
      })
      .catch((err) => console.error(`Failed to get configuration file: ${err.message}`));
    console.log(this.props)
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/receiver"]} component={Receiver} />
            <Route exact path="/admin" component={Admin} />
            <Route path="/*" component={FromServer} />
          </Switch>
        </BrowserRouter>
        <ToastContainer position="bottom-right"/>
      </div>
    );
  }
}

function mapDispatchWithProps(dispatch) {
  return {
    setStoreState: (payload) => dispatch(action(Types.SetStoreState, payload))
  };
}

export default connect(null, mapDispatchWithProps)(App);
