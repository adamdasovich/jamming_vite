
const clientId = '6a1ee4b95ba44cf4bf2fdbd421f9d266'
const redirectUri = 'http://localhost:5173';
//const redirectUri = 'https://adamdasovich.github.io/jammming_vite/'
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
  
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      
      // Retrieve and use the saved search term
      const savedSearchTerm = localStorage.getItem('spotifySearchTerm');
      console.log('Saved search term:', savedSearchTerm);
      localStorage.removeItem('spotifySearchTerm');
      
      if (savedSearchTerm) {
        // Instead of calling this.search directly, we'll return a promise
        return Promise.resolve(accessToken).then(() => {
          return this.search(savedSearchTerm);
        });
      }
      
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

    //Player 
    startPlayback(deviceId, uris) {
      const accessToken = Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: uris })
      });
    },
  
    getDevices() {
      const accessToken = Spotify.getAccessToken();
      return fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(response => response.json());
    },
    //Player ends

    handleSpotify(){
      const accessToken = Spotify.getAccessToken()
      console.log(accessToken)
    },  
    
    search(term) {
      const accessToken = Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          imageUrl: track.album.images[0]?.url,
          previewUrl: track.preview_url 
        }));
      });
    },

    //get user playlist
    getUserPlaylists() {
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
    
      return fetch(`https://api.spotify.com/v1/me`, {headers})
        .then(response => response.json())
        .then(jsonResponse => {
          const userId = jsonResponse.id;
          console.log('User ID:', userId);
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {headers});
        })
        .then(response => response.json())
        .then(jsonResponse => {
          console.log('Playlists response:', jsonResponse);
          if (jsonResponse.items) {
            const playlists = jsonResponse.items.map(playlist => ({
              id: playlist.id,
              name: playlist.name,
              trackCount: playlist.tracks.total,
              uri: playlist.uri
            }));
            console.log('Parsed playlists:', playlists);
            return playlists;
          }
          console.log('No playlists found in response');
          return [];
        })
        .catch(error => {
          console.error('Error fetching playlists:', error);
          return [];
        });
    }, 
  
    savePlaylist(name, trackUris) {
      if (!name || !trackUris.length) {
        return;
      }
  
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      let userId;
  
      return fetch('https://api.spotify.com/v1/me', {headers: headers}
      ).then(response => response.json()
      ).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name})
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackUris})
          });
        });
      });
    }
  };
  export default Spotify;