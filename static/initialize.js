window.onSpotifyWebPlaybackSDKReady = () => {
    const token = "BQAmI9F4Ts_IePNMs_M1UdswVfXSnrOmgyewA8aElb7tEpqLWg0NCoH-Z4xCTgAjDjyE2T4Oq1NxJb6DdS0c62xko6yWhb-xv_XhiYFSxi7JP_3ZkOGanLfUeeJOXkOnlT0SdtXZVw9tyHWaj71E-DSyOyGIDvBTTPyh4is";
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
    });
    
    // Error handling
    player.on('initialization_error', e => { console.error(e); });
    player.on('authentication_error', e => { console.error(e); });
    player.on('account_error', e => { console.error(e); });
    player.on('playback_error', e => { console.error(e); });
    
    // Playback status updates
    player.on('player_state_changed', state => {console.log("change")});
    
    // Ready
    player.on('ready', data => {
        let { device_id } = data;
        console.log('Ready with Device ID', device_id);
    });
    
    // Connect to the player!
    player.connect();

    getTracks(player);
}


