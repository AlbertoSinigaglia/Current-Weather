class WeatherAPI{
    constructor(id, lang = 'it', unit = 'metric', apiImageFormat = "@2x.png"){
        this.id = id;
        this.lang = lang;
        this.unit = unit;
        this.apiImageFormat = apiImageFormat;
        this.cache = new Map();
    }
    setId(value){
        this.id = value;
        return this;
    }
    setLang(value){
        this.lang = value;
        return this;
    }
    setUnit(value){
        this.unit = value;
        return this;
    }
    make(request, method = 'GET'){
    
         if(this.cache.has(JSON.stringify(request)))
             return Promise.resolve(this.cache.get(JSON.stringify(request)));

        let url = new URL(WeatherAPI.apiUrl);
        let req = {
            ...request,
            lang: this.lang,
            APPID: this.id,
            units : this.unit
        }
        let prom = null;
        switch(method.toLowerCase().trim()){
            case 'get':
                url.search = new URLSearchParams(req).toString();
                prom = fetch(url);
            case 'post':
                prom = fetch(url, {
                    method: 'POST',
                    body: req
                })
        }
         return prom
            .then(resp => {
                if (!resp.ok) 
					throw new Error("Il nome inserito non è stato trovato");
			    else {
                    let obj = resp.json();
                    this.cache.set(JSON.stringify(request), obj)    
                    return obj;
                }
            })
    }
    byCity(city){
        return this.make({
            q : city
        })
    }
    byLatLong({lat, long}){
        return this.make({
            lat: lat,
            lon: long
        })
    }
    icon(icon){
        return WeatherAPI.apiImageUrl + icon + this.apiImageFormat;
    }
    static get apiUrl(){
        return "https://api.openweathermap.org/data/2.5/weather";
    }
    static get apiImageUrl(){
        return "http://openweathermap.org/img/wn/";
    }
}
var wapi = new WeatherAPI('5fa9a800de7bb9bcd2867f52a5d3d754')
document.addEventListener("DOMContentLoaded", () => {
	navigator.geolocation.getCurrentPosition(
        pos => {
            wapi.byLatLong({
                lat : pos.coords.latitude,
                long: pos.coords.longitude
            }).then(body => {
                document.getElementById("city").value = body.name.trim().toLowerCase();
                document.getElementById("submit").click();
            });
        }, 
        err => console.log(err), 
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        }
    );
    document.getElementById("submit").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearPage();
        let city = (document.getElementById("city").value || "").trim().toLowerCase();
        wapi.byCity(city).then((data) => {
            generateDescription(data.weather[0].description)
            generateIcon(data.weather[0].icon);
            generateTemperatures(data.main);
        })
        .catch((err) => {
            console.error(err)
            document.getElementById('error').innerText = err.message;
        });
    });
});

function generateIcon(iconId) {
    let image = document.createElement('img');
    image.setAttribute('src', wapi.icon(iconId));
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
}
