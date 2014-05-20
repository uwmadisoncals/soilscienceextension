<?php
/*
*Template Name: Input Submition Page
 */

get_header(); ?>


	<div id="main">

		<div id="primary">
		
			<div id="content" role="main">

				
					<div class="form-signin">
					    	<h2>Input Title</h2>
						<div class="control-group">
							<input type="text" required="required" name="title" class="input-block-level" placeholder="Input Title">
							<button class="btn btn-large" id="next">Next</button>
						</div>		
					</div>
				<p><?php echo get_stylesheet_directory_uri() . '/js/inputtitle_submit.js' ?></p>
			</div><!-- #content -->
			<?php get_sidebar(); ?>
			<div class="clear"></div>
			
		</div><!-- #primary -->

	</div>
<?php get_footer(); ?>

</div>