import React, { Component } from 'react';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import styles from './style.css';
import $ from 'jquery';

var Firebase = require('firebase');

class jukeboxCreatorChooser extends Component {

  constructor() {
    super();

    this.state = {
    }
  }

  componentDidMount() {
    var thisComponent = this;

    var dbRef = new Firebase(
      "https://jukebox-app-e8c39.firebaseio.com/"
    );

    var jukeboxes;
    var jukeboxKeys;

    dbRef.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        jukeboxes = snapshot.val();
        jukeboxKeys = Object.keys(jukeboxes);

        for(var i = 0; i < jukeboxKeys.length; i++) {
          $("#jbNameSelect").append('<option value="' + jukeboxKeys[i] + '">' + jukeboxKeys[i] + '</option>');
        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    $("#createJBForm").submit(function(e)
    {
      var jbName = thisComponent.refs.createJBName.value.replace(/\s+/g, '-').toLowerCase();
      var jbPasswort = thisComponent.refs.createJBPassword.value;
      var jbGuestPasswort = thisComponent.refs.createJBGuestPassword.value;

      var jbNode = [];
      var playlist = [];
      var songlist = [];

      var auth = { name: jbName, passwort: jbPasswort, guestPasswort: jbGuestPasswort };

      var nodeRef = new Firebase(
        "https://jukebox-app-e8c39.firebaseio.com/" + jbName + '/'
      );

      nodeRef.set(jbNode);

      var authRef = new Firebase(
        "https://jukebox-app-e8c39.firebaseio.com/" + jbName + '/auth/'
      );

      authRef.set(auth);

      e.stopImmediatePropagation();
      e.preventDefault(); //Prevent Default action.

      $('#createJBForm')[0].reset();

      thisComponent.history.pushState(null, '/login/' + jbName);

      return false;
    });
  }

  findJukebox() {
    this.history.pushState(null, '/login/' + this.refs.findJBName.value);
  }

  render() {
    return (
      <div className={styles.page}>
        <div className={styles.createJBSection}>
          <h1>Create a Jukebox</h1>
          <form id="createJBForm">
            <label htmlFor="createJBName">Jukebox Name: (spaces will be replaced with a dash!)</label>
            <input type="text" ref="createJBName" name="createJBName" />
            <br />
            <br />
            <label htmlFor="createJBPassword">Jukebox Passwort:</label>
            <input type="text" ref="createJBPassword" name="createJBPassword" />
            <br />
            <br />
            <label htmlFor="createJBGuestPassword">Jukebox Guest Passwort:</label>
            <input type="text" ref="createJBGuestPassword" name="createJBGuestPassword" />
            <input type="submit" value="Submit" />
          </form>
        </div>

        <div className={styles.findJBSection}>
          <h2>Return to your Jukebox</h2>
          <br />
          <label htmlFor="findJBName">Jukebox Name: </label>
          <select id="jbNameSelect" name="findJBName" ref="findJBName"></select>
          <br />
          <br />
          <button onClick={this.findJukebox.bind(this)}>Select Jukebox</button> 
        </div>
      </div>
    )
  }
}

reactMixin.onClass(jukeboxCreatorChooser, History);

export default jukeboxCreatorChooser;