const setMap = require('./map');
const moonphase = require('./moonphase');
const houseNumber = require('./houseNumber')
const barChar = require('./statistic');

function reset(index) {
	var screen = document.getElementById('screen');
	screen.innerHTML = "";
	if(index === 0) {
		setMap();
	}
	else if(index === 1) {
		barChar();
	}
	else if(index === 2) {
		moonphase();
	}
	else if(index === 3) {
		houseNumber();
	}
};

document.querySelectorAll('.selection > li').forEach((element, index) => {
	element.addEventListener('click', () => reset(index))})

reset(0)