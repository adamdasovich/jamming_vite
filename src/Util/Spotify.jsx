import axios from 'axios'
const clientId = '6a1ee4b95ba44cf4bf2fdbd421f9d266'
const redirectUri = 'http://localhost:5173';
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
        window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
        const savedSearchTerm = localStorage.getItem('spotifySearchTerm')
        localStorage.removeItem('spotifySearchTerm')
        if (savedSearchTerm) {
          this.search(savedSearchTerm)
        }
        return accessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    },

    async getUserPlaylists () {
      try {
        const accessToken = Spotify.getAccessToken()
        let playlists = []
        const userId = await axios.get(`https://api.spotify.com/v1/me`, {
          headers: {
            Authentication: `Bearer ${accessToken}`
          }
        })
        
        let url = `https://api.spotify.com/v1/me/usersId/${userId}/playlists`

        while (url) {
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })

          playlists = [...playlists, ...res.data.items]
          url = res.data.next
          
        }
        console.log(playlists)
        return playlists
      } catch (error) {
        console.error('error fetching: ', error)
        throw error;
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