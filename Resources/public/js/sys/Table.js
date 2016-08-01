/* global utility, ajax */

function Table() {
    // Vars
    var self = this;
    
    var urlRequest = "";
    var idResult = "";
    
    var searchContainer = null;
    var paginationContainer = null;
    
    var current = 0;
    var total = 0;
    
    var sortOrderBy = false;
    
    // Properties
    self.setCurrent = function(value) {
        current = value;
        
        paginationSend(current);
    };
    
    // Functions public
    self.init = function(url, id) {
        urlRequest = url;
        idResult = id;
        
        utility.linkPreventDefault();
    };
    
    self.search = function() {
        searchContainer = $(idResult).find(".search_input");
        
        searchContainer.keyup(function(event) {
            searchSend(event);
        });
        
        searchContainer.find("button").off("click").on("click", "", function() {
            searchSend(null);
        });
    };
    
    self.pagination = function() {
        paginationContainer = $(idResult).find(".pagination");
        
        paginationContainer.find(".previous").off("click").on("click", "", function() {
            if (current > 0) {
                current --;
                
                paginationSend(current);
            }
        });
        
        paginationContainer.find(".next").off("click").on("click", "", function() {
            if (current < (total - 1)) {
                current ++;
                
                paginationSend(current);
            }
        });
        
        status();
    };
    
    self.sort = function() {
        var headerRows = $(idResult).find("table thead tr");
        var bodyRows = $(idResult).find("table tbody tr");
        
        $.each(headerRows, function(key, value) {
            $(value).find("th span").addClass("display_none");
        });
        
        headerRows.off("click").on("click", "", function(event) {
            var currentIndex = $(event.target).is("span") === false ? $(event.target).index() : $(event.target).parent().index();
            
            $(this).find("th span").addClass("display_none");
            
            if (sortOrderBy === false) {
                $(this).find("th").eq(currentIndex).find("span").eq(0).removeClass("display_none");
                $(this).find("th").eq(currentIndex).find("span").eq(1).addClass("display_none");
                
                sortOrderBy = true;
            }
            else {
                $(this).find("th").eq(currentIndex).find("span").eq(0).addClass("display_none");
                $(this).find("th").eq(currentIndex).find("span").eq(1).removeClass("display_none");
                
                sortOrderBy = false;
            }
            
            bodyRows.sort(function(a, b) {
                var result = 0;
                var first = $.trim($(a).children("td").eq(currentIndex).text().toLowerCase());
                var second = $.trim($(b).children("td").eq(currentIndex).text().toLowerCase());
                
                if (first !== "" && second !== "") {
                    if (sortOrderBy === true) {
                        if ($.isNumeric(first) === false)
                            result = first.localeCompare(second);
                        else
                            result = first - second;
                    }
                    else {
                        if ($.isNumeric(first) === false)
                            result = second.localeCompare(first);
                        else
                            result = second - first;
                    }
                }
                
                return result;
            });
            
            $.each(bodyRows, function(key, value) {
                $(idResult).find("table tbody").append(value);
            });
        });
    };
    
    self.populate = function(xhr) {
        if (xhr.response.values !== undefined) {
            $(idResult + " .search_input input").val(xhr.response.values.search);
            $(idResult + " .pagination .text").html(xhr.response.values.pagination);
            $(idResult + " table tbody").html(xhr.response.values.pageList);
        }
    };
    
    // Functions private
    function status() {
        var textHtml = paginationContainer.find(".text").html();
        
        if (textHtml !== undefined) {
            var textSplit = textHtml.split("/");
            
            current = parseInt($.trim(textSplit[0])) - 1;
            total = parseInt($.trim(textSplit[1]));
        }
        
        paginationContainer.find(".previous").addClass("disabled");
        paginationContainer.find(".next").addClass("disabled");
        
        if (current > 0)
            paginationContainer.find(".previous").removeClass("disabled");
        
        if (current < (total - 1))
            paginationContainer.find(".next").removeClass("disabled");
        
        if (total > 0 && current > (total - 1)) {
            current --;
            
            paginationSend(current);
        }
        
        self.sort(idResult);
    }
    
    function searchSend(event) {
        if (event === null || (event !== null && event.which === 13)) {
            current = 0;
            
            var data = {
                searchWritten: searchContainer.find("input").val(),
                paginationCurrent: current
            };

            send(data);
        }
    }
    
    function paginationSend(current) {
        var data = {
            searchWritten: searchContainer.find("input").val(),
            paginationCurrent: current
        };

        send(data);
    }
    
    function send(data) {
        ajax.send(
            urlRequest,
            "post",
            JSON.stringify(data),
            null,
            function(xhr) {
                ajax.reply(xhr, "");
                
                if (xhr.response.render !== undefined) {
                    $(idResult).html(xhr.response.render);
                    
                    self.search();
                    self.pagination();
                }
                else
                    self.populate(xhr);

                status();
                
                utility.linkPreventDefault();
            },
            null,
            null
        );
    }
}