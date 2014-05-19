<?php

//Page Slug Body Class
function add_slug_body_class( $classes ) {
global $post;
if ( isset( $post ) ) {
$classes[] = $post->post_type . '-' . $post->post_name;
}
return $classes;
}

add_filter( 'body_class', 'add_slug_body_class' );

/*
wp_enqueue_script('jquery'); //would be used to ensure Jquery is loaded


function addCustomer(){
	global $wpdb;
	$name = $_POST['name'];

	if($wpdb->insert('friends', array('name'=>$name))===FALSE){
		echo "Error";
	}
	else{
		echo "Customer '".$name. "' successfully added, row ID is". $wpdb->insert_id;
	}
	die();
}


add_action('wp_ajax_addCustomer', 'addCustomer');

add_action('wp_ajax_nopriv_addCustomer', 'addCustomer'); //tells wordpress to listen for 'myfunction', b/c it is going to be called by wp Ajax interface
*/
wp_enqueue_script('jquery');
 
function addCustomer(){
       
        global $wpdb;
       
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $email = $_POST['email'];
        $address = $_POST['address'];
       
        if($wpdb->insert('customers',array(
                'name'=>$name,
                'email'=>$email,
                'address'=>$address,
                'phone'=>$phone
                ))===FALSE){
       
                echo "Error";
               
        }
        else {
                        echo "Customer '".$name. "' successfully added, row ID is ".$wpdb->insert_id;
 
                }
        die(); 
}
add_action('wp_ajax_addCustomer', 'addCustomer');
add_action('wp_ajax_nopriv_addCustomer', 'addCustomer');

/*function get_ajaxurl(){
?>
<script type="text/javascript">
        var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';

</script>
<?php 
}

add_action('wp_head','get_ajaxurl'); */

wp_register_script('autocompleteAjaxHandle',get_stylesheet_directory() . "/autocompleteAjax.js");
wp_enqueue_script('autocompleteAjaxHandle');
wp_localize_script('autocompleteAjaxHandle', 'autocompleteAjaxObject', array(
        'ajaxurl'=>admin_url('admin-ajax.php'),
        'autocompleteAjax_nonce'=>wp_create_nonce('autocompleteAjax_nonce_val'),
        'action'=>'autocompleteAjaxAction'
        ));

function get_autocomplete_suggestions(){
        $_GET['term'];
        $suggestions_array=array( 'captain crunch', 'chex', 'cheerios');

        $response = $_GET["callback"]. "(" . json_encode($suggestions_array) . ")";
        echo $response;
        exit;
}

add_action('wp_ajax_autocompleteAjaxAction', 'get_autocomplete_suggestions');
add_action('wp_ajax_nopriv_autocompleteAjaxAction', 'get_autocomplete_suggestions'); 