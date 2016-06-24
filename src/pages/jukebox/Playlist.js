import React, { Component } from 'react';
import styles from './styles.css';
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
	      ('<li className="songlistItem" ' + listID + '><p>Title: ' + song.title + '</p><p>Artist: ' + song.artist + '</p></li>');
	      $("#" + song.id + "playlist").click(function() {
	        thisComponent.state.selectedSong = song;
	        thisComponent.state.currentSong = song;
	        thisComponent.setState({
	          selectedSong: thisComponent.state.selectedSong
	        });
	        $("#" + song.id + "playlist").css("background-color", "red");
	        console.log(thisComponent.state.selectedSong);
	      });
    });
    if (this.props.playlist.length > 0) {
    	$("#" + this.props.playlist[0].id + "playlist").append("<p style='color:red'><b>CURRENTLY LOADED</b></p>");
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
      <div className={styles.playlistContainer}>
        <h1>The Playlist</h1>
        <div className={styles.controlButtons}>
          <ul>
            <li>
                <button onClick={this.removeFromPlaylist.bind(this)}>Remove Song</button>
            </li>
          </ul>

        </div>

        <div className={styles.songlist}>
          <ol id="playlist">

          </ol>
        </div>
      </div>
    )
  }
}


export default Playlist;