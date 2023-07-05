<?php
require("connection.php");
    if(isset($_POST['task']) && $_POST['task']!="" && strlen($_POST['task']) > 0 ){
        $task = $_POST['task'];
        $sql = "INSERT INTO todo(task , taskType) VALUES ('$task', 'user');";
        $result = mysqli_query($connection,$sql);
        echo $result;
    }

    mysqli_close($connection);
?>