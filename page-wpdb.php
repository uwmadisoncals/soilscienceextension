<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 * @package WordPress
 * @subpackage CALSv1
 * @since CALS 1.0
 */

get_header(); ?>


	<div id="main">

		<div id="primary">
		
			<div id="content" role="main">
			
			<?php wcmc_ajax(); ?>
			<p><label>keyword:</label><input id="wcmc-ajax"type='text' name='country' value='' class='auto'></p>


			</div><!-- #content -->
			<?php get_sidebar(); ?>
			<div class="clear"></div>
			
		</div><!-- #primary -->

	</div>

	<?php
	//############################################
	//#############    FIREPHP  ##################
 	/*

	$firephp = FirePHP::getInstance(true);
	 
	$var = $mydb;
	$var_2 = $allUsers;
	$var_3 = $customTerms;

	$firephp->log($var_2,'$allUsers');
	$firephp->log($var_3,'$customTerms');



	
	*/
	//############################################
	//############################################ ?>
<?php get_footer(); ?>

</div>