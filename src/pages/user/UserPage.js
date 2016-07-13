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
      selectedSong: null,
      songChoices: [],
      songAdded: false,
      playlistLength: 0,
      oldPlaylist: [],
      songRemoved: false
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
        thisComponent.state.oldPlaylist = thisComponent.state.playlist;
        thisComponent.state.playlist = snapshot.val();
        if (thisComponent.state.playlistLength === 0) {
          thisComponent.state.playlistLength = thisComponent.state.playlist.length;
        }
        else {
          if (thisComponent.state.playlist.length > thisComponent.state.playlistLength) {
            thisComponent.state.songAdded = true;
            thisComponent.state.playlistLength = thisComponent.state.playlist.length;
          }
          else if (thisComponent.state.playlist.length < thisComponent.state.playlistLength) {
            thisComponent.state.songRemoved = true;
            thisComponent.state.playlistLength = thisComponent.state.playlist.length;
          }
        }
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
      var id = Date.now();
      var url = thisComponent.refs.srcInput.value;
      var videoID;
      var artist;
      var title;

      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        videoID = match[2];
      } else {
        //error
      }

      var ytApiKey = "AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk";

      $.get("https://www.googleapis.com/youtube/v3/videos?key=" + ytApiKey + "&part=snippet&id=" + videoID, function(data) {
        title = data.items[0].snippet.title;
        artist = "URL Submission";

        title = title.replace(/video|lyrics/g, function myFunction(x){return ""});
        title = title.replace(/[()]/g, ''); 

        var songObject = { id: id, title: title, artist: artist, filename: 'url_source', url: url };

        e.stopImmediatePropagation();
        e.preventDefault();

        thisComponent.state.songlist.push(songObject);

        songlistRef.set(thisComponent.state.songlist);

        thisComponent.state.selectedSong = songObject;

        thisComponent.addToPlaylist();
      });

      $('#sourceForm')[0].reset();

      return false;
    });

    // YT FORM SUBMIT
    $("#YTForm").submit(function(e)
    {
      e.preventDefault();
      var artist = thisComponent.refs.YTArtistInput.value;
      var title = thisComponent.refs.YTTitleInput.value;
      var selectedID = thisComponent.refs.YTSelect.value;
      var ytApiKey = "AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk";
      if (artist !== "" && title !== "" && selectedID === "") {

        var urlTitle = title.replace(/ /g, '+');
        var urlArtist = artist.replace(/ /g, '+');

        $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" + urlTitle + "%2B" + urlArtist + "&type=video&key=" + ytApiKey, function(data) {
          data.items.forEach(function(result) {
            if (result.snippet.title.toUpperCase().indexOf("(LIVE)") > -1 || result.snippet.title.toUpperCase().indexOf("COVER") > -1 || result.snippet.title.toUpperCase().indexOf("CONCERT") > -1
              || result.snippet.title.toUpperCase().indexOf(artist.toUpperCase()) < 0) {

            }
            else {
              thisComponent.state.songChoices.push(result);
            }
          });

          thisComponent.state.songChoices.forEach(function(result) {
            $.get("https://www.googleapis.com/youtube/v3/videos?id=" + result.id.videoId + "&part=contentDetails&key=" + ytApiKey, function(data) {
              var seconds = thisComponent.getYTDuration(data.items[0].contentDetails.duration);
              var minutes = Math.floor(seconds/60);
              var remainder = (seconds % 60);
              var title = result.snippet.title.replace(/video|lyrics/g, function myFunction(x){return ""});
              title = title.replace(/[()]/g, ''); 
              $("#YTSelectSong").append(
                '<option value="' + result.id.videoId +'" title="' + result.snippet.description + '">'
                 + title + ',  Minutes: ' + minutes + ' Seconds: ' + remainder + '</option>'
              );
            });
          });

          $("#YTTitleDiv").css("display","none");
          $("#YTArtistDiv").css("display","none");
          $("#YTSelectDiv").css("visibility","visible");
        });
      }
      else if (selectedID !== "" && selectedID !== null) {
        var id = Date.now();

        var url = "https://www.youtube.com/watch?v=" + selectedID;

        var songObject = { id: id, title: title, artist: artist, filename: 'url_source', url: url };

        thisComponent.state.songlist.push(songObject);

        songlistRef.set(thisComponent.state.songlist);

        thisComponent.state.selectedSong = songObject;

        thisComponent.addToPlaylist();

        $('#YTForm')[0].reset();

        $("#YTSelectSong").html('');

        thisComponent.state.songChoices = [];

        $("#YTTitleDiv").css("display","inline");
        $("#YTArtistDiv").css("display","inline");
        $("#YTSelectDiv").css("visibility","hidden");
      }

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

    if (this.state.songRemoved) {
      var removedSongFound = false;
      for (var i = 0; i < this.state.playlist.length; i++) {
        if (this.state.playlist[i].id !== this.state.oldPlaylist[i].id) {
          $("#" + this.state.oldPlaylist[i].id + "playlist").animate({opacity: "0", fontSize: "0px"}, 1000);
          $("#title" + String(i)).animate({fontSize: "0px"}, 1000);
          removedSongFound = true;
        }
      }
      if (!removedSongFound) {
        $("#" + this.state.oldPlaylist[this.state.oldPlaylist.length - 1].id + "playlist").animate({opacity: "0", fontSize: "0px"}, 1000);
        $("#title" + String(this.state.oldPlaylist.length - 1)).animate({fontSize: "0px"}, 1000);
      }
      this.state.songRemoved = false;

      setTimeout(function() {
        $("#playlist").empty();
        var counter = 0;
        var firstSong = true;
        thisComponent.state.playlist.forEach(function(song) {
            var listID = 'id="' + song.id + 'playlist"';
            listID = listID.replace(/\s+/g, '');
            $("#playlist").append
            ('<li className="songlistItem" ' + listID + '><p><span id="title' + counter + '"><b>' + song.title + '</b></span></p><p>' + song.artist + '</p></li>');
            counter++;
        });
        if (thisComponent.state.playlist.length > 0) {
          $("#" + thisComponent.state.playlist[0].id + "playlist").css('border-color', '#39B44A');
          $("#title" + '0').css('color', '#39B44A');
          if (thisComponent.state.songAdded) {
            $("#" + thisComponent.state.playlist[thisComponent.state.playlist.length - 1].id + "playlist").css('opacity', '0');
            $("#" + thisComponent.state.playlist[thisComponent.state.playlist.length - 1].id + "playlist").css('font-size', '0px');
            $("#" + thisComponent.state.playlist[thisComponent.state.playlist.length - 1].id + "playlist").animate({opacity: "1", fontSize: "18px"}, 2000);
            $("#title" + String(counter - 1)).css('font-size', '0px');
            $("#title" + String(counter - 1)).animate({fontSize: "24px"}, 2000);
            thisComponent.state.songAdded = false;
          }
        }
      }, 900);
    }
    else {
      $("#playlist").empty();
      var counter = 0;
      var firstSong = true;
      this.state.playlist.forEach(function(song) {
          var listID = 'id="' + song.id + 'playlist"';
          listID = listID.replace(/\s+/g, '');
          $("#playlist").append
          ('<li className="songlistItem" ' + listID + '><p><span id="title' + counter + '"><b>' + song.title + '</b></span></p><p>' + song.artist + '</p></li>');
          counter++;
      });
      if (this.state.playlist.length > 0) {
        $("#" + this.state.playlist[0].id + "playlist").css('border-color', '#39B44A');
        $("#title" + '0').css('color', '#39B44A');
        if (thisComponent.state.playlist.length === 1) {
          $("#" + thisComponent.state.playlist[0].id + "playlist").css('opacity', '0');
          $("#" + thisComponent.state.playlist[0].id + "playlist").css('font-size', '0px');
          $("#" + thisComponent.state.playlist[0].id + "playlist").animate({opacity: "1", fontSize: "18px"}, 2000);
          $("#title" + String(0)).css('font-size', '0px');
          $("#title" + String(0)).animate({fontSize: "24px"}, 2000);
        }
        if (this.state.songAdded) {
          $("#" + this.state.playlist[this.state.playlist.length - 1].id + "playlist").css('opacity', '0');
          $("#" + this.state.playlist[this.state.playlist.length - 1].id + "playlist").css('font-size', '0px');
          $("#" + this.state.playlist[this.state.playlist.length - 1].id + "playlist").animate({opacity: "1", fontSize: "18px"}, 2000);
          $("#title" + String(counter - 1)).css('font-size', '0px');
          $("#title" + String(counter - 1)).animate({fontSize: "24px"}, 2000);
          this.state.songAdded = false;
        }
      }
    }
	}

  componentWillUpdate() {
  }

  getYTDuration(yt_duration){
    var time_extractor = /([0-9]*)M([0-9]*)S$/;
    var extracted = time_extractor.exec( yt_duration );
    var minutes = parseInt( extracted[1], 10 );
    var seconds = parseInt( extracted[2], 10 );
    var durationn = ( minutes * 60 ) + seconds;
    return durationn;
  };

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

        this.state.songAdded = true;

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
              <div className={styles.formFieldDiv} id="YTTitleDiv">
                <label htmlFor="YTTitleInput">SONG TITLE</label>
                <br/>
                <input type="text" ref="YTTitleInput" name="YTTitleInput"/>
              </div>

              <div className={styles.formFieldDiv} id="YTArtistDiv">
                <label htmlFor="YTArtistInput">ARTIST NAME</label>
                <br />
                <input type="text"  ref="YTArtistInput" name="YTArtistInput"/>
              </div>

              <div className={styles.formFieldDiv} style={{visibility: 'hidden'}} id="YTSelectDiv">
                <label htmlFor="YTSelect">Song Options</label>
                <br />
                <select id="YTSelectSong" ref="YTSelect" name="YTSelect">
                </select>
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