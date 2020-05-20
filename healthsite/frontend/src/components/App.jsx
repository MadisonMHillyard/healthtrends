

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import history from './../history';
import Footer from './Footer'
import Header from './Header'
import QueryForm from './QueryForm'
import logo from './../logo.svg';

export default class App extends Component {
    constructor(props){
        super(props);  
        this.state = { };

    }
    // handlesignin(){
    //     auth2.grantOfflineAccess().then(signInCallback);
    // }
    render() {
        return (
            <div className='container page-container'>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Welcome to the Health Trends App!
        </p>
                    <p>Dr. John Nakayama and Madison Hillyard</p>
                    <form>
                        <Button variant="btn btn-success" onClick={() => history.push('/QueryTrends')}>Make a Health Trends Query</Button>
                    </form>
                    <form>
                        <Button  variant="btn btn-success" onClick={() => history.push('/CovidMap')}>Make a Health Trends Query</Button>
                    </form>
                </header>
                {/* <div className = 'content-wrap'>
                    <Header/>
                    <div className = 'container'>
                        <QueryForm />
                    </div>
                    <Footer/>
                </div> */}
            </div>
        )
    }

}