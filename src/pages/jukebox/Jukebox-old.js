import React, { Component } from 'react';
import styles from './styles.css';
import Youtube from 'react-youtube';
import $ from 'jquery';
var Firebase = require('firebase');

// Firebase
//var Rebase = require('re-base');
//var base = Rebase.createClass('https://catchoftheday-tutorial.firebaseio.com/');

class Jukebox extends Component {
  constructor() {
    super();

    this.opts = {
      currentlyPlaying: false
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    if (this.props.playlist.length > 0) {
      this.opts.currentlyPlaying = true;
    }
  }

  componentDidUpdate() {
  
  }

  shouldComponentUpdate() {
    if (this.refs.ytPlayer.props.opts.currentlyPlaying === true) {
      return false;
    }
    else {
      return true;
    }
  }

  initPlayer(event) {
    var thisComponent = this;
    if (this.opts.playlist.length > 0) {
      event.target.cueVideoById(this.opts.playlist[0].url, 3);
      event.target.playVideo();
      thisComponent.opts.currentlyPlaying = true;
    }
  }

  nextSong() {
    this.opts.currentlyPlaying = false;
    this.opts.removeFromPlaylist(this.opts.playlist[0]);
  }

  render() {

    const opts = {
      height: '400',
      width: '600',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      },
      playlist: this.props.playlist,
      removeFromPlaylist: this.props.removeFromPlaylist,
      currentlyPlaying: this.opts.currentlyPlaying
    };

    return (
      <div className={styles.ytContainer}>
        <Youtube
          id="ytPlayer"
          ref="ytPlayer"
          opts={opts}
          onReady={this.initPlayer}
          onEnd={this.nextSong}
        />
      </div>
    )
  }

  /*_onReady(event) {
    // access to player in all event handlers via event.target
    event.target.cueVideoById(this.opts.playlist[0].url);
    event.target.playVideo();
  }

  _onEnd(event) {
    if (this.opts.playlist.length > 1) {
      event.target.cueVideoById(this.opts.playlist[1].url ,0);
      event.target.playVideo();
    }
    this.opts.removeFromPlaylist(this.opts.playlist[0]);
  }*/
}

export default Jukebox;