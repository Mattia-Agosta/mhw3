# mhw3

Questo è il Mini-Homework che sin'ora mi ha dato più difficoltà. Inizialmente ho pensato di riutilizzare la mia prima pagina web (*Le mie cinque console Nintendo preferite*) utilizzando alcune API a tema. Ne avevo trovata una che però mi ha dato molte difficoltà in fase di autenticazione Oauth e pertanto ho dovuto cambiare argomento. Ho ricreato la pagina, modificando la classifica da tema videogiochi a tema **musica**, che mi ha permesso di avere una maggior selezione di API disponibili.
Queste quelle che ho implementato:

### JokeAPI
Si tratta di un API **senza chiave**. Non è molto a tema con la pagina scelta, ma appena l'ho vista me ne sono innamorato.
**Funzionamento**: premendo il pulsante restituisce una battuta a caso a tema programmazione dal database di JokeAPI. La query è personalizzata per restituire solo battute di questo tipo.

### iTunesAPI
L'API di Apple, è anch'essa **senza chiave**. Ho sfruttato la funzionalità che permette di cercare una canzone tra i vari oggetti dell'Apple Store. 
Nella mia implementazione - a fine pagina - è possibile inserire il nome di un artista per ottenere fino ad 8 sue canzoni (titolo, album e immagine).

### SpotifyAPI
Spotify era la mia ultima spiaggia tra le API che utilizzano autenticazione **OAuth**: volevo evitare di utilizzare qualcosa di già visto a lezione, ma dopo aver provato 4-5 API diverse - senza successo - ho dovuto arrendermi. La maggior parte di quelle che ho provato richiedevano necessariamente PHP o non erano aperte al pubblico senza un'autorizzazione specifica. Alla fine ho utilizzato Spotify, implementando la richiesta del token in modo leggermente diverso di quanto visto a lezione (le assicuro che non ho guardato il codice nemmeno per un aiutino).
Nella mia implementazione, ho fatto utilizzo della proprietà CSS *position: sticky* per creare una barra posizionata a fine pagina (che scorrendo fino in fondo lascia spazio al footer) che mostra quelli che sono in tempo reale gli album in evidenza di Spotify. La richiesta viene effettuata all'apertura della pagina. Ero incappato in un altro problema: tutte le richieste mi davano codice d'errore 400. Cercando online ho scoperto che il problema era che la fetch spesso partiva prima di ricevere il token di autenticazione, per cui ho sfruttato la funzione JavaScript *setTimeout* per esser sicuro di effettuare la fetch solo dopo aver ricevuto il token di autenticazione. Cliccando sulla copertina dell'album, è possibile accedere alla pagina corrispondente su Spotify

Avevo anche vagliato la possibilità di aggiungere una quarta API - un calendario che visualizza alcune informazioni sul giorno corrente - ma ho preferito evitare di inserire troppe API fuori tema. Mi scuso per aver riciclato Spotify, ma davvero - non sono riuscito a trovare alternative.
