<?php
require_once "config.php";

if($conn){
    echo "Connected successfully to the database.";
} else {
    echo "Failed to connect to the database.";
}

mysqli_close($conn);
?>