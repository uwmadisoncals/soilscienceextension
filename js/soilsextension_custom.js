$( document ).ready(function() {
//alert("testing");

/*if (typeof jQuery.ui !=='undefined'){
	alert("JQuery UI loaded");
}else{
	alert("No jquery UI");
}*/

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

//for each of the matched elements,

function isInAutoc(){

var inAutoc = $(".autoc ul").text();

if inAutoc == null{
	alert( "inAutoc is null");
	}else if{
	alert( " something is in inAutoc");	
	}else{
	alert( " something else");	
	}
}


setInterval(isInAutoc,3000);

isInAutoc();

headeroverlay_hght();

}); 