import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authActions';
import { clearCurrentProfile } from './redux/actions/profileActions';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';

import { SocketProvider } from './context/SocketContext';
import './styles/tailwind.css';

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = './login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SocketProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Route exact path="/" component={Home} />
              <div className="container">
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Switch>
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/profile" component={Profile} />
                </Switch>
              </div>
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </Provider>
    );
  }
}

export default App;
