// These are just some global Vars we established
var historyArr = [];
var lastSearch = $("#recent-searches")
var currentCity = "";
var lastCity;
var apikey = "166a433c57516f51dfab1f7edaed8413";
var recentSearchBox = $("recent-searches")


historyGet();
// This function just grabs the recent searches from our local storage so that it can be added in the recents box.
function historyGet() {
    var recents = JSON.parse(localStorage.getItem("historyArr"));
    if (recents != null) {
        historyArr = recents;
        for (let i = 0; i < 6; i++) {
            const element = $("<button>");
            element.addClass("recent-btn", "btn-secondary");
            element.css("display", "block");
            element.text(historyArr[i]);
            lastSearch.append(element);


        }
    }

}
// This function makes it so there can only be 6 searches you can see at once on the page and when it passes 6 it pops and adds the new search on top.
// This handles the saved cities function where you can click them and they will display.
$("#recent-searches").on("click", function (event) {
    input = $(event.target).text()
    weatherApiUrl(input)
})

// This API is for the current weather in the your city. it grabs the ids from the page and adds them to the html.
function weatherApiUrl(input) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apikey + "&units=imperial"
    fetch(weatherUrl)
    .then(response => { return response.json() })
    .then(data => {
            $("#current-city").html(
                `${data.name} (${moment().format("MM/DD/YY")}) <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">`
                );
                $("#temp").text("Temp: " + data.main.temp + " F");
                $("#wind").text("wind: " + data.wind.speed + "mph");
                $("#humidity").text("Humidity: " + data.main.humidity + "%");
                
                currentCity = data.name;
                
                
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                setForcast(lat, lon);
            })
            
        };
        // This function grabs the lat and lon URL to set the forecast for the next 5 days.
        function setForcast(lat, lon) {
            $("#5dayCard").empty();
            $("#5forecastHead").empty();
            //This grabs the Url 
            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid="+ apikey +"&units=imperial"
            fetch(forecastUrl)
            .then(response => { return response.json() })
            .then(data => {
                // This grabs the UV data
                document.getElementById("uv").textContent = "UV: " + data.current.uvi;
                var cardHeader = $("<h3>").text("5 Day Forecast:")
                $("#5forecastHead").append(cardHeader);
                console.log(data);
                // This loops over the cards that have been created and apended to the page
                for (let i = 1; i < (data.daily.length - 2); i++) {
                    const temp = $("<p>").addClass("card-text").text("Temp: " + data.daily[i].temp.day + "F");
                    const wind = $("<p>").addClass("card-text").text("Wind: " + data.daily[i].wind_speed + "MPH");
                    const humidity = $("<p>").addClass("card-text").text("Humidity: " + data.daily[i].humidity + "%");
                    const picLink = `http://openweathermap.org/img/w/${data.daily[1].weather[0].icon}.png`
                    const picture = $("<img>").attr('src', picLink).attr("style", "width:40px ; height:30px;")
                    
                    
                    
                    
                    const cardWeather = $("<div>").addClass("card-weather");
                    const divCard = $("<div>").addClass("card mt5").attr("style", "width:12rem;")
                    const date = moment().add(i, "days").format("MM/DD/YY");
                    const dateCard = $("<h4>").addClass("card-title").text(date);
                    $(cardWeather).append(dateCard, temp, wind, humidity, picture);
                    $(divCard).append(cardWeather)
                    $("#5dayCard").append(divCard)
                    
                }
                
                
                
                
            })
        }
        
        // This search button handles the form for looking up cities.
        
        $("#searchBtn").on("click", () => {
            var currentCity = $('#search-city').val();
            $("#search-city").val("")
            weatherApiUrl(currentCity);
            recentCity(currentCity);
        });
        
        function recentCity(lastCity) {
        if (recentSearchBox.childElementCount > 6) {
                recentSearchBox.children[6].remove();
                historyArr.pop();
            }
            // This handles creating another li for the city and ot updates the array for the local storage.
            const recentbtn = document.createElement("button");
            recentbtn.textContent = lastCity;
            recentbtn.setAttribute("class", "recent-btn")
            historyArr.unshift(lastCity);
            localStorage.setItem("historyArr", JSON.stringify(historyArr));
        
        }
        weatherApiUrl();
        