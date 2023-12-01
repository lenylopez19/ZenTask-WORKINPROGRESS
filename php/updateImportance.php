<?php 
    require("connection.php");
    if($_POST){
        $taskId = (isset($_POST['id'])?$_POST['id']:"");
        $importance = (isset($_POST['importance'])?$_POST['importance']:0);
        $sql = "UPDATE todo SET importance = $importance WHERE id = $taskId ;";
        echo $sql;
        $result = mysqli_query($connection, $sql);
        echo $result;
    }
    mysqli_close($connection);
?>