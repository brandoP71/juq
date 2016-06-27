import React, { Component } from 'react';
import styles from './styles.css';
import $ from 'jquery';

var Firebase = require('firebase');

class UserPage extends Component {

  constructor() {
    super();

    this.state = {
      playlist:[],
      songlist:[],
      selectedSong: null
    }
  }

  componentDidMount() {
    var thisComponent = this;

    // HANDLE SONGLIST INIT
    var songlistRef = new Firebase(
      "https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/songlist/"
    );

    var playlistRef = new Firebase(
      "https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/playlist/"
    );

    songlistRef.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        thisComponent.state.songlist = snapshot.val();
        thisComponent.setState({
          songlist: thisComponent.state.songlist
        });
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    playlistRef.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        thisComponent.state.playlist = snapshot.val();
        thisComponent.setState({
          playlist: thisComponent.state.playlist
        });
      }
      else {
        thisComponent.state.playlist = [];
        thisComponent.setState({
          playlist: thisComponent.state.playlist
        });
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // HANDLE SOURCE FORM SUBMIT
    $("#sourceForm").submit(function(e)
    {
      var artist = thisComponent.refs.artistInput.value;
      var id = Date.now();
      var url = thisComponent.refs.srcInput.value;
      var videoID;

      var title;

      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        videoID = match[2];
      } else {
        //error
      }

      var ytApiKey = "AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk";

      $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoID + "&key=" + ytApiKey, function(data) {
        title = data.items[0].snippet.title;

        var songObject = { id: id, title: title, artist: artist, filename: 'url_source', url: url };

        e.stopImmediatePropagation();
        e.preventDefault(); //Prevent Default action.

        thisComponent.state.songlist.push(songObject);

        songlistRef.set(thisComponent.state.songlist);

        $('#sourceForm')[0].reset();
      });

      return false;
    });

    // YT FORM SUBMIT
    $("#YTForm").submit(function(e)
    {
      var artist = thisComponent.refs.YTArtistInput.value;
      var title = thisComponent.refs.YTTitleInput.value;
      var id = Date.now();
      var url;
      var videoID;

      var urlTitle = title.replace(/ /g, '+');
      var urlArtist = artist.replace(/ /g, '+');

      var ytApiKey = "AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk";

      $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=audio%2Blyrics%2Bofficial%2B" + urlTitle + "%2B" + urlArtist + "&type=video&videoCategoryId=22&key=" + ytApiKey, function(data) {
        videoID = data.items[0].id.videoId;

        url = "https://www.youtube.com/watch?v=" + videoID;


        var songObject = { id: id, title: title, artist: artist, filename: 'url_source', url: url };

        thisComponent.state.songlist.push(songObject);

        songlistRef.set(thisComponent.state.songlist);

        $('#YTForm')[0].reset();

      });
        /*title = data.items[0].snippet.title;

        var songObject = { id: id, title: title, artist: artist, filename: 'url_source', url: url };

        

        thisComponent.state.songlist.push(songObject);

        songlistRef.set(thisComponent.state.songlist);

        $('#sourceForm')[0].reset();*/

      e.stopImmediatePropagation();
      e.preventDefault(); //Prevent Default action.
      return false;
    });
  }

  componentDidUpdate() {
    var thisComponent = this;
    $("#songlist").empty();
    this.state.songlist.forEach(function(song) {
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

    $("#playlist").empty();
    this.state.playlist.forEach(function(song) {
        var listID = 'id="' + song.id + 'playlist"';
        listID = listID.replace(/\s+/g, '');
        $("#playlist").append
        ('<li className="songlistItem" ' + listID + '><p>Title: ' + song.title + '</p><p>Artist: ' + song.artist + '</p></li>');
    });
    if (this.state.playlist.length > 0) {
      $("#" + this.state.playlist[0].id + "playlist").append("<p style='color:red'><b>CURRENTLY LOADED</b></p>");
    }
	}

  componentWillUpdate() {
  }

  addToPlaylist() {
    var playlistRef = new Firebase(
      "https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/playlist/"
    );
    var song = this.state.selectedSong;
    var found = false;

    if (song != null) {

      for(var i = 0; i < this.state.playlist.length; i++) {
        if (this.state.playlist[i].id == song.id) {
            found = true;
            alert("This song is already in the Playlist.");
            break;
        }
      }

      if (!found) {
        this.state.playlist.push(song);
        playlistRef.set(this.state.playlist);

        this.setState({
          playlist: this.state.playlist
        });
      }
    }
    else {
      alert("Please select a song from the Songlist");
    }
  }
  
  render() {
    return (
      <div className={styles.page}>

        <div className={styles.formContainer}>
          <h1>Upload a URL Source!</h1>
          <form id="sourceForm" encType="multipart/form-data" method="post">
            <br />
            <br />
            <label htmlFor="artistInput">(OPTIONAL) Artist --> </label>
            <input type="text"  ref="artistInput" name="artistInput" />
            <br />
            <br />
            <label htmlFor="srcInput">Source (YouTube URL) --> </label>
            <input type="text" ref="srcInput" name="srcInputt" />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        <div className={styles.youtubeFormContainer}>
          <h1>Enter a song title and artist, watch the magic.</h1>
          <form id="YTForm">
            <br />
            <br />
            <label htmlFor="YTArtistInput">(REQUIRED) Artist --> </label>
            <input type="text"  ref="YTArtistInput" name="YTArtistInput" required/>
            <br />
            <br />
            <label htmlFor="YTTitleInput">Title (REQUIRED) --> </label>
            <input type="text" ref="YTTitleInput" name="YTTitleInput" required/>
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        <div className={styles.songlistContainer}>
          <h1>The Songlist</h1>
          <div className={styles.controlButtons}>
            <ul>
              <li>
                  <button onClick={this.addToPlaylist.bind(this)}>Add to Playlist</button>
              </li>
            </ul>

          </div>

          <div className={styles.songlist}>
            <ol id="songlist">

            </ol>
          </div>
        </div>

        <div className={styles.playlistContainer}>
        <h1>The Playlist</h1>
        <div className={styles.controlButtons}>
          <ul>
            <li>
            </li>
          </ul>

        </div>

        <div className={styles.songlist}>
          <ol id="playlist">

          </ol>
        </div>
      </div>
      </div>
    )
  }
}


export default UserPage;