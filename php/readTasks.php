<?php 
    require("connection.php");

    
    $sql = "SELECT * FROM todo";
    
    $result = mysqli_query($connection,$sql);
   
    if(!$result){
        die("Query failed ". mysqli_error($connection));
    }

    $data = array();
    while($row = mysqli_fetch_assoc($result)){
        // $data[]= array(
        //     "id"=>$row['id'],
        //     "task"=>$row['task'],
        //     "completed"=>$row['completed']
        // );
        $data[]= $row;
    }
    echo json_encode($data);

    mysqli_close($connection);
?>