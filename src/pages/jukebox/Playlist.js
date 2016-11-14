import React, { Component } from 'react';
import styles from './styles/styles.css';
import $ from 'jquery';

var Firebase = require('firebase');

class Playlist extends Component {

  constructor() {
    super();

    this.state = {
      currentSong: null,
      selectedSong: null
    }

  }

  componentDidMount() {
  }

  componentDidUpdate() {
    var thisComponent = this;
    $("#playlist").empty();
    this.props.playlist.forEach(function(song) {
    	  var listID = 'id="' + song.id + 'playlist"';
    	  listID = listID.replace(/\s+/g, '');
	      $("#playlist").append
	      ('<li ' + listID + '><p id="title' + song.id + '" style="margin-left:10px;">'
         + song.title + ' - <b>' + song.artist + '</b></p><div><p id="cancel' + song.id + '">[CANCEL]</p></div></li>');

        $("#cancel" + song.id).click(function() {
          thisComponent.state.selectedSong = song;
          thisComponent.state.currentSong = song;
          thisComponent.setState({
            selectedSong: thisComponent.state.selectedSong
          });
          thisComponent.removeFromPlaylist();
        });
    });
    if (this.props.playlist.length > 0) {
      $("#" + this.props.playlist[0].id + "playlist").prepend("<h1><b><i>Currently Loaded</i></b></h1>");
    }
    if (this.props.playlist.length > 1) {
      $("#" + this.props.playlist[1].id + "playlist").prepend("<h1><b><i>Coming Up</i></b></h1>");
    }
  }

  componentWillUpdate() {
  }

  removeFromPlaylist() {
  	if (this.state.selectedSong === null) {

    }
    else {
      this.props.removeFromPlaylist(this.state.selectedSong);
    }
  }
  
  render() {
    return (
      <div className={styles.playlist}>
        <ul id="playlist">

        </ul>
      </div>
    )
  }
}


export default Playlist;