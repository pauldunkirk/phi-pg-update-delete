var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = {
  database: 'phi', // the name of the database
  host: 'localhost', // where is your database
  port: 5432, // the port number for your database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){
  // This will be replaced with a SELECT statement to SQL
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('SELECT * FROM "books";', function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/new', function(req, res){
  // This will be replaced with an INSERT statement to SQL
  var newBook = req.body;

  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('INSERT INTO books (title, author, edition, publisher) VALUES ($1, $2, $3, $4);',
      [newBook.title, newBook.author, newBook.edition, newBook.publisher],
      function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

// -> /delete/48
router.delete('/delete/:id', function(req, res){
  var bookId = req.params.id;
  // DELETE FROM books WHERE id=44;
  console.log('book of id to delete: ', bookId);
  // Connecting to, and deleting row from the database
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' delete stuff!!!!!
      client.query('DELETE FROM books WHERE id=$1;', // This is the SQL query
      [bookId], // This is the array of things that replaces the $1, $2, $3 in the query
      function(errorMakingQuery, result){ // This is the function that runs after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
}); // closing delete request


// for update -> /save/48
router.put('/save/:id', function(req, res){
  var bookId = req.params.id;
  var bookObject = req.body;
  // UPDATE books SET title='The Yodler' WHERE id=40;
  console.log('book of id to save: ', bookId);
  // Connecting to, and deleting row from the database
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' update stuff!!!!!
      client.query('UPDATE books SET title=$1, author=$2, edition=$3, publisher=$4 WHERE id=$5;', // This is the SQL query
      [bookObject.title, bookObject.author, bookObject.edition, bookObject.publsiher, bookId ], // This is the array of things that replaces the $1, $2, $3 in the query
      function(errorMakingQuery, result){ // This is the function that runs after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.status(500).send('Error making the database query: ', errorMakingQuery);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
}); // closing put request


module.exports = router;
