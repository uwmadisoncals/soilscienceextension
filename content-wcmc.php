<?php
/**
 * The template for displaying content in the single.php template
 * @package WordPress
 * @subpackage CALSv1
 * @since CALS 1.0
 */
?>

	<?php $the_paper = get_field('paper');
	      	$the_paper_url = $the_paper['url'];
	      	$the_paper_title = $the_paper['title'];
	      //var_dump($file);
	      $the_ppoint = get_field('presentation');
	      	$the_ppoint_url = $the_ppoint['url'];
	      	$the_ppoint_title = $the_ppoint['title'];
	      
	 ?>




<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	 <?php	if ( has_post_thumbnail() ) { ?>
		 					<div class="featuredImage">
		    					<?php echo get_the_post_thumbnail($page->ID, 'large'); ?>
		 					</div>
						<?php } ?>
	<header class="entry-header">
		<h1 class="entry-title"><?php the_title(); ?></h1>
		<div class="wcmc-author-date"> <span>By: <?php the_field("author_name1") ?> , 


			<?php
			$date = DateTime::createFromFormat('Ymd', get_field('date'));
			echo $date->format('m/d/Y');
			?></span>
			
		  

		 </div>
<?php 
//logit($the_paper,'$the_paper: ');
 ?>

	<div class="paper">
		<!-- Display the paper PDF Hyperlink icon-->
		<div class="wcmc-paper-icon">
			<?php  if( $the_paper_url ){  ?>

			<a href="<?php echo $the_paper_url ?>" ><img src="<?php echo get_stylesheet_directory_uri();?>/images/small-medium-pdf-icon.svg" alt="charcoal black pdf icon" height="90px"></a>
			
			<?php }; ?>

		</div>
		<div class="cf"></div>

		<!-- Display the paper caption -->
		<div class="wcmc-paper-name">
		<?php 
			if( $the_paper_url ){
			 ?>
			<a href="<?php echo $the_paper_url ?>">View the paper</a>
			<?php } ?>

			
		</div>
		<div class="cf"></div>
	</div>



	<div class="ppoint">
		<!-- Display the ppoint PDF Hyperlink icon-->
		<div class="wcmc-ppoint-icon">
			<?php  if( $the_ppoint_url ){  ?>

			<a href="<?php echo $the_ppoint_url ?>" ><img src="<?php echo get_stylesheet_directory_uri();?>/images/small-medium-pdf-icon.svg" alt="charcoal black pdf icon" height="90px"></a>
			
			<?php }; ?>

		</div>
		<div class="cf"></div>

		<!-- Display the powerpoint caption -->
		<div class="wcmc-ppoint-name">
			<?php  if( $the_ppoint_url ){  ?>
			<a href="<?php echo $the_ppoint_url ?>">View the powerpoint</a>
			<?php } ?>
		</div>
		<div class="cf"></div>
	</div>






		<?php if ( 'post' == get_post_type() ) : ?>
		<div class="entry-meta">
			<?php twentyeleven_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php endif; ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php the_content(); ?>
		<?php wp_link_pages( array( 'before' => '<div class="page-link"><span>' . __( 'Pages:', 'twentyeleven' ) . '</span>', 'after' => '</div>' ) ); ?>
	</div><!-- .entry-content -->

	<footer class="entry-meta">
		<?php
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( __( ', ', 'twentyeleven' ) );

			/* translators: used between list items, there is a space after the comma */
			$tag_list = get_the_tag_list( '', __( ', ', 'twentyeleven' ) );
			if ( '' != $tag_list ) {
				$utility_text = __( 'This entry was posted in %1$s and tagged %2$s by <a href="%6$s">%5$s</a>. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'twentyeleven' );
			} elseif ( '' != $categories_list ) {
				$utility_text = __( 'This entry was posted in %1$s by <a href="%6$s">%5$s</a>. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'twentyeleven' );
			} else {
				$utility_text = __( 'This entry was posted by <a href="%6$s">%5$s</a>. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'twentyeleven' );
			}

			printf(
				$utility_text,
				$categories_list,
				$tag_list,
				esc_url( get_permalink() ),
				the_title_attribute( 'echo=0' ),
				get_the_author(),
				esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) )
			);
		?>
		<?php edit_post_link( __( 'Edit', 'twentyeleven' ), '<span class="edit-link">', '</span>' ); ?>

		<?php if ( get_the_author_meta( 'description' ) && ( ! function_exists( 'is_multi_author' ) || is_multi_author() ) ) : // If a user has filled out their description and this is a multi-author blog, show a bio on their entries ?>
		<div id="author-info">
			<div id="author-avatar">
				<?php echo get_avatar( get_the_author_meta( 'user_email' ), apply_filters( 'twentyeleven_author_bio_avatar_size', 68 ) ); ?>
			</div><!-- #author-avatar -->
			<div id="author-description">
				<h2><?php printf( __( 'About %s', 'twentyeleven' ), get_the_author() ); ?></h2>
				<?php the_author_meta( 'description' ); ?>
				<div id="author-link">
					<a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" rel="author">
						<?php printf( __( 'View all posts by %s <span class="meta-nav">&rarr;</span>', 'twentyeleven' ), get_the_author() ); ?>
					</a>
				</div><!-- #author-link	-->
			</div><!-- #author-description -->
		</div><!-- #author-info -->
		<?php endif; ?>
	</footer><!-- .entry-meta -->
</article><!-- #post-<?php the_ID(); ?> -->
