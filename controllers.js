//moduly
var fs = require('fs');
var formidable = require('formidable');
var qs = require('querystring');
var mysql = require('mysql');
var url = require('url');
var render = require('./render.js');


//zmienna globalna ktora przechowuje imie wylosowanej osoby
var	imieSzczesliwca;

//------------------------------------------------------------------------------//

//strona glowna
function index(request, response){
	render.render(response, 'views/index.html',  {
		pageTitle: 'Strona głowna'
	});
};

//proba ponownego losowania
function ponowneLosowanie(request, response){
	render.render(response, 'views/ponowneLosowanie.html',  {
		pageTitle: 'Juz losowales'
	});
};


/*
* Argumenty:
* - imie osoby losujacej
* Zwaraca: imie osoby, ktora zostala wylosowan
*/
	function losujacaOsobeKtoraBedzieObdarowana(imieOsobyLosujacej){
		//losuje liczbe porzadkowa liczbe i w result[i].id
		liczba = (imieOsobyLosujacej[Math.floor((Math.random())*imieOsobyLosujacej.length + 1)].id);
		return liczba;
	} //zamkniecie funckji losujacej


//------------------------------------------------------------------------------//

//strona zapisujaca imie losujacego
function save(request, response){
	//wyswietlanie szablonow dla odpowiednich sytuacji
	var onSaveError = function(response){
	  render.render(response, 'views/saveError.html', {
	    pageTitle: 'Wystapil blad zapisu'
	  });
	};

	//wyswietlanie szablonow dla odpowiednich sytuacji
	var onSaveSuccessImie = function(response){
	  render.render(response, 'views/losowanie.html', {
	    pageTitle: 'poprawnie zapisano',
	  });
	};

	//formularz wysylany jest postem
	if("POST" === request.method){

		//obsluga formularza
		//przypisanie do zmiennej form instancji ktora zawaraca nowy przychodzacy formularz
		var form = new formidable.IncomingForm();
		//ustawianie kodowania dla nowych pol formularza
		form.encoding = 'utf-8';
		//parsuje informacje otrzymane postem i wywiłuje callback
		form.parse(request, function (err, fields) {
			if(err){
				onSaveError(response);
				console.log(err);
				return;
			}

			//zapis informacji do bazy danych
			var pobraneImie = fields.name;

			//stworzenie polaczenie do bazy danych
			var conn = mysql.createConnection({ //przekazuje obiekt w ktorym beda parametry polaczenia
				host:'localhost',
				user:'root',
				password:'1gil2026problemow',
				database:'swiateczne_losowanie'
			});

			//odwoluje sie do obiektu conn i metoda connect czyli polacz sie z baza danych
			conn.connect();

			//pobieram imiona ktore juz losowaly i zablokowanie kolejnego losowania przez te sama osobe
			conn.query("SELECT * FROM domownicy WHERE czy_losowal = 1 AND imie = ?", [pobraneImie], function(err, result) {
				if(err){
					//wyswietlamy komunikat o bledzie
					onSaveError(response);
					console.log(err);
					return;	//zatrzymujemy działanie tej funckji
				}
			//	var imiee = result[0].imie || 100;
			//	console.log("resultat " + result[0].imie);
				if(result.length>0){
					if(result){
					//if(pobraneImie === result[0].imie){
					//zatrzymuje probe ponownego losowania
						ponowneLosowanie(request,response);
						return;
					}
				}


			/*//pobieram imiona ktore juz losowaly i zablokowanie kolejnego losowania przez te sama osobe
			conn.query("SELECT imie FROM domownicy WHERE czy_losowal = 1", function(err, result){ // (!) tutaj nie trzeba fora od razu zrobic selecta z uzytkownikiem ktory losuje
				if(err){
			    //wyswietlamy komunikat o bledzie
			    onSaveError(response);
			    console.log(err);
			    return;		//zatrzymujemy działanie tej funckji
			  }
				for (var i = 0; i < result.length; i++){ //(!)
					console.log("pobranie imienia " + result[i].imie);
					if(pobraneImie === result[i].imie){
						ponowneLosowanie(request,response);
						return; //zatrzymujemy działanie tej funckji jezeli uzytkownik juz raz losowal
					}
				}*/

			//pobieram tablice wszystkich domownikow
			conn.query("SELECT * FROM domownicy", function(err, result) {
				if(err){
					//wyswietlamy komunikat o bledzie
					onSaveError(response);
					console.log(err);
					return;	//zatrzymujemy działanie tej funckji
				}

				//wyslanie do bazy ze osoba losowala
				conn.query('UPDATE domownicy SET czy_losowal=true WHERE imie = ?', [pobraneImie]);

				//pobieram z bazy danych id osob ktore nie zostaly jeszcze wylosowane
				conn.query('SELECT id FROM domownicy WHERE id not in (SELECT kogo_wylosowal FROM domownicy WHERE kogo_wylosowal <> 0)', function(err, result){
					if(err){
						//wyswietlamy komunikat o bledzie
						onSaveError(response);
						console.log(err);
						return;//zatrzymujemy działanie tej funckji
					}


					losujacaOsobeKtoraBedzieObdarowana(result);

				//wylosowana liczba nie moze byc id osoby losujacej
					if(liczba != pobraneImie){
						conn.query('UPDATE domownicy SET kogo_wylosowal=? WHERE imie=?',[liczba, pobraneImie]);
					}	//zamnkniecie warunku if

				//pobieram z bazy danych dane osoby juz wylosowanej
					conn.query('SELECT * FROM domownicy WHERE id = ?', [liczba], function (err, result){
							if(err){
									//wyswietlamy komunikat o bledzie
									onSaveError(response);
									console.log(err);
									return;	//zatrzymujemy działanie tej funckji
							}
								for (var i = 0; i < result.length; i++) {
									imieSzczesliwca = result[i].imie;
									return imieSzczesliwca;
								}	//zamykam petle
							}); //zamkniecie zapytania o osobe wylosowana
						}); //zmkniecie zaptania o osoby jeszcze nie wylosowane

				onSaveSuccessImie(response);
				return;

				});		//zamkniecie selekta ktory pobiera cala tablice domownicy
	//	});// zamkniecie funkcji robiacej zapytanie do bazy sprawdzajace czy user juz losowal
	});
		});		//zamkniecie funkcji parsujacej dane  z formularza
	} //zamkniecie if
}; //zamkniecie controllers save

//--------------------------------------------------------------------------------//

function saveSuccess(request, response){//odpowiedz gdy wcisniemy przycisk losuj

 	//wyswietlanie szablonow dla odpowiednich sytuacji
		var onSaveSuccessLosowanie = function(response){
			render.render(response, 'views/saveSuccess.html', {
			pageTitle: 'poprawnie zapisano',
				imie: imieSzczesliwca,
			});
	};

	//wywolanie
	onSaveSuccessLosowanie(response);

 };

//----------------------------------------------------------------------------//

function error404(request, response){ //gdy strona nie zostala znaleziona
	render.render(response, 'views/error404.html', {
		pageTitle: 'Strona nie znaleziona'
	});
};

//-----------------------------------------------------------------------------//

//kontroler ktory sluzy do implementowania plikow js i css
function static(request, response){
	try {
			plik = url.parse(request.url).query;
			//httpCode
			httpCode = 200;
			if(!fs.statSync('static/'+plik).isFile())
				throw 'Proba odczytania folderu jako elementu statycznego!!!';

			var tresc=fs.readFileSync('static/'+plik, 'utf8');

			//httpCode
			httpCode = httpCode||200;

			//response
			if((plik.substring(plik.length-3))=='css') {
				      response.writeHead(httpCode, {'Content-type': 'text/css'});
			} else {
							response.writeHead(httpCode, {'Content-type': 'text/javascript'});
			}

			response.write(tresc);
			response.end();
		} catch (e) {
		    console.log(e);
				error404(request,response);
		}
}

//index - nazwa pod jaką chce to wyeksportowac
exports.index = index;
exports.ponowneLosowanie = ponowneLosowanie;
exports.save = save;
exports.saveSuccess = saveSuccess;
exports.error404 = error404;
exports.static = static;
