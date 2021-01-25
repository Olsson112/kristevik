<?php

// Checks if a session exists, if not it creates one
if(session_id() == ''){
  session_start();
}

// This recieves a post from js containing post ID and calls on method in db file to remove post

if (isset($_POST['deleteContent'])){
  if ($_POST['deleteContent'] == 'post'){
    include_once('database.class.php');
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->DeletePost($_POST['postId']);
    if ($result) {
      echo json_encode(array (
      "result"=>TRUE
    ));
    exit;
    }
  }
  echo json_encode (array('Error'=>'Något fel med att skicka post till databasen'));
  exit;
}

// This if statement is for creating a post for db. Gets title, content and date as in parameters from post in js

if (isset($_POST['POSTTITLE'])) {
  if (!isset($_SESSION['loggedIn'])){
    echo json_encode(array('Error'=>'Access denied'));
    exit;
  }

  if(isset($_POST['IMGFILE'])) {
    $data = $_POST['IMGFILE'];

    file_put_contents($_POST['IMGFILENAME'], file_get_contents($data));
    chmod($_POST['IMGFILENAME'], 0644);
  }

  $filename = isset($_POST['IMGFILENAME']) ? $_POST['IMGFILENAME'] : "NULL";

  include_once('database.class.php');
  $db = new Database();
  if ($db == FALSE){
    echo json_encode (array('Error'=>'Något fel med databasen'));
    exit;
  }
  $result = $db->CreatePost($_POST['POSTTITLE'], $_POST['POSTCONTENT'], $_POST['DATE'], $filename);
  if ($result) {
    echo json_encode(array (
    "result"=>TRUE,
    "content"=>$_POST
  ));
    exit;
  }
  echo json_encode (array('Error'=>'Något fel med att skicka post till databasen'));
  exit;
}

if(isset($_POST['postTitle'])){
  echo json_encode($_POST);
}

// Uppdates content in "contact" and "about" tables in the database. Calls on method in db file.

if (isset($_POST['updateContent'])){
  if ($_POST['updateContent'] == 'contact'){
    include_once('database.class.php');
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->UpdateContact($_POST['text1']);

    if ($result) {
      echo json_encode(array (
      "result"=>TRUE
    ));
      exit;
    }
    echo json_encode (array('Error'=>'Något fel med att skicka post till databasen'));
    exit;
  }

  if ($_POST['updateContent'] == 'document'){
    include_once('database.class.php');
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->UpdateDocument($_POST['text1']);

    if ($result) {
      echo json_encode(array (
      "result"=>TRUE
    ));
      exit;
    }
    echo json_encode (array('Error'=>'Något fel med att skicka post till databasen'));
    exit;
  }

  if ($_POST['updateContent'] == 'about'){
    include_once('database.class.php');
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->UpdateAbout($_POST['text1']);

    if ($result) {
      echo json_encode(array (
      "result"=>TRUE,
      "newValue" => $result,
      "text" => $_POST['text1']
    ));
      exit;
    }
    echo json_encode (array('Error'=>'Något fel med att skicka post till databasen'));
    exit;
  }
}

// The following statements is for getting data to a specific view from the db, calls on separate funtions in db file.

if (isset($_POST['content'])){
  include_once('database.class.php');

  if($_POST['content'] == 'contact'){
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->GetContact();
    echo json_encode($result);
    exit;
  }

  if($_POST['content'] == 'about'){
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->GetAbout();
    echo json_encode($result);
    exit;
  }

  if($_POST['content'] == 'document'){
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->GetDocument();
    echo json_encode($result);
    exit;
  }

  if($_POST['content'] == 'news'){
    $db = new Database();
    if ($db == FALSE){
      echo json_encode (array('Error'=>'Något fel med databasen'));
      exit;
    }
    $result = $db->GetNews();
    echo json_encode($result);
    exit;
  }

}
?>
