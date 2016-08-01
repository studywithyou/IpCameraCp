/* global utility, loader, flashBag */

var ajax = new Ajax();

function Ajax() {
    // Vars
    var self = this;
    
    // Properties
    
    // Functions public
    self.send = function(url, method, data, callbackBefore, callbackSuccess, callbackError, callbackComplete) {
        loader.show();
        
        if (window.session.activity === "")
            flashBag.hide();
        
        $.ajax({
            url: url,
            method: method,
            data: data,
            dataType: "json",
            cache: false,
            headers: {
                'Content-Type': "application/json",
                charset: "utf-8"
            },
            timeout: 5000,
            beforeSend: function() {
                if (callbackBefore !== null)
                    callbackBefore();
            },
            success: function(xhr) {
                if (callbackSuccess !== null)
                    callbackSuccess(xhr);
                
                loader.hide();
                flashBag.show();
            },
            error: function(xhr, statusText) {
                loader.hide();
                flashBag.hide();
                
                if (statusText === "timeout")
                    self.send(url, method, data, callbackBefore, callbackSuccess, callbackError, callbackComplete);
                else {
                    if (callbackError !== null)
                        callbackError(xhr);
                }
            },
            complete: function() {
                if (callbackComplete !== null)
                    callbackComplete();
            }
        });
    };
    
    self.reply = function(xhr, idTarget) {
        var reply = "";
        
        if ($(idTarget).css("display") !== undefined)
            $(idTarget).find("*[required='required']").parents(".form-group").removeClass("has-error");

        if ($.isEmptyObject(xhr.response) === true) {
            $("#flashBag").attr({class: "alert alert-danger"});
            
            reply = "<p>" + window.text.ajaxConnectionError + "</p>";
        }
        
        if (xhr.response === undefined) {
            $("#flashBag").attr({class: "alert alert-danger"});

            reply = xhr;
        }
        else {
            if (xhr.response.messages !== undefined) {
                if (xhr.response.messages.error !== undefined) {
                    $("#flashBag").attr({class: "alert alert-danger"});

                    reply = "<p>" + xhr.response.messages.error + "</p>";
                }
                else if (xhr.response.messages.success !== undefined) {
                    $("#flashBag").attr({class: "alert alert-success"});

                    reply = "<p>" + xhr.response.messages.success + "</p>";
                }
            }

            if (xhr.response.errors !== undefined) {
                $("#flashBag").attr({class: "alert alert-danger"});

                var list = "<ul>";

                if (typeof(xhr.response.errors) !== "string") {
                    var errors = xhr.response.errors;

                    $.each(errors, function(key, value) {
                        if (typeof(value[0]) === "string" && $.isEmptyObject(value) === false && key !== "token") {
                            var object = $(idTarget).find("*[id*='"+ key + "']")[0];

                            $(object).parents(".form-group").addClass("has-error");

                            list += "<li>" + $(object).prev().html() + ": " + value[0] + "</li>";
                        }
                    });
                }
                else
                    list += "<li>" + xhr.response.errors + "</li>";

                list += "</ul>";

                reply += list;
            }
            
            if (xhr.response.session !== undefined && xhr.response.session.activity !== undefined)
                window.session.activity = xhr.response.session.activity;
        }
        
        if (reply !== "")
            $("#flashBag").find(".content").html(reply);
        
        flashBag.sessionActivity();
        
        utility.linkPreventDefault();
    };
    
    // Functions private
}