var SIZE_CASE = 50;

var WIDTH_GAMEBOARD;
var HEIGHT_GAMEBOARD;

var WIDTH_HUD;
var HEIGHT_HUD;
var width;
var height;

var WIDTH_ITEM = 100;
var HEIGHT_ITEM = 10;

var canvas;
var context2D;

var item = 5;

var board = null;
var socket = null;

function main() {
	socket = io.connect('http://'+location.host);
	socket.emit('message', 'CONNECT DISPLAY');

	socket.on('message', function (message) {
		var msgCut = message.split(' ');

		switch(msgCut[0]) {

			case 'SENDID':
				if(document.getElementById('key_span') != null)
					document.getElementById('key_span').innerHTML = msgCut[1];
				break;

			case 'NEW_CONTROLLER':
				document.getElementById('main-frame').innerHTML = '';
				break;

			case 'STARTGAME':
				document.getElementById('main-frame').innerHTML = '<canvas id="canvas" width="600" height="500"></canvas>';
				run(socket);
				break;

			case 'INITMAP':
				/* define differents areas */
				WIDTH_HUD = 100;
				HEIGHT_HUD = parseInt(msgCut[2] * SIZE_CASE);
				WIDTH_GAMEBOARD = parseInt(msgCut[1] * SIZE_CASE);
				HEIGHT_GAMEBOARD = parseInt(msgCut[2] * SIZE_CASE);
				width = parseInt(msgCut[1]);
				height = parseInt(msgCut[2]);
				console.log(width);
				board = new Array(width);
				for(var i = 0; i < width; i++) {
					board[i] = new Array(height);
				}
				console.log('init');
				window.requestAnimationFrame(draw);
				break;

			case 'SENDMAP':
				for(var i = 0; i < width; i++) {
					for(var j = 0; j < height; j++) {
						board[i][j] = msgCut[1 + i * height + j];
					}
				}
				break;

			default:
				console.log('Unknow message : '+msgCut[0]);
		}
	});
}

/* GAME.JS */

function run () {

	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');

}

function draw () {

	/* Browser doesn't support canvas maggle */
	if (!canvas || !context2D)
		return;

	/* cleaning the whole canvas */
	context2D.fillStyle = 'white';
	context2D.fillRect(0,0,canvas.width,canvas.height);

	context2D.font = "18px sans-serif";

	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++) {
			if(board[i][j] == 'S') {
				context2D.strokeText("S", i * SIZE_CASE, j * SIZE_CASE);
			} else if(board[i][j] == 'D') {
				context2D.strokeText("D", i * SIZE_CASE, j * SIZE_CASE);
			} else if(board[i][j] != '0') {
				console.log(board[i][j]);
				context2D.strokeText(board[i][j], i * SIZE_CASE, j * SIZE_CASE);
			}
		}
	}

	for (var x = 0 ; x < WIDTH_GAMEBOARD ; x = x + SIZE_CASE) {
		context2D.moveTo(x,0);
		context2D.lineTo(x,HEIGHT_GAMEBOARD);
		context2D.stroke();
	}

	for (var y = 0 ; y < HEIGHT_GAMEBOARD ; y = y + SIZE_CASE) {
		context2D.moveTo(0,y);
		context2D.lineTo(WIDTH_GAMEBOARD,y);
		context2D.stroke();
	}

	drawHUD();

	context2D.strokeRect(0,0,WIDTH_GAMEBOARD,HEIGHT_GAMEBOARD);

	window.requestAnimationFrame(draw);
}

function drawHUD() {

	context2D.fillStyle = 'green';
	for (var i = 0 ; i <= item ; i++) {
		context2D.fillStyle = 'green';
		context2D.fillRect(WIDTH_GAMEBOARD,HEIGHT_HUD-(i*HEIGHT_ITEM),WIDTH_ITEM,HEIGHT_ITEM);
		context2D.fillStyle = 'black';
		context2D.strokeRect(WIDTH_GAMEBOARD,HEIGHT_HUD-(i*HEIGHT_ITEM),WIDTH_ITEM,HEIGHT_ITEM);
	}

	context2D.fillStyle = 'black';
	context2D.strokeRect(WIDTH_GAMEBOARD,0,WIDTH_HUD,HEIGHT_HUD);

}
