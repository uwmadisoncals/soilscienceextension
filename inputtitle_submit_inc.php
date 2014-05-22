<?php
/*add_action( 'wp_enqueue_scripts', 'inputtitle_submit_scripts' );  
add_action( 'wp_ajax_ajax-inputtitleSubmit', 'myajax_inputtitleSubmit_func' );
add_action( 'wp_ajax_nopriv_ajax-inputtitleSubmit', 'myajax_inputtitleSubmit_func' );
 
function inputtitle_submit_scripts() {
  
    wp_enqueue_script( 'inputtitle_submit', get_stylesheet_directory_uri() . '/js/inputtitle_submit.js', array( 'jquery' ));	
    wp_localize_script( 'inputtitle_submit', 'PT_Ajax', array(
        'ajaxurl'       => admin_url( 'admin-ajax.php' ),
        'nextNonce'     => wp_create_nonce( 'myajax-next-nonce' ))
    );
	
}
 
function myajax_inputtitleSubmit_func() {
	// check nonce
	$nonce = $_GET['nextNonce']; 	
	if ( ! wp_verify_nonce( $nonce, 'myajax-next-nonce' ) )
		die ( 'Busted!');
		
	// generate the response
	$response = json_encode( $_GET );
 
	// response output
	header( "Content-Type: application/json" );
	echo $response;
 
	// IMPORTANT: don't forget to "exit"
	exit;
	
} */


add_action( 'wp_enqueue_scripts', 'inputtitle_submit_scripts' );  
add_action( 'wp_ajax_ajax-inputtitleSubmit', 'myajax_inputtitleSubmit_func' );
add_action( 'wp_ajax_nopriv_ajax-inputtitleSubmit', 'myajax_inputtitleSubmit_func' );
 
function inputtitle_submit_scripts() {
  
    wp_enqueue_script( 'inputtitle_submit', get_stylesheet_directory_uri() . '/js/inputtitle_submit.js', array( 'jquery' ));	
    wp_localize_script( 'inputtitle_submit', 'PT_Ajax', array(
        'ajaxurl'       => admin_url( 'admin-ajax.php' ),
        'nextNonce'     => wp_create_nonce( 'myajax-next-nonce' ))
    );
	
}
 
function myajax_inputtitleSubmit_func() {
	global $wpdb;
	global $customTerms;

	$acInput = $_GET['input'];
	//$mydb = new wpdb('wp155','G4SP6S9[.1','wp155','localhost');
	$mydb = new wpdb('wcmcajax','CALS_soils2014!','cals_webhost','host.cals.wisc.edu');
	// check nonce
	$nonce = $_GET['nextNonce']; 	
	if ( ! wp_verify_nonce( $nonce, 'myajax-next-nonce' ) )
		die ( 'Busted!');
	

	//$custTermQuery = "SELECT slug FROM wp_47_terms";
	$custTermQuery = "SELECT slug FROM wp_47_terms WHERE slug LIKE '%" . $acInput . "%'";

	$customTerms = $wpdb->get_results($custTermQuery); 

	// generate the response
	//$response = json_encode( $_GET );
	$response2 = json_encode( $customTerms );
	$acInput_encoded = json_encode( $acInput );

 
	// response output
	header( "Content-Type: application/json" );
	//echo $response;
	echo ($response2);
	//echo ($acInput_encoded);
 
	// IMPORTANT: don't forget to "exit"
	exit;
	
}



	

