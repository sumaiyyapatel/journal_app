<?php
require_once "config.php";

$sql = "CREATE TABLE entries (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    tags TEXT
)";

if (mysqli_query($conn, $sql)) {
    echo "Table created successfully.";
} else {
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
}

mysqli_close($conn);
?>