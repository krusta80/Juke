jukeModule.controller('AlbumController', function($http, $rootScope) {
	this.activeIndex;
	this.isPaused = true;
	
	this.getArtistString = function(artists) {
		return artists.reduce(function(prev,curr) {
				return prev + curr.name + ", ";
		}, "").slice(0,-2);
	};

	this.loadAlbum = function() {
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
		    this.album = albumFromServer;
		    console.log("album loaded...");
		}.bind(this)).catch(console.error.bind(console));	
	};
		
	this.toggleSong = function(ind) {
		var oldInd = this.activeIndex;
		this.pauseSong();
		if(oldInd !== ind)
			this.playSong(ind);
	};

	this.playPreviousSong = function() {
		this.toggleSong(this.activeIndex-1);
	};
	
	this.playNextSong = function() {
		this.toggleSong(this.activeIndex+1);
	};

	$rootScope.$on('playPreviousSong', this.playPreviousSong.bind(this));
	$rootScope.$on('playNextSong', this.playNextSong.bind(this));
	$rootScope.$on('pauseSongRequest', function(event,data) {
		this.toggleSong(this.activeIndex);
	}.bind(this));
	$rootScope.$on('songIsPaused', function(event,data) {
		this.isPaused = true;
	}.bind(this));
	$rootScope.$on('songIsPlaying', function(event,data) {
		this.isPaused = false;
	}.bind(this));
	
	this.playSong = function(ind) {
		this.activeIndex = ind;
		this.album.songs[this.activeIndex].isPlaying = true;
		$rootScope.$broadcast('playSong',{
			songId: this.album.songs[this.activeIndex]._id,
			songCount: this.album.songs.length,
			songIndex: this.activeIndex
		});
	};

	this.pauseSong = function(ind) {
		if(this.isPaused) return;
		if(ind === undefined) ind = this.activeIndex;
		$rootScope.$broadcast('pauseSong');
		this.deactivateSong(ind);
		this.activeIndex = undefined;
	};

	this.deactivateSong = function(ind) {
		if(ind === undefined) ind = this.activeIndex;
		if(ind > -1) {
			this.album.songs[ind].isPlaying = false;
		}
	};

	this.readKey = function(event) {
		if(event.keyCode === 37 || event.keyCode === 38) {
			if(this.activeIndex > 0) this.playPreviousSong();
		}
		else if(event.keyCode === 39 || event.keyCode === 40) {
			if(this.activeIndex < this.album.songs.length - 1) this.playNextSong();
		}
		else if(event.keyCode === 32) {
			this.toggleSong(this.activeIndex);
		}
		console.log(event.keyCode);
	};

	this.loadAlbum();
});