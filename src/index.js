"use strict";

import './styles/main.scss';
import Game from './game/Game';

let game = new Game()

document.body.appendChild(game.render())
