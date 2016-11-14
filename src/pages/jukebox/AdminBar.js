import React from 'react';
import $ from 'jquery';

import styles from './styles/adminBarStyles.css';

class AdminBar extends React.Component {
	constructor() {
		super();

	}

	render() {
		return (
			<div className={styles.adminBarContainer}>
				<div className={styles.tab}>
					<p>MENU</p>
				</div>
				<div className={styles.closeButton}>
					<span>
						<p>Exit Jukebox</p>
						<p className={styles.test}>&#10008;</p>
					</span>
				</div>
			</div>
		)
	}
}

export default AdminBar;