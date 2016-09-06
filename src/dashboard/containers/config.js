import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import {CONFIG} from 'dashboard/config';
import {fetchConfigAction, fetchAllConfigsAction} from 'dashboard/reducers/actions';
import {makeGetConfig, getConfigRequest, getLogin, getLoginExpiresAt, getLoginValid} from 'dashboard/reducers/selectors';
import {Input, Textarea} from 'views';


class ConfigDisplay extends React.Component{
  /**
   * props:
   *   title: title of model
   *   model: model to display
   *   edit: function to call when editing
   */
  render(){
    return <div>
      <h4>{this.props.title}</h4>
      {Object.keys(this.props.model).map((i)=>{
        return <div key={i}>
          <h6>{i}</h6>
          <span>{JSON.stringify(this.props.model[i])}</span>
        </div>;
      })}
      <div className="button-row">
        <button className="button-outline" onClick={()=>{
          if(this.props.edit){
            this.props.edit();
          }
        }}>
          Edit
        </button>
      </div>
    </div>;
  }
}

class ConfigEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {data: Immutable.fromJS(this.props.model)};
  }

  /**
   * props:
   *   title: title of model
   *   model: model to edit
   *   error: error object
   *   cancel: function to call when cancelling edit
   *   check: function to call when verifying data
   *   save: function to call when saving edits
   */
  render(){
    return <div>
      <h4>{this.props.title}</h4>
      <div className="button-row">
        <button className="button-outline" onClick={()=>{
          if(this.props.cancel){
            this.props.cancel();
          }
        }}>
          Cancel
        </button>
        <button className="button-outline" onClick={()=>{
          if(this.props.check){
            this.props.check(this.state.data.toJSON());
          }
        }}>
          Check
        </button>
        <button className="button-primary" onClick={()=>{
          if(this.props.save){
            this.props.save(this.state.data.toJSON());
          }
        }}>
          Save
        </button>
      </div>
      {Object.keys(this.props.model).map((i)=>{
        return <Input key={i} label={i} value={JSON.stringify(this.state.data.get(i))} error={this.props.error && this.props.error[i]}
          handleBlur={(value)=>{this.setState({data: this.state.data.set(i, value)});}}/>
      })}
    </div>;
  }
}

class Config extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      edit: false,
      error: false
    };
  }

  componentWillMount(){
    this.props.fetchAllConfigs();
  }

  validate(configObject){
    
  }

  render(){
    const configlist = ['navigation'];
    return <div>
      <h1>Config</h1>
      {!this.props.config.loading && <div className="button-row">
        <button className="button-outline"
          onClick={()=>{
            this.props.fetchAllConfigs();
          }}>Refresh</button>
      </div>}
      {(!this.props.config.loading && !this.props.config.failed) && this.props.config.content &&
        <div>
          {!this.state.edit && Object.keys(this.props.config.content).map((i)=>{
            const err = {};
            Object.keys(this.props.config.content[i]).map((j)=>{
              err[j] = false;
            });
            return <ConfigDisplay key={i} title={i} model={this.props.config.content[i]} edit={()=>{this.setState({...this.state, edit: i, error: err});}}/>
          })}
          {this.state.edit &&
            <ConfigEdit title={this.state.edit} model={this.props.config.content[this.state.edit]} error={this.state.error}
              cancel={()=>{
                this.setState({...this.state, edit: false, error: false});
              }}
              check={(data)=>{

              }}
              save={(data)=>{

              }}/>
          }
        </div>
      }
    </div>;
  }
}

const makeMapStateToProps = ()=>{
  const getConfig = makeGetConfig();
  return (state)=>{
    return {
      config: getConfig(state),
      request: getConfigRequest(state),
      logininfo: getLogin(state),
      loginExpiresAt: getLoginExpiresAt(state)
    };
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    fetchConfig: (configid, method=false, body=false)=>{
      dispatch(fetchConfigAction(CONFIG.retrieve('baseConfigUrl'), configid, method, body));
    },
    fetchAllConfigs: ()=>{
      dispatch(fetchAllConfigsAction(CONFIG.retrieve('baseConfigUrl'), ['navigation']));
    },
    loginValid: (time)=>{
      return getLoginValid(time);
    }
  };
};

Config = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Config);

export {Config};