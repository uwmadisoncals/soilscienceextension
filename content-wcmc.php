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
	      	//Vimeo ID
	      $the_videoid = get_field('video_id');

			//WPT Recording URL
	      $the_recording_URL = get_field('recording_URL');
			//WPT Recording iFrame
	      $the_recording_iframe = get_field('recording_iframe');
	      	//Extract src of iFrame
	      $the_recording_src = substr(htmlentities($the_recording_iframe),66,44);
	      
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

<!-- if any media, display section & title, AND run script -->	
		<?php if( $the_paper_url || $the_ppoint_url || $the_videoid ){ ?>
		
	<section class="wcmc-media">
		<h6>Project Media</h6>	

		<script>
		jQuery(document).ready(function($){
			$("#backdrop").hide();
			
			$(".item .mediaLink").click(function(evt) {
				evt.preventDefault();
				
				var mediaurl = $(this).attr('data-mediaurl');
				var mediaiframeurl = $(this).attr('data-mediaiframeurl');
				
				$("#modal").find("iframe").attr("src",mediaiframeurl);
				$("#modal").find("a.download").attr("href",mediaurl);
				$("#modal").animate({opacity: '1'},"200").css("pointer-events", "auto");
				$("#backdrop").show();
			});
			
			$('.close').hover(function() {
				$('#backdrop').css('opacity', '.25');
				}, function() {
				// on mouseout, reset the backdrop
				$('#backdrop').css('opacity', '.75');
			});
			
			$(".close").click(function(cls) {
				cls.preventDefault();
				
				$("#backdrop").hide();
				$("#modal").animate({opacity: '0'},"100").css("pointer-events", "none");
				$("#modal").find("iframe").removeAttr("src");
				$("#modal").find("a.download").removeAttr("href");
			});
			
		});
		</script>
					
		<?php }; ?>
			
			
<!-- Paper -->
		<?php  if( $the_paper_url ){  ?>
			<article class="item">
			
				<a href="#" class="mediaLink" data-mediaurl="<?php echo $the_paper_url ?>" data-mediaiframeurl="http://docs.google.com/gview?url=<?php echo $the_paper_url ?>&embedded=true"><i class="icon-paper"></i>Paper</a>
		
			</article>
		<?php }; ?>


<!-- Powerpoint -->		
		<?php  if( $the_ppoint_url ){  ?>
			<article class="item">
			
				<a href="#" class="mediaLink" data-mediaurl="<?php echo $the_ppoint_url ?>" data-mediaiframeurl="http://docs.google.com/gview?url=<?php echo $the_ppoint_url ?>&embedded=true"><i class="icon-pres"></i>Presentation</a>
						
			</article>
		<?php }; ?>


<!-- Video Embed -->		
		<?php  if( $the_videoid ){  ?>
			<article class="item video">
			
				<a href="#" class="mediaLink" data-mediaurl="https://vimeo.com/<?php echo $the_videoid ?>" data-mediaiframeurl="https://player.vimeo.com/video/<?php echo $the_videoid ?>"><i class="icon-video"></i>Video</a>
					
			</article>
		<?php }; ?>
		

<!-- Recording Embed -->		
		<?php  if( $the_recording_URL ){  ?>
			<article class="item recording">
			
				<a href="#" class="mediaLink" data-mediaurl="<?php echo $the_recording_URL ?>" data-mediaiframeurl="<?php echo $the_recording_src ?>"><i class="icon-video"></i>Recording</a>
					
			</article>
		<?php }; ?>
		
		
<!-- if there's any media, close Media section tag -->	
		<?php if( $the_paper_url || $the_ppoint_url || $the_videoid || $the_recording_URL ){ ?>
		
	</section><!-- wcmc-media -->
	
		<?php }; ?>


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
