---------------------------------------------------------------------------
                     "TrailerSpot" start up guide:
---------------------------------------------------------------------------

1. Install MySQL database instance.

2. Create MySQL connection with following properties:

	hostname: '127.0.0.1'
	username: 'root'
	password: 'toor@66_root$$666'
	database: 'testdb'

** If these properties get changed, then need to change in "server.py" also accordingly.

3. Create table "movies_information" inside the database "testdb".

4. Load data into the table, using "database.csv" file.

5. Install Python 3.9 or higher.

6. Install following python libraries:

	import http.server
	import mysql.connector
	import json
	import datetime
	import os

7. Start MySQL database instance

8. Execute "server.py", it will start REST API server on port "8080" locally.

9. Open web browser, and then visit url "localhost:8080".

---------------------------------------------------------------------------

---------------------------------------------------------------------------
          "TrailerSpot" functionalities and general information:
---------------------------------------------------------------------------

1. This website provides trailers of different movies in different genres.

2. All the images, movies data, and youtube links are loaded dynamically directly from the MySQL database.

3. In the frontend, HTML, CSS, and JavaScript has been used.

	3.1. HTML is used for basic structure of website.
	3.2. CSS is used for styling the website.
	3.3. JavaScript is used to create REST API clients to fetch data dynamically from the server, and provide interactivity.

4. In the backend, Python has been used for creating the REST API server and fetch data from the MySQL database.

5. Red & Black theme of the website replicates the idea of Netflix, and opening of movies when we hover on them, replicates the idea of Amazon's PrimeVideo.

6. The header section includes the name of website "Trailer Spot" and the transition of all trending movies.

7. Left & Right arrows are present, in order to slide in respective direction for accessing more movies within the same genre.

8. In order to play any trailer, we need to hover on the movie thumbnail and then click either on its image or on the play button.

9. A box will get open including all the details of the movie and a play button. We just have to click on that play button and the trailer would be start playing.

10. Video of the trailer is directly playing from the youtube using HTML's iframe component.


** We are storing all the movie thumbnail images as base64 encoded string in MySQL table.
--------------------------------------------------------------------------------------------