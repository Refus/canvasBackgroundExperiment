function HexToR(h) {
	return parseInt((cutHex(h)).substring(0, 2), 16)
}

function HexToG(h) {
	return parseInt((cutHex(h)).substring(2, 4), 16)
}

function HexToB(h) {
	return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
	return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function colorArray(rgb, angolo, mischia) {
	var numVol = 360 / angolo;
	var arr = new Array();
	//creaArray colori
	for (var i = 1; i <= numVol; i++) {
		//var colorTesto= prettyColor(rgb, angolo+180);
		var newColor = prettyColor(rgb, angolo);
		arr.push(newColor);
		rgb = newColor;
	}
	if (mischia) {
		arr = shuffle(arr);
	}
	return arr
}

function shuffle(array) {
	var i = array.length;
	while (--i) {
		var j = Math.floor(Math.random() * (i + 1))
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
	// for convenience, in case we want a reference to the array
};
function prettyColor(rgb, angolo) {
	var temprgb = rgb;
	var temphsv = RGB2HSV(temprgb);
	temphsv.hue = HueShift(temphsv.hue, angolo);
	//si sposta di 180 (complementare)
	var temprgb = HSV2RGB(temphsv);
	return temprgb;
}

function HueShift(h, s) {
	h += s;
	while (h >= 360.0)
	h -= 360.0;
	while (h < 0.0)
	h += 360.0;
	return h;
}

function min3(a, b, c) {
	return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
}

function max3(a, b, c) {
	return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
}

function RGB2HSV(rgb) {
	hsv = new Object();
	max = max3(rgb.r, rgb.g, rgb.b);
	dif = max - min3(rgb.r, rgb.g, rgb.b);
	hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
	if (hsv.saturation == 0)
		hsv.hue = 0;
	else if (rgb.r == max)
		hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
	else if (rgb.g == max)
		hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
	else if (rgb.b == max)
		hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
	if (hsv.hue < 0.0)
		hsv.hue += 360.0;
	hsv.value = Math.round(max * 100 / 255);
	hsv.hue = Math.round(hsv.hue);
	hsv.saturation = Math.round(hsv.saturation);
	return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
	var rgb = new Object();
	if (hsv.saturation == 0) {
		rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
	} else {
		hsv.hue /= 60;
		hsv.saturation /= 100;
		hsv.value /= 100;
		i = Math.floor(hsv.hue);
		f = hsv.hue - i;
		p = hsv.value * (1 - hsv.saturation);
		q = hsv.value * (1 - hsv.saturation * f);
		t = hsv.value * (1 - hsv.saturation * (1 - f));
		switch(i) {
			case 0:
				rgb.r = hsv.value;
				rgb.g = t;
				rgb.b = p;
				break;
			case 1:
				rgb.r = q;
				rgb.g = hsv.value;
				rgb.b = p;
				break;
			case 2:
				rgb.r = p;
				rgb.g = hsv.value;
				rgb.b = t;
				break;
			case 3:
				rgb.r = p;
				rgb.g = q;
				rgb.b = hsv.value;
				break;
			case 4:
				rgb.r = t;
				rgb.g = p;
				rgb.b = hsv.value;
				break;
			default:
				rgb.r = hsv.value;
				rgb.g = p;
				rgb.b = q;
		}
		rgb.r = Math.round(rgb.r * 255);
		rgb.g = Math.round(rgb.g * 255);
		rgb.b = Math.round(rgb.b * 255);
	}
	return rgb;
}

function draw(impostazioni) {
	var c = document.getElementById("canvasB");
	c.width = $(document).width()
	c.height = $(document).height()
	var ctx = c.getContext("2d");
	//var ctx = document.getCSSCanvasContext("2d", "canvase", $(document).width(), $(document).height());

	var thisrgb = {
		r : 245,
		g : 101,
		b : 69
	};
	var angolo = 30;
	if (impostazioni.mischia) {
		var arrayC = colorArray(thisrgb, angolo, true);
	} else {
		var arrayC = colorArray(thisrgb, angolo);
	}
	totaleColori = 360 / angolo;
	var y = 0;
	var x = 0;
	var h = 50;
	var hMin = impostazioni.hMin;
	if (hMin <= 0) {
		hMin = 1;
		impostazioni.hMin = 1;
	}
	var hMax = impostazioni.hMax - impostazioni.hMin;
	var variaz = impostazioni.variaz;

	randomNumber = 0;
	while (y < $(document).height()) {
		var hprec = h;
		if (hMax != 0) {
			do {
				var h = hMin + Math.round(Math.random() * (hMax - 1));

			} while (hprec==h);
		} else {
			var h = hMin;
		}
		randomNumber == totaleColori - 1 ? randomNumber = 0 : randomNumber++;
		var rgbT = "rgb(" + arrayC[randomNumber].r + "," + arrayC[randomNumber].g + "," + arrayC[randomNumber].b + ")";
		ctx.fillStyle = rgbT;
		if (variaz > 0) {
			var yV = Math.round(variaz / 2) + Math.round(Math.random() * (variaz - 1)) - Math.round(variaz / 2);
		} else {
			var yV = 0;
		}

		var xprec = x;
		do {
			var x = $(document).width() / 100 + $(document).width() / 100 * Math.round(Math.random() * (100 - 1));
		} while (xprec==x);

		ctx.fillRect(0, y - yV, x, h + yV);
		randomNumber == totaleColori - 1 ? randomNumber = 0 : randomNumber++;
		var rgbT = "rgb(" + arrayC[randomNumber].r + "," + arrayC[randomNumber].g + "," + arrayC[randomNumber].b + ")";
		ctx.fillStyle = rgbT;

		var wid = $(document).width() - x;
		if (variaz > 0) {
			var yV = Math.round(variaz / 2) + Math.round(Math.random() * (variaz - 1)) - Math.round(variaz / 2);
		} else {
			var yV = 0;
		}

		//var yV = 0;
		ctx.fillRect(x, y - yV, wid, h + yV);
		y = y + h;
	}
}


$(document).ready(function() {

	var impostazioni = {
		mischia : true,
		time : 3000,
		hMin : 40,
		hMax : 60,
		variaz : 50
	}

	draw(impostazioni);
	function setTimer(callback, time) {
		var internalCallback = function() {
			return function() {

				window.setTimeout(internalCallback, time);
				callback();

			}
		}();

		window.setTimeout(internalCallback, time);
	};
	setTimer(function() {
		draw(impostazioni);
	}, impostazioni.time);

})
