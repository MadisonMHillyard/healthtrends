import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import history from './history';
import QueryForm from './components/QueryForm'
import App from "./components/App"
import Map from "./components/Map"

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/QueryTrends" component={QueryForm} />
                    <Route path="/Map" component={Map} />
                </Switch>
            </Router>
        )
    }
}