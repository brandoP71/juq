import React, { Component } from 'react';
import styles from './styles.css';
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
      ('<li className="songlistItem" value="' + song.id + '" id="' + song.id + '" ><p>Title: ' + song.title + '</p><p>Artist: ' + song.artist + '</p></li>');
      $("#" + song.id).click(function() {
        thisComponent.state.selectedSong = song;
        thisComponent.setState({
          selectedSong: thisComponent.state.selectedSong
        });
        $("#" + song.id).css("background-color", "red");
        console.log(thisComponent.state.selectedSong);
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
      <div className={styles.songlistContainer}>
        <h1>Available Music</h1>
        <div className={styles.controlButtons}>
          <ul>
            <li>
                <button onClick={this.addToPlaylist.bind(this)}>Add to Playlist</button>
            </li>
            <li>
                <button onClick={this.removeSong.bind(this)}>Delete Song</button>
            </li>
          </ul>

        </div>

        <div className={styles.songlist}>
          <ol id="songlist">

          </ol>
        </div>

      </div>
    )
  }
}


export default Songlist;