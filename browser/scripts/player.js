jukeModule.controller('PlayerController', function($scope, $rootScope) {
	this.activeAudio = document.createElement('audio');
	this.firstSong;
	this.lastSong;

	this.playSong = function(songId) {
		this.activeAudio = document.createElement('audio');
		this.activeAudio.src = '/api/songs/' + songId + '.audio';
		
		this.activeAudio.addEventListener('timeupdate', function () {
		    this.progress = 100 * this.activeAudio.currentTime / this.activeAudio.duration;
			$scope.$apply();
		}.bind(this));
		
		this.activeAudio.addEventListener('ended', function () {
		    if(this.lastSong) this.togglePauseButton();
		    else this.playNextSong();
		}.bind(this));
		
		this.activeAudio.load();
		this.activeAudio.play();
		$rootScope.$broadcast('songIsPlaying');
	};

	this.pauseSong = function() {
		this.activeAudio.pause();
		$rootScope.$broadcast('songIsPaused');
	};

	this.togglePauseButton = function() {
		$rootScope.$broadcast('pauseSongRequest');
	};

	this.playPreviousSong = function() {
		$rootScope.$broadcast('playPreviousSong');
	};
	
	this.playNextSong = function() {
		$rootScope.$broadcast('playNextSong');
	};

	this.seekSong = function(event) {
		var progressWidth = angular.element(event.currentTarget).prop('offsetWidth');
		var x = event.offsetX;
		this.activeAudio.currentTime = this.activeAudio.duration * x / progressWidth;
	};

	$rootScope.$on('playSong', function(event,data) {
		this.firstSong = data.songIndex === 0;
		this.lastSong = data.songIndex === data.songCount-1;
		this.playSong(data.songId);
	}.bind(this));
	$rootScope.$on('pauseSong', this.pauseSong.bind(this));

});