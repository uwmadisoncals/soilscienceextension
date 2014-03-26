<!-- In a child theme, all of the functions of the parent theme are present, unless overridden here -->
<?php

function cals_fetch_feed2($feed_uri,$num_items, $echo = 1, $length =-1, $exclude=''){
	//NOTE: to disable cache, go to feed.php and replace timestamp in 
	// $feed->set_cache_duration(apply_filters('wp_feed_cache_transient_lifetime', 43200, $url)); 
	$i = rand(1,5);
	// Get RSS Feed(s)
	include_once(ABSPATH . WPINC . '/feed.php');
	
	// Get a SimplePie feed object from the specified feed source.
	$rss = fetch_feed($feed_uri);
	 
	if (!is_wp_error( $rss ) ) : // Checks that the object is created correctly 
		
		//enable order by date
		$rss->enable_order_by_date(true);
		
		// Figure out how many total items there are, but limit it to $num_items. 
		$maxitems = $rss->get_item_quantity($num_items); 
	
		// Build an array of all the items, starting with element 0 (first element).
		$rss_items = $rss->get_items(0, $maxitems); 
	endif;
	
	if($echo == 1){
	
		if (count($rss_items) == 0) {
			//echo '<li>No items.</li>';
			echo 'no items';
		} else {
			foreach ( $rss_items as $item ) { 
			
				//check for excluded posts
				if($exclude!='' && $exclude == $item->get_id()){
					continue;
				}
				
				
				$featuredImageSrc = $item->get_item_tags('', 'featuredimage'); 
				
				
				$featuredImage = $featuredImageSrc[0]['data'];
				
				
				
				?>
				
				<?php  
				/*if($featuredImage) {*/
				
    				echo '<div class="newsItem fromFunctionsPHP ';
    				if(!$featuredImage) {echo 'noImage ';}
    				
    				
    				
    				
    				foreach ($item->get_categories() as $category)
						{
							echo $category->get_label()." ";
							
							
							/*$imageCat = $category->get_label();
						
						if($imageCat == "Agriculture" || $imageCat == "Food" || $imageCat == "Environment" || $imageCat == "Energy" || $imageCat == "Health" || $imageCat == "People" || $imageCat == "Communities" || $imageCat == "Events") {
							
							break;
							
						} else {
							
							
							echo "Announcements ";
							break;
						}*/
							
						}
	
		    		echo '"><div class="previousa"><div class="additionalContent">';
		    		
		    		$notdisplayed = true;
    		
    			if($featuredImage1) {
    				echo '<img src="'.$featuredImage1.'" alt="" />';
    			} else if($featuredImage) {
    				echo '<img src="'.$featuredImage.'" alt="" />';
    			} else {
    				echo '<div class="noImageSpacer"></div>';
    				/*foreach ($item->get_categories() as $category)
					{
						$imageCat = $category->get_label();
						
						if($imageCat == "Agriculture") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/agriculture-pic-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else if($imageCat == "Food") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/food-pic-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else if($imageCat == "Environment") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/environment-pic-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else if($imageCat == "Energy") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/energy-pic-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else if($imageCat == "Health") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/health-pic-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else if ($imageCat == "People" || $imageCat == "Communities") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/people-pic-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else if ($imageCat == "Events") {
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/twitter-bg-';
							echo rand(1,3);
							echo '.jpg" alt=" " />';
							break;
						} else {
							
							
							echo '<img src="';
							echo bloginfo('template_url');
							echo '/images/generalcals-bg-';
							echo $i;
							echo '.jpg" alt=" " />';
							if($i < 5) {
								$i = $i + 1;
							} else {
								$i = 1;
							}
							break;
						}
						 
						
						
					}*/
	    			
	    			
    			}
    			echo '</div>';
		    		
		    		echo '<div class="text"><div class="glyph"><div class="symbol"></div></div><div class="titleheading"><h3>';
		    		$title = $item->get_title();
					if($length != -1){
						if(strlen($title)>$length){ 
							echo substr($title,0,$length).'...'; } 
						else { 
							echo $title; 
						}
					} else { 
						echo $title; 
					}
				echo '</h3></div><div class="excerpt">';
				$content = $item->get_description(); 
    			echo $content;
				echo '</div><div class="dateheading">';
				echo $item->get_date('F j, Y');
				echo '</div><div class="hiddendate">';
				echo "-".$item->get_date('Ymd');
				echo '</div><div class="hiddengroup">';
		    	$cattemp = $item->get_category();
    			echo $cattemp->get_label();
    			echo '</div><span class="number">10</span></div>';
		    		
		    		
    		
    		
    			
    		echo '<a href="';
    		echo $item->get_permalink();
    		echo '" class="highlight" title="';
    		echo 'Posted '.$item->get_date('j F Y | g:i a');
    		echo '">Read more about ';
    		echo $item->get_title();
    		echo '<div class="loadingSpinner"><div class="progress"></div></div></a></div></div>';
    		
    		
    		/*}  else {
	    		
	    		//What to display if no image is supplied by the article
	    		
	    		echo '<div class="newsItem noImage ';
    				foreach ($item->get_categories() as $category)
						{
							echo $category->get_label()." ";
						}
	
		    		echo '"><div class="previousa"><div class="titleheading"><h3>';
		    		$title = $item->get_title();
					if($length != -1){
						if(strlen($title)>$length){ 
							echo substr($title,0,$length).'...'; } 
						else { 
							echo $title; 
						}
					} else { 
						echo $title; 
					}
				echo '</h3></div><div class="text"><div class="glyph"><div class="symbol"></div></div><div class="excerpt">';
				$content = $item->get_description(); 
    			echo $content;
				echo '</div><div class="dateheading">';
				echo $item->get_date('F j, Y');
				echo '</div><div class="hiddendate">';
				echo "-".$item->get_date('Ymd');
				echo '</div><div class="hiddengroup">';
		    	$cattemp = $item->get_category();
    			echo $cattemp->get_label();
    			echo '</div><span class="number">10</span></div><div class="additionalContent">';
		    		
		    			
		    	
    		
    		
							
    		
    		
    			
    		echo '</div><a href="';
    		echo $item->get_permalink();
    		echo '" class="highlight" title="';
    		echo 'Posted '.$item->get_date('j F Y | g:i a');
    		echo '">Read more about ';
    		echo $item->get_title();
    		echo '<div class="loadingSpinner"><div class="progress"></div></div></a></div></div>';
	    		
	    		
    		}*/
    		 ?>
    			
    		

				
			<?php }
		}

	} else {
	
		return $rss_items;
	
	}
}

function soilsextension_enqueue_scripts(){
	 $handle = 'soilsextension_scripts';
	 $src = get_theme_root_uri() . '/soilsextension/js/min/master.min.js';

	wp_register_script($handle, $src, false, false, true);

	wp_enqueue_script('soilsextension_scripts');
}

add_action('wp_enqueue_scripts', 'soilsextension_enqueue_scripts');

?>