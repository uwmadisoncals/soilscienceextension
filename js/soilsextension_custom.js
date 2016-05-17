$( document ).ready(function() {
//alert("testing");


var noNewsExists = $('.noNews').length;


if ( !noNewsExists == 0){
	$( ".news_heading_wrapper" ).addClass( "invisible" ); //noNews does exist in markup
	$( ".news_container" ).addClass( "invisible" );

};



// Fix the height of the main div based upon the number of rows in the Main navigation. Supports up to 3 rows.
var headeroverlay_hght = function (){
	var currnt_ho_hght = (parseInt($("div.headeroverlay").css("height")));
	if( currnt_ho_hght>40 && currnt_ho_hght <= 80){
		$("div#main").css("padding-top",40);
	}else if(currnt_ho_hght>80 && currnt_ho_hght <=120){
		$("div#main").css("padding-top",80);
	}else if(currnt_ho_hght>120 && currnt_ho_hght < 160){
		$("div#main").css("padding-top",120);
	};
};

/*var SoilsExtAutoComplete = function(){
	$('#wcmc-ajax').autocomplete({
		source:availableTags
	});

}; */

//turn off the autocomplete in these form fields
$("#s, #autocomplete1, #yearAuthorField").attr("autocomplete","off");

//slickwrap
//$('.wrapReady').slickWrap();


if($('body').is(".home.blog")){

	//get number of news items and add css class accordingly
	var child_count = $( '.news_container .news_item' ).length;

	if(child_count == 2){
		$(".news_item").addClass("count_2");
	}else if( child_count == 1 ){
		$(".news_item").addClass("count_1");
	}

}



headeroverlay_hght();

}); 