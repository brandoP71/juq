import React, { Component } from 'react';
import styles from './styles.css';
import ReactPlayer from 'react-player';

import './defaults.scss';
import './App.scss';
import './Range.scss';

// Firebase
//var Rebase = require('re-base');
//var base = Rebase.createClass('https://catchoftheday-tutorial.firebaseio.com/');

export default class Jukebox extends Component {
  constructor() {
    super();

    this.state = {
      url: null,
      playlist: []
    }
  }
  load(url) {
    this.setState({
      url
    })
  }

  componentDidMount() {
    var thisComponent = this;

    var playlistRef = new Firebase(
      "https://jukebox-app-e8c39.firebaseio.com/" + this.props.jukeboxID + "/playlist/"
    );

    // HANDLE PLAYLIST INIT
    playlistRef.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        thisComponent.state.playlist = snapshot.val();
        if (thisComponent.state.playlist.length === 1) {
          thisComponent.load(thisComponent.state.playlist[0].url);
        }
        else if (thisComponent.state.playlist.length === 0) {
          thisComponent.load(null);
        }
      } 
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  componentDidUpdate() {

  }

  nextSong() {
    this.props.removeFromPlaylist(this.state.playlist[0]);
  }
  render () {

    const {
      url
    } = this.state;

    return (
      <div className='app'>
        <section className='section'>
          <h1>ReactPlayer</h1>
          <ReactPlayer
            ref='player'
            className='react-player'
            controls={true}
            width={500}
            height={300}
            url={url}
            playing={true}
            volume={0.7}
            //onStart={}
            //onPlay={}
            //onPause={}
            //onBuffer={}
            onEnded={this.nextSong.bind(this)}
          />
        </section>
        <footer className='footer'>
        </footer>
      </div>
    )
  }
}