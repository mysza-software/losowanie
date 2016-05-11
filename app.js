//moduly
var serwer = require('./serwer.js');
var controllers = require('./controllers.js');
var render = require('./render.js');


//w tym obiekcie bede tworzyla routing - podawala pathname
var routing = {
  '/':controllers.index,
  '/ponowneLosowanie':controllers.ponowneLosowanie,
  '/save':controllers.save,
  '/saveSuccess':controllers.saveSuccess,
  '/error404':controllers.error404,
	'/static':controllers.static
};

//wywolanie funkcji z argumentem -tablica routing
serwer.start(routing);

console.log('witaj');
