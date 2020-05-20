import React, { Component } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
export default class CovidMap extends Component {
    render() {
       return (
          <div className ='container ui'>
              <div className = 'header'>
                  <div>
                      <h1>
                          Health API Research Tool
                      </h1>
                  </div>
                
              </div>
          </div>
       )
    }
}