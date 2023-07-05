<?php 
    require("connection.php");
    if($_POST){
        $id = (isset($_POST['id'])?$_POST['id']:"");
        $completed = (isset($_POST['completed'])?$_POST['completed']:"");
        $sql = "UPDATE todo SET completed = $completed WHERE id = $id ;";
        echo $sql;
        $result = mysqli_query($connection, $sql);
        echo $result;
    }
    mysqli_close($connection);
?>