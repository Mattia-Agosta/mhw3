//Definisco le costanti utili per le API
const joke_endpoint = "https://v2.jokeapi.dev/joke/"
const iTunes_endpoint = "https://itunes.apple.com/search"
const client_id = "5ac868ec136146988cf5291e148921e6";
const client_secret = "ddfab56d3bac4013a4ab2c227fcfb0a4";
const spotify_token_endpoint = "https://accounts.spotify.com/api/token";
const spotify_endpoint = "https://api.spotify.com/v1/";
let access_token = "";
const spotify_limit = 5;

//Creo la funzione onJson di jokeAPI
function onJokeJson(json) {
    if (json === null) {
        return;
    }
    console.log ("Json ricevuto!");
    console.log (json);
    //Cancello la battuta precedente
    joke_content.innerHTML = '';
    //Caso 1: La battuta è formata da una battuta sola
    if (json.joke) {
        const joke = document.createElement('span');
        joke.textContent = json.joke;
        console.log (joke);
        joke_content.appendChild(joke);
    }
    //Caso 2: La battuta ha due parti
    else {
        const joke1 = document.createElement('span');
        joke1.textContent = json.setup + "...";
        const joke2 = document.createElement('span');
        joke2.setAttribute('id', 'delivery');
        joke2.textContent = "..." + json.delivery;
        joke_content.appendChild(joke1);
        joke_content.appendChild(joke2);
    }
}

//Creo la funzione che gestisce il Json di iTunesAPI
function onSongsJson(json) {
    if (json === null) 
        return;
    console.log ("Json ricevuto!");
    console.log(json);
    //Cancello le canzoni precedente
    canzoni.innerHTML = '';
    //Processo i risultati ottenuti
    const risultati = json.results;
    let song_ids = [];
    for (let i = 0; i < 8;) {
        let continua = true;
        const trackID = risultati[i].trackId;
        console.log(trackID);
        //Controllo che la canzone non sia già presente
        console.log(song_ids.includes(trackID));
         if (song_ids.includes(trackID)) {
            continua = false;
            break;
         }
        if (continua === true) {
            //Se sono arrivato fin qui, la canzone non è già presente
            song_ids[i] = trackID;
            console.log(song_ids);
            const song_name = document.createElement("div");
            song_name.textContent = "Titolo: " + risultati[i].trackName;
            const album_name = document.createElement("div");
            album_name.textContent = "Album: " + risultati[i].collectionName;
            const image = document.createElement('img');
            image.src = risultati[i].artworkUrl100;
            const canzone = document.createElement('div');
            canzone.classList.add("canzone");
            canzone.appendChild(image);
            canzone.appendChild(song_name);
            canzone.appendChild(album_name);
            canzoni.appendChild(canzone);
            i++;
        }
    }
}

//Creo la funzione che gestisce il JSON di Spotify
function onSpotifyJson (json) {
    if (json === null) {
        return;
    }
    console.log ("Json ricevuto!");
    console.log (json);
    //Processo i risultati ottenuti
    const albums = json.albums.items;
    for (let i = 0; i < spotify_limit; i++) {
        const a = albums[i];
        const titolo = document.createElement('span');
        titolo.textContent = a.name;
        const image = document.createElement('img');
        image.src = a.images[1].url;
        const link = document.createElement('a');
        link.href = a.external_urls.spotify;
        link.classList.add('album-img');
        const oggetto = document.createElement('div');
        oggetto.classList.add('album');
        link.appendChild(image);
        oggetto.appendChild(link);
        oggetto.appendChild(titolo);
        container.appendChild(oggetto); 
    }
}

//Creo la funzione che gestisce il json del token di Spotify
function onTokenJson(json) {
    if (json === null) {
        return;
    }
    console.log(json);
    console.log ("Token ricevuto!");
    access_token = json.access_token;
    console.log ("Access token: " + access_token);
}

//Creo le funzioni che gestistono le ricerche per tutti
function onResponse(response) {
    if (!response.ok) {
        console.log ("Ricevuta risposta non valida");
        console.log(response);
        return null;
    }
    console.log ("Risposta ricevuta!");
    return response.json();
}

function onError (error) {
    console.log ("Errore: " + error);
    return null;
}

//Creo la funzione che gestisce JokeAPI: restituirà una battuta a caso a tema programmazione
function searchJoke () {
    //Preparo la richiesta
    const search_url = joke_endpoint + "Programming?blacklistFlags=nsfw,religious,racist,sexist,explicit";
    //Eseguo la fetch (non sono necessarie chiavi o simili)
    fetch(search_url).then(onResponse, onError).then(onJokeJson);
}

//Creo la funzione che gestisce iTunesAPI: restituità otto canzoni di un artista
function searchSongs(event) {
    //Prevengo il comportamento di default
    event.preventDefault();
    //Preparo la richiesta
    const artist_field = document.querySelector('#select_Artist');
    const artist = encodeURIComponent(artist_field.value);
    const search_url = iTunes_endpoint + "?term=" + artist + "&country=IT&entity=song&attribute=artistTerm&limit=8";
    console.log("Ricerca di: " + search_url); 
    //Faccio la fetch
    fetch(search_url).then(onResponse, onError).then(onSongsJson);
}

//Creo la funzione incaricata di ottenere il token da Spotify 
function getSpotifyToken() {
    //Preparo il link
    const search_url = spotify_token_endpoint + "?grant_type=client_credentials&client_id=" + client_id + 
        "&client_secret=" + client_secret;
    //Eseguo la fetch
    fetch(search_url, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
        }
    }).then(onResponse, onError).then(onTokenJson);
}

//Creo la funzione che gestisce l'API di Spotify
function spotifyAPI() {    
    //Una volta ottenuto il token, preparo la richiesta
    const search_url = "https://api.spotify.com/v1/browse/new-releases?country=IT&offset=0&limit=" + spotify_limit;
    //Faccio la fetch
    fetch(search_url, {
        headers: {
            'Authorization': 'Bearer ' + access_token,
        },
        contentType: 'application/json',
    }).then(onResponse, onError).then(onSpotifyJson);
}

//All'apertura della pagina, l'API di Spotify entra in funzione in automatico
getSpotifyToken();
//Ritardo l'esecuzione di SpotifyAPI per essere sicuro di avere il token
setTimeout(spotifyAPI, 1000);

//Aggiungo l'event listener per JokeAPI
const joke_button = document.querySelector('#joke_button');
joke_button.addEventListener('click', searchJoke);

//Aggiungo l'event listener per iTunesAPI
const artist_button = document.querySelector('#submit');
artist_button.addEventListener('click', searchSongs);