import React from 'react';
import {connect} from 'react-redux';
import {interpreter} from 'bullet-mark';

import {CONFIG} from 'config';
import {fetchPageAction} from 'reducers/actions';
import {makeGetPage, getPageId} from 'reducers/selectors';
import {Section} from 'views';
import views from 'views';


class Pages extends React.Component{
  componentWillMount(){
    this.props.fetchPage();
  }

  render(){
    if(this.props.loading){
      return <span>loading</span>;
    } else if(this.props.failed){
      return <span>failed</span>;
    } else {
      return <Section>
        {interpreter(this.props.content, views)}
      </Section>;
    }
  }
}

const makeMapStateToProps = ()=>{
  const getPage = makeGetPage();
  return (state, props)=>{
    return getPage(state, props);
  };
};

const mapDispatchToProps = (dispatch, props)=>{
  return {
    fetchPage: ()=>{
      dispatch(fetchPageAction(CONFIG.retrieve('basePagesUrl'), getPageId(null, props)));
    }
  };
};

Pages = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Pages);

export {Pages};
