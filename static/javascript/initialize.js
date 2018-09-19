window.onSpotifyWebPlaybackSDKReady = () => {
    
    let token = "";

    $.get('/accessToken', function(data, status) {
        token = data;
        console.log(token);
    });
    
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


