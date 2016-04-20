<?php
/**
 * The template for displaying search forms in Twenty Eleven
 * @package WordPress
 * @subpackage CALSv1
 * @since CALS 1.0
 */
?>
	<form method="get" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
		<div class="relative">
			<label for="s" class="assistive-text"><?php _e( 'Search', 'twentyeleven' ); ?></label>
			<input type="text" class="field" name="s" value="<?php the_search_query(); ?>" id="s" placeholder="<?php esc_attr_e( 'Search', 'twentyeleven' ); ?>" x-webkit-speech />
			<input type="submit" class="submit" name="submit" id="searchsubmit" value="<?php esc_attr_e( 'Search', 'twentyeleven' ); ?>" />
			<a href="#" class="searchClear">Clear my search</a>
		</div>
	</form>
