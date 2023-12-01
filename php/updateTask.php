<?php 
    require("connection.php");
    if($_POST){
        $id = (isset($_POST['id'])?$_POST['id']:"");
        $completed = (isset($_POST['completed'])?$_POST['completed']:0);
        if(isset($_POST['task'])){
            $updatedTask = $_POST['task'];
            $sql = "UPDATE todo SET task = '$updatedTask', completed = $completed WHERE id = $id ;";
        }else{
            $sql = "UPDATE todo SET completed = $completed WHERE id = $id ;";
        }
        echo $sql;
        $result = mysqli_query($connection, $sql);
        echo $result;
    }
    mysqli_close($connection);
?>