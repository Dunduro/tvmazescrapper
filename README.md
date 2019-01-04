### tv maze scrapper
installation guide
1. import mysql database structure from file 'db_structure.sql'
2. install node dependencies
    ```
    $ npm install
    ```
3. run import.js to repeatedly pull in more information from tv maze
    ```
    $ node import.js
    ```
4. change mysql database credentials as required in ./modules/db.js
5. start the node webserver process
    ```
    $ node server.js
    ```
6. the restful api should be available from localhost:1337/api/shows/[pageNumber]
