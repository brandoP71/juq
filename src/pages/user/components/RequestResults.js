import React, { Component } from 'react';
import styles from '../styles.css';
import $ from 'jquery';
import Loading from 'react-loading';

class RequestResults extends Component {
	constructor() {
		super();

		this.state = {
		}
	}

	componentDidMount() {
		var playlistRef = new Firebase(
	      "https://jukebox-app-e8c39.firebaseio.com/" + this.props.jukeboxID + "/playlist/"
	    );

	    playlistRef.on("value", function(snapshot) {
	      if (snapshot.val() != null) {
	        // Do stuff with json
	      }
	    }, function (errorObject) {
	      console.log("The read failed: " + errorObject.code);
	    });
	}

	componentDidUpdate() {
		setTimeout(() => {
			let delay = 100;
			$("#resultList").empty();
			this.props.searchResults.forEach((song) => {
				delay += 300;
				$("#resultList").append(
					'<li id="' + song.id + '"><button id="' + song.id + 'select">SELECT</button> ' + song.title +
					'<p>' + song.minutes + ' Minutes | ' + song.seconds + ' Seconds</p></li>'
				);
				$("#" + song.id).animate({
					left: '+=550',
					opacity: 1
				},delay);
			});
		}, 3000);
	}

	render() {
		return (
			<div className={styles.searchResultsItem}>
				<ul className={styles.searchResultsList} id="resultList">
				</ul>
			</div>
		)
	}
}

export default RequestResults;