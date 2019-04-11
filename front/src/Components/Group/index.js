import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SetStoreState } from '../../Actions';
import Display from '../Display';
import Socket from './socket';

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Unassigned',
            description: 'Newly created group'
        };
        const socket = Socket(this);
    }

    render() {
        return (
            <div className="card">
                <div className="card-header" style={{padding: "5px 10px 0px 10px"}}>
                    <div className="card-title mb-0">
                        {this.state.title}
                    </div>
                    <div className="card-subtitle mb-2 text-muted margin-0">
                        {this.state.description}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-sm"><Display /></div>
                        <div className="col-sm"><Display /></div>
                        <div className="col-sm"><Display /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-sm"><Display /></div>
                        <div className="col-sm"><Display /></div>
                        <div className="col-sm"><Display /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-sm"><Display /></div>
                        <div className="col-sm"><Display /></div>
                        <div className="col-sm"><Display /></div>
                    </div>
                </div>
                <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-light w-50 border-right rounded-0">Add a new dashboard</button>
                    <button type="button" className="btn btn-light w-50 border-left rounded-0">Preview</button>
                </div>
            </div>
        );
    }
};

function mapDispatchToProps(dispatch) {
    return ({
        setStoreState: (payload) => dispatch(SetStoreState(payload))
    });
}

export default withRouter(connect(null, mapDispatchToProps)(Group));