let cities = null;
const APIURLFirstPart = 'https://api.openweathermap.org/data/2.5/weather?q='
const APIURLSecondPart = '&appid=19788040e3de4e7b5b5909da6b86c8a2';


window.onload = async function () {
    await fetch('./cities.json')
        .then(data => {
            return data.json()
        }).then(data => {
            cities = data;
        });
    
    addEnterKey();
    addMouseOverLeft();
}

function addEnterKey(){
    var elementInputCity = document.getElementById('inputCity');
    elementInputCity.addEventListener('keypress' ,function(event){
        if(event.key == "Enter" && elementInputCity.value != ""){
            var elementCityMenu = document.getElementById('citiesSearch');
            elementCityMenu.classList.add('maincontainer-searchmenu-cities-citiesmenu-setdisplaynone')
            if(elementInputCity.value != "" && cities.includes(elementInputCity.value.toLowerCase())){
                getWeather(elementInputCity.value.toLowerCase());
            }
            
        }
    })
}
function addMouseOverLeft(){
    var elementWeatherBox = document.getElementById('weatherBox');
    var elementWeatherBoxFront = document.getElementById('weatherBoxFront');
    var elementWeatherBoxBack = document.getElementById('weatherBoxBack');
    elementWeatherBox.addEventListener('mouseover',function(){
        elementWeatherBox.classList.remove('maincontainer-infomenu-weatherbox-mouseleft');
        elementWeatherBox.classList.add('maincontainer-infomenu-weatherbox-mouseover');
        elementWeatherBoxFront.classList.add('maincontainermaincotainer-infomenu-weatherbox-front-setdisplaynone');
        elementWeatherBoxBack.classList.add('maincontainermaincotainer-infomenu-weatherbox-back-setdisplayflex');
    });

    elementWeatherBox.addEventListener('mouseleave',function(){
        elementWeatherBox.classList.remove('maincontainer-infomenu-weatherbox-mouseover');
        elementWeatherBox.classList.add('maincontainer-infomenu-weatherbox-mouseleft');
        elementWeatherBoxFront.classList.remove('maincontainermaincotainer-infomenu-weatherbox-front-setdisplaynone');
        elementWeatherBoxBack.classList.remove('maincontainermaincotainer-infomenu-weatherbox-back-setdisplayflex');
    });
}

function makeAnimationSearchButton(){
    var elementSearchButton = document.getElementById('searchIcon');
    elementSearchButton.classList.add('fa-bounce');
    setTimeout(function(){
        elementSearchButton.classList.remove('fa-bounce')
    },1000);
}

function showCities(city) {
    var parentElement = document.getElementById('citiesSearch');
    if (city == "") {
        parentElement.classList.add('maincontainer-searchmenu-cities-citiesmenu-setdisplaynone');
    }
    else{
        var firstchild = parentElement.children[0];
        while(firstchild){
            parentElement.removeChild(firstchild);
            firstchild = parentElement.children[0];
        }
        parentElement.classList.remove('maincontainer-searchmenu-cities-citiesmenu-setdisplaynone')
        let lowerCity = city.toLowerCase().trim();
        let filteredCities = cities.filter(data => data.includes(lowerCity));
        
        if(filteredCities.length > 0){
            for (let i = 0; i < filteredCities.length; i++) {      
                var childElement = document.createElement('div');
                childElement.textContent = filteredCities[i].trim();
                childElement.classList.add('maincontainer-searchmenu-cities-citiesmenu-item');
                childElement.addEventListener('click',function(){
                    var elementInput = document.getElementById('inputCity');
                    elementInput.value = this.textContent;
                    parentElement.classList.add('maincontainer-searchmenu-cities-citiesmenu-setdisplaynone');
                    getWeather(elementInput.value);
                })
                parentElement.appendChild(childElement);
            }
        }
        else{
            var childElement = document.createElement('div');
            childElement.classList.add('maincontainer-searchmenu-cities-citiesmenu-item');
            childElement.textContent = "City not found";
            parentElement.appendChild(childElement);
        }
    }
}

async function getWeather(city){
    const WeatherURL = new URL(APIURLFirstPart + city + APIURLSecondPart);
    const respond = await fetch(WeatherURL);
    const result = await respond.json();
    console.log(result);
    let currentWeather = result.weather[0].main;
    let temperature = parseInt(result.main.temp)-273;
    let humidity = result.main.humidity;
    let windSpeed = result.wind.speed;
    let weatherDescription = result.weather[0].description;
    showWeather(city , currentWeather , temperature , humidity , windSpeed , weatherDescription);
}

function showWeather(city , currentWeather , temperature , humidity , windSpeed, weatherDescription){
    var elementWeatherBox = document.getElementById('weatherBox');
    elementWeatherBox.classList.add('maincontainer-infomenu-weatherbox-setdisplayflex')
    
    var elementCityName = document.getElementById('cityName');
    elementCityName.textContent = city.toUpperCase() + " ";

    var elementCityTemperature =  document.getElementById('cityTemperature') ;
    elementCityTemperature.textContent = temperature + "°C";

    var elementCityWeather = document.getElementById('cityWeather');
    elementCityWeather.textContent = currentWeather;

    var elementWindSpeed = document.getElementById('windSpeed');
    elementWindSpeed.textContent = windSpeed+" KM";

    var elementHumidity = document.getElementById('humidity');
    elementHumidity.textContent = humidity+ "%";

    var elementImgOfWeather = document.getElementById('imgOfWeather');
    var elementApp = document.getElementById('app');
    removeClasses();
    switch(currentWeather){
        
        case "Mist" || "Fog":{
            elementApp.classList.add('maincontainer-setbackground-mist');
            elementImgOfWeather.src = 'assets/mist.png';
            break;
        }
        case "Clear" :{
            elementApp.classList.add('maincontainer-setbackground-sun')
            elementImgOfWeather.src = 'assets/sun.png';
            break;
        }
        case "Clouds" :{
            if(weatherDescription == "few clouds" || weatherDescription == "scattered clouds"){
                elementImgOfWeather.src = 'assets/cloudsun.png';
                elementApp.classList.add('maincontainer-setbackground-mixclouds');
            }
            else{
                elementImgOfWeather.src = 'assets/clouds.png'
                elementApp.classList.add('maincontainer-setbackground-clouds')
            }
            break;     
        }
        case "Snow":{            
            elementImgOfWeather.src = 'assets/snow.png';
            elementApp.classList.add('maincontainer-setbackground-snow')
            break;
        }
        case "Rain" || "Drizzle" :{
            elementImgOfWeather.src = 'assets/rain.png';
            elementApp.classList.add('maincontainer-setbackground-rain')
            break;
        }
    }
    //? set the hover mode of box 
    //? finish the project
}
function removeClasses(){
    var elementApp = document.getElementById('app');
    elementApp.classList.remove('maincontainer-setbackground-rain')
    elementApp.classList.remove('maincontainer-setbackground-snow')
    elementApp.classList.remove('maincontainer-setbackground-clouds')
    elementApp.classList.remove('maincontainer-setbackground-mixclouds')
    elementApp.classList.remove('maincontainer-setbackground-sun')
    elementApp.classList.remove('maincontainer-setbackground-mist')
}