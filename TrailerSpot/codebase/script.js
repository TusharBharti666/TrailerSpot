var LOADED = {};
var BANNER = [];
var BANNER_TRACKER = 0;

//-----------this function handles the working of preloader--------------

function progressBar(width) {
    if(width <= 100) {
        document.getElementById('preloader_progress_bar').style.width = width + "%";
        setTimeout(progressBar.bind(progressBar, width + 0.25), 15);
    }
    else {

        var footer = `
        <div class="footer" style="margin-top: ${margin + 200}px;">
            <p class="copyright">
            &nbsp;&nbsp;&nbsp;TrailerSpot&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;2021&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Tushar Bharti&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;VN Hari Chandana
            </p>
        </div>`;

        document.getElementById('body').innerHTML += footer;
        document.getElementById('body').style.overflowY = 'scroll';
        document.getElementById('nav').style.display = 'block';
        document.getElementById('preloader').style.display = "none";
    }
}

function isLoaded() { 

    var status = true;
    
    for (const [key, value] of Object.entries(LOADED)) {
        if (!value) {
            status = false;
        }
    }

    if (status) {
        progressBar(1);
    }
    else {
        setTimeout(function(){
            isLoaded();
        }, 1000);
    }

}

window.onload = function(e) {
    isLoaded();
}

var margin = 25;
var zIndex = 1000000000;
var link = "";


// this function displaying movie release dates in a proper format 

function getFormattedDate(rawDate) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var rawDateList = rawDate.split("/");
    return rawDateList[1] + " " + monthNames[parseInt(rawDateList[0]) - 1] + ", " + rawDateList[2];
}

// this function is to slide the movies tile either in right or left using the red block of white arrows

function slideRow(row, direction) {
    var rowElement = document.getElementById(row);
    var rowLeftBtnElement = document.getElementById(row + "-btn-left");
    var rowRightBtnElement = document.getElementById(row + "-btn-right");

    console.log(rowElement.scrollLeft);
    console.log(rowElement.scrollWidth);

    if ("left" == direction) {
        rowElement.scrollLeft -= 500;
    }
    else if ("right" == direction) {
        rowElement.scrollLeft += 500;
    }
}

// this function is playing the video from youtube

function playVideo() {
    document.getElementById('row-expand-video-container').innerHTML = "<iframe id='ytiframe' width='700' height='393' src='https://www.youtube.com/embed/" + link + "?rel=0&amp;controls=1&amp;showinfo=0&amp;autoplay=1' allow='autoplay'; encrypted-media; allowfullscreen></iframe>";
}

//--------expandRowPosterBox definition------------------------

function expandRowPosterBox(id, childId, isHide) {
    var element = document.getElementById(id);
    var childElement = document.getElementById(childId);

    if (true == isHide) {
        element.style.zIndex += 10;
        element.style.border = 'solid 2px red';
        childElement.style.display = 'block';

    
    } else {
        element.style.border = 'none';
        childElement.style.display = 'none';
        element.style.zIndex -= 10;
    }
}

//----------expandRowDetails definition------------------------

function expandRowDetails(status, id) {
    
    var element = document.getElementById('row-expand-container');

    if (true == status) {
        getMovieById(id);
        element.style.display = 'block';
        document.getElementById('row-expand-loader').style.display = 'block';
        
        setTimeout( function() {
            document.getElementById('row-expand-loader').style.display = 'none';
            document.getElementById('row-expand').style.display = 'block';
            document.getElementById('body').style.overflowY = 'hidden';
        }, 1000);
       

    } else {
        element.style.display = 'none';
        document.getElementById('row-expand-video-container').innerHTML = "";
        document.getElementById('row-expand-loader').style.display = 'block';
        document.getElementById('row-expand').style.display = 'none';
        document.getElementById('body').style.overflowY = 'scroll';
    }
}

//------------Definition of getMovieById-----------------------

function getMovieById(id) {

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        var details = JSON.parse(this.responseText)[0];
        document.getElementById('row-expand-name').innerHTML = details['name'];
        document.getElementById('row-expand-description').innerHTML = details['description'];
        document.getElementById('row-expand-rating').innerHTML = "IMDB " + details['rating'] + " &nbsp;| &nbsp;" + details['duration'] + " &nbsp;| &nbsp;" + details['release_dt'];
        document.getElementById('row-expand-video-container').style.backgroundImage = 'url(' + "data:image/jpg;base64," +  details['poster'] + ')';
        link = details['link'];
    }

    xhttp.open("POST", "/getMovieById");
    xhttp.setRequestHeader("Content-type", "application/json");

    var payload = {'column': 'id', 'value': parseInt(id)};
    payloadJson = JSON.stringify(payload);

    xhttp.send(payloadJson);
}

//-----Definition of getMoviesByGenre-------------

function getMoviesByGenre(genre) {
    
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        var movies = JSON.parse(this.responseText);

        var html = `
        <div class="movies-tiles-box" style="margin-top: ${margin}px;">
            <h2>${genre.toUpperCase()} MOVIES</h2>
            <div class="row-btn row-btn-left" id="${genre.split(" ").join("_").toLowerCase()}-row-btn-left" onclick="slideRow('${genre.split(" ").join("_").toLowerCase()}-row', 'left');">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
        </div>

        <div class="row-btn row-btn-right" id="${genre.split(" ").join("_").toLowerCase()}-row-btn-right" onclick="slideRow('${genre.split(" ").join("_").toLowerCase()}-row', 'right');">
            <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>

            <div style="z-index:${zIndex};" class="row-posters" id="${genre.split(" ").join("_").toLowerCase()}-row">
                

            `;

            margin += 285;
    
        for(var i = 0; i < movies.length; i++) {

            html += `<div style="z-index:${zIndex};" class="row-poster-box" id="row-poster-box-${genre.split(" ").join("_").toLowerCase()}_${i+1}" onmouseover="expandRowPosterBox('row-poster-box-${genre.split(" ").join("_").toLowerCase()}_${i+1}', 'row-poster-box-info-${genre.split(" ").join("_").toLowerCase()}_${i+1}', true);" onmouseout="expandRowPosterBox('row-poster-box-${genre.split(" ").join("_").toLowerCase()}_${i+1}', 'row-poster-box-info-${genre.split(" ").join("_").toLowerCase()}_${i+1}', false);">
                        
                        <div onclick="expandRowDetails(true, '${movies[i]['id']}');">
                            <img src='data:image/jpg;base64,${movies[i]['poster']}' class='row-poster' />
                        </div>

                        <div class="row-poster-box-info" id="row-poster-box-info-${genre.split(" ").join("_").toLowerCase()}_${i+1}">
                
                            <div style="margin-top: 5px;">
                                <div onclick="expandRowDetails(true, '${movies[i]['id']}')"; style="display: inline-block; padding-left: 25px; padding-right: 25px; padding-bottom: 5px; padding-top: 5px; font-size: 35px; float: left;">
                                    <i class="fa fa-play-circle" aria-hidden="true"></i>
                                </div>
                                <div onclick="expandRowDetails(true, '${movies[i]['id']}')" style="cursor: pointer; display: inline-block; width: fit-content; line-height: 30px; font-size: 15px; font-weight: bold; margin-top: 12px; margin-left: -10px;">
                                    Play
                                </div>
                            </div>

                            <div style="padding-top: 5px; padding-left: 25px; padding-right: 25px; padding-bottom: 5px; font-size: 13px; font-weight: bold;">
                                <h3><br>${movies[i]['name']}</h3>
                            </div>

                            <div style="padding-left: 25px; padding-right: 25px; text-align: justify; font-size: 11px; font-family:Arial, Helvetica, sans-serif; padding-top: 2px;  text-align: justify;">
                                <p>${movies[i]['description']}</p>
                            </div>

                            <div style="margin-top: 10px; padding-left: 25px; display: inline-block; font-size: 12px; font-weight: 700;">
                                ${movies[i]['duration']}
                            </div>

                            <div style="padding-left: 25px; margin-bottom: 20px; display: inline-block; font-size: 12px; font-weight: 700;">
                                ${getFormattedDate(movies[i]['release_dt'])}
                            </div>

                        </div>
                    </div>`;
        }

        zIndex -= 100;

        html += `</div>
            </div>
            `;

        document.getElementById("body").innerHTML += html;
        LOADED[genre.split(" ").join("_").toLowerCase()] = true;

    }

    xhttp.open("POST", "/getMoviesByGenre");
    xhttp.setRequestHeader("Content-type", "application/json");

    var payload = {'genre': genre};
    payloadJson = JSON.stringify(payload);

    xhttp.send(payloadJson);
}

//---------Definition of getGenres----------

function getGenres() {

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        var genres = JSON.parse(this.responseText)
        
        for(var i = 0; i < genres.length; i++) {
            LOADED[genres[i]['genre'].split(" ").join("_").toLowerCase()] = false;
            getMoviesByGenre(genres[i]['genre']);
        }
    }

    xhttp.open("POST", "/getGenres");
    xhttp.send();

    
}

getGenres();

// ----- Definition of getTrendingMovies---------------

function getTrendingMovies() {

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        BANNER = JSON.parse(this.responseText);

        setInterval(function() {
            if (BANNER_TRACKER >= BANNER.length) {
                BANNER_TRACKER = 0;
            }
            else {
                document.getElementById('banner').style.backgroundImage = 'url(' + "data:image/jpg;base64," +  BANNER[BANNER_TRACKER]['poster'] + ')';
            
                BANNER_TRACKER++;
            }
        }, 4000);        
    }

    xhttp.open("POST", "/getTrendingMovies");
    xhttp.send();
}

getTrendingMovies();