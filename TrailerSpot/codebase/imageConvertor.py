import os
import base64
import mysql.connector

path = "C:/Users/Tushar/Desktop/movies_poster"
hostname = '127.0.0.1'
username = 'root'
password = 'toor@66_root$$666'
database = 'testdb'
    
myDb = mysql.connector.connect(host = hostname, user = username, passwd = password, database = database)
myCursor = myDb.cursor(dictionary = True)

for (dirpath, dirnames, filenames) in os.walk(path):
    for filename in filenames:
        with open(dirpath + "/" + filename, "rb") as image_file:
            # print(image_file.read())
            encoded_string = base64.b64encode(image_file.read())
            id = filename.replace(".jpg", "")
            print(filename)
            myCursor.execute('UPDATE movies_information SET poster = "' + encoded_string.decode() + '" WHERE id = ' + id)

myDb.commit()