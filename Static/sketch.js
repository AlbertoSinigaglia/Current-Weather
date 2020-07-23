var api1 = "https://www.metaweather.com/api/location/search/?query=";
var api2 = "https://www.metaweather.com/api/location/";


async function getId() {
  var city = document.getElementById("city").value;
  var result = await fetch(api1 + city, { mode: "no-cors" });
  console.log(result);

  return result;
}

document.addEventListener("DOMContentLoaded", () => {
  var submit = document.getElementById("submit");
  var div = document.getElementById("result");
  submit.addEventListener("click", () => {

    getId()
      .then((response) => {
        if (!response.ok) {
          throw new Error("You probabily misspelled the city name!");
        } else {
          return response.json();
        }
      })/*
      .then((data) => {
        return data;
      })
      .catch((err) => {
        div.innerText = err.message;
      })
      .then(woeid => {
        div.innerText = woeid;
        //getWeather();
      });*/
  });
});
