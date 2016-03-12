(function($) {

	$.fn.formalize = function() {
		
		alert("1");

		this.each( function() {

			$form = $(this);

			$(this).on("keyup", ".frz-required", function() {
				if ($(this).val() != "") {
					$(this).prev("label").removeClass("frz-empty");
					$(this).removeClass("frz-empty");
				} else {
					$(this).prev("label").addClass("frz-empty");
					$(this).addClass("frz-empty");
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
				var options = "<div class=\"frz-options\" style=\"width: "+($(this).width()+10)+"px;\">";		
				$(this).find("option").each(function() {

					var icon = $(this).attr("data-icon");

					if (hasSelected < 1 && idx == 1) {
						options += "<div class=\"frz-opt selected\" date-value=\""+$(this).val()+"\"><div class=\"icon ic ic-"+icon+"\"></div><div class=\"val\">"+$(this).text()+"</div></div>";
						optSelected = $(this).text();
						iconSelected = icon;
					} else {
						if ($(this).is(":selected")) {
							options += "<div class=\"frz-opt selected\" date-value=\""+$(this).val()+"\"><div class=\"icon ic ic-"+icon+"\"></div><div class=\"val\">"+$(this).text()+"</div></div>";
							optSelected = $(this).text();
							iconSelected = icon;
						} else {
							options += "<div class=\"frz-opt\" date-value=\""+$(this).val()+"\"><div class=\"icon ic ic-"+icon+"\"></div><div class=\"val\">"+$(this).text()+"</div></div>";
						}
					}
					idx += 1;
				});
				options += "</div>";

				if ($(this).hasClass("frz-icon")) {
					var code = "<div class=\"frz-select\"><div class=\"icon ic ic-"+iconSelected+"\"></div><div class=\"text\">"+optSelected+"</div><div class=\"ic ic-arrow-down\"></div></div>";
				} else {
					var code = "<div class=\"frz-select\"><div class=\"text\">"+optSelected+"</div><div class=\"ic ic-arrow-down\"></div></div>";
				}

				$(this).css("display","none");

				$(this).after(code+options);
			});

			$(this).on("click", ".frz-select", function() {
				openCloseSelect($(this))
			});

			$(this).on("click", ".frz-opt", function() {
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
				select.next(".frz-options").slideToggle(300, "swing", function() {
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

		$form.find(".frz-required[type='text']").each(function() {
			if ($(this).val() == "") {
				$(this).prev("label").addClass("frz-empty");
				$(this).addClass("frz-empty");
			}
		});

		return false;
	}

}(jQuery));