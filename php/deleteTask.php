<?php 
    require("connection.php");
    if(isset($_POST['id'])){
        $ids = $_POST['id'];
        $length= count($ids);
        $idsList = "";
        for ($i=0; $i<$length ; $i++) { 
          $idsList .= $ids[$i];
          if($i<$length-1){
            $idsList .= ",";
          }
        }
        $sql = "DELETE FROM todo WHERE id IN ($idsList)";
        $result = mysqli_query($connection,$sql);
        echo $result;
    }
    mysqli_close($connection);
?>