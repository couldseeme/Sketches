(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// app.js
(function () {
	var App = function App() {
		if (document.body) this._init();else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	var p = App.prototype;

	p._init = function () {

		var numItems = 5;
		var container = document.body.querySelector('.main-Container');
		for (var i = 0; i < numItems; i++) {
			var div = document.createElement("div");
			div.className = 'exp-container';
			container.appendChild(div);
		}
	};

	new App();
})();

},{}]},{},[1]);