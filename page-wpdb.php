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

						<div id="formWrap">
						    <form id="messageForm" action="#">
						        <fieldset>
						            <legend>New message form</legend>
						            <span>New Message</span>
						            <label id="toLabel">To:</label>
						            <div id="friends" class="ui-helper-clearfix">
						                <input id="to" type="text">
						            </div>
						            <label>Subject:</label>
						            <input id="subject" name="subject" type="text">
						            <label>Message:</label>
						            <textarea id="message" name="message" rows="5" cols="50"></textarea>
						            <button type="button" id="cancel">Cancel</button>
						            <button type="submit" id="send">Send</button>
						        </fieldset>
						    </form>
						</div>
						<p><?php echo  admin_url('admin-ajax.php')?> </p>
				

		
			</div><!-- #content -->
			<?php get_sidebar(); ?>
			<div class="clear"></div>
			
		</div><!-- #primary -->

	</div>

	<?php
	//############################################
	//#############    FIREPHP  ##################
 	

	$firephp = FirePHP::getInstance(true);
	 
	$var = $mydb;
	$var_2 = $allUsers;
	$var_3 = $customTerms;
	$var_4 =$response;

	//$firephp->log($var_2,'$allUsers');
	//$firephp->log($var_3,'$customTerms');
	$firephp->log($var_4,'$response');



	
	
	//############################################
	//############################################ ?>
<?php get_footer(); ?>

</div>