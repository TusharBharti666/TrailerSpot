from http.server import BaseHTTPRequestHandler, HTTPServer
import mysql.connector
import json
import datetime
import os

#Credentials for establishing a connection with MySQL

basePath = str(os.path.dirname(os.path.realpath(__file__))).replace('\\', '/')
hostname = '127.0.0.1'
username = 'root'
password = 'toor@66_root$$666'
database = 'testdb'

#Server details

hostName = "127.0.0.1"
serverPort = 8080

#-----------------------------------This function is used to execute the query------------------------------

def mysql_select (query: str) -> list:

    myDb = mysql.connector.connect(
        host = hostname,
        user = username,
        passwd = password,
        database = database
    )
    
    myCursor = myDb.cursor(dictionary = True)

    myCursor.execute(query)

    resultSet = myCursor.fetchall()
    resultList = list(resultSet)

    for i in range(0, len(resultList)):
        for key, value in resultList[i].items():
            if type(value) == datetime.date:
                resultList[i][key] = datetime.date.strftime(value, '%m/%d/%Y')

    return resultList


#-------------------------This function is used to make the query-----------------------------------

def mysql_fetchData (dataType: str, columns: list, filterColumn: str, filterValue):

    if len(columns) == 0:
        columns = "*"
    else:
        columns = ",".join(columns)

    tablename = ''
    query = ''

    if 'users' == dataType.lower():
        tablename = 'users'
    elif 'movies' == dataType.lower():
        tablename = 'movies_information'

    if filterColumn != '':

        if type(filterValue) == str:
            query = f'SELECT {columns} FROM {tablename} WHERE {filterColumn} = "{filterValue}"'

        elif type(filterValue) == int:
            query = f'SELECT {columns} FROM {tablename} WHERE {filterColumn} = {filterValue}'

    else:
        query = f'SELECT {columns} FROM {tablename}'

    result = mysql_select(query)

    return result


#--------------This function is used to get all the movies according to genre--------------------

def getMoviesByGenre (requestPayload: dict):
    result = mysql_fetchData('movies', [], 'genre', requestPayload['genre'])
    resultJson = json.dumps(result)
    return resultJson

#------------This function is used to get a single-single movie according to their id------------

def getMovieById (requestPayload: dict):
    result = mysql_fetchData('movies', [], 'id', requestPayload['value'])
    resultJson = json.dumps(result)
    return resultJson

#----------------------------------This function is to get the genres----------------------------

def getGenres ():
    result = mysql_fetchData('movies', ['DISTINCT genre'], '', '')
    resultJson = json.dumps(result)
    return resultJson

#-----------This function is used to get the trending movies which are present in the large banner-----

def getTrendingMovies ():
    result = mysql_fetchData('movies', ['name','description','poster'], 'is_trending', 1)
    resultJson = json.dumps(result)
    return resultJson


#-------------------GET request which client send to the server---------------------------

class Server (BaseHTTPRequestHandler):

    def do_GET (self):

        requestPath = str(self.requestline).strip().split(' ')[1]

        requestPathList = requestPath.strip().split('/')
        response = None

        if requestPathList[1] == '':
            requestPath += 'index.html'
            response = bytes(open(basePath + requestPath, 'r').read(), 'utf-8')

        elif requestPathList[1].startswith('getMoviesByGenre'):
            getMoviesByGenre(requestPathList[1])

        else:
            if requestPath.endswith('jpg') or requestPath.endswith('png') or requestPath.endswith('ico') or requestPath.endswith('gif'):
                response = open(basePath + requestPath, 'rb').read()
                
            else:
                response = bytes(open(basePath + requestPath, 'r').read(), 'utf-8')

        self.send_response(200)
        #self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(response)


#------------------------------POST request send by the client to the server-------------------------

    def do_POST (self):

        contentLength = int(self.headers.get('Content-Length'))
        requestPayload = None

        if contentLength != 0:
            requestPayloadBytes = self.rfile.read(contentLength)
            requestPayloadJson = requestPayloadBytes.decode()
            requestPayload = json.loads(requestPayloadJson)

        requestPath = str(self.requestline).strip().split(' ')[1]
        requestPathList = requestPath.strip().split('/')

        responsePayload = None

        if requestPathList[1].startswith('getMoviesByGenre'):
            responsePayload = getMoviesByGenre(requestPayload)

        elif requestPathList[1].startswith('getMovieById'):
            responsePayload = getMovieById(requestPayload)

        elif requestPathList[1].startswith('getGenres'):
            responsePayload = getGenres()
        
        elif requestPathList[1].startswith('getTrendingMovies'):
            responsePayload = getTrendingMovies()

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(responsePayload.encode())




webServer = HTTPServer((hostName, serverPort), Server)
webServer.serve_forever()