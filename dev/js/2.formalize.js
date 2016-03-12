/*jslint browser: true*/
/*global $, jQuery, alert*/

(function ($) {
     "use strict";
     $.fn.formalize = function () {

          this.each(function () {

               var thisForm, input_selector, wrap_prefix, btn_prefix, wrap_suffix, validate_field, validate_keypress, radio_checkbox, hiddenDiv, text_area_selector, range_type, range_mousedown, left;

               thisForm = $(this);
               input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';

               // Update labels of text fields
               $(this).find(input_selector).each(function (index, element) {
                    if ($(element).val().length > 0 || element.autofocus || $(this).attr('placeholder') !== undefined || $(element)[0].validity.badInput === true) {
                         $(this).siblings('label, i').addClass('active');
                    } else {
                         $(this).siblings('label, i').removeClass('active');
                    }
               });

               /*******************************
               * Add prefix, affix and suffix *
               *******************************/

               wrap_prefix = "input.prefix ~ input, button.prefix ~ input";
               btn_prefix = "input.prefix, button.prefix";

               wrap_suffix = "input ~ input.suffix, input ~ button.suffix";

               // Set prefix wrapper
               $(this).find(wrap_prefix).each(function (index, element) {

                    var prefix = $(element).siblings(btn_prefix);
                    $(prefix).wrapAll('<span class="frz-btn-prefix">');
                    $(element).addClass("frz-affix");

               });

               // Set suffix wrapper
               $(this).find(wrap_suffix).each(function () {

                    var $this, affix;

                    $this = $(this);
                    affix = $this.siblings("input");

                    $this.wrapAll('<span class="frz-btn-suffix">');
                    affix.addClass("frz-affix");

               });

               // Set affix wrapper
               $(this).find("input.frz-affix").each(function () {

                    var $this, label;

                    $this = $(this);
                    label = $this.next("label");

                    label.andSelf().siblings("i.prefix, i.suffix").andSelf().wrapAll('<span class="frz-input-affix">');
                    // add character to fix a bug
                    label.before(" ");
               });


               // Text based inputs

               // Add active if form auto complete
               $(this).on('change', input_selector, function () {

                    // Remove active if input is empty
                    if ($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
                         $(this).siblings('label').addClass('active');
                    }

                    validate_field($(this));
               });

               /**********
               * Counter *
               **********/

               $(this).find(input_selector).not("input[type=button], input[type=submit]").each(function () {
                    var $this, parent, hasTagInfo, hasCounter, hasMaxLength, hasMinLength;

                    $this = $(this);
                    parent = $this.parent();
                    hasTagInfo = parent.has("span.tagInfo").length;
                    hasCounter = $this.hasClass("frz-counter");
                    hasMaxLength = ($this.attr("maxlength") || $this.attr("max"));
                    hasMinLength = ($this.attr("minlength") || $this.attr("min"));

                    if (!hasTagInfo) {
                         parent.append("<span class=\"tagInfo\"></span>");
                    }

                    if (hasMinLength && hasMaxLength) {
                         $this.addClass("frz-counter");
                         parent.append("<span class=\"tagCount\">" + hasMinLength + " / " + hasMaxLength + "</span>");
                    } else if (hasMaxLength) {
                         $this.addClass("frz-counter");
                         parent.append("<span class=\"tagCount\">0 / " + hasMaxLength + "</span>");
                    } else if (hasMinLength) {
                         $this.addClass("frz-counter");
                         parent.append("<span class=\"tagCount\">" + hasMinLength + " / *</span>");
                    }

               });

               $(this).find(".frz-counter").each(function () {
                    var $this, parent, hasTagCount;

                    $this = $(this);
                    parent = $this.parent();
                    hasTagCount = parent.find(".tagCount").length;

                    if (!hasTagCount) {
                         parent.append("<span class=\"tagCount\">0</span>");
                    }
               });

               $(this).on('keyup keydown', ".frz-counter", function () {
                    var $this, type, maxLength, minLength, val;

                    $this = $(this);
                    type = $(this).attr("type");
                    maxLength = (($this.attr("maxlength") >= 0 || $this.attr("max") >= 0) ? ($this.attr("maxlength") || $this.attr("max")) : "*");
                    minLength = (($this.attr("minlength") >= 0 || $this.attr("min") >= 0) ? ($this.attr("minlength") || $this.attr("min")) : 0);
                    val = $this.val().length;

                    // When has only the class frz-counter
                    if (minLength === 0 && maxLength === "*") {

                         $this.parent().find(".tagCount").html(val);

                         // When has only the attribute minLength
                    } else if (minLength > 0 && maxLength === "*") {

                         if (val < minLength) {

                              $this.parent().find(".tagCount").html(val + " < " + minLength + " / *");

                         } else if (val >= minLength) {

                              $this.parent().find(".tagCount").html(val + " / *");

                         }

                         // When has only the attribute maxLength
                    } else if (minLength === 0 && maxLength >= 0) {

                         $this.parent().find(".tagCount").html(val + " / " + maxLength);

                         // When has both attributes, minLength and maxLength
                    } else if (minLength > 0 && maxLength >= 0) {

                         if (val < minLength) {

                              $this.parent().find(".tagCount").html(val + " < " + minLength + " / " + maxLength);

                         } else {

                              $this.parent().find(".tagCount").html(val + " / " + maxLength);

                         }

                    }

                    validate_keypress($this);
               });

               /*******************************
               * HTML DOM FORM RESET handling *
               *******************************/

               $(this).on('reset', function (e) {
                    var formReset = $(e.target);
                    if (formReset.is('form')) {
                         formReset.find(input_selector).removeClass('valid').removeClass('invalid');
                         formReset.find(input_selector).each(function () {
                              if ($(this).attr('value') === '') {
                                   $(this).siblings('label, i').removeClass('active');
                              }
                         });

                         // Reset select
                         formReset.find('select').each(function () {
                              var reset_text = formReset.find('option[selected]').text();
                              formReset.siblings('input.select-dropdown').val(reset_text);
                         });
                    }
               });


               /*************************************
               *  Add active when element has focus *
               *************************************/
               $(this).on('focus', input_selector, function () {
                    $(this).siblings('label, i').addClass('active');
               });

               $(document).on('blur', input_selector, function () {
                    var $inputElement = $(this);

                    // Remove active when aren't in focus and with not content
                    if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
                         $inputElement.siblings('label, i').removeClass('active');
                    }

                    validate_field($inputElement);
               });

               /**********************************
               *  Radio and Checkbox focus class *
               **********************************/
               radio_checkbox = 'input[type=radio], input[type=checkbox]';
               $(this).on('keyup.radio', radio_checkbox, function (e) {
                    // TAB, check if tabbing to radio or checkbox.
                    if (e.which === 9) {
                         $(this).addClass('tabbed');
                         var $this = $(this);
                         $this.one('blur', function (e) {
                              $(this).removeClass('tabbed');
                         });
                         return;
                    }
               });

               /************************
               *  TextArea Auto Resize *
               ************************/

               $(this).find("textarea").addClass("formalize-textarea");

               hiddenDiv = $('.hiddendiv').first();
               if (!hiddenDiv.length) {
                    hiddenDiv = $('<div class="hiddendiv common"></div>');
                    $(this).append(hiddenDiv);
               }
               text_area_selector = '.formalize-textarea';

               function textareaAutoResize($textarea) {
                    // Set font properties of hiddenDiv
                    var fontFamily, fontSize, content;
                    
                    fontFamily = $textarea.css('font-family');
                    fontSize = $textarea.css('font-size');

                    if (fontSize) { hiddenDiv.css('font-size', fontSize); }
                    if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }

                    if ($textarea.attr('wrap') === "off") {
                         hiddenDiv.css('overflow-wrap', "normal")
                              .css('white-space', "pre");
                    }

                    hiddenDiv.text($textarea.val() + '\n');
                    content = hiddenDiv.html().replace(/\n/g, '<br>');
                    hiddenDiv.html(content);


                    // When textarea is hidden, width goes crazy.
                    // Approximate with half of window size

                    if ($textarea.is(':visible')) {
                         hiddenDiv.css('width', $textarea.width());
                    } else {
                         hiddenDiv.css('width', $(window).width() / 2);
                    }

                    $textarea.css('height', hiddenDiv.height());
               }

               $(text_area_selector).each(function () {
                    var $textarea = $(this);
                    if ($textarea.val().length) {
                         textareaAutoResize($textarea);
                    }
               });

               $(this).on('keyup keydown autoresize', text_area_selector, function () {
                    textareaAutoResize($(this));
               });

               /****************
               *  File Input  *
               ****************/

               $(this).find("input[type=\"file\"]").each(function () {
                    var placeholder, multiple, path_wrapper;
                    
                    placeholder = ($(this).attr("placeholder") || $(this).data("placeholder"));
                    multiple = $(this).attr("multiple");

                    if (placeholder === undefined && multiple === undefined) {
                         placeholder = "Upload file";
                    } else if (placeholder === undefined && multiple) {
                         placeholder = "Upload one or more files";
                    }

                    path_wrapper = "<div class=\"file-path-wrapper\"><input class=\"file-path validate\" type=\"text\" placeholder=\"" + placeholder + "\"></div>";
                    $(this).parent().after(path_wrapper);
               });

               $(this).on('change', 'input[type="file"]', function () {
                    var col, path_input, files, file_names, i;
                    
                    col = $(this).closest('.col');
                    path_input = col.find('input.file-path');
                    files      = $(this)[0].files;
                    file_names = [];
                    
                    for (i = 0; i < files.length; i += 1) {
                         file_names.push(files[i].name);
                    }
                    path_input.val(file_names.join(", "));
                    path_input.trigger('change');
               });

               /****************
               *  Range Input  *
               ****************/

               range_type = 'input[type=range]';
               range_mousedown = false;

               $(this).find(range_type).each(function () {
                    var thumb = $('<span class="thumb"><span class="value"></span></span>');
                    $(this).after(thumb);
               });

               $(this).on('change', range_type, function (e) {
                    var thumb = $(this).siblings('.thumb');
                    thumb.find('.value').html($(this).val());
               });

               $(this).on('input mousedown touchstart', range_type, function (e) {
                    var thumb, width;
                    
                    thumb = $(this).siblings('.thumb');
                    width = $(this).outerWidth();

                    // If thumb indicator does not exist yet, create it
                    if (thumb.length <= 0) {
                         thumb = $('<span class="thumb"><span class="value"></span></span>');
                         $(this).after(thumb);
                    }

                    // Set indicator value
                    thumb.find('.value').html($(this).val());

                    range_mousedown = true;
                    $(this).addClass('active');

                    if (!thumb.hasClass('active')) {
                         thumb.animate({
                              width: 30,
                              height: 30,
                              top: -28
                         }, 300, function () {});
                    }

                    if (e.type !== 'input') {
                         if (e.pageX === undefined || e.pageX === null) {//mobile
                              left = e.originalEvent.touches[0].pageX - $(this).offset().left;
                         } else { // desktop
                              left = e.pageX - $(this).offset().left;
                         }
                         if (left < 0) {
                              left = 0;
                         } else if (left > width) {
                              left = width;
                         }
                         thumb.addClass('active').css('left', left);
                    }

                    thumb.find('.value').html($(this).val());
               });

               $(this).on('mouseup touchend', range_type, function () {
                    range_mousedown = false;
                    $(this).removeClass('active');
               });

               $(this).on('mousemove touchmove', range_type, function (e) {
                    var thumb, left, width;
                    
                    thumb = $(this).siblings('.thumb');
                    
                    if (range_mousedown) {
                         if (!thumb.hasClass('active')) {
                              thumb.animate({
                                   width: 30,
                                   height: 30,
                                   top: -28
                              }, 300, function () {});
                         }
                         if (e.pageX === undefined || e.pageX === null) { //mobile
                              left = e.originalEvent.touches[0].pageX - $(this).offset().left;
                         } else { // desktop
                              left = e.pageX - $(this).offset().left;
                         }
                         
                         width = $(this).outerWidth();

                         if (left < 0) {
                              left = 0;
                         } else if (left > width) {
                              left = width;
                         }
                         thumb.addClass('active').css('left', left);
                         thumb.find('.value').html(thumb.siblings(range_type).val());
                    }
               });

               $(this).on('mouseout touchleave', range_type, function () {
                    if (!range_mousedown) {
                         var thumb = $(this).siblings('.thumb');

                         if (thumb.hasClass('active')) {
                              thumb.animate({
                                   width: 0,
                                   height: 0,
                                   top: 10
                              }, 300, function () {});
                         }
                         thumb.removeClass('active');
                    }
               });

               /***********
               *  Select  *
               ***********/

               // Create the elements
               $(this).find("select").each(function () {
                    var $this, isMultiple, content, currentSelected, parentB;
                    
                    $this = $(this);
                    isMultiple = $(this).attr("multiple");

                    if (!isMultiple) {
                         content = "<ul class=\"dropdown-content\">";
                         currentSelected = $this.find(':selected').text();
                    } else {
                         content = "<ul class=\"dropdown-content multiple-select-dropdown\">";

                         currentSelected = "";
                         $this.find("option:checked").each(function () {
                              currentSelected += $(this).text() + ", ";
                         });

                         currentSelected = currentSelected.replace(/,\s*$/, "");

                    }

                    $this.wrap("<div class=\"select-wrapper\">");
                    $this.before("<span class=\"caret\">▼</span>");
                    $this.before("<input type=\"text\" class=\"select-dropdown\" readonly=\"true\" value=\"" + currentSelected + "\">");

                    parentB = $this;
                    $this.find("option").each(function () {
                         var $this, parentA, isSelected, disabled, liSelect, checkSelect;
                         
                         $this = $(this);
                         parentA = $this.parent();
                         isSelected = $this.is(":selected");

                         if (!parentB.is(parentA)) {
                              content += "<li class=\"optgroup\"><span>" + parentA.attr("label") + "</span></li>";
                         }

                         parentB = parentA;

                         disabled = "";
                         if ($this.attr("disabled")) {
                              disabled = "disabled";
                         }

                         liSelect = "";
                         checkSelect = "";
                         if (isSelected) {
                              liSelect = "active";
                              checkSelect = "checked";
                         }

                         if (!isMultiple) {
                              content += "<li data-value=\"" + $this.val() + "\" class=\"" + disabled + "\"><span>" + $this.text() + "</span></li>";
                         } else {
                              content += "<li data-value=\"" + $this.val() + "\" class=\" " + disabled + " " + liSelect + " \"><span><input type=\"checkbox\" " + checkSelect + " " + disabled + "><label></label>" + $this.text() + "</span></li>";
                         }
                    });

                    content += "</ul>";

                    $this.before(content);
               });

               // When click on select
               $(this).on("click", ".select-dropdown", function () {
                    var $this, width, dropdown;
                    
                    $this = $(this);
                    width = $this.css("width");
                    dropdown = $this.next(".dropdown-content");

                    dropdown.css("top", "0px");
                    dropdown.css("width", width);
                    dropdown.slideToggle();

                    if (dropdown.hasClass("actived")) {
                         dropdown.removeClass("actived");
                    } else {
                         dropdown.addClass("actived");
                    }
               });

               // When click in one valid option, except when its a multiple select
               $(this).on("click", ".dropdown-content:not(.multiple-select-dropdown) li:not(.optgroup, .disabled)", function () {
                    var $this, text, value, parent;
                    
                    $this = $(this);
                    text = $this.text();
                    value = $this.attr("data-value");
                    parent = $this.parent();
                    
                    parent.parent().find("select").val(value);
                    parent.prev(".select-dropdown").val(text);

                    parent.slideToggle();

                    if (parent.hasClass("actived")) {
                         parent.removeClass("actived");
                    } else {
                         parent.addClass("actived");
                    }
               });

               // When click in one valid option when its a multiple select
               $(this).on("click", ".multiple-select-dropdown li:not(.optgroup, .disabled)", function () {
                    var $this, value, checkbox, ulParent, selectWrapper, optionsTxt;
                    
                    $this = $(this);
                    value = $this.attr("data-value");
                    checkbox = $this.find("input[type=\"checkbox\"]");
                    ulParent = $this.parent();
                    selectWrapper = ulParent.parent();

                    if ($this.hasClass("active")) {
                         $this.removeClass("active");
                         checkbox.prop("checked", false);
                         selectWrapper.find("select option[value='" + value + "']").prop("selected", false);
                    } else {
                         $this.addClass("active");
                         checkbox.prop("checked", true);
                         selectWrapper.find("select option[value='" + value + "']").prop("selected", true);
                    }

                    optionsTxt = "";
                    selectWrapper.find("select option:checked").each(function () {
                         optionsTxt += $(this).text() + ", ";
                    });

                    optionsTxt = optionsTxt.replace(/,\s*$/, "");

                    ulParent.prev(".select-dropdown").val(optionsTxt);
               });

               // When click outside the select
               $(document).on("click", function (event) {
                    if (!$(event.target).closest('.dropdown-content').length && !$(event.target).is('.dropdown-content').length && !$(event.target).is('.select-dropdown')) {

                         var dropdownContent = thisForm.find(".dropdown-content.actived");

                         dropdownContent.slideToggle();

                         if (dropdownContent.hasClass("actived")) {
                              dropdownContent.removeClass("actived");
                         } else {
                              dropdownContent.addClass("actived");
                         }
                    }
               });

               // Validations of values
               validate_field = function (object) {
                    var hasRequired, hasMaxLenght, hasMinLenght, type, val, regex;

                    hasRequired = object.attr("required");
                    hasMaxLenght = parseInt((object.attr("maxlength") || object.attr("max")), 10);
                    hasMinLenght = parseInt(object.attr("min"), 10);
                    type = object.attr("type");
                    val = object.val();

                    if (hasRequired) {
                         if (val === "") {
                              object.removeClass('valid');
                              object.addClass('invalid');
                              object.parent().find(".tagInfo").html("Required field!");

                              return false;
                         } else {
                              object.removeClass('invalid');
                              object.addClass('valid');
                              object.parent().find(".tagInfo").html("");
                         }
                    }

                    if (type === "email") {
                         regex = /^([\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4})?$/;
                         if (regex.test(val)) {
                              object.removeClass('invalid');
                              object.addClass('valid');
                              object.parent().find(".tagInfo").html("");
                         } else {
                              object.removeClass('valid');
                              object.addClass('invalid');
                              object.parent().find(".tagInfo").html("Invalid email!");
                         }
                    }
               };

               // Validations on keypress event
               validate_keypress = function (object) {
                    var lenght, maxLength, minLength;

                    lenght = object.val().length;

                    maxLength = ((object.attr("maxlength") >= 0 || object.attr("max") >= 0) ? (object.attr("maxlength") || object.attr("max")) : "*");
                    minLength = ((object.attr("minlength") >= 0 || object.attr("min") >= 0) ? (object.attr("minlength") || object.attr("min")) : "0");

                    if (maxLength !== "*" || minLength > "0") {

                         if (lenght < minLength) {

                              object.removeClass('valid');
                              object.addClass('invalid');
                              object.parent().find(".tagInfo").html("Can't be less than " + minLength);

                         } else if (lenght > maxLength) {

                              object.removeClass('valid');
                              object.addClass('invalid');
                              object.parent().find(".tagInfo").html("Can't be more than " + maxLength);

                         } else {

                              object.removeClass('invalid');
                              object.addClass('valid');
                              object.parent().find(".tagInfo").html("");

                         }
                    }

               };

          });

     };

}(jQuery));

$(document).ready(function () {
     "use strict";
     $(".formalize").formalize();

});