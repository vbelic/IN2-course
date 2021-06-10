/*jshint node: true */
/*global  console, module*/
/**Module for extending console with colors */
'use strict';
var colors = require('colors/safe');
var allColors = ['blue', 'red', 'green', 'magenta', 'cyan', 'yellow'];
var bold = ['blue', 'magenta', 'yellow'];
var special = {
    'greenBoldUnderline': {
        color: 'green',
        specials: ['bold', 'underline']
    },
    'redBold': {
        color: 'red',
        specials: ['bold']
    },
    'greenBold': {
        color: 'green',
        specials: ['bold']
    },
    'cyanBold': {
        color: 'cyan',
        specials: ['bold']
    }

};

var _ = require('lodash');

_.each(allColors, function (color) {
    addConsoleColor(color);
});

_.each(special, function (val, type) {
    addSpecialConsole(val, type);
});

function addSpecialConsole(obj, type) {
    console[type] = function (msg, val) {
        val = val || '';
        var specials = obj.specials;
        var colored = colors[obj.color] || colors.green;
        _.each(specials, function (sp) {
            colored = colored[sp] || colored;
        });
        console.log(colored(msg), colored(val));
    };
    console[type].bind(console);
}

function addConsoleColor(color) {
    console[color] = function (msg, val) {
        val = val || '';
        if (bold[color]) {
            console.log(colors[color].bold(msg), colors[color](val));
        } else {
            console.log(colors[color](msg), colors[color](val));
        }
    };
    console[color].bind(console);
}

module.exports = console;
