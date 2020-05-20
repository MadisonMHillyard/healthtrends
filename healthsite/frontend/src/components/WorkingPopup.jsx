import React from 'react';    

export default class WorkingPopup extends React.Component {  
    constructor(props){
        super(props);
    }
    
    render() {
        const folderLink = this.props.folderLink;
        let message;
        if(folderLink){
            message = <h3 href = {this.props.folderLink}>Folder Link</h3>;
        } else {
            message = <h3 className = 'status-bar'>working...</h3>;
        }
        return (  
            <div className='popup'>  
                <div className='popup-inner'> 
                    <div className='pi'>
                        <div className = 'pi1'>
                            <h1>{this.props.text}</h1>  
                            <div>
                                {message}
                            </div>
                        </div>
                        <div className = 'pi2'>
                            <div className = ''>
                                <button className = 'ui btn btn-primary btn-block' onClick={this.props.backToQuery}>Go Back to Query</button>
                            </div>
                            <div className = ''>
                                <button className = 'ui btn btn-primary btn-block' onClick={this.props.newQuery}>New Query</button>
                            </div>
                        </div>
                    </div> 
                </div>  
            </div>  
        );  
    }  
}  
