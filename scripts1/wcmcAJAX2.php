<?php

	//connection information
	$host = "localhost";
	$user = "wp155";
	$password = "G4SP6S9[.1";
	$database = "wp155";
	$param = $_GET["term"];
	
	//make connection
	$server = mysql_connect($host, $user, $password);
	$connection = mysql_select_db($database, $server);
	
	//query the database
	$query = mysql_query("SELECT * FROM friends WHERE name REGEXP '^$param'");
	
	//build array of results
	for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
		$row = mysql_fetch_assoc($query);
    
		$friends[$x] = array("name" => $row["name"]);		
	}
	
	//echo JSON to page
	$response = $_GET["callback"] . "(" . json_encode($friends) . ")";
	echo $response;
	
	mysql_close($server);
	
?>