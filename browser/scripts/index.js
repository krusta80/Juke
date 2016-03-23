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

	$scope.activeIndex;
	$scope.activeAudio;

	$scope.toggleSong = function(ind) {
		//console.log("ind is "+ind);
		var oldInd = $scope.activeIndex;
		$scope.pauseSong();
		if(oldInd !== ind)
			$scope.playSong(ind);
		//console.log("new activeIndex is "+$scope.activeIndex);
	}

	$scope.playSong = function(ind) {
		$scope.activeIndex = ind;
		$scope.activeAudio = document.createElement('audio');
		$scope.activeAudio.src = '/api/songs/' + $scope.album.songs[$scope.activeIndex]._id + '.audio';
		$scope.activeAudio.addEventListener('timeupdate', function () {
		    $scope.progress = 100 * $scope.activeAudio.currentTime / $scope.activeAudio.duration;
			$scope.$apply();
			//console.log($scope.progress);
		});
		$scope.activeAudio.load();
		$scope.activeAudio.play();
		$scope.activeAudio.onpause = function(e) {
			var func = function() {
				if($scope.activeAudio.currentTime == 0) {
					$scope.deactivateSong(ind);	
					$scope.$apply();	
				}
			}
			func();
		};
		$scope.album.songs[$scope.activeIndex].isPlaying = true;
	}

	$scope.pauseSong = function(ind) {
		if($scope.activeAudio === undefined) return;
		if(ind === undefined) ind = $scope.activeIndex;
		$scope.activeAudio.pause();
		$scope.deactivateSong(ind);
		$scope.activeIndex = undefined;
	}

	$scope.deactivateSong = function(ind) {
		if(ind === undefined) ind = $scope.activeIndex;
		if(ind > -1) {
			$scope.album.songs[ind].isPlaying = false;
			
		}
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