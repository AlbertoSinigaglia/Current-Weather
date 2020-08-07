class WeatherAPI {
    constructor(id, lang = 'en', unit = 'metric', apiImageFormat = "@2x.png") {
        this.id = id;
        this.lang = lang;
        this.unit = unit;
        this.apiImageFormat = apiImageFormat;
        this.cache = new Map();
    }
    setId(value) {
        this.id = value;
        return this;
    }
    setLang(value) {
        this.lang = value;
        return this;
    }
    setUnit(value) {
        this.unit = value;
        return this;
    }

    async make(request, method = 'GET') {
        let req = {
            ...request,
            lang: this.lang,
            APPID: this.id,
            units: this.unit
        }
        if (this.cache.has(JSON.stringify(req)))
            return Promise.resolve(this.cache.get(JSON.stringify(req)));

        let url = new URL(WeatherAPI.apiUrl);
        let prom = null;
        switch (method.toLowerCase().trim()) {
            case 'get':
                url.search = new URLSearchParams(req).toString();
                prom = fetch(url);
            case 'post':
                prom = fetch(url, {
                    method: 'POST',
                    body: req
                });
        }
        return prom
            .then(resp => {
                if (!resp.ok)
                    throw new Error("Il nome inserito non è stato trovato");
                else {
                    let obj = resp.json();
                    this.cache.set(JSON.stringify(req), obj);
                    return obj;
                }
            })
    }

    byCity(city) {
        return this.make({
            q: city
        })
    }
    byLatLong({ lat, long }) {
        return this.make({
            lat: lat,
            lon: long
        })
    }
    icon(icon) {
        return WeatherAPI.apiImageUrl + icon + this.apiImageFormat;
    }
    static get apiUrl() {
        return "https://api.openweathermap.org/data/2.5/weather";
    }
    static get apiImageUrl() {
        return "http://openweathermap.org/img/wn/";
    }
}


const dom = {}
var wapi = new WeatherAPI('5fa9a800de7bb9bcd2867f52a5d3d754');
$(() => {
    dom.lang      = document.getElementById("lang");
    dom.city      = document.getElementById("city");
    dom.button    = document.getElementById("submit");
    dom.error     = document.getElementById("error");
    dom.result    = document.getElementById("result")
    dom.icon      = document.getElementById("icon")
    dom.min       = document.getElementById("min")
    dom.max       = document.getElementById("max")

    dom.lang.setAttribute("value", "English");
    /*
            o se preferisci:
            ["lang", "languages", "city", "submit", "error", "result", "icon", "min", "max"]
                .forEach(el => dom[el] = document.getElementById(el))
     */
    navigator.geolocation.getCurrentPosition(
        pos => {
            wapi.byLatLong({
                lat: pos.coords.latitude,
                long: pos.coords.longitude
            }).then(body => {
                dom.city.value = body.name.trim();
                dom.button.click();
            });
        },
        err => console.log(err),
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        }
    );

    dom.button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearPage();
        let city = (dom.city.value || "").trim().toLowerCase();
        wapi.byCity(city).then((data) => {
            generateDescription(data.weather[0].description)
            generateIcon(data.weather[0].icon);
            generateTemperatures(data.main);
        })
            .catch((err) => {
                console.error(err)
                error.innerText = err.message;
            });
    });

    createOptions();

      
    dom.lang.addEventListener('change', () => {
        getLang().then(lang => {
            wapi.setLang(lang);
            dom.button.click()
        });
    });
});

async function languagesList() {
    return fetch("Static/json/languages.json")
        .then(resp => resp.json())
        .catch(err => console.log(err))
}

function createOptions() {
    languagesList().then(
        list => {
            dom.lang.innerHTML = Object.entries(list.languages).reduce((prev, [name, key]) => prev + `<option data-content='<img class="pr-2" src=\"https://flagcdn.com/28x21/${list.flagMap[key]}.png\">${name}'>${name}</option>`, "");
            $(dom.lang).selectpicker("refresh")
        }
    )
    
}

async function getLang() {
    return languagesList()
        .then(resp => resp.languages[dom.lang.options[dom.lang.selectedIndex].value]);
}

function generateDescription(description) {
    dom.result.innerText = description;
}

function generateIcon(iconId) {
    let image = document.createElement('img');
    image.setAttribute('src', wapi.icon(iconId));
    image.setAttribute('Alt', "Weather Icon");
    dom.icon.appendChild(image);
}

function generateTemperatures(main) {
    dom.min.innerText = "Min: " + Math.floor(main.temp_min) + "°C";
    dom.max.innerText = "Max: " + Math.floor(main.temp_max) + "°C";
}

function clearPage() {
    dom.icon.innerHTML = "";
    dom.error.innerText = "";
}