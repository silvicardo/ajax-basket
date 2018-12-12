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
*/

$( document ).ready(function() {

  var databaseGiocatori = generaDatabaseGiocatori(100);
  //console.log(databaseGiocatori);

  caricaUIListaGiocatoriDa(databaseGiocatori);

  $('#searchInput').on({
    keyup: function () {
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
    },
    click: function () {
      var idRicerca = $(this).val();
      if (idRicerca.length == 6) {
        $(this).val('');
      }
    }
  });

  var giocatoreMostrato;

  $('.full_database .player_card').click(function() {

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

  //Generazione Giocatori casuali per il db

  function generaDatabaseGiocatori(nrGiocatori) {
    var arrayGiocatori = [];

    var arrayId = generaIdCasualiDifferentiPer(nrGiocatori);

    for (var i = 0; i < arrayId.length; i++) {
      arrayGiocatori.push(generaNuovoOggettoGiocatoreRandomCon(arrayId[i]));
    }

    return arrayGiocatori;
  }

  function generaIdCasualiDifferentiPer(totaleId) {

    var arrayId = [];

    while (arrayId.length <= totaleId - 1) {
      var numeriCasuali = generaNumeroCasualeTra(100, 999);
      var stringaCasuale = generaStringaConLettereCasuali(3);
      var idCandidato = stringaCasuale + numeriCasuali;
      if (arrayId.includes(idCandidato) == false) {
        arrayId.push(idCandidato);
      }
    }

    return arrayId;
  }

  function generaStringaConLettereCasuali(numeroCaratteri) {
    var alfabeto = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","u","v","w","x","y","z"];

    var stringaRisultato = "";

    for (var i = 0; i < numeroCaratteri; i++) {
      var stringaCasuale = alfabeto[generaNumeroCasualeTra(0, alfabeto.length - 1)];
      stringaRisultato += stringaCasuale.toUpperCase();
    }
    return stringaRisultato;
  }

  function generaNuovoOggettoGiocatoreRandomCon(id) {

    var nuovoGiocatore = {
      id: id,
    };

    nuovoGiocatore.statistiche = generaOggettoStatistiche();

    return nuovoGiocatore;
  }

  function generaOggettoStatistiche() {

    var statistiche = {
      rimbalzi : generaNumeroCasualeTra(1,30), //Numero di rimbalzi
      falli : generaNumeroCasualeTra(0, 5) //Falli
    };

    //Creazione restanti parametri delle statistiche
    var statisticaCreata = false;

    while (statisticaCreata != true) {
      //Genero Punteggio Totale Casuale
      statistiche.punteggioPartita = generaNumeroCasualeTra(20,80);

      //Genero una percentuale tiri da 3 riuscita
      var percentualeTiriDa3Casuale = generaNumeroCasualeTra(30,60);

      //Calcolo punti fatti con tiri da 3 e 2 ad Intero
      var puntiTiriDa3ConPerScelta = parseInt(statistiche.punteggioPartita / 100 * percentualeTiriDa3Casuale);
      var tiriDa2Sottratti = statistiche.punteggioPartita - puntiTiriDa3ConPerScelta;

      if (puntiTiriDa3ConPerScelta % 3 == 0) {
        if (tiriDa2Sottratti % 2 == 0) {
          statisticaCreata = true;
        }
      }
    }

    //Assegnazione parametri generati
    statistiche.tiriDa3Riusciti = puntiTiriDa3ConPerScelta / 3;
    statistiche.tiriDa2Riusciti = tiriDa2Sottratti / 2;
    statistiche.puntiConTiriDa3Riusciti = puntiTiriDa3ConPerScelta;
    statistiche.puntiConTiriDa2Riusciti = tiriDa2Sottratti ;
    statistiche.percentualeTiriDa3InPartita = percentualeTiriDa3Casuale + '%';
    statistiche.percentualeTiriDa2InPartita = (100 - percentualeTiriDa3Casuale) + '%';

    return statistiche;
  }
});
