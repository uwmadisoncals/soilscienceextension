<?php
//absolute path to wp-load.php, or relative to this script
//e.g., ../wp-core/wp-load.php
//include( '../../hostcals.localhost/wp-load.php' ); 
 
//grab the WPDB database object, using WP's database
//more info: http://codex.wordpress.org/Class_Reference/wpdb
global $wpdb;
global $customTerms;
 
//make a new DB object using a different database
//$mydb = new wpdb('username','password','database','localhost');
$mydb = new wpdb('wp155','G4SP6S9[.1','wp155','localhost');

$allUsers = $wpdb->get_results("SELECT * FROM $wpdb->users");
$custTermQuery = "SELECT slug FROM wp_47_terms";

$customTerms = $wpdb->get_results($custTermQuery); ?> 
<pre>
 <?php// print_r($customTerms); ?>
</pre>

<?php function wcmcAutoComplete($customTerms){
	return json_encode($customTerms);
	} ?>