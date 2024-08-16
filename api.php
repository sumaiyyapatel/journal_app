<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "config.php";

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT * FROM entries ORDER BY date DESC";
        $result = mysqli_query($conn, $sql);
        $entries = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($entries);
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $content = mysqli_real_escape_string($conn, $data->content);
        $tags = isset($data->tags) ? implode(',', $data->tags) : '';
        $sql = "INSERT INTO entries (content, tags) VALUES ('$content', '$tags')";
        if(mysqli_query($conn, $sql)){
            echo json_encode(["message" => "Entry added successfully"]);
        } else {
            echo json_encode(["message" => "ERROR: Could not execute $sql. " . mysqli_error($conn)]);
        }
        break;
    
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $id = mysqli_real_escape_string($conn, $data->id);
        $content = mysqli_real_escape_string($conn, $data->content);
        $tags = isset($data->tags) ? implode(',', $data->tags) : '';
        $sql = "UPDATE entries SET content='$content', tags='$tags' WHERE id=$id";
        if(mysqli_query($conn, $sql)){
            echo json_encode(["message" => "Entry updated successfully"]);
        } else {
            echo json_encode(["message" => "ERROR: Could not execute $sql. " . mysqli_error($conn)]);
        }
        break;
    
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $id = mysqli_real_escape_string($conn, $data->id);
        $sql = "DELETE FROM entries WHERE id=$id";
        if(mysqli_query($conn, $sql)){
            echo json_encode(["message" => "Entry deleted successfully"]);
        } else {
            echo json_encode(["message" => "ERROR: Could not execute $sql. " . mysqli_error($conn)]);
        }
        break;
}

mysqli_close($conn);
?>