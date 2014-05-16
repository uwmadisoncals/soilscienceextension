<?php
/*
Template Name: Customers
 */
get_header(); ?>


	<div id="main">

		<div id="primary">
		
			<div id="content" role="main">

				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', 'page' ); ?>

					<?php get_template_part('nav_menu', 'explore');?>

					<?php //comments_template( '', true ); ?>

					<form type="post" action="" id="newCustomerForm">

					<label for="name">Name:</label>
					<input name="name" type="text" />

					<input type="hidden" name="action" value="addCustomer"/> <!--This hidden field, 'addCustomer' is the function triggered BY ajax -->
					<input type="submit">
					</form>
					<br/><br/>
					<div id="feedback"></div>
					<br/><br/>

					<?php 
					global $wpdb;
					$customers = $wpdb->get_results("SELECT * FROM friends;");
					echo "<table>";
					foreach($customers as $customer){
						echo "<tr>";
						echo "<td>".$customer->name."</td>"; //where 'name' is the DB field name I want
						echo "</tr>";
					}
					echo "</table>";
				 	?>

				 	<script type="text/javascript">
						jQuery('#newCustomerForm').submit(ajaxSubmit); //attach function 'ajaxSubmit', so it executes on form submission

						function ajaxSubmit(){

						var newCustomerForm = jQuery(this).serialize();

						jQuery.ajax({
						type:"POST",
						url: "/wp-admin/admin-ajax.php",
						data: newCustomerForm,
						success:function(data){
						jQuery("#feedback").html(data);
						}
						});

						return false;
						}
					</script>

				<?php endwhile; // end of the loop. ?>
				
			</div><!-- #content -->

			

			<?php get_sidebar(); ?>
			<div class="clear"></div>
			
		</div><!-- #primary -->

	</div>
<?php get_footer(); ?>

</div>