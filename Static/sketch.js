/* var url =
    "https://api.openweathermap.org/data/2.5/weather?q=Villatora&APPID=5fa9a800de7bb9bcd2867f52a5d3d754&lang=it&units=metric"; */

/* URL FOR THE FORECAST */
var api = "https://api.openweathermap.org/data/2.5/weather?q=";
var appid = "&APPID=5fa9a800de7bb9bcd2867f52a5d3d754";
var lang = "&lang=it";
var metric = "&units=metric";

/* URL FOR THE ICONS */
var source = "http://openweathermap.org/img/wn/";
var format = "@2x.png";

var lastCity = " ";
var city;
var cache = [];
document.addEventListener("DOMContentLoaded", () => {
    var submit = document.getElementById("submit");
    submit.addEventListener("click", () => {
        clearPage();
        let promise = cache[city] ?  
            new Promise((resolve, reject) => resolve(cache[city])) : 
            getData(city).then((response) => {
                if (!response.ok) {
                    throw new Error("You probabily misspelled the city name!");
                } else {
					console.log('a fetch is executed');
                    return response.json();
                }
            }).then(body => {
				cache[city] = body;
				return body;
			});
        promise.then((data) => {
            generateDescription(data.weather[0].description)
            generateIcon(data.weather[0].icon);
            generateTemperatures(data.main);
        })
        .catch((err) => {
            document.getElementById('error').innerText = err.message;
        });
    });
});

async function getData(city) {
    var result = await fetch(api + city + appid + lang + metric);
    return result;
}

function generateIcon(iconId) {
    var image = document.createElement('img');
    image.setAttribute('src', source + iconId + format);
    image.setAttribute('Alt', "Weather Icon");
    document.getElementById('icon').appendChild(image);
}

function generateDescription(description) {
    document.getElementById('result').innerText = description;
}

function generateTemperatures(main) {
    document.getElementById('min').innerText = "Min: " + main.temp_min;
    document.getElementById('max').innerText = "Max: " + main.temp_max;
}

function clearPage() {
    document.getElementById('icon').innerHTML = "";
    document.getElementById('error').innerText = "";
    city = document.getElementById("city").value;
}
navigator.geolocation.getCurrentPosition((pos => {
	console.log(pos)
	fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`+ appid + lang + metric)
		.then((response) => {
			if (!response.ok) {
				throw new Error("You probabily misspelled the city name!");
			} else {
				console.log('a fetch is executed');
				return response.json();
			}
		})
		.then(body => {
			document.getElementById("city").value = body.name;
			document.getElementById("submit").click();
		});
}));