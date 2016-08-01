/* global utility, loader */

var flashBag = new FlashBag();

function FlashBag() {
    // Vars
    var self = this;
    
    // Properties
    
    // Functions public
    $(window).scroll(function() {
        if (utility.isIntoView("#flashBag") === true)
            $("#flashBag_popup").hide();
    });
    
    self.show = function() {
        if ($("#flashBag").css("display") === "none" && $("#flashBag").find(".content").html() !== "") {
            $("#flashBag").show();
            
            $("#flashBag_close").on("click", "", function() {
                $("#flashBag").hide();
            });
        }
        
        if (utility.isIntoView("#flashBag") === false) {
            if ($("#flashBag_popup").css("display") === "none") {
                var flashBagClass = $("#flashBag").attr("class");
                var flashBagHtml = $("#flashBag").find(".content").html();

                $("#flashBag_popup").attr({class: flashBagClass});
                $("#flashBag_popup").addClass("shadow");
                $("#flashBag_popup").find(".content").html(flashBagHtml);
                $("#flashBag_popup").show();
                
                $("#flashBag_popup_close").on("click", "", function() {
                    $("#flashBag_popup").hide();
                    $("#flashBag").hide();
                });
            }
        }
    };
    
    self.hide = function() {
        $("#flashBag").find(".content").html("");
        $("#flashBag").hide();
        
        $("#flashBag_popup").find(".content").html("");
        $("#flashBag_popup").hide();
    };
    
    self.sessionActivity = function() {
        if (window.session.activity !== "") {
            $("#flashBag").attr({class: "alert alert-warning"});
            $("#flashBag").find(".content").html(window.session.activity);
            
            loader.hide();
            self.show();
        }
    };
    
    // Functions private
}