import React, { Component } from 'react';
import MapChart from './MapChart';

export default class Map extends Component {
    render() {
        return (
            <div className='container ui'>
                <div className='header'>
                    <div>
                        <h1>
                            Covid Map
                      </h1>
                    </div>
                </div>
                <div className="map-page">
                    <div className="map-container">
                    <h3>Map Box</h3>
                    
                    </div>
                    <div className= "control-panel">
                    <h3>Control Panel</h3>
                    <div>
                        <label>Term Sets</label>
                        <select multiple="" name='terms' className='ui dropdown form-control' onChange={this.handleInputChange}>
                                    <option defaultValue value="bca">Breast Cancer Terms</option>
                                    <option value="covid">COVID 19 Terms</option>
                                    <option value="ect">ECT..</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div>
      <MapChart />
    </div>
            </div>
        )
    }
}