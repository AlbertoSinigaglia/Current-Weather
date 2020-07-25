/* var url =
  "https://api.openweathermap.org/data/2.5/weather?q=Villatora&APPID=5fa9a800de7bb9bcd2867f52a5d3d754&lang=it&units=metric"; */

var api = "https://api.openweathermap.org/data/2.5/weather?q=";
var appid = "&APPID=5fa9a800de7bb9bcd2867f52a5d3d754";
var lang = "&lang=it";
var metric = "&units=metric";

async function getData(city) {
  var result = await fetch(api + city + appid + lang + metric);
  return result;
}

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
      })
      .catch((err) => {
        div.innerText = err.message;
      });
  });
});
