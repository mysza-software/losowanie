//moduly
var fs = require('fs');			//fs modul sluzacy do czytania pliku

//funkcja odpowiedzialna za wyrenderowanie/dopasowanie widoku
var render = function(response, views,  params, httpCode){

	fs.readFile(views, 'utf8', function(err, data){
		if(err){
			console.log(error);
			return;
		}
		//params
		params = params||{};
		for(var key in params){
			data = data.replace(new RegExp('@'+key+'@', 'g'), params[key]);
    }
		//httpCode
		httpCode = httpCode||200;
		//response
		response.writeHead(httpCode, {'Content-type': 'text/html'});
		response.write(data);
		response.end();
	});
};

//wyeksportowanie metody
exports.render = render;
