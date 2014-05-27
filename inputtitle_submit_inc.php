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
	$custTaxQuery = "SELECT term_id FROM wp_47_term_taxonomy WHERE taxonomy='wcmc_keywords'";
	//$custTermQuery = "SELECT slug FROM wp_47_terms WHERE slug LIKE '%" . $acInput . "%'";
	
	$customTax = $wpdb->get_results($custTaxQuery); 
	$customTerms = $wpdb->get_results($custTermQuery); 

	//map the array of stdClass objects into an indexed array of integers, than implode it into a string
	$custTaxMapped = array_map(function($obj){ return $obj->term_id;}, $customTax);

	// apply single quotes around each value
	foreach ($custTaxMapped as $key => $value) {
		$custTaxMapped[$key] = " '" . $value . "'";
	}

	//implode the array to make it a string
	$custTaxMapped = implode(", ", $custTaxMapped);

	// add the parenthesis and semicolon
	$custTaxString = "( " . $custTaxMapped . ");";

	$custTermQuery = "SELECT slug FROM wp_47_terms WHERE slug LIKE '%" . $acInput . "%' AND term_id IN" . $custTaxString;
	$customTerms = $wpdb->get_results($custTermQuery);
	// generate the response
	//$response = json_encode( $_GET );
	$response2 = json_encode( $customTerms );
	//$acInput_encoded = json_encode( $acInput );

 	logit( $customTax, '$customTax:' );
 	logit( $customTerms, '$customTerms:' );
 	logit( $custTaxMapped, '$custTaxMapped:' );
 	logit( $custTaxString, '$custTaxString:' );
 	logit( $custTermQuery, '$custTermQuery:' );


	// response output
	header( "Content-Type: application/json" );
	//echo $response;
	echo ($response2);
	//echo ($acInput_encoded);
 
	// IMPORTANT: don't forget to "exit"
	exit;
	
}



									############################################
									#############    FIREPHP  ##################
								 	/*

									$firephp = FirePHP::getInstance(true);
									 
									$var_z0 = $customTerms;
									$var_z1 = $custTermQuery;
									
									$var_z2 = $getTerms;
									


									 
									//$firephp->log($var99,'$get_auth_name');
									$firephp->log($var_z1,'$custTermQuery');
									
									$firephp->log($var_z0,'$customTerms');
									

									*/
									//############################################
									//#########################################
	

