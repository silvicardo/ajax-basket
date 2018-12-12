/*
Il software deve generare casualmente le statistiche di gioco di
100 giocatori di basket per una giornata di campionato.
In particolare vanno generate per ogni giocatore le seguenti
informazioni, facendo attenzione che il numero generato abbia
senso:
- Codice Giocatore Univoco (formato da 3 lettere
maiuscole casuali e 3 numeri)
- Numero di punti fatti
- Numero di rimbalzi
- Falli
- Percentuale di successo per tiri da 2 punti
- Percentuale di successo per da 3 punti
Una volta generato il “database”, il programma deve chiedere
all’utente di inserire un Codice Giocatore e il programma
restituisce le statistiche.

JQUERY
Utilizzare il DB del Basket già creato nell’esercizio
precedente, per creare un’interfaccia grafica.
Tutti i giocatori verranno visualizzati tramite il loro
codice in una sidebar. Una volta cliccato sul codice
giocatore, nel corpo principale verranno
visualizzate le statistiche corrispondenti.
Utilizzare jquery, handlebars e il DB del precedente
esercizio

AJAX UPDATE (versione corrente);
Grazie all’utilizzo dell’API e il suo
URL
https://www.boolean.careers/api/ar
ray/basket?n=numberPlayers
Ricreare l’esercizio del basket,
questa volta dando la possibilità
all’utente di scegliere quanti
giocatori generare per poi stampare
la lista in una sidebar e vedere le
statistiche correlate al player
clicccato
*/

$( document ).ready(function() {

  var numeroGiocatoriStr = prompt('Digita il numero giocatori desiderato');
  var databasegiocatori = [];
  var apiUrl = 'https://www.boolean.careers/api/array/basket?n='+ numeroGiocatoriStr;

  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function(apiData) {
      databaseGiocatori = generaDatabaseGiocatoriDa(apiData.response);
      caricaUIListaGiocatoriDa(databaseGiocatori);

      $('#searchInput').on({
        keyup: gestisciDigitazioneBarraDiRicerca,
        click: gestisciClickSuBarraDiRicerca
      });

      var giocatoreMostrato;

      $('.full_database .player_card').click(gestisciClickSuListaGiocatori);
    },
    error: function(error) {
      console.log('Errore durante il recupero dei dati');
    }
  })

});

// FUNZIONI

//Gestione della UI

function caricaUIListaGiocatoriDa(databaseGiocatori) {
  var listaGiocatori = $('#db');

  for (var i = 0; i < databaseGiocatori.length; i++) {
    var card = generaCardPerListaDatabaseDa(databaseGiocatori[i]);
    listaGiocatori.append(card);
  }

}

function generaCardPerListaDatabaseDa(giocatore) {

  var cardTemplate = $('#db_list_player_template');

  var cardTemplateHtml = cardTemplate.html();

  var template = Handlebars.compile(cardTemplateHtml);

  var data = {
    id: giocatore.id
  };

  var htmlRisultato = template(data);

  return htmlRisultato;

}

function generaCard(giocatore) {

  var cardTemplate = $('#player_found');

  var cardTemplateHtml = cardTemplate.html();

  var template = Handlebars.compile(cardTemplateHtml);

  var data = giocatore.statistiche;

  data.id = giocatore['id'];

  var htmlRisultato = template(data);

  return htmlRisultato;

}

//Ricerca Giocatori nel db

function interroga(database, id) {

  var idAdattato = id.toUpperCase();

  var risultatoQuery = databaseContiene(database, idAdattato);
  if (risultatoQuery == -1) {
    stampaASchermoErrore();
  } else {
    stampaASchermoGiocatoreDa(risultatoQuery, database);
  }
  $('#searchInput').val('');
}

function stampaASchermoErrore() {
  $('.warning').addClass('active');
}

function stampaASchermoGiocatoreDa(indice, database) {

  var giocatore = database[indice];
  var cardGiocatoreTrovato = generaCard(database[indice]);
  $('#result_area').append(cardGiocatoreTrovato);
}

function databaseContiene(database, id) {

  for (var i = 0; i < database.length; i++) {
    if (database[i].id == id) {
      return i;
    }
  }

  return -1;
}

//Popolazione lista Giocatori per il db

function generaDatabaseGiocatoriDa(apiData) {
  var arrayGiocatori = [];

  for (var i = 0; i < apiData.length; i++) {
    arrayGiocatori.push(generaNuovoOggettoGiocatoreDa(apiData[i]));
  }

  return arrayGiocatori;
}

function generaNuovoOggettoGiocatoreDa(giocatoreApi) {

  var nuovoGiocatore = {
    id: giocatoreApi.playerCode,
  };

  nuovoGiocatore.statistiche = generaOggettoStatisticheDa(giocatoreApi);

  return nuovoGiocatore;
}

function generaOggettoStatisticheDa(giocatoreApi) {

  var statistiche = {
    rimbalzi : giocatoreApi.rebounds,
    falli : giocatoreApi.fouls,
    punteggioPartita : giocatoreApi.points,
    puntiConTiriDa3Riusciti : giocatoreApi.threePoints,
    puntiConTiriDa2Riusciti : giocatoreApi.twoPoints,
    tiriDa3Riusciti : giocatoreApi.threePoints / 3,
    tiriDa2Riusciti : giocatoreApi.twoPoints / 2
  };
  var percentualeTiriDa3 = parseInt((100 / giocatoreApi.points) * giocatoreApi.threePoints);
  statistiche.percentualeTiriDa3Riusciti = percentualeTiriDa3 + '%';
  statistiche.percentualeTiriDa2Riusciti = (100 - percentualeTiriDa3) + '%';

  return statistiche;
}

//Funzioni eventi per jQuery

function gestisciClickSuListaGiocatori(){
  //Recupero l'indice di un eventuale giocatore già toccato in lista
  giocatoreMostrato = $('.full_database .player_card.selected');
  var indiceGiocatoreMostrato = $('.full_database .player_card').index(giocatoreMostrato);

  var giocatoreCliccato = $(this);
  var indiceGiocatoreCliccato = $('.full_database .player_card').index(giocatoreCliccato);

  //Se il giocatore è diverso da quello già selezionato
  //elabora la card
  if (indiceGiocatoreMostrato != indiceGiocatoreCliccato) {
    giocatoreMostrato.removeClass('selected');
    giocatoreCliccato.addClass('selected');
    var figliAreaRisultati = ($('#result_area').get(0).childElementCount);
    if (figliAreaRisultati == 3 ) {
      $('#result_area > .player_card').remove();
    }
    $('.warning').removeClass('active');
    stampaASchermoGiocatoreDa(indiceGiocatoreCliccato, databaseGiocatori);
  }

}

function gestisciDigitazioneBarraDiRicerca(){
  $('.full_database .player_card').removeClass('selected');
  var idRicerca = $(this).val();
  if (idRicerca.length == 6) {
    interroga(databaseGiocatori, idRicerca);
  } else if (idRicerca.length == 1) {
      var figliAreaRisultati = ($('#result_area').get(0).childElementCount);

      $('.warning').removeClass('active');
      if (figliAreaRisultati == 3 ) {
        $('#result_area > .player_card').remove();
      }
  }
}

function gestisciClickSuBarraDiRicerca(){
  var idRicerca = $(this).val();
  if (idRicerca.length == 6) {
    $(this).val('');
  }
}
