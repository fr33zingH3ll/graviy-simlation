import './style.css'

import { Game } from './src/Game.js';

const game = new Game();
game.start();
let previousTime = Date.now();
setInterval(() => {
	game.update(Date.now() - previousTime);
	previousTime = Date.now();
}, 1/30*1000);	