<?php

// This file checks the authenticity of the inparameters (username and password) from the user through the db and sets sessionvalue "loggedIn" to true or destroys the session if you get signed out.

  if (session_id() == "") {
    session_start();
  }
  if (isset($_GET['loggedIn'])) {
    if (isset($_SESSION['loggedIn'])){
       echo json_encode(array ("loggedIn"=>TRUE));
       exit;
    }
    echo json_encode(array ("loggedIn"=>FALSE));
    exit;
  }

  if (isset($_GET['loggedOut'])) {
    session_destroy();
    exit;
  }


  if (isset($_POST['LOGIN'])){
    $USERNAME = $_POST['USERNAME'];
    $PASSWORD = $_POST['PASSWORD'];

    include_once ('database.class.php');
    $db = new Database();

    $result = $db->logIn($USERNAME,sha1($PASSWORD));

    if ($result) {
      $_SESSION['loggedIn'] = TRUE;

      echo json_encode(array ("loggedIn"=>TRUE));
      exit;
    }
    echo json_encode(array("Error"=>"Du angav fel inloggningsuppgifter, försök igen!"));
    exit;
  }
?>
