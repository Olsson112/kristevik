
// Logged in or not
signedIn = false;

// Checks if the user is logged in. Returns true or false.
function checkAuthentication () {
  $.get("authenticator.php?loggedIn", function (dataraw){
    var data = JSON.parse(dataraw);
    signedIn = data.loggedIn;

    var logInBtn = document.getElementById('logInBtn');
    if (signedIn == true) {
      $('#logInBtn').html('Logga ut');
      $('#logInBtn').attr('data-target', '');
      $('#logInBtn').attr('data-toggle', '');
      $('#logInBtn').attr('onclick', 'logOut()');
    } else {
      $('#logInBtn').html('Logga in');
      $('#logInBtn').attr('data-target', '#myModal');
      $('#logInBtn').attr('data-toggle', 'modal');
      $('#logInBtn').attr('onclick', '');
    }
  })
}



// Redirect user to dropbox.com
function openDropbox () {
  window.open('https://www.dropbox.com/sh/uztvyxa13bxsx7n/AAAHkPk9R5oMLSylajng3h_Ja?dl=0');
}

// logging the user out
function logOut () {
  $.get("authenticator.php?loggedOut", function (){
    signedIn = false;
    console.log('Nu är du utloggad!');
    $("#aboutBtn").trigger("click");
  })
}

// Triggers a "digital" click to load the "about" content
function toggleStartpage () {
  $("#aboutBtn").trigger("click");
}

// Gets the specified view (html document) and loads it into the webpage
function getView(url, obj, func){
  checkAuthentication();
  console.log("Creating ajax request");
  console.log("URL: "+url);
  console.log("DATA: "+obj);

  $.get(url, function(data){
    $('#content-body').html(data);

    $.ajax({
      type: "POST",
      url: 'ajaxRequestHandler.php',
      data : obj,
      dataType: "json",
      success : func,
      error: (err)=>{
        console.log(err);
        console.log("Någonting gick snett gubben");
      }
    });
  });
}

// This method covers almost all of the posts made from this JS file. Its dynamic with inparameters.
function postData (url, obj, func) {
  $.ajax({
    type: "POST",
    url: url,
    data : obj,
    dataType: "json",
    success : func,
    error: (err)=>{
      console.log(err);
      console.log("Någonting gick snett gubben");
    }
  });
}

// Adds attribute to the textfields that are changeable by the admin in the webpage
function addIsContenteditable (extension="") {
  if (signedIn == true){
  $("*").children('.editable').each(function(i,el){
    $(el).attr('contenteditable', 'true');
  });

// Initializes editor with preferences

  tinymce.init({
    selector:'.hasEditor'+extension,
    plugins: [
        "image code advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste imagetools preview"
    ],
    toolbar: "code | link image | preview | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    skin: "custom",
    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    content_css: [
    '//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
    '//www.tinymce.com/css/codepen.min.css'
  ],

    //To upload images from editor to webserver

    image_title: true,
    automatic_uploads: true,
    images_upload_url: 'imageUploadHandler.php',
    file_picker_types: 'image',

    file_picker_callback: function(cb, value, meta) {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.onchange = function() {
        var file = this.files[0];
        var id = 'blobid' + (new Date()).getTime();
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        var blobInfo = blobCache.create(id, file);
        blobCache.add(blobInfo);

        // call the callback and populate the Title field with the file name
        cb(blobInfo.blobUri(), { title: file.name });
      };
      input.click();
    }
  })

  $("*").children('.show-btn-loggedIn').each(function(i,el){
      $(el).show();
  });
  $('#post-form').show();
  }
}

// Sends a request to backend to delete a certain post (indentified throug "Post ID")
function deletePost (Id) {
  var postId = Id.dataset.id;

  postData('ajaxRequestHandler.php',{deleteContent: 'post', postId: postId},
  function(data){
    console.log("Ajax call was a success");
    if(data.hasOwnProperty('Error')){
      console.log(data.Error);
      return;
    }
    $("#newsBtn").trigger("click");
    addIsContenteditable();
  });
}

// Formats the date for the posts, in this application the backend creates a new datetime so this is not litterary used.
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}



// Document is fully loaded after the comming statement
$(document).ready(function(){

  // This function determens what will happened when "Nyheter"-button is pressed at the navbar

  $("#newsBtn").click(function(event){
    event.preventDefault();
    getView('news.html',{content: 'news'},
    function(data){
      console.log("Ajax call was a success");
      if(data.hasOwnProperty('Error')){
        console.log(data.Error);
        $("#no-posts").show();
      }
      else {
        $("#no-posts").hide();
        $.each(data, function(index, value) {

          var newEl = value.postImgUrl != "NULL" && value.postImgUrl != null ? "<div class='col-lg-12 col-md-12'><div class='well well-lg'><button data-id='"+value.id+"'  type='button' style='display:none; float:right; background-color:lightred;' onclick='deletePost(this)' class='delete-post-btn show-btn-loggedIn btn btn-primary'>Ta bort inlägg</button><div class='row'><div class='col-md-12'><p class='news-post-title'>"+value.postTitle+"</p><p class='news-post-metadata'>Postades: "+value.postDate+"</p></div></div><div class='row'><div class='col-md-12 news-post-text'><p>"+value.postContent+"</p><div class='postImgBox'><img class='postImg' src='"+value.postImgUrl+"'></div></div></div></div></div>" : "<div class='col-lg-12 col-md-12'><div class='well well-lg'><button data-id='"+value.id+"'  type='button' style='display:none; float:right; background-color:lightred;' onclick='deletePost(this)' class='delete-post-btn show-btn-loggedIn btn btn-primary'>Ta bort inlägg</button><div class='row'><div class='col-md-12'><p class='news-post-title'>"+value.postTitle+"</p><p class='news-post-metadata'>Postades: "+value.postDate+"</p></div></div><div class='row'><div class='col-md-12 news-post-text'><p>"+value.postContent+"</p></div></div></div></div>"

          $('#news-row').append(newEl);
        });
      }
      addIsContenteditable();

      $("#new-postBtn").click(function(){
        var postTitle = document.getElementById("input-post-title").value;
        var postContent = document.getElementById("input-post-content").value;
        var date = Date.now();
        var dateToSave = formatDate(date);

        var fileInput = document.getElementById('input-post-image');
        var file = undefined

        if(!fileInput.files[0]){
          console.log("No file was selected")
        }else{
          file = fileInput.files[0]

          fr = new FileReader()
          fr.onload = saveImgData

          fr.readAsDataURL(file)

          function saveImgData () {

            var fileNameArr = fileInput.value.split('\\');
            var filename = fileNameArr[fileNameArr.length-1]
            fileNameArr = filename.split('.')
            filename = "uploads/"+date+"."+fileNameArr[1]

            console.log(fileNameArr[1]);

            //TODO: Kolla så att FileNameArr[1] är antingen jpeg, png eller bmp format
            if (fileNameArr[1] != "jpg" && fileNameArr[1] != "png" && fileNameArr[1] != "bmp") {
              alert("Felaktigt bildformat, tillåtna format är jpg, png och bmp");
              return;
            }
            console.log(filename)

            postData('ajaxRequestHandler.php',{POSTTITLE:postTitle, POSTCONTENT:postContent, DATE:dateToSave, IMGFILE:fr.result, IMGFILENAME: filename},
              function(data){
                if(data.hasOwnProperty('Error')){
                  console.log(data.Error);
                  return;
                }

                console.log(data.result);
                $("#newsBtn").trigger("click");

              });
            }
          }

        if(file == undefined){
          postData('ajaxRequestHandler.php',{POSTTITLE:postTitle, POSTCONTENT:postContent, DATE:dateToSave},
            function(data){
              console.log("Ajax call was a success");
              if(data.hasOwnProperty('Error')){
                console.log(data.Error);
                return;
              }
              console.log(data.result);
              $("#newsBtn").trigger("click");
            });

        }else{
          return;
        }});
    });
  });

  // This function determens what will happened when "Kontakt"-button is pressed at the navbar
  $("#contactBtn").click(function(event){
      event.preventDefault();
      getView('contact.html',{content: 'contact'},
      function(data){
        console.log("Ajax call was a success");
        if(data.hasOwnProperty('Error')){
          console.log(data.Error);
          return;
        }

        $('#containerContact').html(data.text1);
        /*
        $('#ordforande').text(data.ordforande);
        $('#viceOrdforande').text(data.viceordforande);
        $('#driftansvarig').text(data.driftansvarig);
        $('#epost').text(data.epost);
        $('#adress').text(data.adress);
        */
        $("#updateContact-btn").click(function(event){
            event.preventDefault();

            var text1 = tinymce.activeEditor.getContent();
            /*

            var ordforande = $('#ordforande').text();
            var viceOrdforande = $('#viceOrdforande').text();
            var driftansvarig = $('#driftansvarig').text();
            var epost = $('#epost').text();
            var adress = $('#adress').text();

            */

            postData('ajaxRequestHandler.php',{updateContent: 'contact', text1:text1},
            function(data){
              console.log("Ajax call was a success");
              if(data.hasOwnProperty('Error')){
                console.log(data.Error);
                return;
              }
              $("#contactBtn").trigger("click");
              addIsContenteditable("Contact");

            });
        });
        addIsContenteditable("Contact");
      });
  });

  // This function determens what will happened when "Startsida or Kristevik SF"-button is pressed at the navbar
  $("#aboutBtn").click(function(event){

    event.preventDefault();
    getView('about.html',{content: 'about'},
    function(data){
      console.log("Ajax call was a success");
      if(data.hasOwnProperty('Error')){
        console.log(data.Error);
        return;
      }
      //$('#rubrik1').text(data.rubrik1);
      //$('#rubrik2').text(data.rubrik2);
      $('#aboutContainer').html(data.text1);
      //$('#text2').html(data.text2);

      $("#updateAbout-btn").click(function(event){

          event.preventDefault();
          //var rubrik1 = $('#rubrik1').text();
          //var rubrik2 = $('#rubrik2').text();
          var text1 = tinymce.activeEditor.getContent();
          //var text2 = $('#text2').html();

          postData('ajaxRequestHandler.php',{updateContent: 'about', text1:text1},
          function(data){
            console.log("Ajax call was a success");
            if(data.hasOwnProperty('Error')){
              console.log(data.Error);
              return;
            }
              $("#aboutBtn").trigger("click");
            addIsContenteditable();
          });
      });

      addIsContenteditable();
    });
  });



  $("#documentBtn").click(function(event){

    event.preventDefault();
    getView('document.html',{content: 'document'},
    function(data){
      console.log("Ajax call was a success");
      if(data.hasOwnProperty('Error')){
        console.log(data.Error);
        return;
      }
      $('#documentContainer').html(data.text1);

      $("#updateDocument-btn").click(function(event){

          event.preventDefault();
          var text1 = tinymce.activeEditor.getContent();

          postData('ajaxRequestHandler.php',{updateContent: 'document',text1: text1},
          function(data){
            console.log("Ajax call was a success");
            if(data.hasOwnProperty('Error')){
              console.log(data.Error);
              return;
            }
              $("#documentBtn").trigger("click");
            addIsContenteditable("Document");
          });
      });

      addIsContenteditable("Document");
    });
  });


  // This function determens what will happened when "log in"-button is pressed at in the modal. This action posts the username and password to backend for varification.
  $("#btnLogin").click(function(event){
    event.preventDefault();
    var username = document.logInForm.username.value;
    var password = document.logInForm.password.value;

  postData('authenticator.php',{USERNAME:username, PASSWORD:password, LOGIN:true},
    function(data){
      console.log("Ajax call was a success");
      if(data.hasOwnProperty('Error')){
        console.log(data.Error);
        $('#felUppgifter').text(data.Error);
        return;
      }
      $('#felUppgifter').text('');
      signedIn = true;
      checkAuthentication();
      $('#myModal').modal('hide');
      $( "#aboutBtn" ).trigger( "click" );
    });
  });

  // This loads the startpage after logging in
  $("#aboutBtn").trigger("click");
});
