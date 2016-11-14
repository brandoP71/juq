export function getYTDuration(yt_duration){
	var time_extractor = /([0-9]*)M([0-9]*)S$/;
	var extracted = time_extractor.exec( yt_duration );
	var minutes = parseInt( extracted[1], 10 );
	var seconds = parseInt( extracted[2], 10 );
	//var duration = ( minutes * 60 ) + seconds;
	//return duration;
	return { minutes, seconds };
}