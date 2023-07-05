<?php
 $server= "127.0.0.1";
 $user="root";
 $pass="";
 $db="simpleToDo";

 $connection = new mysqli($server,$user,$pass,$db);
 
 if(mysqli_connect_errno()){
    echo "error connecting to the database, error: ".mysqli_connect_errno();
    exit;
 }

?>