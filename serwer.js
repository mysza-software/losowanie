//moduly
var http = require('http');  			//za pomoca metody/funkcji require dodaje moduł http ktory jest wbudowany w noda
var url = require('url');					//modul sluzy do analizy adresu URL

//funkcja start bedzie przyjmowala tablice routingi(z pliku app.js) jako parametr
function start(routing){

		//stworzenie serwera http
		http.createServer(function(request, response){ //w obiekcie request mamy zapisane wszelkie informacje ktore wysyla przegladarka, response - sluzy do wygenerowanie odpowiedzi do przegladarki

		//przeparsowanie url w obiekcie request i dzieki metodzie pathname otzytam pathname
		var pathName = url.parse(request.url).pathname;

		//sprawdzam czy w obiekcie routing jest pathname, jezeli nie to zmieniam pathname na 404
		if(!routing[pathName]){
			pathName = '/404';
		}
		console.log(pathName);
		//wywplujemy funkcje z parametrami i przekazujemy dalej
		routing[pathName](request, response);

}).listen(80, '127.0.0.1');
}

exports.start = start;
