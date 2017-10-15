"use strict";

var Precedence = require('./precedence');
var Screen = require('./screen');
var Memory = require('./memory');

var precedence = new Precedence();
var precedenceOps = document.getElementById('precedenceOps');
precedenceOps.onclick = function() {
    document.getElementById('precedenceOps').style.backgroundColor = '#848484';
    precedence.precedenceOn();
}


var EventDispatcher = require('./eventDispatcher');
var ed = new EventDispatcher();

ed.bind('eventSample', function() {console.log('hi there!')});
ed.bind(7, function() {console.log('hi !')});
//ed.trigger(7);
ed.trigger('eventSample');

console.log(ed);


var result = 0;
var screen = new Screen(document.getElementById('screen'));
var buttons = document.querySelector('.allButtons');
var numberButtons = buttons.querySelectorAll('.number');

for (var i = 0; i <= numberButtons.length - 1; i++) {
    numberButtons[i].onclick = function() {
        var buttonDigit = parseInt(this.innerHTML);
        screen.addDigit(buttonDigit);
    }
};

var operationButtons = buttons.querySelectorAll('.operation');

for (var i = 0; i < operationButtons.length; i++) {
    var isInitialAction = true;
    var prevOperation;

    operationButtons[i].onclick = function() {
        var currNumber = screen.getNumber();

        if (isInitialAction) {
            result = currNumber;
            isInitialAction = false;
        } else {
            switch (prevOperation) {
                case '+':
                    result = Number(result) + Number(currNumber);
                    break;

                case '-':
                    result = Number(result) - Number(currNumber);
                    break;

                case 'x':
                    result = Number(result) * Number(currNumber);
                    break;

                case '/':
                    result = Number(result) / Number(currNumber);
                    break;
                case '=':
                    result = currNumber;
                    break;
            }
        }
        if (precedence.turnOn === true) {
            var currOperation = this.innerHTML;
            screen.setNumber(currNumber);
            precedence.addNumber(currNumber);
            if (currOperation !== '=') {
                precedence.addOperation(currOperation);
            } else {
                var outcome = precedence.calculateResult();
                screen.setNumber(outcome);
            }
        } else {
            screen.setNumber(result);
        }
        prevOperation = this.innerHTML;
        screen.resetOnNextInput();
    }
}

var memo = new Memory();
var memoryPlus = document.getElementById('memoryPlus');
memoryPlus.onclick = function() {
    var currNumber = screen.getNumber();
    memo.Plus(Number(currNumber));
    screen.resetOnNextInput();
}

var memoryMinus = document.getElementById('memoryMinus');
memoryMinus.onclick = function() {
    var currNumber = screen.getNumber();
    memo.Minus(Number(currNumber));
    screen.resetOnNextInput();
}

var memoryRecall = document.getElementById('memoryRecall');
memoryRecall.onclick = function() {
    var currNumber = screen.getNumber();
    var callMemory = memo.Recall();
    if (callMemory === 0) {
        screen.setNumber(currNumber);
    } else {
        screen.setNumber(callMemory);
    }
}

var memoryClear = document.getElementById('memoryClear');
memoryClear.onclick = function() {
    var noMemory = memo.Clear();
}