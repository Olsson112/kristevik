<?php
class Database {

// Sets up a connection to the database

  function Database () {
    #$dsn = 'mysql:dbname=viol0011;localhost';
    $dsn = 'mysql:host=postvagen-224150.mysql.binero.se;dbname=224150-postvagen';
    $user = '224150_jl76916';
    $password = 'Kristevik1';
    try {
      $this->db=new PDO ($dsn,$user,$password);
      $this->db->exec('set names utf8');
    } catch (PDOException $e) {
      return FALSE;
    }
  }

  // Stores new post in the news table

  function CreatePost ($title, $content, $date, $filename) {
    $query = $this->db->prepare ("INSERT INTO news (postDate,postTitle,postContent,postImgUrl) VALUES (:date,:title,:content,:imgUrl);");
    $result = $query->execute(array (
      ":date"=>$date,
      ":title"=>$title,
      ":content"=>nl2br($content),
      ":imgUrl"=>$filename
    ));
    return $result;
  }

  // Deletes specific post from news table

  function DeletePost ($postId) {

    $query = $this->db->prepare("SELECT postImgUrl FROM news WHERE id=:postId");
    $query->execute(array (
      ":postId"=>$postId
    ));

    $result = $query->fetch();
    if($result != NULL)
      unlink($result['postImgUrl']);
    $query = $this->db->prepare ("DELETE FROM news WHERE id=:postId;");
    $result = $query->execute(array (
      ":postId"=>$postId
    ));
    return $result;
  }

  // Gets the data from the contact table

  function GetContact () {
    $query = $this->db->prepare ("SELECT * FROM contact;");
    $query->execute();
    $result = $query->fetch();
    if (empty($result)){
      return array("Error"=> "Oups, något gick fel att hämta contact vyn! Försök igen");
    }
    return $result;
  }

  // Uppdates content in the contact table

  function UpdateContact ($text1) {
    $updateData = $this->db->prepare ("UPDATE contact SET text1=:text1 WHERE id=1");

    $result = $updateData->execute(array (
      ":text1"=>$text1
    ));
    return $result;
  }

  // Gets content from the news table

  function GetNews () {
    $query = $this->db->prepare ("SELECT * FROM news ORDER BY postDate DESC;");
    $query->execute();
    $result = $query->fetchAll();
    if (empty($result)){
      return array("Error"=> "Det finns inga poster att hämta!");
    }
    return $result;
  }

  // Gets data from the about table

  function GetAbout () {
    $query = $this->db->prepare ("SELECT * FROM about;");
    $query->execute();
    $result = $query->fetch();
    if (empty($result)){
      return array("Error"=> "Oups, något gick fel att hämta about vyn! Försök igen");
    }
    return $result;
  }

  // Updates content in the about table

  function UpdateAbout ($text1) {
    $updateData = $this->db->prepare ("UPDATE about SET text1=:text1 WHERE id=2");

    $result = $updateData->execute(array (
      ":text1"=>$text1
    ));
    return $text1;
  }

  function GetDocument () {
    $query = $this->db->prepare ("SELECT * FROM document;");
    $query->execute();
    $result = $query->fetch();
    if (empty($result)){
      return array("Error"=> "Oups, något gick fel att hämta about vyn! Försök igen");
    }
    return $result;
  }

  function UpdateDocument ($text1) {
    $updateData = $this->db->prepare ("UPDATE document SET text1=:text1; WHERE id=1");

    $result = $updateData->execute(array (
      ":text1"=>$text1
    ));
    return $result;
  }

  // Gets the data from the user table (for authentication)

  function logIn($username, $password){
    $query = $this->db->prepare("SELECT * FROM user WHERE username = :USERNAME AND password = :PASSWORD");
    $query->execute(array(
      ':USERNAME' => $username,
      ':PASSWORD' => $password
    ));

    $result = $query->fetch();
    if(empty($result)){
      return FALSE;
    }
    return TRUE;
  }
}
?>
