<script
      src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
      integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
      crossorigin="anonymous"
    ></script>

    
    $('#myImage').change(function(e){
     //send ajax request
     var file = e.target.files;

     if(file.length > 0 ){
         console.log('file length: '+file.length);
     }
     $.ajax('/users/upload_file',   // request url
     {
     dataType: 'json', // type of response data
     timeout: 500,     // timeout milliseconds
     success: function (data,status,xhr) {   // success callback function
      console.log('file uploaded...');
    },
     error: function (jqXhr, textStatus, errorMessage) { // error callback 
         $('p').append('Error: ' + errorMessage);
     }
     });
 });     

$('#myImage').fileupload({
    dataType: 'json',
    add: function (e, data) {            
        $("#up_btn").off('click').on('click', function () {
            data.submit();
            console.log("uploadded");
        });
    },
});