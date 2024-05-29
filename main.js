import './style.css'

import { Game } from './src/Game.js';

const game = new Game();

game.start();
setInterval(() => {
    game.update();
});
