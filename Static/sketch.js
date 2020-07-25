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

document.addEventListener("DOMContentLoaded", () => {
  var submit = document.getElementById("submit");
  var div = document.getElementById("result");
  var city = document.getElementById("city").value;
  submit.addEventListener("click", () => {
    getData(city)
      .then((response) => {
        if (!response.ok) {
          throw new Error("You probabily misspelled the city name!");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        div.innerText = data.weather[0].description;
        generateIcon(data.weather[0].icon, div);
      })
      .catch((err) => {
        div.innerText = err.message;
      });
  });
});

async function getData(city) {
  var result = await fetch(api + city + appid + lang + metric);
  return result;
}

function generateIcon(iconId, div) {
  var image = document.createElement('img');
  image.setAttribute('src', source + iconId + format);
  image.setAttribute('Alt', "Rappresentazione grafica");
  console.log(image);
  div.appendChild(image);
}
