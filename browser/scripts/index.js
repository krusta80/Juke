var jukeModule = angular.module('juke', []);

jukeModule.controller('AlbumController', function($scope, $http, $rootScope) {
	$scope.activeIndex;
	$scope.isPaused = true;
	
	$scope.getArtistString = function(artists) {
		return artists.reduce(function(prev,curr) {
				return prev + curr.name + ", ";
		}, "").slice(0,-2);
	};

	$scope.loadAlbum = function() {
		$http.get('/api/albums/').then(function(response) {
			return response.data;
		}).then(function(body) {
			var firstAlbum = body[Math.floor(Math.random()*body.length)]._id;
			return firstAlbum;
		}).then(function(albumID) {
			return $http.get('/api/albums/' + albumID);
		}).then(function(album) {
			var albumFromServer = album.data;
			albumFromServer.imageUrl = '/api/albums/' + albumFromServer._id + '.image';
		    $scope.album = albumFromServer;
		}).catch(console.error.bind(console));	
	};
		
	$scope.toggleSong = function(ind) {
		//console.log("ind is "+ind);
		var oldInd = $scope.activeIndex;
		$scope.pauseSong();
		if(oldInd !== ind)
			$scope.playSong(ind);
		//console.log("new activeIndex is "+$scope.activeIndex);
	};

	$scope.playPreviousSong = function() {
		$scope.toggleSong($scope.activeIndex-1);
	};
	
	$scope.playNextSong = function() {
		$scope.toggleSong($scope.activeIndex+1);
	};

	$rootScope.$on('playPreviousSong', $scope.playPreviousSong);
	$rootScope.$on('playNextSong', $scope.playNextSong);
	$rootScope.$on('pauseSongRequest', function(event,data) {
		console.log(" --> song request");
		$scope.toggleSong($scope.activeIndex);
	});
	$rootScope.$on('songIsPaused', function(event,data) {
		console.log(" --> song is paused");
		$scope.isPaused = true;
	});
	$rootScope.$on('songIsPlaying', function(event,data) {
		console.log(" --> song is playing");
		$scope.isPaused = false;
	});
	
	$scope.playSong = function(ind) {
		$scope.activeIndex = ind;
		$scope.album.songs[$scope.activeIndex].isPlaying = true;
		console.log("play the song --> ");
		$rootScope.$broadcast('playSong',{
			songId: $scope.album.songs[$scope.activeIndex]._id,
			songCount: $scope.album.songs.length,
			songIndex: $scope.activeIndex
		});
	}

	$scope.pauseSong = function(ind) {
		if($scope.isPaused) return;
		if(ind === undefined) ind = $scope.activeIndex;
		console.log("pause the song --> ");
		$rootScope.$broadcast('pauseSong');
		$scope.deactivateSong(ind);
		$scope.activeIndex = undefined;
	}

	$scope.deactivateSong = function(ind) {
		if(ind === undefined) ind = $scope.activeIndex;
		if(ind > -1) {
			$scope.album.songs[ind].isPlaying = false;
		}
	}

	$scope.loadAlbum();
});

jukeModule.controller('PlayerController', function($scope, $rootScope) {
	$scope.activeAudio = document.createElement('audio');
	$scope.firstSong;
	$scope.lastSong;

	$scope.playSong = function(songId) {
		$scope.activeAudio = document.createElement('audio');
		$scope.activeAudio.src = '/api/songs/' + songId + '.audio';
		
		$scope.activeAudio.addEventListener('timeupdate', function () {
		    $scope.progress = 100 * $scope.activeAudio.currentTime / $scope.activeAudio.duration;
			$scope.$apply();
		});
		
		$scope.activeAudio.addEventListener('ended', function () {
		    if($scope.lastSong) $scope.togglePauseButton();
		    else $scope.playNextSong();
		});
		
		$scope.activeAudio.load();
		$scope.activeAudio.play();
		$rootScope.$broadcast('songIsPlaying');
	};

	$scope.pauseSong = function() {
		console.log("[PLAY CONTROLLER] pausing song");
		$scope.activeAudio.pause();
		$rootScope.$broadcast('songIsPaused');
	};

	$scope.togglePauseButton = function() {
		$rootScope.$broadcast('pauseSongRequest');
	};

	$scope.playPreviousSong = function() {
		$rootScope.$broadcast('playPreviousSong');
	};
	
	$scope.playNextSong = function() {
		$rootScope.$broadcast('playNextSong');
	};

	$scope.seekSong = function(event) {
		var progressWidth = angular.element(event.currentTarget).prop('offsetWidth');
		var x = event.offsetX;
		$scope.activeAudio.currentTime = $scope.activeAudio.duration * x / progressWidth;
	};

	$rootScope.$on('playSong', function(event,data) {
		console.log("[PLAY CONTROLLER] play song received",data.songId,data.songIndex,data.songCount);
		$scope.firstSong = data.songIndex === 0;
		$scope.lastSong = data.songIndex === data.songCount-1;
		$scope.playSong(data.songId);
	});
	$rootScope.$on('pauseSong', $scope.pauseSong);

});