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

      $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + urlTitle + "%2B" + urlArtist + "&type=video&videoCategoryId=10&key=" + ytApiKey, function(data) {
        videoID = data.items[0].id.videoId;

        url = "https://www.youtube.com/watch?v=" + videoID;


        var songObject = { id: id, title: title, artist: artist, filename: 'url_source', url: url };

        thisComponent.state.songlist.push(songObject);

        songlistRef.set(thisComponent.state.songlist);

        thisComponent.state.selectedSong = songObject;

        thisComponent.addToPlaylist();

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
      ('<li className="songlistItem" value="' + song.id + '" id="' + song.id + '" ><p><b>' + song.title + '</b></p><p>' + song.artist + '</p></li>');
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
    var counter = 0;
    this.state.playlist.forEach(function(song) {
        var listID = 'id="' + song.id + 'playlist"';
        listID = listID.replace(/\s+/g, '');
        $("#playlist").append
        ('<li className="songlistItem" ' + listID + '><p><span id="title' + counter + '"><b>' + song.title + '</b></span></p><p>' + song.artist + '</p></li>');
    });
    if (this.state.playlist.length > 0) {
      $("#" + this.state.playlist[0].id + "playlist").css('border-color', '#39B44A');
      $("#title" + counter).css('color', '#39B44A');
    }
    counter++;
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
        <div className={styles.header}>
          <p>the workplace music player</p>
          <div className={styles.jbLogo}>
            <h1>JUKEBOX</h1>
          </div>        
        </div>

        <p className={styles.addSongHeader}>ADD A SONG</p>

        <div className={styles.youtubeFormContainer}>
          <form id="YTForm">        
            <section className={styles.formSection}>
              <div className={styles.formFieldDiv}>
                <label htmlFor="YTTitleInput">SONG TITLE</label>
                <br/>
                <input type="text" ref="YTTitleInput" name="YTTitleInput" required/>
              </div>

              <div className={styles.formFieldDiv}>
                <label htmlFor="YTArtistInput">ARTIST NAME</label>
                <br />
                <input type="text"  ref="YTArtistInput" name="YTArtistInput" required/>
              </div>

              <input type="submit" value="+" />
            </section>
          </form>
        </div>

        <div className={styles.formSeperator}>
          <hr className={styles.hrLine} width="175"/> <span className={styles.OR}>OR</span> <hr className={styles.hrLine} width="175"/>
        </div>

        <div className={styles.formContainer}>
          <form id="sourceForm">
            <section className={styles.formSection}>
              <div className={styles.formFieldDiv}>
                <label htmlFor="srcInputt">YOUTUBE URL</label>
                <br/>
                <input type="text" ref="srcInput" name="srcInputt" required/>
              </div>
              <input type="submit" value="+" />
            </section>
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
        <h1>PLAYLIST</h1>
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
      <p className={styles.credit}>Design by Shujaat Syed || Thinkingbox Media and Design</p>
      </div>
    )
  }
}


export default UserPage;