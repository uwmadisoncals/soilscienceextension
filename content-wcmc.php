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
	      $the_videoid = get_field('video_id');
	      $more_info = get_field('more');
	 ?>




<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	 <?php	if ( has_post_thumbnail() ) { ?>
		 					<div class="featuredImage">
		    					<?php echo get_the_post_thumbnail($page->ID, 'large'); ?>
		 					</div>
						<?php } ?>
	<header class="entry-header">
	
		<h1 class="entry-title"><?php the_title(); ?></h1>
		
		<p class="wcmc-date">
			<?php
			$date = DateTime::createFromFormat('Ymd', get_field('date'));
			echo $date->format('Y');
			?>
		</p>
		
		<h2 class="wcmc-subtitle"><?php the_field('subtitle'); ?></h2>
		
		<?php if( have_rows('authors') ): ?>
			<ul class="wcmc-author wcmc-list">
				<?php while( have_rows('authors') ): the_row(); ?>
					<li><?php the_sub_field('name'); ?></li>
				<?php endwhile; ?>
			</ul>
		<?php 
		endif;
		if( have_rows('org') ): 
		?>
			<ul class="wcmc-org wcmc-list">
				<?php while( have_rows('org') ): the_row(); ?>
					<li><?php the_sub_field('org_names'); ?></li>
				<?php endwhile; ?>
			</ul>
		<?php endif; ?>
		
<?php 
//logit($the_paper,'$the_paper: ');
 ?>

		
	<section class="wcmc-media">

	<!-- if there's any media, display title -->	
		<?php if( $the_paper_url || $the_ppoint_url || $the_videoid || $more_info ){ ?>
			<h6>Project Media</h6>
		<?php }; ?>
		
	<!-- Paper -->
		<?php  if( $the_paper_url ){  ?>
			<article class="item paper">
				<a href="<?php echo $the_paper_url ?>"><img class="paper" src="https://cdn3.iconfinder.com/data/icons/brands-applications/512/File-512.png" /></a>
		<!-- <img src="<?php echo get_stylesheet_directory_uri();?>/images/icon-paper.svg" alt="black paper icon"> -->
			</article>
		<?php }; ?>

	<!-- Powerpoint -->		
		<?php  if( $the_ppoint_url ){  ?>
			<article class="item ppoint">
				<a href="<?php echo $the_ppoint_url ?>" ><img class="powerpoint" src="https://cdn3.iconfinder.com/data/icons/brands-applications/512/File-512.png" /></a>
		<!-- <img src="<?php echo get_stylesheet_directory_uri();?>/images/icon-ppoint.svg" alt="black powerpoint icon"> -->

			</article>
		<?php }; ?>

	<!-- Video Embed -->		
		<?php  if( $the_videoid ){  ?>
			<article class="item video">
				<p><?php echo $the_videoid ?></p>
				<img class="video" src="https://cdn3.iconfinder.com/data/icons/brands-applications/512/File-512.png" />
		<!-- <img src="<?php echo get_stylesheet_directory_uri();?>/images/icon-video.svg" alt="black video launcher icon"> -->

			</article>
		<?php }; ?>
	
	<!-- More Info -->	
		<?php  if( $more_info ){  ?>
			<article class="item more">
				<a href="<?php echo $more_info ?>"><img class="more info" src="https://cdn3.iconfinder.com/data/icons/brands-applications/512/File-512.png" /></a>
		<!-- <img src="<?php echo get_stylesheet_directory_uri();?>/images/icon-more.svg" alt="black paper icon"> -->

			</article>
		<?php }; ?>
		
	</section><!-- wcmc-media -->


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
		<?php edit_post_link( __( 'Edit', 'twentyeleven' ), '<span class="edit-link">', '</span>' ); ?>
	</footer><!-- .entry-meta -->
	
</article><!-- #post-<?php the_ID(); ?> -->
