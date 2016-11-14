import React, {Component} from 'react';
import styles from '../styles.css'
import $ from 'jquery';
import Loading from 'react-loading';

import { getYTDuration } from '../helpers';

var Firebase = require('firebase');

class SongFinderForm extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    var thisComponent = this;

    // YT FORM SUBMIT
    $("#YTForm").submit(function(e) {
      e.preventDefault();
      $("#loadingDiv").css("visibility","visible");
      setTimeout(() => {
        $("#loadingDiv").css("visibility","hidden");
        thisComponent.refs.txtArtist.value = "";
        thisComponent.refs.txtTitle.value = "";
      }, 3500);

      thisComponent.props.emptyResults();
      var artist = thisComponent.refs.txtArtist.value;
      var title = thisComponent.refs.txtTitle.value;
      var ytApiKey = "AIzaSyB5zz7R6AudAf5yxZK05WZhn7sZCiL4Esk";

      var urlTitle = title.replace(/ /g, '+');
      var urlArtist = artist.replace(/ /g, '+');

      let counter = 0;

      $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" 
        + urlTitle + "%2B" + urlArtist + "&type=video&key=" + ytApiKey, function(data) {
        data.items.forEach(function(result) {
          if (counter < 4) {
            counter++;
            if (result.snippet.title.toUpperCase().indexOf("(LIVE)") > -1 || result.snippet.title.toUpperCase().indexOf("COVER") > -1 || result.snippet.title.toUpperCase().indexOf("CONCERT") > -1
              || result.snippet.title.toUpperCase().indexOf(artist.toUpperCase()) < 0 || title.toUpperCase().indexOf("LIVE") < 0 && 
              result.snippet.title.toUpperCase().indexOf("LIVE") > -1) {
              // Reject Video from our results list
            }
            else {
              //thisComponent.state.songChoices.push(result);
              $.get("https://www.googleapis.com/youtube/v3/videos?id=" + result.id.videoId + "&part=contentDetails&key=" + ytApiKey, function(data) {
                var time = getYTDuration(data.items[0].contentDetails.duration);
                var title = result.snippet.title.replace(/video|lyrics|Video|VIDEO|Lyrics|Music/g, function myFunction(x){return ""});
                title = title.replace(/[()]/g, '');
                const resultObject = { id: result.id.videoId, title: title, desc: result.snippet.description, minutes: time.minutes,
                  seconds: time.seconds };
                thisComponent.props.addSongResult(resultObject);
              });
            }
          }
        });
      });

      e.stopImmediatePropagation();
      return false;
    });
  }

  render() {
    return (
      <div className={styles.songPickerItem}>
        <h2>Request by Title & Artist</h2>
        <form id="YTForm">
          <input type="text" ref="txtTitle" placeholder="TITLE" />
          <input type="text" ref="txtArtist" placeholder="ARTIST" />
          <input type="submit" value="Request" />
          <div className={styles.testerr} id="loadingDiv">
            <Loading type='spinningBubbles' color='#000000'/>
          </div>
        </form>
      </div>
    )
  }
}

export default SongFinderForm;