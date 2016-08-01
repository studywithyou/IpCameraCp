/* global utility, ajax, popupEasy, download, table */

var ipCamera = new IpCamera();

function IpCamera() {
    // Vars
    var self = this;
    
    var currentId = 0;
    var swipeMoveValue = -1;
    
    var filesTable = null;
    
    // Properties
    
    // Functions public
    self.status = function() {
        currentId = window.session.ipCameraId;
        var createNew = false;
        
        $("#form_cameras_selection").on("submit", "", function(event) {
            event.preventDefault();
            
            if ($("#form_cameras_selection_id").val() === "0" && createNew === false) {
                popupEasy.create(
                    window.text.warning,
                    window.text.ipCameraCreateNew,
                    function() {
                        popupEasy.close();

                        createNew = true;

                        $("#form_cameras_selection").submit();
                    },
                    function() {
                        popupEasy.close();
                    }
                );
            }
            
            if (parseInt($("#form_cameras_selection_id").val()) > 0 || createNew === true) {
                ajax.send(
                    $(this).attr("action"),
                    $(this).attr("method"),
                    JSON.stringify($(this).serializeArray()),
                    function() {
                        $("#camera_video_result").html("");
                        $("#camera_controls_result").html("");
                        $("#camera_profile_result").html("");
                        $("#camera_files_result").html("");
                    },
                    function(xhr) {
                        if (createNew === true) {
                            ajax.reply(xhr, "#" + event.currentTarget.id);
                            
                            currentId = $("#form_cameras_selection_id").children("option").length - 1;
                            
                            $("<option>", {
                                value: currentId,
                                text: "Camera " + currentId
                            }).appendTo($("#form_cameras_selection_id"));
                            
                            $("#form_cameras_selection_id").val(currentId);
                        }
                        else
                            ajax.reply(xhr, "");
                        
                        $("#camera_video_result").load(window.url.root + "/Resources/views/render/video.php", function() {
                            utility.reloadImage("#camera_video");
                        });

                        $("#camera_controls_result").load(window.url.root + "/Resources/views/render/controls.php", function() {
                            controls();
                        });

                        $("#camera_profile_result").load(window.url.root + "/Resources/views/render/profile.php", function() {
                            profile();
                            labelStatus();
                        });

                        $("#camera_files_result").load(window.url.root + "/Resources/views/render/files.php", function() {
                            files();
                            filesTableLogic();
                        });
                        
                        createNew = false;
                    },
                    null,
                    null
                );
            }
        });
        
        $("#form_cameras_selection_id").val(currentId);
        
        $("#form_cameras_selection").submit();
    };
    
    // Functions private
    function controls() {
        $("#camera_control_swipe_switch").bootstrapSwitch("state", false);
        
        if (window.matchMedia("(min-width: 992px)").matches === true) {
            move("#camera_control_move_up", new Array(0, 1));
            move("#camera_control_move_right_up", new Array(6, 7, 0, 1));
            move("#camera_control_move_right", new Array(6, 7));
            move("#camera_control_move_right_down", new Array(6, 7, 2, 3));
            move("#camera_control_move_down", new Array(2, 3));
            move("#camera_control_move_left_down", new Array(4, 5, 2, 3));
            move("#camera_control_move_left", new Array(4, 5));
            move("#camera_control_move_left_up", new Array(4, 5, 0, 1));
        }
        else {
            $("#camera_control_swipe_switch").off("switchChange.bootstrapSwitch").on("switchChange.bootstrapSwitch", "", function(event, state) {
                if (state === true) {
                    $("#camera_video_area").show();
                    $("#camera_video_area").addClass("touch_disable");
                    
                    $("#camera_video_area").swipe({
                        down: function () {
                            swipeMoveStart(0);
                            swipeMoveValue = 1;
                        },
                        left: function () {
                            swipeMoveStart(6);
                            swipeMoveValue = 7;
                        },
                        up: function () {
                            swipeMoveStart(2);
                            swipeMoveValue = 3;
                        },
                        right: function () {
                            swipeMoveStart(4);
                            swipeMoveValue = 5;
                        }
                    });

                    swipeMoveEnd();
                }
                else {
                    $("#camera_video_area").off();
                    $("#camera_video_area").removeClass("touch_disable");
                    $("#camera_video_area").hide();
                }
            });
        }
        
        $(".camera_control_picture").off("click").on("click", "", function() {
            ajax.send(
                window.url.root + "/Requests/IpCameraRequest.php?controller=controlsAction",
                "post",
                JSON.stringify({
                    event: "picture",
                    token: window.session.token
                }),
                null,
                function(xhr) {
                    ajax.reply(xhr, "");
                },
                null,
                null
            );
        });
    }
    
    function profile() {
        $("#form_camera_profile_detection_active").bootstrapSwitch();
        $("#form_camera_profile_detection_active").off("switchChange.bootstrapSwitch").on("switchChange.bootstrapSwitch", "", function(event, state) {
            if (state === true) {
                $("#form_camera_profile_detection_active").attr("value", "start");
                $("#form_camera_profile_detection_active").parents(".bootstrap-switch-wrapper").next().attr("value", "start");
            }
            else {
                $("#form_camera_profile_detection_active").attr("value", "pause");
                $("#form_camera_profile_detection_active").parents(".bootstrap-switch-wrapper").next().attr("value", "pause");
            }
        });
        
        $("#form_camera_profile").on("submit", "", function(event) {
            event.preventDefault();

            ajax.send(
                $(this).attr("action"),
                $(this).attr("method"),
                JSON.stringify($(this).serializeArray()),
                null,
                function(xhr) {
                    ajax.reply(xhr, "#" + event.currentTarget.id);

                    labelStatus();
                },
                null,
                null
            );
        });
        
        $("#camera_deletion").off("click").on("click", "", function() {
            popupEasy.create(
                window.text.warning,
                window.text.ipCameraDelete,
                function() {
                    popupEasy.close();

                    ajax.send(
                        window.url.root + "/Requests/IpCameraRequest.php?controller=deleteAction",
                        "post",
                        JSON.stringify({
                            token: window.session.token
                        }),
                        null,
                        function(xhr) {
                            ajax.reply(xhr, "");
                            
                            $("#form_cameras_selection_id").find("option")[currentId + 1].remove();
                            $("#form_cameras_selection_id").val(-1);
                            
                            $("#camera_video_result").html("");
                            $("#camera_controls_result").html("");
                            $("#camera_profile_result").html("");
                            $("#camera_files_result").html("");
                            
                            labelStatus();
                        },
                        null,
                        null
                    );
                },
                function() {
                    popupEasy.close();
                }
            );
        });
    }
    
    function files() {
        filesTable = new Table();
        
        $("#camera_files_result, #camera_files_refresh").off("click");
        $("#camera_files_result, #camera_files_delete_all").off("click");
        $("#camera_files_result, .camera_files_download").off("click");
        $("#camera_files_result, .camera_files_delete").off("click");
        
        $("#camera_files_result").on("click", "#camera_files_refresh", function() {
            ajax.send(
                window.url.root + "/Requests/IpCameraRequest.php?controller=filesAction",
                "post",
                JSON.stringify({
                    event: "refresh",
                    name: "",
                    token: window.session.token
                }),
                null,
                function(xhr) {
                    ajax.reply(xhr, "");
                    
                    filesTableLogic(xhr);
                },
                null,
                null
            );
        });
        
        $("#camera_files_result").on("click", "#camera_files_delete_all", function() {
            popupEasy.create(
                window.text.warning,
                window.text.ipCameraDeleteAllFile,
                function() {
                    popupEasy.close();
                    
                    ajax.send(
                        window.url.root + "/Requests/IpCameraRequest.php?controller=filesAction",
                        "post",
                        JSON.stringify({
                            event: "deleteAll",
                            name: "",
                            token: window.session.token
                        }),
                        null,
                        function(xhr) {
                            ajax.reply(xhr, "");
                            
                            filesTableLogic(xhr);
                        },
                        null,
                        null
                    );
                },
                function() {
                    popupEasy.close();
                }
            );
        });
        
        $("#camera_files_result").on("click", ".camera_files_download", function() {
            var path = window.path.documentRoot + "/motion/camera_" + currentId;
            var name = $.trim($(this).parents("tr").find(".name_column").text());
            
            download.send(path, name);
        });
        
        $("#camera_files_result").on("click", ".camera_files_delete", function() {
            var name = $.trim($(this).parents("tr").find(".name_column").text());
            
            popupEasy.create(
                window.text.warning,
                window.text.ipCameraDeleteFile,
                function() {
                    popupEasy.close();
                    
                    ajax.send(
                        window.url.root + "/Requests/IpCameraRequest.php?controller=filesAction",
                        "post",
                        JSON.stringify({
                            event: "delete",
                            name: name,
                            token: window.session.token
                        }),
                        null,
                        function(xhr) {
                            ajax.reply(xhr, "");
                            
                            filesTableLogic(xhr);
                        },
                        null,
                        null
                    );
                },
                function() {
                    popupEasy.close();
                }
            );
        });
    }
    
    function labelStatus() {
        var detectionActiveValue = $("#form_camera_profile_detection_active").val();
        
        if (detectionActiveValue === "start")
            $("#camera_detection_status").text(window.text.ipCameraStatusActive);
        else
            $("#camera_detection_status").text(window.text.ipCameraStatusNotActive);
    }
    
    function move(tag, elements) {
        if (elements.length === 2) {
            $(tag).on("mousedown", "", function(event) {
                event.preventDefault();
                
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + elements[0],
                    "post",
                    {
                        command: elements[0]
                    }
                );
            });
            
            $(tag).on("mouseup", "", function(event) {
                event.preventDefault();
                
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + elements[1],
                    "post",
                    {
                        command: elements[1]
                    }
                );
            });
        }
        else if (elements.length === 4) {
            $(tag).on("mousedown", "", function(event) {
                event.preventDefault();
                
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + elements[0],
                    "post",
                    {
                        command: elements[0]
                    }
                );
        
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + elements[2],
                    "post",
                    {
                        command: elements[2]
                    }
                );
            });
            
            $(tag).on("mouseup", "", function(event) {
                event.preventDefault();
                
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + elements[1],
                    "post",
                    {
                        command: elements[1]
                    }
                );
                
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + elements[3],
                    "post",
                    {
                        command: elements[3]
                    }
                );
            });
        }
    }
    
    function swipeMoveStart(value) {
        utility.postIframe(
            window.url.ipCameraControl + "&command=" + value,
            "post",
            {
                command: value
            }
        );
    }
    
    function swipeMoveEnd() {
        $("#camera_video_area").on("touchend touchcancel", "", function(event) {
            event.preventDefault();
            
            if (swipeMoveValue !== -1) {
                utility.postIframe(
                    window.url.ipCameraControl + "&command=" + swipeMoveValue,
                    "post",
                    {
                        command: swipeMoveValue
                    }
                );
                
                swipeMoveValue = -1;
            }
        });
    }
    
    function filesTableLogic(xhr) {
        filesTable.init(window.url.root + "/Requests/IpCameraRequest.php?tableType=filesTable", "#camera_files_table");
        
        if (xhr !== undefined)
            filesTable.populate(xhr);
        
        filesTable.search();
        filesTable.pagination();
    }
}