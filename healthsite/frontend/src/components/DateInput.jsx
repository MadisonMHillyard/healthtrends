import React from 'react';
import {format, addWeeks, subWeeks, parse, isFuture, differenceInWeeks} from 'date-fns'

export default class DateInput extends React.Component {
    constructor(props){
       super(props);
       this.state = {numWeek: '',
                    startDate: '',
                    endDate: '',
                    endToday: false,
                    startDateError: '',
                    endDateError:'',
                    numWeekError:''
                };

       this.handleInputChange = this.handleInputChange.bind(this)
       this.validateDateFormat = this.validateDateFormat.bind(this)
    };

    //Validate that the input is in the correct date format 
    validateDateFormat(date){
        const d = date
        //regular expression for mm/dd/yyyy (values are not checked)
        var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        return re.test(d)? true: false;
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        var loc_start = this.state.startDate;
        var loc_end = this.state.endDate;
        var err = ''
        
        //End Range Today checked
        if(target.name === 'endToday'){
            if(target.checked){
                loc_end = format(new Date(),"P")
                this.setState({
                    endDate:loc_end,
                    [name]:value
                });
            }
            //if unchecked don't delete entry
            this.setState({
                [name]:value
            });
        }

        //if number of weeks is defined
        else if(target.name === 'numWeek'){
            //if startDate is defined already
            if (this.state.startDate !== '' && this.state.startDateError === ''){
                loc_end = format(addWeeks(parse(this.state.startDate, 'MM/dd/yyyy', new Date()), value), "P");
                
                //check that endDate is not a future date
                err = isFuture(parse(loc_end, 'MM/dd/yyyy', new Date())) ? 'End date cannot be a future date': '';
                if(err){
                    this.setState({
                        [`${name}Error`]: err
                    });  
                }
                else{
                    this.setState({
                        [name]: value,
                        endDate: loc_end,
                        [`${name}Error`]: err
                    });
                }
                
                
            }
            //if endDate is defined already with no start date
            else if (this.state.endDate !== '' && this.state.endDateError === ''){
                loc_start = format(subWeeks(parse(this.state.endDate, 'MM/dd/yyyy', new Date()), value), "P");
                this.setState({
                    [name]: value,
                    startDate: loc_start
                });
            }
            //if no dates have been defined
            else{
                loc_end = format(new Date(), "P");
                loc_start = format(subWeeks(parse(loc_end, 'MM/dd/yyyy', new Date()), value), "P");
                this.setState({
                    [name]: value,
                    startDate: loc_start,
                    endDate: loc_end
                });

            }
        }

        //if dates are changed
        else{
            if(name ==='endDate'){
                loc_end = value
            }
            if (name ==='startDate'){
                loc_start = value
            }
            this.setState({[name]:value});
            err = this.validateDateFormat(value)? isFuture(parse(value, 'MM/dd/yyyy', new Date())) ? 'Date cannot be a future date': '':'Date must be in MM/DD/YYYY format';
            this.setState({
                [`${name}Error`]: err
            });
            
            if(err === 'Date cannot be a future date'){
                alert(err);
            }
        }


        if(!err && (this.state.endDate || loc_start) && (this.state.endDate || loc_end) ){
            this.setState({
                numWeek:differenceInWeeks(parse(loc_end, 'MM/dd/yyyy', new Date()), parse(loc_start, 'MM/dd/yyyy', new Date()))
            });
            
        }
        //update parent component
        if(!err){
            this.props.action(loc_start, loc_end);
        }

    }

    render(){
        return(
            <div>
            <div className='date-range form-sec'>
                <div className= 'date-level'>
                    <div className = 'd1'>
                        <div className = 'date-in'>
                            <label>Start Date</label>
                            <input 
                                type = 'text' 
                                name='startDate' 
                                className={`form-control date-input 
                                ${this.state.startDateError ? 'inval' :''}`}
                                placeholder='mm/dd/yyyy'
                                value = {this.state.startDate}
                                onBlur = {this.validateDateFormat}
                                onChange = {this.handleInputChange}/>
                        </div>
                        <span><h4>{this.state.startDateError}</h4></span>
                        <div className = 'date-in'>
                            <label>End Date</label>
                            <input 
                                type = 'text' 
                                name='endDate' 
                                className={`form-control date-input 
                                ${this.state.endDateError ? 'inval' :''}`}
                                placeholder='mm/dd/yyyy'
                                value = {this.state.endDate}
                                // onBlur = {this.validateDateFormat}
                                onChange = {this.handleInputChange}/>
                        </div>
                        <span>{this.state.endDateError}</span>
                    </div>
                    <div className = 'd1'>
                        <div className = 'date-level date-in'>
                            <label>Number of Weeks</label>
                            <input 
                                type = 'text'
                                name = 'numWeek'
                                className = 'form-control num-week-input date-input'
                                placeholder = '# Weeks'
                                value = {this.state.numWeek}
                                onChange = {this.handleInputChange}/>
                        </div>
                        <div className= 'num-w'>
                            <label>End Range Today</label>
                            <input
                                type = 'checkbox'
                                name='endToday' 
                                className='form-control date-input endToday' 
                                value = {this.state.endToday}
                                onChange = {this.handleInputChange}/>
                        </div>
                    </div>
                </div>
                <br/>
                
            </div>
        </div>
        );
    }
}