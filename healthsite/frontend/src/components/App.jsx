

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import history from './../history';
// import logo from './../logo.svg';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }
    // handlesignin(){
    //     auth2.grantOfflineAccess().then(signInCallback);
    // }
    render() {
        return (
            <div className='container page-container'>
                {/* <header className="App-header"> */}
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <div>
                    <h1>Welcome to the Health Trends App!</h1>
                    <h2>Researcher: Dr. John Nakayama</h2>
                    <h3>Developer: Madison Hillyard</h3>
                </div>

                <div>
                    <div className='query-button'>
                        <form>
                            <Button variant="ui btn btn-primary btn-block" onClick={() => history.push('/QueryTrends')}>Make a Health Trends Query</Button>
                        </form>
                    </div>
                    {/* <div className='map-button'>
                        <form>
                            <Button variant="ui btn btn-primary btn-block" onClick={() => history.push('/Map')}>Check out our Covid Map</Button>
                        </form>
                    </div> */}
                </div>
            </div>
        )
    }

}