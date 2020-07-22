var url =
  "https://api.openweathermap.org/data/2.5/weather?q=Villatora&APPID=5fa9a800de7bb9bcd2867f52a5d3d754&lang=it&units=metric";

var name;
var lastOne = "Villatora";

async function getData() {
  var result = await fetch(url);
  return result;
}

function upDateCity() {
  var textBox = document.getElementById("city");
  url = url.replace(lastOne, textBox.value);
  lastOne = textBox.value;
}

document.addEventListener("DOMContentLoaded", () => {
  var submit = document.getElementById("submit");
  var div = document.getElementById("result");
  submit.addEventListener("click", () => {
    upDateCity();
    getData()
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
