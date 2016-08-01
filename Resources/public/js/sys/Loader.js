var loader = new Loader();

function Loader() {
    // Vars
    var self = this;
    
    // Properties
    
    // Functions public
    self.create = function(type) {
        if (type === "image")
            $("<div id=\"request_loader\" class=\"display_none shadow\"><img src=\"" + window.url.public + "/image/templates/" + window.settings.template + "/request_loader.gif\" alt=\"request_loader.gif\"/></div>").appendTo(document.body);
        
        $(window).on("beforeunload", "", function() {
            if ($("#request_loader").css("display") === undefined || $("#request_loader").css("display") === "none") {
                if (type === "font")
                    $("<div id=\"request_loader\" class=\"shadow\"><span class=\"fa fa-refresh fa-spin fa-3x fa-fw\"></span></div>").appendTo(document.body);
                else if (type === "image")
                    $("#request_loader").show();
            }
        });
    };
    
    self.show = function() {
        if ($("#backdrop").css("display") === undefined) {
            $(document.body).addClass("overflow_hidden");
            $("<div id=\"backdrop\" class=\"fade in\"></div>").appendTo(document.body);
            
            $("#loader").show();
        }
    };
    
    self.hide = function() {
        $("#loader").hide();
        
        $("#backdrop").remove();
        $(document.body).removeClass("overflow_hidden");
    };
    
    self.remove = function() {
        var requestLoader = setInterval(function() {
            if ($("#request_loader").css("display") !== undefined || $("#request_loader").css("display") !== "none") {
                $("#request_loader").remove();

                clearInterval(requestLoader);
            }
        }, 1000);
    };
    
    // Functions private
}