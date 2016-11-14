import React, { Component } from 'react';
import styles from './styles/styles.css';
import $ from 'jquery';

var Firebase = require('firebase');

class Songlist extends Component {

  constructor() {
    super();

    this.state = {
      selectedSong: null
    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    var thisComponent = this;
    $("#songlist").empty();
    this.props.songs.forEach(function(song) {
      $("#songlist").append
      ('<li value="' + song.id + '" id="' + song.id + '" ><p><b>' + song.title + '</b></p><p>' + song.artist + '</p>' +
          '<div id="' + song.id +'div">' + 
          '<p><span id="' + song.id + 'replay" style="padding-right:5px;">Replay</span>' +
          '<span id="' + song.id + 'remove" style="padding-left:5px;">Remove</span></p></div></li>');

      $("#" + song.id + "replay").click(() => {
        thisComponent.state.selectedSong = song;
        thisComponent.setState({
          selectedSong: thisComponent.state.selectedSong
        });
        thisComponent.addToPlaylist();
      });
      $("#" + song.id + "remove").click(() => {
        thisComponent.state.selectedSong = song;
        thisComponent.setState({
          selectedSong: thisComponent.state.selectedSong
        });
        thisComponent.removeSong();
      });
    });
  }

  componentWillUpdate() {
  }

  addToPlaylist() {
    if (this.state.selectedSong === null) {

    }
    else {
      this.props.addToPlaylist(this.state.selectedSong);
    }
  }

  removeSong() {
    if (this.state.selectedSong === null) {

    }
    else {
      this.props.removeSong(this.state.selectedSong);
    }
  }
  
  render() {
    return (
        <div className={styles.songlist}>
          <h2>Jukebox Library</h2>
          <ul id="songlist">

          </ul>
        </div>
    )
  }
}


export default Songlist;