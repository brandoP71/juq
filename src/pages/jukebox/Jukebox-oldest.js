import React, { Component } from 'react';
import { withMediaPlayer, withMediaProps, controls } from 'react-media-player';
const { PlayPause, CurrentTime, Progress, SeekBar, Duration, MuteUnmute, Volume, Fullscreen } = controls;
import styles from './jukeboxstyles.css';
import $ from 'jquery';

// Firebase
//var Rebase = require('re-base');
//var base = Rebase.createClass('https://catchoftheday-tutorial.firebaseio.com/');

class Jukebox extends Component {
  constructor() {
    super();

    this.state = {
      onFirstSongStill: true
    }
  }

  componentDidMount() {
    try {
      this.props.media.play();
    }catch(e) {
      var nothing = 'nothing';
    }
  }

  componentDidUpdate() {
    var thisComponent = this;

    /*if (window.addEventListener) {

        // bind focus event
        window.addEventListener("focus", function (event) {

            // tween resume() code goes here
            setTimeout(function(){              
            },500);

        }, false);

    }

    if(this.props.media.currentTime > (this.props.media.duration - 4) && this.props.media.duration != 0 && this.props.media.duration != 0.1) {
      if (this.state.onFirstSongStill) {
        alert("play next song");
        this.props.removeFromPlaylist(this.props.playlist[0]);
        this.state.onFirstSongStill = false;
        this.setState({
          onFirstSongStill: false
        });
      }
      else {

      }
    }
    else if (!this.state.onFirstSongStill) {
      this.state.onFirstSongStill = true;
      this.setState({
        onFirstSongStill: true
      });
      try {
        this.props.media.play();
      }catch(e) {
      }
    }
    else if (this.props.media.currentTime === 0 && this.props.media.duration != 0) {
      try {
        this.props.media.play();
      }catch(e) {
      }
    }
    else if (this.props.media.currentTime != 0 && this.props.media.duration != 0 && !this.props.media.isPlaying) {
      if (this.state.onFirstSongStill) {
        this.props.removeFromPlaylist(this.props.playlist[0]);
      }
    }*/
  }

  render() {
    const { Player, media } = this.props
    const { playPause } = media

    return (
      <div className={styles}>
        <div className={styles.mediaplayer} onClick={() => playPause()}>
          { Player }
        </div>
        <nav className={styles.mediacontrols}>
          <PlayPause/>
          <CurrentTime/>
          <SeekBar/>
          <Duration/>
          <MuteUnmute/>
          <Volume/>
          <Fullscreen/>
        </nav>
      </div>
    )
  }
}

Jukebox = withMediaPlayer(withMediaProps(Jukebox));

export default Jukebox;