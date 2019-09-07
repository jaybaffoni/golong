import React, { Component } from 'react';

class Loader extends Component {
    
    render() {
        return (
            <div style={{textAlign:'center', marginTop:'25px'}}>
                <div style={{}} className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            
    );
  }
}

export default Loader;