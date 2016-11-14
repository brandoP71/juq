import React, { Component } from 'react';
import styles from '../styles.css';
import $ from 'jquery';

class URLForm extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={styles.urlFormItem}>
       <h2>Request by YouTube URL</h2>
        <form>
          <input type="text" name="txtURL" placeholder="YouTube URL" />
          <input type="submit" value="Request" />
        </form>
      </div>
    )
  }
 }

 export default URLForm;

// HANDLE SOURCE FORM SUBMIT
    /*$("#sourceForm").submit(function(e)
    {
      var id = Date.now();
      var url = thisComponent.refs.srcInput.value;
      var videoID;
      var artist;
      var title;

      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      /*var match = url.match(regExp);
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
      });

      $('#sourceForm')[0].reset();

      return false;
    });*/