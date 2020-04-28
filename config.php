<?php

$host = 'localhost';
$username = 'root';
$password  = '';
$db = 'bipolar';


// Connect mySql

$mysqli = new mysqli($host, $username, $password, $db);
//Check if Safe connection established

if ($mysqli->connect_error) {
    die("Connect Error:Could not cconnect to database");
}
