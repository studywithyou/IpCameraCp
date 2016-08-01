var utility = new Utility();

function Utility() {
    // Vars
    var self = this;
    
    var watchExecuted = false;
    
    var menuRootButtonOld = null;
    var modulePositionValue = "";
    
    // Properties
    
    // Functions public
    self.watch = function(tag, callback) {
        if (watchExecuted === false) {
            if (callback !== undefined)
                $(tag).bind("DOMSubtreeModified", callback());
            
            watchExecuted = true;
        }
    };
    
    self.linkPreventDefault = function() {
        $("a[href^='#']").on("click", "", function(event) {
            event.preventDefault();
        });
    };
    
    self.mobileCheck = function(fix) {
        var isMobile = false;
        
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            isMobile = true;
            
            if (fix === true)
                swipeFix();
        }
        
        return isMobile;
    };
    
    self.widthCheck = function(width) {
        if (window.matchMedia("(min-width: " + width + "px)").matches === true)
            return "desktop";
        else
            return "mobile";
    };
    
    self.postIframe = function(action, method, elements) {
        var iframeTag = "iframe_commands_" + (new Date()).getTime();
        
        $("<iframe>", {
            id: iframeTag,
            name: iframeTag,
            style: "display: none;"
        }).appendTo(document.body);
        
        var formTag = "form_commands_" + + (new Date()).getTime();
        
        $("<form>", {
            id: formTag,
            target: iframeTag,
            action: action,
            method: method
        }).appendTo(document.body);
        
        $.each(elements, function(key, value) {
            $("<input>", {
                type: "hidden",
                name: key,
                value: value
            }).appendTo("#" + formTag);
        });
        
        $("#" + formTag).submit();
    };
    
    self.urlParameters = function(index) {
        var pathName = window.location.pathname;
        var pathNameSplit = pathName.split("/").filter(Boolean).reverse();
        
        if (index > (pathNameSplit.length - 1))
            return "";
        else
            return pathNameSplit[index];
        
        return "";
    };
    
    self.selectWithDisabledElement = function(id, xhr) {
        var options = $(id).find("option");
        
        var disabled = false;
        var optionLength = 0;
        
        $(options).each(function(key, val) {
            var optionValue = parseInt(val.value);
            var optionText = val.text;
            var idElementSelected = parseInt(xhr.urlExtra);
            
            if (optionValue === idElementSelected) {
                disabled = true;
                optionLength = optionText.length;
            }
            else if (optionText.length < optionLength)
                disabled = false;
            
            if (disabled === true)
                $(id).find("option").eq(key).attr("disabled", true);
        });
    };
    
    self.removeElementAndResetIndex = function(element, index) {
        element.length = Object.keys(element).length;
        element.splice = [].splice;

        element.splice(index, 1);

        delete element.length;
        delete element.splice;
        
        return element;
    };
    
    self.objectToArray = function(items) {
        var array = $.map(items, function(elements) {
            return elements;
        });
        
        return array;
    };
    
    self.isIntoView = function(id) {
        if ($(id) === null)
            return false;
	
	var viewport = {
            top : $(window).scrollTop(),
            left : $(window).scrollLeft()
	};
	viewport.right = viewport.left + $(window).width();
	viewport.bottom = viewport.top + $(window).height();
	
	var bounds = $(id).offset();
        bounds.right = bounds.left + $(id).outerWidth();
        bounds.bottom = bounds.top + $(id).outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };
    
    /*self.sortableDragList = function(type, containerTag, parentList, inputsId) {
        if (type === true) {
            sortListFieldsAssignment(containerTag, inputsId);
            
            parentList.sortable({
                cursor: "move",
                cursorAt: {
                    top: 0,
                    left: 0
                },
                placeholder: "sortable_placeholder",
                tolerance: "pointer",
                revert: true,
                start: function(event, ui) {
                    ui.placeholder.height(ui.item.height());
                },
                helper: function(event, ui) {
                    var clone = $(ui).clone();
                    clone.css({position: "absolute"});
                    return clone.get(0);
                },
                stop: function(event, ui) {
                    ui.placeholder.height(0);
                    
                    sortListFieldsAssignment(containerTag, inputsId);
                }
            }).disableSelection();
        }
        else {
            if (parentList.data("ui-sortable"))
                parentList.sortable("destroy");
        }
    };*/
    
    self.sortableDragModules = function(type, inputId) {
        var columnsObject = $(".sortable_column");
        var moduleSettingsObject = $(".module_settings");
        
        if (type === true) {
            columnsObject.addClass("sortable_column_enabled");
            moduleSettingsObject.show();
            
            columnsObject.sortable({
                cursor: "move",
                cursorAt: {
                    top: 0,
                    left: 0
                },
                placeholder: "sortable_placeholder",
                tolerance: "pointer",
                revert: true,
                connectWith: ".sortable_column",
                handle: ".module_move",
                start: function(event, ui) {
                    ui.placeholder.height(ui.item.height());
                },
                helper: function(event, ui) {
                    var clone = $(ui).clone();
                    clone.css({position: "absolute"});
                    return clone.get(0);
                },
                stop: function(event, ui) {
                    ui.placeholder.height(0);
                }
            }).disableSelection();
        }
        else {
            if (columnsObject.data("ui-sortable")) {
                columnsObject.sortable("destroy");
                
                columnsObject.removeClass("sortable_column_enabled");
                moduleSettingsObject.hide();
                
                var header = new Array();
                var left = new Array();
                var center = new Array();
                var right = new Array();
                
                $.each(columnsObject, function(key, value) {
                    var panels = $(value).find(".module_settings").parent();
                    $.each(panels, function(keySub, valueSub) {
                        var id = valueSub.id.replace("panel_id_", "");
                        
                        if (key === 0)
                            header.push(id);
                        else if (key === 1)
                            left.push(id);
                        else if (key === 2)
                            center.push(id);
                        else if (key === 3)
                            right.push(id);
                    });
                });
                
                $(inputId + "Header").val(header);
                $(inputId + "Left").val(left);
                $(inputId + "Center").val(center);
                $(inputId + "Right").val(right);
            }
        }
    };
    
    self.sortableButtonModules = function(containerTag, parentList, inputsId) {
        sortModulesFieldsAssignment(containerTag, inputsId);

        $("#" + containerTag + "_button_up").off("click").on("click", "", function() {
            var current = parentList.find("input:checked").parent();
            current.prev().before(current);

            sortModulesFieldsAssignment(containerTag, inputsId);
        });

        $("#" + containerTag + "_button_down").off("click").on("click", "", function() {
            var current = parentList.find("input:checked").parent();
            current.next().after(current);

            sortModulesFieldsAssignment(containerTag, inputsId);
        });
    };
    
    self.selectOnlyOneElement = function(parentList) {
        parentList.find("input").off("click").on("click", "", function(event) {
            $.each(parentList.find("input"), function(key, value) {
                $(value).not(event.target).attr("checked", false);
            });
        });
    };
    
    self.reloadImage = function(tag) {
        var tagReplace = tag.replace("#", "");
        
        var interval = null;
        
        $(tag).on("load", function() {
            $("#reload_image_" + tagReplace).remove();
            
            $(tag).show();
            
            clearInterval(interval);
        })
        .on("error", function() {
            $(tag).hide();
            
            if ($("#reload_image_" + tagReplace).css("display") === undefined)
                $(tag).before("<img id=\"reload_image_" + tagReplace + "\" class=\"display_block margin_auto\" src=\"" + window.url.public + "/image/templates/" + window.settings.template + "/reload_image.gif\" alt=\"reload_image.gif\"/>");
            
            interval = setInterval(function() {
                if ($(tag).data("src") === undefined)
                    $(tag).data("src", $(tag).attr("src"));

                $(tag).attr("src", $(tag).data("src"));
            }, 1000);
        })
        .attr("src", $(tag).attr("src"));
    };
    
    self.fileNameFromSrc = function(attribute, extension) {
        var value = attribute.replace(/\\/g, "/");
        value = value.substring(value.lastIndexOf("/") + 1);
        
        return extension ? value.replace(/[?#].+$/, "") : value.split(".")[0];
    };
    
    // Bootstrap fix
    self.bootstrapMenuFix = function() {
        $("ul.dropdown-menu [data-toggle=dropdown]").on("click", "", function(event) {
            event.preventDefault(); 
            event.stopPropagation(); 

            if ($(this).parent().hasClass("open") === false)
                $(this).parent().addClass("open");
            else
                $(this).parent().removeClass("open");
        });
    };
    
    self.bootstrapMenuActiveFix = function(tag, menuTag) {
        var elements = $(tag).find("li").find("a");
        
        var url = window.location.href;
        
        if (url.substring(url.length - 1) === "/")
            url = url.substring(0, url.length - 1);
        
        var lastUrlParameter = url.substring(url.lastIndexOf("/") + 1);
        
        $(elements).each(function(key, value) {
            var lastHrefParameter = $(value).attr("href").substring($(value).attr("href").lastIndexOf("/") + 1);
            
            if (lastUrlParameter === "app_dev.php" || lastUrlParameter === "app.php") {
                $(elements).eq(0).parent().addClass("active");
                
                menuRootButtonOld = $(elements).eq(0).parent();
            }
            else if (lastHrefParameter === lastUrlParameter) {
                if (menuTag === true)
                    elements.parent().removeClass("active");
                
                if ($(value).parents(".dropdown") !== undefined)
                    $(value).parents(".dropdown").addClass("active");
                
                $(value).parent().addClass("active");
                
                menuRootButtonOld = $(value).parent();
            }
            else if (menuTag === false && url.indexOf("/" + lastHrefParameter + "/") === -1)
                $(value).parent().removeClass("active");
            else if (url.indexOf("/" + lastHrefParameter + "/") >= 0)
                $(value).parent().addClass("active");
        });
        
        elements.on("click", "", function() {
            if ($(this).parents(".dropdown").hasClass("active") === false && $(this).parent().find("li").hasClass("active") === false)
                elements.parent().removeClass("active");
            
            if ($(this).attr("target") === undefined)
                $(this).parent().addClass("active");
        });
        
        $(document).mouseup(function(event) {
            var container = $(".nav.navbar-nav");
            
            if (container.is(event.target) === false && container.has(event.target).length === 0) {
                container.find("li").removeClass("active");
                
                if ($(menuRootButtonOld).parents(".dropdown") !== undefined)
                    $(menuRootButtonOld).parents(".dropdown").addClass("active");

                $(menuRootButtonOld).addClass("active");
            }
        });
    };
    
    self.bootstrapAddClassIsVisibleFix = function(idTarget, idResult, classCss) {
        checkIsBlockAndAddClass(idTarget, idResult, classCss);
        
        $(window).resize(function() {
            checkIsBlockAndAddClass(idTarget, idResult, classCss);
        });
    };
    
    // Functions private
    function checkIsBlockAndAddClass(idTarget, idResult, classCss) {
        if ($(idTarget).css("display") === "block")
            $(idResult).addClass(classCss);
        else
            $(idResult).removeClass(classCss);
    }
    
    /*function sortListFieldsAssignment(containerTag, inputsId) {
        
    }*/
    
    function sortModulesFieldsAssignment(containerTag, inputsId) {
        var sortParentList = $("#" + containerTag).find("ul").eq(0).find("li");
        var sortListElements = new Array();
        
        $.each(sortParentList, function(key, value) {
            var id = $(value).attr("id").replace(containerTag + "_", "");
            
            sortListElements.push(id);
        });
        
        if ($("#" + containerTag).parent().css("display") === "none") {
            modulePositionValue = $(inputsId[0]).find("option:selected").val();
            
            $(inputsId[0]).find("option").removeAttr("selected");
            $(inputsId[1]).val("");
        }
        else {
            if (modulePositionValue !== "")
                $(inputsId[0]).find("option[value='" + modulePositionValue + "']").attr("selected", true);
            
            $(inputsId[1]).val(sortListElements);
        }
    }
    
    // Jquery mobile fix
    function swipeFix() {
        var defaults = {
            min: {
                x: 20,
                y: 20
            },
            left: $.noop,
            right: $.noop,
            up: $.noop,
            down: $.noop
        }, isTouch = "ontouchend" in document;

        $.event.props.push("touches");

        $.fn.swipe = function(options) {
            options = $.extend({}, defaults, options);

            return this.each(function() {
                var elem = $(this);
                var startX;
                var startY;
                var isMoving = false;

                function cancelTouch() {
                    elem.off("mousemove.swipe touchmove.swipe", onTouchMove);
                    startX = null;
                    isMoving = false;
                }

                function onTouchMove(e) {
                    if (isMoving) {
                        var x = isTouch ? e.touches[0].pageX : e.pageX;
                        var y = isTouch ? e.touches[0].pageY : e.pageY;

                        var dx = startX - x;
                        var dy = startY - y;

                        if (Math.abs(dx) >= (options.min.x || options.min)) {
                            cancelTouch();

                            if (dx > 0)
                                options.left();
                            else
                                options.right();
                        }
                        else if (Math.abs(dy) >= (options.min.y || options.min)) {
                            cancelTouch();

                            if (dy > 0)
                                options.up();
                            else
                                options.down();
                        }
                    }
                }

                function onTouchStart(e) {
                    startX = isTouch ? e.touches[0].pageX : e.pageX;
                    startY = isTouch ? e.touches[0].pageY : e.pageY;
                    isMoving = true;
                    elem.on("mousemove.swipe touchmove.swipe", onTouchMove);
                }

                elem.on("mousedown touchstart", onTouchStart);
            });
        };
    }
}