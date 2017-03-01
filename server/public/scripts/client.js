console.log('sourced!');
$(document).ready(function(){
  console.log('jquery was correctly sourced!');
  getBookData();
  function getBookData() {
    $.ajax({
      type: 'GET',
      url: '/books',
      success: function(response) {
        console.log('response', response); // response is an array of book objects
        $('#bookShelf').empty(); // clears the books in the #bookShelf
        for (var i = 0; i < response.length; i++) {
          var currentBook = response[i]; // Loops through books - This is an object
          var $newBook = $('<tr>'); // Creating a new row for each book
          $newBook.data('id', currentBook.id);
          $newBook.append('<td><input value="' + currentBook.title + '" class="bookTitle"></td>');
          $newBook.append('<td><input value="' + currentBook.author + '" class="bookAuthor"></td>');
          $newBook.append('<td><input value="' + currentBook.edition + '" class="bookEdition"></td>');
          $newBook.append('<td><input value="' + currentBook.publisher + '" class="bookPublsher"></td>');
          $newBook.append('<td><button class="deleteButton">Delete</button></td>');
          $newBook.append('<td><button class="saveButton">Save</button></td>');
          $('#bookShelf').prepend($newBook);
        }
      }
    });
  }

  $('#newBookForm').on('submit', function(event){
    event.preventDefault();
    var newBookObject = {};
    var formFields = $(this).serializeArray();
    formFields.forEach(function (field) {
      newBookObject[field.name] = field.value;
    });

    $.ajax({
      type: 'POST',
      url: '/books/new',
      data: newBookObject,
      success: function(response){
        console.log(response);
        getBookData();
        $('#newBookForm > input').val('');
      }
    });
  });

  $('#bookShelf').on('click', '.deleteButton', function(){
    var idOfBookToDelete = $(this).parent().parent().data().id;
    console.log('The id to delete is: ', idOfBookToDelete);
    // for waldo, number 48 -> /books/delete/48
    $.ajax({
      type: 'DELETE',
      url: '/books/delete/' + idOfBookToDelete,
      success: function(response) {
        console.log(response);
        getBookData();
      }
    });
  });

  $('#bookShelf').on('click', '.saveButton', function(){
    var idOfBookToSave = $(this).parent().parent().data().id;
    var titleOfBookToSave = $(this).parent().parent().find('.bookTitle').val();
    var authorOfBookToSave = $(this).parent().parent().find('.bookAuthor').val();
    var editionOfBookToSave = $(this).parent().parent().find('.bookEdition').val();
    var publisherOfBookToSave = $(this).parent().parent().find('.bookPublisher').val();
    var bookObjectToSave = {
      title: titleOfBookToSave,
      author: authorOfBookToSave,
      edition: editionOfBookToSave,
      publisher: publisherOfBookToSave
    };
    // for waldo, number 48 -> /books/save/48
    $.ajax({
      type: 'PUT',
      url: '/books/save/' + idOfBookToSave,
      data: bookObjectToSave,
      success: function(response) {
        console.log(response);
        getBookData();
      }, //end success
      error: function(response){
        console.log(response);
        $('#errorMessage').append('<p>'+ response.statusText + '</p>');
      } // end error
    }); //end of AJAX
  }); // end of click
});//end of doc ready
