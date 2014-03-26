$(function(){

 	var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
 			
			
 	//Redraw tiles UI
 	function reDraw(elem) {
		
		setTimeout(function() {
		
		$("#container").animate({ 
       
        opacity: 1.0
       
      }, 500 );
		
		if(arrHasDupes(mainobjs)) {
			var dupes = arrHasDupes(mainobjs);
	
		}
		
		if(arrHasDupes(descobjs)) {
			var dupes = arrHasDupes(descobjs);
			
		}

		
		if($('.newsItem.twitter')) {
			var url = $('.newsItem.twitter .titleheading a').last().attr("href");
			var text = "Learn more about how " + $('.newsItem.twitter .titleheading h3').text();
			if(url) {
				$('.newsItem.twitter .highlight').attr("href",url);
				$('.newsItem.twitter .highlight').attr("title",text);
				$('.newsItem.twitter .highlight').text(text);
			}
		}
		
		
		
		$('.newsItem').each(function(index) {
		var w = $(this);
		var t = $(this).find('.titleheading').text();
		var d = $(this).find('.excerpt').text();
		
		var ds = d.substring(0,50);
		
		if(dupes) {
			if(t == dupes || ds == dupes) {
				//$(this).hide();
				$(this).addClass("duplicate");
				dupes = "";
			}
		}
		
		
		
		$(this).find('.excerpt a').remove();
		var tempexcerpt = $(this).find('.excerpt').text();
		
		//Remove extra spaces from the beginning and end of the excerpt
		tempexcerpt = trim11(tempexcerpt);
		
		if(tempexcerpt.length == 0) {
			$(this).addClass("noexcerpt");
		} else {
			
			//tempexcerpt = tempexcerpt.replace('/&#8230','/');
			//console.log( tempexcerpt.charAt( tempexcerpt.length-1 ) );
			tempexcerpt = tempexcerpt.slice(0, -2);
			var shortexcerpt = "<p>"+tempexcerpt.substring(0,120)+"&#8230;</p>";
			$(this).find('.excerpt').html(shortexcerpt);
		}
		
			
			
		
		
		//$(".twitter").find('.excerpt').html("");
		
		
		
		
		var height1 = parseInt($(this).find('.additionalContent').height());
		var height2 = parseInt($(this).find('.text').height());
		var height3 = parseInt($(this).find('.additionalContent img').attr('height'));
		var width1 = parseInt($(this).find('.additionalContent img').attr('width'));
		var width2 = parseInt($(this).find('.additionalContent').width());
		
		
		if(!isMobile) {
		var updateheight = height1 + (height2*1.3);
		} else {
			var updateheight = height1 + (height2*1.1);
		}
			
		
		$(this).not('.customize, .noImage').find('.previousa').css("height",updateheight);
		
		if(BrowserDetect.browser != "Explorer") {
		
		var b = $(this).find('.excerpt').html();
		var h = $(this).find('.excerpt').height();
		
		
			h = h *1.3;
		
		//console.log(h);
		
		if(!isMobile) {
		
		$(this).find('.excerpt').css("height",h);
		$(this).find('.excerpt').html("");
		$(this).find('.excerpt').append("<div class='fold1'><div class='content'>"+b+"</div></div><div class='fold2' aria-hidden='true'><div class='content'>"+b+"</div></div>");
		
		$(this).find('.fold2 .content').css("margin-top",-(h/2));
		$(this).find('.fold1').css("height",h/2);
		$(this).find('.fold2').css("height",h/2);
		$(this).find('.fold2').css("-webkit-transform-origin-y",-(h/2));
		
		
		if(BrowserDetect.browser == "Chrome") {
		$(this).find('.fold1').css("-webkit-transform", "translate3d(0px, "+-(h/7)+"px, 0px) rotateX(-90deg)");
		} else {
			$(this).find('.fold1').css("-webkit-transform", "translate3d(0px, 0px, 0px) rotateX(-90deg)");
		}
		
		var h = $(this).find('.excerpt').height();

		//$(this).find('.excerpt').attr("data-height",h+'px');
		
		}
		}
		
		
	});
	
	if(!startcat) {
		startcat = "chronological";
	}
    
      $container.isotope({
        masonry: {
        columnWidth: 316
        
          //columnWidth: 1
        },
        sortBy: startcat,
        getSortData: {
          number: function( $elem ) {
            var number = $elem.hasClass('newsItem') ? 
              $elem.find('.number').text() :
              $elem.attr('data-number');
            return parseInt( number, 10 );
          },
          alphabetical: function( $elem ) {
            var name = $elem.find('h3'),
            itemText = name.length ? name : $elem;
            return itemText.text();
          },
          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
        }
      });
		
		 },500);

	}
 	//End of reDraw()
 	
 	function reIso(elem) {
		

		
	
	if(!startcat) {
		startcat = "chronological";
	}
    
      $container.isotope({
        masonry: {
        columnWidth: 316
        
          //columnWidth: 1
        },
        sortBy: startcat,
        getSortData: {
          number: function( $elem ) {
            var number = $elem.hasClass('newsItem') ? 
              $elem.find('.number').text() :
              $elem.attr('data-number');
            return parseInt( number, 10 );
          },
          alphabetical: function( $elem ) {
            var name = $elem.find('h3'),
            itemText = name.length ? name : $elem;
            return itemText.text();
          },
          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
        }
      });
		
		

	}
 	
 	//Find any duplicate article entries by title	
	function arrHasDupes( A ) {                          // finds any duplicate array elements using the fewest possible comparison
		var i, j, n;
		n=A.length;
	                                                     // to ensure the fewest possible comparisons
		for (i=0; i<n; i++) {                        // outer loop uses each item i at 0 through n
			for (j=i+1; j<n; j++) {              // inner loop only compares items j at i+1 to n
				if (A[i]==A[j]) {
				
				return A[i];
				}
				
		}	}
		return false;
	}
	
	//Trim String
	function trim11(str) {
	    str = str.replace(/^\s+/, '');
	    for (var i = str.length - 1; i >= 0; i--) {
	        if (/\S/.test(str.charAt(i))) {
	            str = str.substring(0, i + 1);
	            break;
	        }
	    }
	    return str;
	}
 
 	 var calsWPTheme = {

	    foo: function() {
	    },
	
	    bar: function() {
	    },
	    
	    init: function() {
	    	
	    	//Check for window resize and reDraw the tiles as needed.
		    var resize;
		 	$(window).resize(function() {
		 			clearTimeout(resize);
			 		resize = setTimeout(function() { reIso(); },300);
		  	});
		  	
		  	//Setup sidebar navigation event listeners
		  	$("#nav_sidebar .children").hide();
		  	
		  	$("#nav_sidebar .children").parent().find("a").css("font-weight","bold");
		  	
		  	$("#nav_sidebar .children").delay(300).slideDown(700, function() {
			  		// Animation complete.
			  });
			  
			  
			  if(Function('/*@cc_on return document.documentMode===10@*/')()){document.documentElement.className+=' ie10';}
		  	
		  			 	
		 	var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
			
			if( isMobile.any() ) {
			
			
			function slideChange(args) {
						
				$('.sliderContainer .slideSelectors .item').removeClass('selected');
				$('.sliderContainer .slideSelectors .item:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
			
			}
			
			function slideComplete(args) {
							
				/*if(!args.slideChanged) return false;
				
				$(args.sliderObject).find('.text1, .text2').attr('style', '');
				
				$(args.currentSlideObject).find('.text1').animate({
					right: '100px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');
				
				$(args.currentSlideObject).find('.text2').delay(200).animate({
					right: '50px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');*/
				
			}
			
			function sliderLoaded(args) {
					
				$(args.sliderObject).find('.text1, .text2').attr('style', '');
				
				$(args.currentSlideObject).find('.text1').animate({
					right: '100px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');
				
				$(args.currentSlideObject).find('.text2').delay(200).animate({
					right: '50px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');
				
				slideChange(args);
				
			}
			
			
			$(".fluidHeight").show();
			
			$(".collegeFeature").hide();
			$('.iosSlider').iosSlider({
					desktopClickDrag: true,
					autoSlideTimer: 9000,
					snapToChildren: true,
					onSlideComplete: slideComplete,
					autoSlide: true,
					scrollbar: true,
					scrollbarContainer: '.sliderContainer .scrollbarContainer',
					scrollbarMargin: '0',
					scrollbarBorderRadius: '1em',
					
				});

			
			
				$("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
			
			
			
				//Mobile
				$('body').addClass("mobile");
				isMobile = true;
				
				//Enable quickly scrolling to the top of the list by touching the header bar
			    $('.mobileScrollTop').click(function(){
			    		
			    	    $(".mobileScroll").animate({ scrollTop: 0 }, 400);	
			    });
			    
			    
			    //Add in mobile menu and categories markup and event listeners
			    var orignav = $(".menu-main-navigation-container").first().html();
			    
			    $('#mobile-menu-container').html(orignav);
			    var origfilter = $(".categories").first().html();
			    $('#mobile-filter-inner').html(origfilter);
			     //$(".categories").first().html("");
			    var menushown = false;
			    var filtershown = false;

    
			    $('.mobileNavTrigger').bind('touchstart', function(){
    	
    	
    	$(this).addClass("touched");
    	return false;
    });
    
    $('.mobileNavTriggerLarge').bind('touchstart', function(){
    	
    	if(menushown) {
    	
    	$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    $("#access").css("-webkit-transition", "0.3s");
    	    $("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    setTimeout(function() { $("#mobile-filter").show(); },500);
    	    
    	    menushown = false; 
    	    
    	  }
    	  
    	  if(filtershown) {
	    	  $(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
    	    $("#access").css("-webkit-transition", "0.3s");
    	    $("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    setTimeout(function() { $("#mobile-menu").show(); },500);
    	    
    	    filtershown = false;
    	  }   	
    	    return false;
    });
			    
			    $('.mobileNavTrigger').bind('touchend', function(){
			    
				    $("#mobile-filter").hide();
    	if(menushown) {
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    $("#access").css("-webkit-transition", "0.3s");
    	    $("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    setTimeout(function() { $("#mobile-filter").show(); },500);
    	    
    	    menushown = false;
    	    	    
    	} else {
    		$(".mobileNavTriggerLarge").show();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(240px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    $("#access").css("-webkit-transition", "0.3s");
    	    $("#access").css("-webkit-transform", "translate3d(240px,0,0)");
    	    
    	    menushown = true;
    	    
    	    if(filtershown) {
    	    	$(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	//$("#mobile-menu").css("-webkit-transform", "translate3d(240px,0,0)");
    	    	filtershown = false;
    	    }

    	}
    	
    	$(this).removeClass("touched");
    	
    	return false;
    });
			    
			    $('.mobileSettingsTrigger').bind('touchstart', function(){
    	
    	
    	$(this).addClass("touched");
    	   return false; 
    });
			
			    $('.mobileSettingsTrigger').bind('touchend', function(){
				   
				    $("#mobile-menu").hide();
				    
    if(filtershown) {
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
    	    $("#access").css("-webkit-transition", "0.3s");
    	    $("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    setTimeout(function() { $("#mobile-menu").show(); },500);
    	    
    	    filtershown = false;
    	  
    	} else {
    		$(".mobileNavTriggerLarge").show();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#access").css("-webkit-transition", "0.3s");
    	    $("#access").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    filtershown = true;
    	    
    	    
	    	   if(menushown) {
    	    	$(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	menushown = false;
    	    }
    	    
    	   
    	}
    	$(this).removeClass("touched");
    	return false;
    });
				
				
			} else {
				//Not Mobile
				
				
				//Add scroll event listener to allow for fixed navigation header upon scrolling
			    $(window).scroll(function() {
			    	var scrolltop = $(window).scrollTop();
			    	
				    
				    if(scrolltop >= offset) {
					    $('#access').addClass("fixedNav"); 
					    $('.collegeFeature').css("margin-top","50px");
				    } else {
					    $('#access').removeClass("fixedNav");
					    $('.collegeFeature').css("margin-top","0px");
				    }
			  	});
			  	
			  	//Scroll to the top of the page smoothly when clicking the small crest
			  	$('.totop').click(function(){
				  	    $("html, body").animate({ scrollTop: 0 }, 600);
				  	    return false;
				});
				
				$('.newsItem a.more').mouseover(function() {
					$(this).prev().addClass("highlighted");	
				});	
					
				$('.newsItem a.more').mouseout(function() {
					$(this).prev().removeClass("highlighted");	
				});	
					
				$('.newsItem a.more, .newsItem a.categor').mouseover(function() {
					$(this).parent().find('.more').show();
				});	
					
				$('.newsItem a.more, .newsItem a.categor').mouseout(function() {
					$(this).parent().find('.more').hide();	
				});	
					
					
				
				$('.newsItem .previousa a').mouseover(function() {
					
					
					if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Opera") {
						var n = $(this).parent();
						//ex = setTimeout(function() {
						$(n).find('.excerpt').slideDown();
						
						//},800)
						 
					} else {
							var n = $(this).parent();
							
							
							//ex = setTimeout(function() {
							
								$(n).removeClass("reverse");
								$(n).addClass("expand");
								
								
								$(n).attr("aria-live","true");
							
							//},1000)
					}
						
				});
					
				$('.newsItem .previousa a').mouseout(function() {
				
				
				
					if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Opera") {
					//clearTimeout(ex);
						$(this).parent().find('.excerpt').slideUp();
					} else {
					
					//clearTimeout(ex);
					
					var n = $(this).parent();
					
					$(n).addClass("reverse");
					$(n).removeClass("expand");
					$(n).attr("aria-live","false");
					
					
					}
					
					
					$(this).removeClass("focusHighlight");
					
				});
					
				$('.newsItem .previousa a').focus(function() {
				
				
					
					if(BrowserDetect.browser == "Explorer") {
						
						$(this).parent().find('.excerpt').slideDown();
						 
					} else {
							
							var n = $(this).parent();
							$(n).addClass("expand");
							$(n).removeClass("reverse");
							
							
							
							$(n).attr("aria-live","true");
					}
					
					$(this).addClass("focusHighlight");
				});
					
				$('.newsItem .previousa a').blur(function() {
					
					if(BrowserDetect.browser == "Explorer") {
					
						$(this).parent().find('.excerpt').slideUp();
					} else {
					
					var n = $(this).parent();
					$(n).addClass("reverse");
					$(n).removeClass("expand");
					$(n).attr("aria-live","false");
					
					
					}
					
					$(this).removeClass("focusHighlight");
				});

			  	
				
			}
			
		
	    }
	};

	calsWPTheme.init();
 
 
	//Declare starting variables
	
 	var filteroptions = "";
    var sortoptions = "chronological";
    var $container = $('#container');
    var nt;
    var count = 0;
    var mainobjs = [];
    var descobjs = [];
    var c = 0;
    var num = 0; //starting number for results returned in search filter
    var isMobile = false;  //Determining if you are on a mobile device (tablet or smartphone)
    var filterquery;
      var remember = "yes";
    
    //Add the browser type as a class to the body
    $('body').addClass(BrowserDetect.browser);
    
    if(BrowserDetect.OS == "iPhone/iPod") {
	    $('body').addClass("iPhone");
    } else {
    	$('body').addClass(BrowserDetect.OS);
    }
    
    
    /*var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
			
			if( isMobile.any() ) {
				$('body').addClass("mobile");
				isMobile = true;
			}*/
    
    if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome")) {
    	$('body').addClass("mobile");
    	isMobile = true;
    } 
    
    //Count the number of images in the articles section
    $('.newsItem img').each(function(index) {
    	count = count +1;
    });
    
    //Compensate for Internet Explorer offset measurement
    var offset = $('#access').offset().top;
    if(BrowserDetect.browser == "Explorer") {
	    offset = offset;
    } else {
	    offset = offset + 80;
    }
    
    
    
    
    
     
    
    
    
    
	    
    
    //Preload the images for the articles if available
    $('.newsItem').each(function(index) {
   
	    
   
	    if($(this).hasClass("Communities")) {
		    $(this).addClass("People")
	    }
	    
	    if($(this).hasClass("Communities") == false && $(this).hasClass("People") == false && $(this).hasClass("Agriculture") == false && $(this).hasClass("Energy") == false && $(this).hasClass("Environment") == false && $(this).hasClass("Events") == false && $(this).hasClass("Food") == false && $(this).hasClass("Health") == false && $(this).hasClass("social") == false) {
		    $(this).not('.customize').addClass("Announcements");
	    }
	    
	    var w = $(this);

		var tsrc = $(this).not('.customize').find('img').attr('src');
		if(BrowserDetect.browser != "Explorer") {
		//$(this).find('.excerpt').hide();
		}
		var addarray = $(this).find('.titleheading').text();
		var adddescarray = $(this).find('.excerpt').text();
		var adddescarraysmall = adddescarray.substring(0,50)
		descobjs.push(adddescarraysmall);
		mainobjs.push(addarray);
		
		//If images are associated with the content, preload those images
		if(count > 0) {
			
			var img = new Image();
	        $(img).load(function () {
	           
	            c = c + 1;
	            //console.log(c + " " + count); 
	           var per = (c/count)*100;
	           //console.log(per);
	            $('.progress').attr("style","width:"+per+"%;");
	            if(c == count) {
	            	$('.loadBar').fadeOut(300);
		            //console.log('its done');
		            
		            reDraw();
	            }
	        }).error(function () {
	            // notify the user that the image could not be loaded
	        }).attr('src', tsrc);
        
        
        
	      } else {
		      $('.loadBar').fadeOut(300);
		            //console.log('its done');
		            
		            reDraw();
	      }
		
	});

    //Initial Isotope Call
    $container.isotope({
        masonry: {
        columnWidth: 316
        
          //columnWidth: 1
        },
        sortBy: 'chronological',
        getSortData: {
          number: function( $elem ) {
            var number = $elem.hasClass('newsItem') ? 
              $elem.find('.number').text() :
              $elem.attr('data-number');
            return parseInt( number, 10 );
          },
          alphabetical: function( $elem ) {
            var name = $elem.find('h3'),
            itemText = name.length ? name : $elem;
            return itemText.text();
          },
          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
        }
      });
    
      
      var $optionSets = $('.option-set'),
          $optionLinks = $optionSets.find('a');

      //Options event listener
      $('.option-set a').click(function(){
      
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
  
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
      
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
          // changes in layout modes need extra logic
          changeLayoutMode( $this, options )
        } else {
          // otherwise, apply new options
          $container.isotope(options);
          //console.log(options);
          //localStorage.setItem("options", options);
        }
        
        return false;
      });
      
      
      //Store preference function needs to include polyfill for older browsers
      function storePrefs(key,value) {
		     if (supports_html5_storage()) {
			      // window.localStorage is available!
			      //alert(categories);
			      
			      localStorage.setItem(key, value);
			      
			     
		  		} else {
		  			
			  		// no native support for HTML5 storage :(
			  		// maybe try dojox.storage or a third-party solution
			  	}

	     }
      
      
      //Storing initial values, also needs polyfill for older browsers
      if (supports_html5_storage()) {
			      // window.localStorage is available!
			     
			      var startingcategories = localStorage.getItem("categories");
			      
			      var startcat = localStorage.getItem("sortCat");
			      if(!startcat) {
				      startcat = sortoptions;
			      } else {
			      		$('.categoriesSort a').removeClass('selected');
				     	$('.categoriesSort a').each(function(index) {
					     	if($(this).attr("data-cat") == startcat) {
						     	$(this).addClass("selected");
					     	}
					     });
					  sortingoptions = startcat;
					  sortoptions = startcat;
					  
					  if(isMobile) {
					  		
						  //var origfilter = $(".categories").first().html();
						  //$('#mobile-filter-inner').html(origfilter);
					  }
			      }
			      
			      if(startingcategories) {
				      var startingcategoriesarray = startingcategories.split(',');
					      
					      	for (var i = 0; i < startingcategoriesarray.length; i++) {
						      	
					     		if(startingcategoriesarray[i]) {
					     			
					     			if(startingcategoriesarray.length > 0) {
					     				
				              			var filterquery = filterquery +', .'+ startingcategoriesarray[i];
				              			
				              		} else {
					              		var filterquery = filterquery;
				              		}
				              		
				              		//$('.categories .topics a').addClass("selected");
				              		
				              		$('.categories .topics a').each(function(index) {
					              			var tempcat = $(this).attr('data-cat');
					              			//alert(tempcat);
					              			if(tempcat == startingcategoriesarray[i]) {
						              			$(this).removeClass("selected");
						              			
					              			}
					              	});
					              	
					              	
				              		
				              	}
				              	
				              	if(isMobile) {
					              			
										  var origfilter = $(".categories").first().html();
										  $('#mobile-filter-inner').html(origfilter);
									  }
				    
				            
				           } 
				           
			
		             
		              //If mobile, hide main filter menu
				      if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome") || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
				     
					      var filterquery = filterquery +', .customize, .duplicate';
					      reDraw();
					  }
		             
		             var categories = startingcategoriesarray;
		             
		             var completestartingquery = '".newsItem:not(.'+filterquery +')"';
		             filteroptions = completestartingquery;
		             
		             
		             } else {
				      var categories = new Array;
				      categories.push('duplicate');
				      
				      //If mobile, hide main filter menu
				      if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome")) {
				      		
					       categories.push('customize');
					       //categories.push('duplicate');
					       reDraw();
				      }
			      }

				  	
			     	//$container.isotope({ filter: completestartingquery });
			     	if(startcat && !startingcategories) {
			     	
			     	$container.isotope({ filter: ".newsItem:not(.duplicate)" });
			     	
			     	setTimeout(function() {
			     	$container.isotope({ 
			      		
			      		sortBy: startcat,
				        getSortData: {
				          number: function( $elem ) {
				            var number = $elem.hasClass('newsItem') ? 
				              $elem.find('.number').text() :
				              $elem.attr('data-number');
				            return parseInt( number, 10 );
				          },
				          alphabetical: function( $elem ) {
				            var name = $elem.find('h3'),
				            itemText = name.length ? name : $elem;
				            return itemText.text();
				          },
				          
				          chronological: function( $elem ) {
				            var number = $elem.find('.hiddendate').text();
				            return parseInt( number );
				          },
				          grouped: function( $elem ) {
				            var groupname = $elem.find('.hiddengroup').text();
				            return groupname;
				          }
				        } 
			        });
			         },300);
			        
			        }
			        
			        if(!startcat && startingcategories) {
			     	$container.isotope({ filter: completestartingquery });			        
			        }
			     	
			     	
			     	if(startcat && startingcategories) {
			     	setTimeout(function() {
			     		
			     		
			     		$container.isotope({ 
			      		filter: completestartingquery,
			      		sortBy: startcat,
				        getSortData: {
				          number: function( $elem ) {
				            var number = $elem.hasClass('newsItem') ? 
				              $elem.find('.number').text() :
				              $elem.attr('data-number');
				            return parseInt( number, 10 );
				          },
				          alphabetical: function( $elem ) {
				            var name = $elem.find('h3'),
				            itemText = name.length ? name : $elem;
				            return itemText.text();
				          },
				          chronological: function( $elem ) {
				            var number = $elem.find('.hiddendate').text();
				            return parseInt( number );
				          },
				          grouped: function( $elem ) {
				            var groupname = $elem.find('.hiddengroup').text();
				            return groupname;
				          }
				        } 
			        });
			        
			        },300);
			        
			        }

			     	
			      			      
			   			      //alert(startingcategories);
			      
		  		} else {
	      // no native support for HTML5 storage :(
		  // maybe try dojox.storage or a third-party solution
	  }
	     
	  //Apply stored preferences, also needs polyfill for older browsers
	  function applyPrefs(startingcategoriesarray) {
	     	//alert(startingcategoriesarray.length);
		 	for (var i = 0; i < startingcategoriesarray.length; i++) {
	     		
	     		if(startingcategoriesarray[i]) {
	     			if(startingcategoriesarray.length > 0) {
              			var filterquery = filterquery +', .'+ startingcategoriesarray[i];
              		} else {
	              		var filterquery = filterquery;
              		}
              	}
    
             }
             
             
             var categories = startingcategoriesarray;
             
             var completestartingquery = '".newsItem:not(.'+filterquery +')"';
             
		  
	     	$container.isotope({ filter: completestartingquery });
	     	filteroptions = completestartingquery;
	    
	     }
	           
      
      

      
      //Categories Event Listener
      $('.categories .topics a.categor, #mobile-filter .topics a.categor').click(function() {
      	
      	if($(this).hasClass('selected')) {
      		var cat = $(this).attr('data-cat');
      		$(this).removeClass('selected');
	        categories.push(cat);
	        	       
	     } else {
		    var cat = $(this).attr('data-cat');
      		
      		$(this).addClass('selected');
	        
	        categories.splice(categories.indexOf(cat), 1);
	      	     
	     }
	     	//alert(categories);
	     	for (var i = 0; i < categories.length; i++) {
	     		
	     		if(categories[i]) {
	     			if(categories.length > 0) {
              			var filterquery = filterquery +', .'+ categories[i];
              		} else {
	              		var filterquery = filterquery;
              		}
              	}
    
             }
             
             var completefilterquery = '".newsItem:not(.'+filterquery +')"';
             filteroptions = completefilterquery;
	     	

		  	
	     	$container.isotope({ 
      		filter: completefilterquery,
      		sortBy: sortoptions,
	        getSortData: {
	          number: function( $elem ) {
	            var number = $elem.hasClass('newsItem') ? 
	              $elem.find('.number').text() :
	              $elem.attr('data-number');
	            return parseInt( number, 10 );
	          },
	          alphabetical: function( $elem ) {
	            var name = $elem.find('h3'),
	            itemText = name.length ? name : $elem;
	            return itemText.text();
	          },
	          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
	          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
	        } 
	        
        });
	     	if(remember == "yes") {
	     		storePrefs("categories",categories);
	     	}
	     	return false;
      });
      
      //Resorting content when a category is clicked
      $('.categoriesSort a').click(function() {
      	console.log(filteroptions);
      
      	$(".categoriesSort a").removeClass("selected");
      	$(this).addClass("selected");
      	
      	var cat = $(this).attr('data-cat');
      	
      	sortoptions = cat;
      	$container.isotope({ 
      		filter: filteroptions,
      		sortBy: cat,
	        getSortData: {
	          number: function( $elem ) {
	            var number = $elem.hasClass('newsItem') ? 
	              $elem.find('.number').text() :
	              $elem.attr('data-number');
	            return parseInt( number, 10 );
	          },
	          alphabetical: function( $elem ) {
	            var name = $elem.find('h3'),
	            itemText = name.length ? name : $elem;
	            return itemText.text();
	          },
	          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
	          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
	        } 
        });
        
        if(remember == "yes") {
	     		storePrefs("sortCat",cat);
	     	}
        return false;
      });
      
      //Browser test to see if html5 local storage is supported
      function supports_html5_storage() {
		  try {
		    return 'localStorage' in window && window['localStorage'] !== null;
		  } catch (e) {
		    return false;
		  }
	}
      
      //Remember Setting event listener
     $('.remembersettings').click(function() {
     	
	     var r = $(this).attr("data-rem");
	     if(r == "yes") {
		     $(this).removeClass("selected");
		     $(this).attr("data-rem", "no");
		     remember = "no";
	     } else {
		      $(this).addClass("selected");
		     $(this).attr("data-rem", "yes");
		     remember = "yes";
	     }
	     
	     return false;
	  });
	     
     //Previous event listener for the hide and show options menu.  ** Deprecated ** 
	 $('.catOptions').click(function() {
	     	$(this).next().toggle();
	     	
	     	return false;
	     });
	     
	   var countFeatures = 0;
	   
	   //Check to see if the homepage feature exists
	   var checkcol = $('.collegeFeature').html();
	   if(checkcol) {
	   
	   
	   //Feature setup
	  $('.collegeFeature li').each(function(index) {
			   countFeatures = countFeatures + 1;
			   $(this).attr("data-count",countFeatures);
			   $(this).css("z-index",countFeatures);
			   $(this).addClass('active');
			   if($(this).attr("data-count") != 1) {
				   //$(this).css("display","none");
				   $(this).removeClass('active');
			   }
		   });
		   
		 
		var duration = 12000;
		var halfd = duration /2;
		var time1,time2;
    	time1 = setInterval(function() {nextSlide();},duration);
    	
    	//Feature slide rotation functionality
    	function nextSlide(elem) {
    	
    	rotateTimer();
    	
    	 var widthvar = $(".collegeFeature ul li").width();
    	
    	if($('.collegeFeature li:last-child').hasClass('active')) {
		   $(".collegeFeature ul").animate({ 
		        left: "0px"
		      }, 500 );
		      
		   } else {
			   $(".collegeFeature ul").animate({ 
		        left: "-="+widthvar+"px"
		      }, 500 );
		   }

	    	
	    	$('.collegeFeature li').each(function(e) {
			  
			   if($(this).hasClass('active') && ($(this).attr("data-count") < countFeatures)) {
			   	 var t = $(this);
				  $(t).next().addClass('active');
				  $(t).removeClass('active');
				  
				   return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == countFeatures)) {
				  var t = $(this);
				  $(t).removeClass('active');
				   
				    $('.collegeFeature li:first-child').addClass('active');
				   return false; 
			   }
		   });
		   }
		   

    	//Rotate Timer functionality
        function rotateTimer() {
        	
        	clearTimeout(time2);
        	
        if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Firefox") {
	     
	     } else {
        	
        	$('.collegeFeature .timer1').stop().rotate('0deg');
		    $('.collegeFeature .timer2').stop().rotate('0deg');
		    
	      
	       $('.collegeFeature .timer2').animate({rotate: '180deg'}, halfd, 'linear');
	       time2 = setTimeout(function() {        
	       		$('.collegeFeature .timer1').animate({rotate: '180deg'}, halfd, 'linear', function() {
		       		
		       		//rotateTimer();
	       		});
	       		
	       		
	       },halfd);
	       
	       }
	       
	     }
	     
	   
	     rotateTimer();

	     $('.collegeFeature .next').click(function() {
	     
	     	     
	     if(!sliderpaused) {
	     	clearTimeout(time1);
	     	time1 = setInterval(function() {nextSlide($(this));},duration);
	     	rotateTimer();
	     }
		    var widthvar = $(".collegeFeature ul li").width();
	     	
	    	
	    	$('.collegeFeature li').each(function(index) {
			   
			   if($(this).hasClass('active') && ($(this).attr("data-count") < countFeatures)) {
			   	  var t = $(this);
			   	  
				  $(t).next().addClass('active');
				  $(t).removeClass('active');
				  
				  $(".collegeFeature ul").animate({ 
					  left: "-="+widthvar+"px"
		        	}, 500 );
				   
				  return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == countFeatures)) {
				  var t = $(this);
				  $(t).removeClass('active');
				  
				   $('.collegeFeature li:first-child').addClass('active');
				   
				   $(".collegeFeature ul").animate({ 
					   left: "0px"
		        	}, 500 );
				   
				   return false; 
			   }
			   
			    
			   
			   
		   });
		   
		   		   
		   return false;
	     });
	     
	     
	     $('.collegeFeature .previous').click(function() {
	     	//console.log(mainslider);
	     	if(!sliderpaused) {
		     	clearTimeout(time1);
		     	time1 = setInterval(function() {nextSlide(this);},duration);
		     	rotateTimer();
	     	}
	     	
		     var widthvar = $(".collegeFeature ul li").width();
	    	
	    	$('.collegeFeature li').each(function(index) {
			   
			   if($(this).hasClass('active') && ($(this).attr("data-count") != 1)) {
			   	 var t = $(this);
				  $(t).prev().addClass('active');
				  $(t).removeClass('active');
				  
				  $(".collegeFeature ul").animate({ 
					  left: "+="+widthvar+"px"
		        	}, 500 );
				   
				   return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == 1)) {
				  var t = $(this);
				  $(t).removeClass('active');
				   
				   
				    $('.collegeFeature li:last-child').addClass('active');
				    
				     $(".collegeFeature ul").animate({ 
					     left: "-2814px"
					     }, 500 );

				   return false; 
			   }
		   });
		   
		   

		   return false;
	     });
	     
	     var sliderpaused = false;
	     
	     //Pausing and playing the feature slides
	     $('.collegeFeature .timer a').click(function() {
	     	if(!sliderpaused) {
		     	clearTimeout(time1);
		     	clearTimeout(time2);
		     	
		     	//$('.collegeFeature .timer1').stop();
		     	//$('.collegeFeature .timer2').stop();
		     	
		     	$('.collegeFeature .timer1').stop().animate({rotate: '0deg'}, 200, 'linear');
				       setTimeout(function() {        
				       		$('.collegeFeature .timer2').stop().animate({rotate: '0deg'}, 200, 'linear', function() {
					       		
					       		//rotateTimer();
				       		});
				       		
				       		
				       },200);
		     	
		     	$(this).addClass("paused");
		     	sliderpaused = true;
		     	storePrefs("mainslider","paused");
	     	} else {
		     	rotateTimer();
		     	time1 = setInterval(function() {nextSlide();},duration);
		     	
		     	$(this).removeClass("paused");
		     	storePrefs("mainslider","play");
		     	sliderpaused = false;
	     	}
	     
	     
	     	return false;
	     });
	     
	     //Save the paused state to html5 local storage
	     if (supports_html5_storage()) {
	     	var mainslider = localStorage.getItem("mainslider");
		      if(mainslider == "paused") {
				    clearTimeout(time1);
			     	clearTimeout(time2);
			     	
			     	$('.collegeFeature .timer1').stop();
			     	$('.collegeFeature .timer2').stop();
			     	
			     	
			     	
			     	$(".collegeFeature .timer a").addClass("paused");
			     	sliderpaused = true;
			     	} else {
				  mainslider = "play";
				  }
				  
		}
		
		if(isMobile) {
					clearTimeout(time1);
			     	clearTimeout(time2);
			     	
			     	$('.collegeFeature .timer1').stop();
			     	$('.collegeFeature .timer2').stop();
			     	
			     	
			     	
			     	$(".collegeFeature .timer a").addClass("paused");
		}
		
		}
		
		//Search input field functionality
		$("#s").attr("autocomplete","off");
		
		$("#s").keydown(function(event) {
			
			

			if(event.keyCode == 40) {
			event.preventDefault();
			$(".filtered .visible").first().find('a').focus();
			$(".filtered .visible").first().addClass("focused");				
				
			}
		});
		
		
		//Auto Complete Functionality
		
		$(".filtered li").keydown(function(event) {
			
			if(event.keyCode == 38) {
						event.preventDefault();
				
						
				
												
						num = parseInt($(".filtered .focused").attr("data-counted")) - 1;
						
						$(".filtered .visible").each(function(index) {
							
							if($(this).attr("data-counted") == num) {
								
								$(this).find('a').focus();
								$(".filtered .focused").removeClass("focused");
								$(this).addClass("focused");
								//num = parseInt($(this).attr("data-counted")) + 1;
								return false;
							}
						});
						
				
				
				
				
				
			}
		
			
			
			if(event.keyCode == 40) {
						event.preventDefault();
				
						
				
						
						
						num = parseInt($(".filtered .focused").attr("data-counted")) + 1;
						
						$(".filtered .visible").each(function(index) {
							
							if($(this).attr("data-counted") == num) {
								
								
								$(this).find('a').focus();
								$(".filtered .focused").removeClass("focused");
								$(this).addClass("focused");
								//num = parseInt($(this).attr("data-counted")) + 1;
								return false;
							}
						});
						
				
				
				
				
				
			}
		});
		
		
		//Beta loading spinner - currently set to only appear in Chrome Browser
		if(BrowserDetect.browser != "Chrome") {
		
			$(".loadingSpinner").hide();
			
			
		
		} else {
			$(".loadingSpinner").hide();
			
			$(".newsItem .previousa .highlight").click(function () {
				
				$(this).addClass('loading');
				$(this).find('.loadingSpinner').show();
			});
		}
		
				
		
		//Regular Expression Search Filter Auto Complete
		$("#s").keyup(function () {
			var filter = $(this).val(), count = 0;
			var resultscounted = 0;
			if(filter == "boredom") {
			       eegg();
		    }
		            
			$(".filtered:first li").each(function () {
		        if ($(this).text().search(new RegExp(filter, "i")) < 0) {$(this).addClass("hidden"); $(this).removeClass("visible"); 
			       
			        
		        } else {
				
					
					
					//$(".cleartrigger").fadeIn(300);
				/*$('.instructions').fadeOut('fast', function() {
		        		// Animation complete
					
		     		 });*/
				
		            $(this).removeClass("hidden");
		            $(this).addClass("visible");
		            
		            $(".filtered .visible").each(function(index) {
					$(this).attr("data-counted",resultscounted);
					resultscounted = resultscounted + 1;
					
					
					});
		            
		            count++;
		           
		            
		        }
		    });
		    $("#filter-count").text(count);
		    if(count > 0) {
			            $(".filtered").show();
			            $("#s").addClass("notEmpty");
			            //$(".searchClear").show();
		            } else {
		            $("#s").removeClass("notEmpty");
			            $(".filtered").stop().fadeOut(300);
			            
		            }
		          if(filter.length > 0) {
			        $(".searchClear").show();
		        }  else {
			        $(".searchClear").hide();
		        }
		            
    	});
    	
    	//Check for search complete to be ignored and hide
    	setInterval(function() {
    		
			var v = $("#s").val();
			if(v != "") {
			
				var filter = $("#s").val(), count = 0;
				var resultscounted = 0;
			if(filter == "boredom") {
			       eegg();
		    }
		            
			$(".filtered:first li").each(function () {
		        if ($(this).text().search(new RegExp(filter, "i")) < 0) {$(this).addClass("hidden"); $(this).removeClass("visible"); 
			       
			        
		        } else {
				
					
					
					//$(".cleartrigger").fadeIn(300);
				/*$('.instructions').fadeOut('fast', function() {
		        		// Animation complete
					
		     		 });*/
				
		            $(this).removeClass("hidden");
		            $(this).addClass("visible");
		            
		            $(".filtered .visible").each(function(index) {
					$(this).attr("data-counted",resultscounted);
					resultscounted = resultscounted + 1;
					
					
					});
		            
		            count++;
		           
		            
		        }
		    });
		    $("#filter-count").text(count);
		    if(count > 0) {
		    		$("#s").addClass("notEmpty");
			            $(".filtered").show();
			            //$(".searchClear").show();
		            } else {
		            	$("#s").removeClass("notEmpty");
			            $(".filtered").stop().fadeOut(300);
			            
			            
		            }
		         if(filter.length > 0) {
			        $(".searchClear").show();
		        }  else {
			        $(".searchClear").hide();
		        }
			}
		},1000);
    	
    	//take action upon user leaving the search input field
    	$("#s").blur(function () {
    		var v = $(this).attr("value");
    		
    		if(v == "") {
	    		$(".filtered").fadeOut(300);
	    		$(".searchClear").hide();
	    		//$(".cleartrigger").fadeOut(300);
	    		
	    	}
	    });
	    
	    //Clear the search results and hide suggested searches
	    $(".searchClear").click(function() {
		   	 $("#s").attr("value","");
		   	 $("#s").removeClass("notEmpty");
		   	 $(".filtered").fadeOut(300);
	    		$(".searchClear").hide();
	    		
	    		return false;
	    });
		
		//Easter Egg - Type "boredom" into search to activate
		var eeggused = "no";
		function eegg() {
			if(eeggused == "no") {
			eeggused = "yes";
			var KICKASSVERSION='2.0';
			var s = document.createElement('script'); 
			s.type='text/javascript'; 
			document.body.appendChild(s); 
			s.src='//hi.kickassapp.com/kickass.js';
			void(0);
			}
		}
		
		//Mobile Helper Functions
		(function(document){

	window.MBP = window.MBP || {}; 
	
	// Fix for iPhone viewport scale bug 
	// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
	
	MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
	MBP.ua = navigator.userAgent;
	
	MBP.scaleFix = function () {
	  if (MBP.viewportmeta && /iPhone|iPad/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
	    MBP.viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
	    document.addEventListener("gesturestart", MBP.gestureStart, false);
	  }
	};
	MBP.gestureStart = function () {
	    MBP.viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
	};
	
	
	// Hide URL Bar for iOS and Android by Scott Jehl
	// https://gist.github.com/1183357
	
	MBP.hideUrlBar = function () {
		var win = window,
			doc = win.document;
	
		// If there's a hash, or addEventListener is undefined, stop here
		if( !location.hash || !win.addEventListener ){
	
			//scroll to 1
			window.scrollTo( 0, 1 );
			var scrollTop = 1,
	
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
	
			win.addEventListener( "load", function(){
				setTimeout(function(){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}, 0);
			}, false );
		}
	};
	
	
	// Fast Buttons - read wiki below before using
	// https://github.com/shichuan/mobile-html5-boilerplate/wiki/JavaScript-Helper
	
	MBP.fastButton = function (element, handler) {
	    this.element = element;
	    this.handler = handler;
	    if (element.addEventListener) {
	      element.addEventListener('touchstart', this, false);
	      element.addEventListener('click', this, false);
	    }
	};
	
	MBP.fastButton.prototype.handleEvent = function(event) {
	    switch (event.type) {
	        case 'touchstart': this.onTouchStart(event); break;
	        case 'touchmove': this.onTouchMove(event); break;
	        case 'touchend': this.onClick(event); break;
	        case 'click': this.onClick(event); break;
	    }
	};
	
	MBP.fastButton.prototype.onTouchStart = function(event) {
	    event.stopPropagation();
	    this.element.addEventListener('touchend', this, false);
	    document.body.addEventListener('touchmove', this, false);
	    this.startX = event.touches[0].clientX;
	    this.startY = event.touches[0].clientY;
	    this.element.style.backgroundColor = "rgba(0,0,0,.7)";
	};
	
	MBP.fastButton.prototype.onTouchMove = function(event) {
	    if(Math.abs(event.touches[0].clientX - this.startX) > 10 || 
	       Math.abs(event.touches[0].clientY - this.startY) > 10    ) {
	        this.reset();
	    }
	};
	
	MBP.fastButton.prototype.onClick = function(event) {
	    event.stopPropagation();
	    this.reset();
	    this.handler(event);
	    if(event.type == 'touchend') {
	        MBP.preventGhostClick(this.startX, this.startY);
	    }
	    this.element.style.backgroundColor = "";
	};
	
	MBP.fastButton.prototype.reset = function() {
	    this.element.removeEventListener('touchend', this, false);
	    document.body.removeEventListener('touchmove', this, false);
	    this.element.style.backgroundColor = "";
	};
	
	MBP.preventGhostClick = function (x, y) {
	    MBP.coords.push(x, y);
	    window.setTimeout(function (){
	        MBP.coords.splice(0, 2);
	    }, 2500);
	};
	
	MBP.ghostClickHandler = function (event) {
	    for(var i = 0, len = MBP.coords.length; i < len; i += 2) {
	        var x = MBP.coords[i];
	        var y = MBP.coords[i + 1];
	        if(Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
	            event.stopPropagation();
	            event.preventDefault();
	        }
	    }
	};
	
	if (document.addEventListener) {
	    document.addEventListener('click', MBP.ghostClickHandler, true);
	}
	                            
	MBP.coords = [];
	
	
	// iOS Startup Image
	// https://github.com/shichuan/mobile-html5-boilerplate/issues#issue/2
	
	MBP.splash = function () {
	    var filename = navigator.platform === 'iPad' ? 'h/' : 'l/';
	    document.write('<link rel="apple-touch-startup-image" href="/img/' + filename + 'splash.png" />' );
	};
	
	
	// Autogrow
	// http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html
	
	MBP.autogrow = function (element, lh) {
	
	    function handler(e){
	        var newHeight = this.scrollHeight,
	            currentHeight = this.clientHeight;
	        if (newHeight > currentHeight) {
	            this.style.height = newHeight + 3 * textLineHeight + "px";
	        }
	    }
	
	    var setLineHeight = (lh) ? lh : 12,
	        textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : 
	                         getComputedStyle(element, null).lineHeight;
	
	    textLineHeight = (textLineHeight.indexOf("px") == -1) ? setLineHeight :
	                     parseInt(textLineHeight, 10);
	
	    element.style.overflow = "hidden";
	    element.addEventListener ? element.addEventListener('keyup', handler, false) :
	                               element.attachEvent('onkeyup', handler);
	};
	
})(document);
		MBP.hideUrlBar();
	
	
		//Determine if the user is using iOS5 or iOS6
		var ua = navigator.userAgent;
		var isiOS5 = /iPhone OS 5/i.test(ua);
		var isiOS6 = /iPhone OS 6/i.test(ua);


		//Solve mobile web app scrolling bug that moves the header and footer during springback
		if(isiOS5 || isiOS6) {
		document.body.addEventListener('touchstart', function(event){
		var obj=document.getElementsByTagName("div");
			var i = 0;
			for (i=0;i<=obj.length;i++)
			{
				var mainid = obj[i].className;
				if(mainid == "mobileScroll") {
					
					var scroll = obj[i].scrollTop;
					var windowsize = window.innerHeight;
					var combine = scroll + windowsize;

					

					if(obj[i].scrollTop <= 0) {
						obj[i].scrollTop = 1;
						
					}

					if(combine == obj[i].scrollHeight || combine > obj[i].scrollHeight) {
						
						obj[i].scrollTop = obj[i].scrollTop-1;
					}
					break;
				}
				
			}
	}, false);
	} else {
			//not iOS5 or iOS6
		}

		//If you are an admin you can press esc to edit a page on any single content page.
		if($('.post-edit-link').html()) {
		
	$(document).keyup(function(event) {
			
			

			if(event.keyCode == 27) {
			event.preventDefault();
			var url = $('.post-edit-link').first().attr("href");	
			window.location = url;			
				
			}
		});
	}
});

