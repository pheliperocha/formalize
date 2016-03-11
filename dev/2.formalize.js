(function($) {

	$.fn.formalize = function() {
		
		alert("1");

		this.each( function() {

			$form = $(this);

			$(this).on("keyup", ".fr-required", function() {
				if ($(this).val() != "") {
					$(this).prev("label").removeClass("fr-empty");
					$(this).removeClass("fr-empty");
				} else {
					$(this).prev("label").addClass("fr-empty");
					$(this).addClass("fr-empty");
				}
			});

			$(this).on("focusin", "input, textarea, select", function() {
				$(this).prev("label").addClass("active");
				$(this).next(".hint").addClass("active");
			});

			$(this).on("focusout", "input, textarea, select", function() {
				$(this).prev("label").removeClass("active");
				$(this).next(".hint").removeClass("active");
			});

			$(this).submit(function( event ) {

				$checked = checkForm($form);

				if ($checked == true) {
					return true;
				} else {
					event.preventDefault();
				}
			});

			$(this).find("select").each(function() {

				var hasSelected = $(this).find("option[selected]").length;

				var optSelected = "";
				var iconSelected = "";
				var idx = 1;
				var options = "<div class=\"fr-options\" style=\"width: "+($(this).width()+10)+"px;\">";		
				$(this).find("option").each(function() {

					var icon = $(this).attr("data-icon");

					if (hasSelected < 1 && idx == 1) {
						options += "<div class=\"fr-opt selected\" date-value=\""+$(this).val()+"\"><div class=\"icon ic ic-"+icon+"\"></div><div class=\"val\">"+$(this).text()+"</div></div>";
						optSelected = $(this).text();
						iconSelected = icon;
					} else {
						if ($(this).is(":selected")) {
							options += "<div class=\"fr-opt selected\" date-value=\""+$(this).val()+"\"><div class=\"icon ic ic-"+icon+"\"></div><div class=\"val\">"+$(this).text()+"</div></div>";
							optSelected = $(this).text();
							iconSelected = icon;
						} else {
							options += "<div class=\"fr-opt\" date-value=\""+$(this).val()+"\"><div class=\"icon ic ic-"+icon+"\"></div><div class=\"val\">"+$(this).text()+"</div></div>";
						}
					}
					idx += 1;
				});
				options += "</div>";

				if ($(this).hasClass("fr-icon")) {
					var code = "<div class=\"fr-select\"><div class=\"icon ic ic-"+iconSelected+"\"></div><div class=\"text\">"+optSelected+"</div><div class=\"ic ic-arrow-down\"></div></div>";
				} else {
					var code = "<div class=\"fr-select\"><div class=\"text\">"+optSelected+"</div><div class=\"ic ic-arrow-down\"></div></div>";
				}

				$(this).css("display","none");

				$(this).after(code+options);
			});

			$(this).on("click", ".fr-select", function() {
				openCloseSelect($(this))
			});

			$(this).on("click", ".fr-opt", function() {
				var select = $(this).parent().prev();
				
				openCloseSelect(select);
				
				/*
				$(this).parent().prevAll("select").val($(this).attr("date-value"));
				$(this).parent().find(".selected").removeClass("selected");
				$(this).parent().prev().find(".text").html($(this).text());

				$(this).parent().prev().find(".icon").removeClass(function(i, c) {
					
				});

				$(this).addClass("selected");
				*/
			});

			function openCloseSelect(select) {
				select.next(".fr-options").slideToggle(300, "swing", function() {
					if (select.hasClass("opened")) {
						select.removeClass("opened");
						select.find(".ic-arrow-up").addClass("ic-arrow-down").removeClass("ic-arrow-up");
					} else {
						select.addClass("opened");
						select.find(".ic-arrow-down").addClass("ic-arrow-up").removeClass("ic-arrow-down");
					}
				});
			}

		});

	}

	function checkForm($form) {

		$form.find(".fr-required[type='text']").each(function() {
			if ($(this).val() == "") {
				$(this).prev("label").addClass("fr-empty");
				$(this).addClass("fr-empty");
			}
		});

		return false;
	}

}(jQuery));