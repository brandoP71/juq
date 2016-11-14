import React, { Component } from 'react';
import styles from './styles.css';
import $ from 'jquery';

import SongFinderForm from './components/SongFinderForm'
import RequestResults from './components/RequestResults'
import UserPlaylist from './components/UserPlaylist'
import URLForm from './components/URLForm'
import RecommendedNext from './components/RecommendedNext'

var Firebase = require('firebase');

class UserPage extends Component {

  constructor() {
    super();

    this.addSongResult = this.addSongResult.bind(this);
    this.emptySongResults = this.emptySongResults.bind(this);

    this.state = {
      searchResults: []
    }
  }

  componentDidMount() {
   
  }

  componentDidUpdate() {

	}

  componentWillUpdate() {
  }

  addSongResult(songResult) {
    const currentResults = this.state.searchResults;
    currentResults.push(songResult);
    this.setState({ searchResults: currentResults });
  }

  emptySongResults() {
    this.setState({ searchResults: [] });
  }
  
  render() {
    const check = window.sessionStorage.getItem("pass");
    if (check === null) {
      return (<h1>No Authorization</h1>)
    }
    else {
      return (
        <div className={styles.flexRoot}>
          <SongFinderForm addSongResult={this.addSongResult} emptyResults={this.emptySongResults}/>
          <URLForm />
          <RequestResults searchResults={this.state.searchResults} jukeboxID={this.props.params.jukeboxID}/>
          <RecommendedNext />
          <UserPlaylist />
        </div>
      )
    }
  }
}

export default UserPage;