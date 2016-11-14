import React, { Component } from 'react';
import styles from '../styles.css';
import $ from 'jquery';

class UserPlaylist extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className={styles.playlist}>
				<h1>LOGO and STUFF</h1>
				<h1>User Playlist!</h1>
			</div>
		)
	}
}

export default UserPlaylist;