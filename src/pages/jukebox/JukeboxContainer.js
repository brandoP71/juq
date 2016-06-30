/*
	APP
	YT API KEY: AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk
*/
import React from 'react';
import Jukebox from './Jukebox';
import Songlist from './Songlist';
import Playlist from './Playlist';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import { History } from 'react-router';
import autobind from 'autobind-decorator';
//import ReactAudioPlayer from 'react-audio-player';
import $ from 'jquery';
import styles from './styles.css';

var Firebase = require('firebase');

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			playlist: [
			],
			songlist: [
			],
			currentSource: null
		}
	}

	componentDidMount() {
		var thisComponent = this;

		var playlistRef = new Firebase(
			"https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/playlist/"
		);

		/*var ytApiKey = "AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk";
		var videoId = "3necB6CZHsk";

		$.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + ytApiKey, function(data) {
  			alert(data.items[0]);
		});*/

		// HANDLE PLAYLIST INIT
		playlistRef.on("value", function(snapshot) {
			if (snapshot.val() != null) {
				var array = snapshot.val();
				var song = array[array.length - 1];
				if (song.filename === 'url_source') {
					var found = false;
					for(var i = 0; i < thisComponent.state.playlist.length; i++) {
					    if (thisComponent.state.playlist[i].id == song.id) {
					        found = true;
					        break;
					    }
					}
					if (!found) {
						thisComponent.addToPlaylist(song);
					}
					else {
						thisComponent.state.currentSource = song.url;
						thisComponent.setState({
							currentSource: thisComponent.state.currentSource
						});
					}
				}
				thisComponent.state.playlist = snapshot.val();
				thisComponent.setState({
					playlist: thisComponent.state.playlist
				});
				if (array[0].filename !== 'url_source') {
					var songSrc = require('../../../assets/' + array[0].filename.replace(/\.[^/.]+$/, "") + '.mp3');
					thisComponent.state.currentSource = songSrc;
					thisComponent.setState({
						currentSource: thisComponent.state.currentSource
					});
				}
				else {
					var songSrc = array[0].url;
					thisComponent.state.currentSource = songSrc;
					thisComponent.setState({
						currentSource: thisComponent.state.currentSource
					});
				}
			}	
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

		// HANDLE SONGLIST INIT
		var songlistRef = new Firebase(
			"https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/songlist/"
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

		$("#songForm").submit(function(e)
		{

			var newFilename = thisComponent.refs.fileInput.files[0].name.replace(/[^A-Z0-9_.]+/ig, "_");
			var title = thisComponent.refs.titleInput.value;
			var artist = thisComponent.refs.artistInput.value;
			var id = Date.now();
			var url = ('../../../assets/' + newFilename );

			var songObject = { id: id, title: title, artist: artist, filename: newFilename, url: url };

			e.stopImmediatePropagation();
			e.preventDefault(); //Prevent Default action.
		    var formData = new FormData(this);
		    $.ajax({
		        url: "/uploadSong",
		    	type: 'POST',
		        data:  formData,
		    	mimeType:"multipart/form-data",
		    	contentType: false,
		        cache: false,
		        processData:false,
			    success: function(data, textStatus, jqXHR)
			    {
			    	thisComponent.state.songlist.push(songObject);
					thisComponent.setState({
						songlist: thisComponent.state.songlist
					});

					songlistRef.set(thisComponent.state.songlist);
					alert("Your music/source was added to the server successfully.");
			    },
			     error: function(jqXHR, textStatus, errorThrown) 
			     {
			     	alert("fail");
			     }          
			});

			$('#songForm')[0].reset();

			return false;
		});

	}

	componentWillUpdate(nextProps, nextState) {
		
	}

	addToPlaylist(song) {
		var playlistRef = new Firebase(
			"https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/playlist/"
		);
		var found = false;

		for(var i = 0; i < this.state.playlist.length; i++) {
		    if (this.state.playlist[i].id == song.id) {
		        found = true;
		        break;
		    }
		}

		if (!found) {
			this.state.playlist.push(song);
	      	playlistRef.set(this.state.playlist);

	      	var songSrc;

	      	if (song.filename != 'url_source') {
	      		songSrc = require('../../../assets/' + song.filename.replace(/\.[^/.]+$/, "") + '.mp3');
	      	}
	      	else {
	      		songSrc = song.url;
	      	}

	      	this.setState({
	      		playlist: this.state.playlist
	      	});
      }
	}

	removeFromPlaylist(song) {
		var playlistRef = new Firebase(
			"https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/playlist/"
		);
		this.state.playlist = this.state.playlist.filter(function (songObject) {
            return songObject.id !== song.id;
        });
		playlistRef.set(this.state.playlist);
		this.setState({
      		playlist: this.state.playlist
      	});

      	if (this.state.playlist.length > 0) {
      		var newSong = this.state.playlist[0];
      		var songSrc;

      		if (newSong.filename === 'url_source') {
      			songSrc = newSong.url;
      		}
      		else {
      			songSrc = require('../../../assets/' + newSong.filename.replace(/\.[^/.]+$/, "") + '.mp3');
      		}
      	}
      	else {
      		this.state.currentSource = null;
      		this.setState({
      			currentSource: null
      		});
      	}
	}

	removeSong(song) {
		var songlistRef = new Firebase(
			"https://jukebox-app-e8c39.firebaseio.com/" + this.props.params.jukeboxID + "/songlist"
		);
		if (song.filename === 'url_source') {
			this.state.songlist = this.state.songlist.filter(function (songObject) {
	            return songObject.id !== song.id;
	        });

			songlistRef.set(this.state.songlist);
		}
	}

	exitJukebox() {
		this.history.pushState(null, '/');
	}

	render() {
		//const jukebox = 
			//(this.state.playlist.length > 0 && this.state.currentSource != null) ? 
			{/*<Jukebox
			src={this.state.currentSource}
			playlist={this.state.playlist}
			removeFromPlaylist={this.removeFromPlaylist.bind(this)}
			jukeboxID={this.props.params.jukeboxID}
			/> //: */}
			//<h1>The playlist is curently empty!</h1>;
		return  (
			<div className={styles.page}>
				<div className={styles.jukeboxContainer}>
					<h1 className={styles.jukeboxHeader}>Welcome to the React powered Jukebox.</h1>
					<Jukebox
						removeFromPlaylist={this.removeFromPlaylist.bind(this)}
						jukeboxID={this.props.params.jukeboxID}
					/> 
					{/*<br />
					<br />
					<p>Upload a Song!</p>
					<form id="songForm" encType="multipart/form-data" method="post">
						<label htmlFor="titleInput">Title --></label>
				       	<input type="text" ref="titleInput" name="titleInput"/>
				       	<br />
						<br />
				       	<label htmlFor="artistInput">Artist --></label>
				       	<input type="text"  ref="artistInput" name="artistInput" />
				       	<br />
						<br />
				       	<input type="file" ref="fileInput" name="fileInputt" accept=".mp3" />
				       	<br />
						<br />
				       	<input type="submit" value="Submit" />
				    </form>
				    <br />
					<br />*/}
				    <button onClick={this.exitJukebox.bind(this)}>EXIT JUKEBOX</button>
				</div>
				<Songlist jukeboxID={this.props.params.jukeboxID} songs={this.state.songlist} addToPlaylist={this.addToPlaylist.bind(this)} removeSong={this.removeSong.bind(this)}/>
				<Playlist jukeboxID={this.props.params.jukeboxID} playlist={this.state.playlist} removeFromPlaylist={this.removeFromPlaylist.bind(this)}/>
			</div>
		)
	}
};

reactMixin.onClass(App, History);

export default App;

