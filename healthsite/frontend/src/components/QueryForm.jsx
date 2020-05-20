import React, { Component } from 'react';
import Footer from './Footer';
import Header from './Header';
import DateInput from './DateInput';
import WorkingPopup from './WorkingPopup';
import Form from 'react-bootstrap/Form';
import { format, addWeeks, subWeeks, parse, isFuture, differenceInWeeks } from 'date-fns'
import axios from "axios";
import GoogleLogin from 'react-google-login';
import getCookie from './../helper';



var $ = require('jquery');
var numRegex = /^\d+/;
var dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
const responseGoogle = (response) => {
    console.log(response);
  }
export default class QueryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            folderLink: '',
            folder: 'First Test',
            spreadsheet: '',
            numRuns: '',
            freq: 'week',
            geo: 'us',
            startDate: '',
            endDate: '',
            numWeek: '',
            endToday: false,
            terms: '',
            err: {
                folder: '',
                spreadsheet: '',
                numRuns: '',
                startDate: '',
                endDate: '',
                numWeek: '',
                terms: '',
            }
        };

        this.getFolderLink = this.getFolderLink.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleEndTodayChange = this.handleEndTodayChange.bind(this);
        this.handleNumWeekChange = this.handleNumWeekChange.bind(this);
        this.newQuery = this.newQuery.bind(this);
    }

    getFolderLink() {
        $.get(window.location.href + 'api/submit', (data) => {
            console.log(data);
            //    this.personaliseGreeting(data);
        });
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        let err = this.state.err;
        console.log(name, value);
        switch (name) {
            case 'folder':
                err.folder =
                    value.length >= 1
                        ? ''
                        : 'Folder must be named';
                break;
            case 'spreadsheet':
                err.spreadsheet =
                    value.length >= 1
                        ? ''
                        : 'Spreadsheet must be named';
                break
            case 'terms':
                err.terms =
                    value.length >= 1
                        ? ''
                        : 'Terms must be added to search, separated by commas';
                break
            case 'numRuns':
                err.numRuns =
                    numRegex.test(value)
                        ? ''
                        : 'Must be a Number';
                break;
            case 'endToday':
                this.handleEndTodayChange(value);
                break;
            case 'startDate':
                err.startDate =
                    dateRegex.test(value)
                        ? isFuture(parse(value, 'MM/dd/yyyy', new Date()))
                            ? 'Date cannot be a future date'
                            : ''
                        : 'Date must be in MM/DD/YYYY format';
                if (err.startDate === 'Date cannot be a future date') {
                    alert(err.startDate);
                }
                else {
                    this.handleDateChange(name, value, err);
                }

                break;
            case 'endDate':
                err.endDate =
                    dateRegex.test(value)
                        ? isFuture(parse(value, 'MM/dd/yyyy', new Date()))
                            ? 'Date cannot be a future date'
                            : ''
                        : 'Date must be in MM/DD/YYYY format';
                if (err.endDate === 'Date cannot be a future date') {
                    alert(err.endDate);
                }
                else {
                    this.handleDateChange(name, value, err);
                }

                break;
            case 'numWeek':
                err.numWeek =
                    (parseInt(value) < 0) //maybe a or statement??
                        ? ''
                        : 'Number must be positive';
                if (err.numWeek) {
                    alert(err.numWeek);
                }
                else {
                    this.handleNumWeekChange(value, err);
                }

                break;
            default:
                break;
        }
        this.setState({
            err,
            [name]: value
        });
        console.log(err)
    }

    handleNumWeekChange(value, err) {
        if (this.state.startDate && !this.state.err.startDate) {
            var endDate = format(addWeeks(parse(this.state.startDate, 'MM/dd/yyyy', new Date()), value), "P");
            err.numWeek = isFuture(parse(this.state.endDate, 'MM/dd/yyyy', new Date())) ? 'End date cannot be a future date' : '';
            if (!err.numWeek) {
                this.setState({
                    endDate: endDate
                });
            }
        }
        else if (this.state.endDate && !this.state.err.endDate) {
            var startDate = format(subWeeks(parse(this.state.endDate, 'MM/dd/yyyy', new Date()), value), "P");
            this.setState({
                startDate: startDate
            });
        }
    }

    handleDateChange(name, value, err) {
        if (!this.state.err.startDate && !this.state.err.endDate) {
            var endDate = this.state.endDate;
            var startDate = this.state.startDate;
            var numWeek = this.state.numWeek;
            //if endDate
            if (this.state.startDate && name === 'endDate') {
                endDate = value;
                numWeek = differenceInWeeks(parse(endDate, 'MM/dd/yyyy', new Date()), parse(startDate, 'MM/dd/yyyy', new Date()))
            }
            //if stateDate
            if (this.state.endDate && name === 'startDate') {
                startDate = value;
                numWeek = differenceInWeeks(parse(endDate, 'MM/dd/yyyy', new Date()), parse(startDate, 'MM/dd/yyyy', new Date()))
            }

            //if startDate is after endDate 
            err.numWeek =
                (numWeek > 0 && numWeek)
                    ? ''
                    : 'Start Date must be before End Date';
            if (err.numWeek && startDate && endDate) {
                alert(err.numWeek);
            }
            this.setState({
                err,
                numWeek: numWeek
            });
        }
        return;
    }

    handleEndTodayChange(value) {
        if (value) {
            var loc_end = format(new Date(), "P");
            this.setState({
                endDate: loc_end
            });
        }
    }

    validateInputs(err) {
        let valid = true;
        Object.values(err).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        if (!(this.state.folder
            && this.state.spreadsheet
            && this.state.numRuns
            && this.state.startDate
            && this.state.endDate
            && this.state.terms)) {
            valid = false;
        }
        return valid;
    }

    handleSubmit(e) {

        e.preventDefault();
        var url = window.location.origin + "/api/submit";
        var folder = this.state.folder;
        var spreadsheet = this.state.spreadsheet;
        var numRuns = this.state.numRuns;
        var freq = this.state.freq;
        var geo = this.state.geo;
        var startDate = this.state.startDate;
        var endDate = this.state.endDate
        var terms = this.state.terms;

        var data = {
            folder: folder,
            spreadsheet: spreadsheet,
            num_runs: numRuns,
            freq: freq,
            geo: geo,
            start_date: startDate,
            end_date: endDate,
            terms: terms
        };

        console.log('DATA', data);
        // axios.defaults.headers.post['X-CSRF-Token'] = getCookie('csrftoken');
        axios.defaults.xsrfCookieName = 'csrftoken'
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios
            .post("http://127.0.0.1:8000/query", data)
            .then(res => {
                alert(res.data)
            })
        // event.preventDefault();

        // if(this.validateInputs(this.state.err)){
        //     this.togglePopup(e);

        //     $.ajax({
        //         crossOrigin:true,
        //         url:url,
        //         dataType:'json',
        //         type:'POST',
        //         data: JSON.stringify(data),
        //         contentType: 'application/json; charset=utf-8',
        //         success: function(data){
        //             this.setState({
        //                 folderLink:data.message
        //             });
        //             // alert(data.message);
        //         }.bind(this),
        //         error: function(xhr, status, err){
        //         alert('Poll creation failed: ' + err.toString());
        //         }.bind(this)
        //     });
        // }
        // else{
        //     alert('Some fields have not been filled.')
        // }
    }

    togglePopup(e) {
        e.preventDefault();
        console.log("TOGGLE POPUP");
        let val = this.validateInputs(this.state.err);
        console.log(val);
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    newQuery() {
        let err = this.state.err;
        err.folder = '';
        err.spreadsheet = '';
        err.numRuns = '';
        err.startDate = '';
        err.endDate = '';
        err.numWeek = '';
        err.terms = '';
        this.setState({
            spreadsheet: '',
            numRuns: '',
            freq: '',
            geo: '',
            startDate: '',
            endDate: '',
            numWeek: '',
            endToday: false,
            terms: '',
        });
    }

    handleNewQuery(e) {
        e.preventDefault();
        console.log('in Handle new Query')
        this.newQuery();
        this.togglePopup(e);
        console.log('end of handleNew query')
    }

    render() {
        return (
            <div className='container text-box'>
                <form className='ui form container' role='form' onSubmit={this.handleSubmit}>
                    <h2>File Setup</h2>
                    <div className='container drive-sec'>
                        <div className='field'>
                            <label>Folder Name</label>
                            <input
                                type='text'
                                name='folder'
                                className={`'form-control ' 
                                    ${this.state.err.folder ? 'inval' : ''}`}
                                placeholder='Folder Name'
                                onChange={this.handleInputChange} />
                        </div>
                        <div className='field'>
                            <label>Spreadsheet Name</label>
                            <input
                                type='text'
                                name='spreadsheet'
                                className={`'form-control spreadsheet' 
                                    ${this.state.err.spreadsheet ? 'inval' : ''}`}
                                placeholder='Spreadsheet Name'
                                onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <br />
                    <h2>Query</h2>
                    <div className='container '>

                        <div className='form-sec form-sec-row'>
                            <div className='field sub-sec-row'>
                                <label>Number of Runs </label>
                                <input
                                    type='text'
                                    name='numRuns'
                                    className={`'form-control num-runs ' 
                                    ${this.state.err.numRuns ? 'inval' : ''}`}
                                    placeholder='Number of Runs'
                                    onChange={this.handleInputChange} />
                            </div>
                            <br />
                            <div className='field sub-sec-row'>
                                <label>Frequency</label>
                                <select multiple="" name='freq' className='ui dropdown form-control' onChange={this.handleInputChange}>
                                    <option defaultValue value="week">Week</option>
                                    <option value="day">Day</option>
                                    <option value="month">Month</option>
                                    <option value="year">Year</option>
                                </select>
                            </div>
                            <div className='field sub-sec-row'>
                                <label>Geographical Area </label>
                                <select multiple="" name='geo' className='ui dropdown form-control' onChange={this.handleInputChange}>
                                    <option defaultValue value="US">US</option>
                                </select>
                            </div>
                        </div>
                        <div className='form-sec'>
                            <div className='date-range form-sec'>
                                <div className='date-level'>
                                    <div className='d1'>
                                        <div className='field date-in'>
                                            <label>Start Date</label>
                                            <input
                                                type='text'
                                                name='startDate'
                                                className={`form-control date-input 
                                                ${this.state.err.startDate ? 'inval' : ''}`}
                                                placeholder='mm/dd/yyyy'
                                                value={this.state.startDate}
                                                onChange={this.handleInputChange} />
                                        </div>
                                        <div className='field date-in'>
                                            <label>End Date</label>
                                            <input
                                                type='text'
                                                name='endDate'
                                                className={`form-control date-input 
                                                ${this.state.err.endDate ? 'inval' : ''}`}
                                                placeholder='mm/dd/yyyy'
                                                value={this.state.endDate}
                                                onChange={this.handleInputChange} />
                                        </div>
                                    </div>
                                    <div className='d1'>
                                        <div className='field date-level date-in'>
                                            <label>Number of Weeks</label>
                                            <input
                                                type='text'
                                                name='numWeek'
                                                className={`'form-control num-week-input date-input'
                                                ${this.state.err.numWeek ? 'inval' : ''}`}
                                                placeholder='# Weeks'
                                                value={this.state.numWeek}
                                                onChange={this.handleInputChange} />
                                        </div>
                                        <div className='field num-w'>
                                            <label>End Range Today</label>
                                            <input
                                                type='checkbox'
                                                name='endToday'
                                                className='form-control date-input endToday'
                                                value={this.state.endToday}
                                                onChange={this.handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='field form-sec'>
                            <label>Terms</label>
                            <input
                                type='text'
                                name='terms'
                                className={`'form-control ' 
                                ${this.state.err.terms ? 'inval' : ''}`}
                                placeholder='Terms'
                                onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <br />
                    <div className='container for-sec'>
                        <button className="ui btn btn-primary btn-block" type="submit">Submit</button>
                        <GoogleLogin
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />,
                        {this.state.showPopup ?
                            <WorkingPopup
                                text='Working on the Query'
                                backToQuery={this.togglePopup.bind(this)}
                                newQuery={this.handleNewQuery.bind(this)}
                                folderLink={this.state.folderLink}
                            />
                            : null}
                    </div>
                    {/* <div className = 'container for-sec'>
                        <button className="ui btn btn-primary btn-block" type="submit">Submit</button>
                    </div> */}
                </form>
            </div>
        )
    }

}
