var jukeModule = angular.module('juke', []);

jukeModule.controller('MainViewController', function($scope, $http) {
	$scope.fakeAlbum = {
	    name: 'Abbey Road',
	    imageUrl: 'http://fillmurray.com/300/300',
	    songs: [{
	        name: 'Romeo & Juliette',
	        artists: [{name: 'Bill'}],
	        genres: ['Smooth', 'Funk'],
	        audioUrl: 'http://www.stephaniequinn.com/Music/Commercial%20DEMO%20-%2013.mp3'
	    }, {
	        name: 'White Rabbit',
	        artists: [{name: 'Bill'}, {name: 'Bob'}],
	        genres: ['Fantasy', 'Sci-fi'],
	        audioUrl: 'http://www.stephaniequinn.com/Music/Commercial%20DEMO%20-%2008.mp3'
	    }, {
	        name: 'Lucy in the Sky with Diamonds',
	        artists: [{name: 'Bob'}],
	        genres: ['Space'],
	        audioUrl: 'http://www.stephaniequinn.com/Music/Commercial%20DEMO%20-%2001.mp3'
	    }]
	};
	$scope.getArtistString = function(artists) {
		return artists.reduce(function(prev,curr) {
				return prev + curr.name + ", ";
		}, "").slice(0,-2);
	}

	$http.get('/api/albums/').then(function(response) {
		return response.data;
	}).then(function(body) {
		var firstAlbum = body[0]._id;
		return firstAlbum;
	}).then(function(albumID) {
		return $http.get('/api/albums/' + albumID);
	}).then(function(album) {
		var albumFromServer = album.data;
		albumFromServer.imageUrl = '/api/albums/' + albumFromServer._id + '.image';
	    $scope.album = albumFromServer;
	}).catch(console.error.bind(console));

	$scope.playSong = function(url) {
		console.log(url);
		var audio = document.createElement('audio');
		audio.src = '/api/songs/' + url + '.audio';
		audio.load();
		audio.play();
	}
});

jukeModule.controller('SideBarController', function($scope) {
	$scope.fakeAlbum = {
	    name: 'Abbey Road',
	    imageUrl: 'http://fillmurray.com/300/300',
	    songs: [{
	        name: 'Romeo & Juliette',
	        artists: [{name: 'Bill'}],
	        genres: ['Smooth', 'Funk'],
	        audioUrl: 'http://www.stephaniequinn.com/Music/Commercial%20DEMO%20-%2013.mp3'
	    }, {
	        name: 'White Rabbit',
	        artists: [{name: 'Bill'}, {name: 'Bob'}],
	        genres: ['Fantasy', 'Sci-fi'],
	        audioUrl: 'http://www.stephaniequinn.com/Music/Commercial%20DEMO%20-%2008.mp3'
	    }, {
	        name: 'Lucy in the Sky with Diamonds',
	        artists: [{name: 'Bob'}],
	        genres: ['Space'],
	        audioUrl: 'http://www.stephaniequinn.com/Music/Commercial%20DEMO%20-%2001.mp3'
	    }]
	};
});