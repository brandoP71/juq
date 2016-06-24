var React = require('react');
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import styles from "./style.css";

var Firebase = require('firebase');

class Login extends React.Component {
	login(event) {
		var thisComponent = this;
		event.preventDefault();
		// Get the data from the input
		var passwordField = this.refs.password.value;

		var jbName = this.props.params.jukeboxID;

		var thisJBAuth = new Firebase(
        	"https://jukebox-app-e8c39.firebaseio.com/" + jbName + '/auth/'
      	);

		var passwort;
		var object;

		thisJBAuth.on("value", function(snapshot) {
	      if (snapshot.val() != null) {
	         object = snapshot.val();

	         passwort = object.passwort;

			if (passwordField === passwort) {
				thisComponent.history.pushState(null, '/jukebox/' + jbName);
			}
			else {
				var notification = this.refs.login_notifications;
				notification.innerHTML = "Login Failed, Incorrect Credentials";
			}

		      }
		    }, function (errorObject) {
		      console.log("The read failed: " + errorObject.code);
		});
	}

	guestLogin() {
		this.history.pushState(null, '/userPage/' + this.props.params.jukeboxID);
	}

	render() {
		return (
			<div className={styles.loginpage}>
				<div className={styles.loginform}>
					<form onSubmit={this.login.bind(this)}>
						<h1>Admin Login</h1>
	            		<p className="test">
		                	<label className={styles.jbNameLabel}>{this.props.params.jukeboxID}</label>
	            		</p>
	            		<p className="test">
			                <label>Password
			                    <input className="right" type="password" ref="password" required />
			                </label>
	            		</p>
	            		<p>
	                		<input className="right" type="submit" value="SUBMIT" />
	            		</p>
	        		</form>
	        		<button onClick={this.guestLogin.bind(this)}>User</button>
	        	</div>
				<h1 ref="login_notifications"></h1>
			</div>
		)
	}
}

reactMixin.onClass(Login, History);

export default Login;