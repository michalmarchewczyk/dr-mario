"use strict";

import './styles/main.scss';
import KeyboardController from './KeyboardController';
import renderGrid from './debug/renderGrid';
import Stage from './Stage';

// document.write('1 PLAYER GAME<br>')
// document.write('2 PLAYER GAME<br>')
// document.write('ATARI VERSION<br>')

// document.body.appendChild(renderGrid(16, 0.2));

//
// let keyboardController = new KeyboardController();
// keyboardController.addListener('w', 'up', () => {
//     console.log('WWWWWWWWW');
// });
// keyboardController.addListener('s', 'press', () => {
//     console.log('SSSSSSSS');
// });
// keyboardController.addListener('x', 'down', () => {
//     console.log('XXXXXXXX');
// });


let stage1 = new Stage(4);

document.body.appendChild(stage1.render())
