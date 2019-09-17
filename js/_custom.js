document.addEventListener("DOMContentLoaded", function() {

	$('.logo-litera').each(function() {
		var ths = $(this);
		ths.html(ths.html().replace('SPB', '<span>SPB</span>'));
	});

	$('.top-line').after('<div class="mobile-menu d-lg-none">');
	$('.top-menu').clone().appendTo('.mobile-menu');
	$('.mobile-menu-button').click(function() {
		$('.mobile-menu').stop().slideToggle();
	});

	$('.col-item').hover(function() {
		ths = $(this);
		lnk = ths.closest('.col-item').find('h4 a');
		lnk.addClass('hover');
	}, function() {
		lnk.removeClass('hover');
	});

	$("body").prognroll({
		height: 3,
		color: "#ec1c1c",
		custom: false
	});

	$('.main-menu li').removeClass('active');
	var path = window.location.pathname;
	$('.main-menu li a').each(function() {
		var href = $(this).attr('href');
		if(path.slice(1).substring(0, href.length) === href) {
			$(this).parent('li').addClass('active');
		}
});

	
});
