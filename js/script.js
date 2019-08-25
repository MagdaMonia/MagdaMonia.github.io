const days = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
};
const months = {
    "0": "January",
    "1": "February",
    "2": "wtorek",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
};

const weatherType = {
    "RainAndCloudy": "assets/icon/rain_s_cloudy.png",
    "RainLight": "assets/icon/rain_light.png",
    "Cloudy": "assets/icon/cloudy.png",
    "Sunny": "assets/icon/sunny.png",
    "PartlyCloudy": "assets/icon/partly_cloudy.png",
};

window.addEventListener('load', function () {
    selectValue();
    showWeatherTodayForCity(1);

    let element = document.querySelector("#select");
    element.addEventListener("change", function () {
        showWeatherTodayForCity(element.value);
    });
});

function showWeatherForDays(date, id) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    get(
        `http://dev-weather-api.azurewebsites.net/api/city/${id}/weather?date=${year}-${month}-${day}`,
        function (daysWeather) {
            showHeadWeather(daysWeather[0]);
            for (let i = 0; i < daysWeather.length; i++) {
                showSmallDay(i, daysWeather[i]);
            }
        });
}

function setElementContent(elementSelector, value) {
    let element = document.querySelector(elementSelector);
    element.innerHTML = value;
}

function showHeadWeather(weather) {
    let date = new Date(weather.date);
    let day = date.getDate();
    let dayName = days[date.getDay()];
    let monthName = months[date.getMonth()];
    let currentDate = dayName + ", " + monthName + " " + day +"th";
    let img = weather.type;
    let element = document.querySelector(".temperature__group-img");
    element.src = weatherType[img];

    setElementContent('.temperature__group-text', weather.temperature);
    setElementContent('.properties__value--wind-direction', weather.windInfo.direction);
    setElementContent('.properties__value--wind-speed', weather.windInfo.speed + " mph");
    setElementContent('.properties__value--humidity', weather.humidity + "%");
    setElementContent('.properties__value--precipitation', weather.precipitation + "%");
    setElementContent('.temperature__date-pollen-count', weather.pollenCount);
    setElementContent('.weather-main__date', currentDate);
}

function showSmallDay(index, weather) {
    let date = new Date(weather.date);
    let dayName = days[date.getDay()];

    let element = document.querySelectorAll(".weatherNextDay .weather__name");
    element[index].innerHTML = dayName;

    element = document.querySelectorAll(".weatherNextDay .weather__temperature-number");
    element[index].innerHTML = weather.temperature;

    element = document.querySelectorAll(".weatherNextDay .weather__pollenCount");
    element[index].innerHTML = weather.pollenCount;

    let img = weather.type;
    element = document.querySelectorAll(".weatherNextDay .weather__img");
    element[index].src = weatherType[img];
}

function selectValue() {
    get('http://dev-weather-api.azurewebsites.net/api/city', function (cities) {
        for (let i = 0; i < cities.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", cities[i].id);
            option.innerHTML = cities[i].name;
            document.getElementById("select").appendChild(option);
        }
    });
}

function showWeatherTodayForCity(id) {
    let date = new Date();
    showWeatherForDays(date, id);
}

function get(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    });
    xhr.send();
}
