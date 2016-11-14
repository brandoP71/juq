import React, {Component} from 'react';
import styles from '../styles.css'
import $ from 'jquery';

class RecommendedNext extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className={styles.recommendedItem}>
		    	<h1>Recommended Next!</h1>
		    </div>
		)
	}
}

export default RecommendedNext;