<?php
require_once(dirname(dirname(dirname(__DIR__))) . "/Classes/Utility.php");
require_once(dirname(dirname(dirname(__DIR__))) . "/Classes/IpCamera.php");

$utility = new Utility();
$utility->generateToken();
$utility->configureCookie("PHPSESSID", 0, isset($_SERVER['HTTPS']), true);

$token = isset($_SESSION['token']) == true ? $_SESSION['token'] : "";
$sessionActivity = $utility->checkSessionOverTime();
$settings = $utility->getSettings();

$ipCamera = new IpCamera();
$cameraId = isset($_SESSION['camera_id']) == true ? $_SESSION['camera_id'] : -1;
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?php echo $utility->getWebsiteName(); ?></title>
        <!-- Meta -->
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">-->
        <!-- Favicon -->
        <link href="<?php echo $utility->getUrlPublic(); ?>/image/templates/<?php echo $settings['template']; ?>/favicon.ico" rel="icon" type="image/x-icon">
        <!-- Css -->
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/lib/jquery_ui_1.11.4.min.css" rel="stylesheet"/>
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/lib/jquery_ui_1.11.4.structure.min.css" rel="stylesheet"/>
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/lib/bootstrap_3.3.5.min.css" rel="stylesheet"/>
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/lib/bootstrap_switch_3.3.2.min.css" rel="stylesheet"/>
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/lib/font_awesome_4.5.0.min.css" rel="stylesheet">
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/sys/basic.css" rel="stylesheet"/>
    </head>
    <body class="user_select_none">
        <div class="container-fluid">
            <p class="logo_big hidden-xs hidden-sm"><?php echo $utility->getWebsiteName(); ?></p>
            <p class="logo_small hidden-md hidden-lg"><?php echo $utility->getWebsiteName(); ?></p>
            <div class="row">
                <div class="col-md-12">
                    <?php
                    require_once("{$utility->getPathRootFull()}/Resources/views/include/loader.php");
                    require_once("{$utility->getPathRootFull()}/Resources/views/include/flashBag.php");
                    require_once("{$utility->getPathRootFull()}/Resources/views/include/popup_easy.php");
                    ?>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <div class="panel panel-primary">
                        <div class="panel-heading clearfix">
                            <div class="pull-left">
                                <h3 class="panel-title">Video</h3>
                            </div>
                            <div class="pull-right hidden-md hidden-lg">
                                <input id="camera_control_swipe_switch" type="checkbox" data-on-color="success" data-off-color="danger"/>
                                <img class="camera_control_picture margin_left camera_controls" src="<?php echo "{$utility->getUrlPublic()}/image/templates/{$settings['template']}"; ?>/picture.png" alt="picture.png"/>
                            </div>
                        </div>
                        <div class="panel-body overflow_hidden padding_clear">
                            <div id="camera_video_result"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="panel panel-primary hidden-xs hidden-sm">
                        <div class="panel-heading">
                            <h3 class="panel-title">Controls</h3>
                        </div>
                        <div class="panel-body overflow_hidden">
                            <div id="camera_controls_result"></div>
                        </div>
                    </div>
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <h3 class="panel-title">Actions</h3>
                        </div>
                        <div class="panel-body overflow_hidden">
                            <ul class="nav nav-tabs">
                                <li class="active">
                                    <a id="actions_tab_1" data-toggle="tab" href="#actions_tab_content_1">Status</a>
                                </li>
                                <li>
                                    <a id="actions_tab_2" data-toggle="tab" href="#actions_tab_content_3">Profile</a>
                                </li>
                                <li>
                                    <a id="actions_tab_2" data-toggle="tab" href="#actions_tab_content_2">Files</a>
                                </li>
                            </ul>
                            <div class="tab-content tab_container clearfix">
                                <div id="actions_tab_content_1" class="tab-pane active">
                                    <?php require_once("{$utility->getPathRootFull()}/Resources/views/render/status.php"); ?>
                                </div>
                                <div id="actions_tab_content_3" class="tab-pane">
                                    <div class="margin_top overflow_y_hidden">
                                        <div id="camera_profile_result"></div>
                                    </div>
                                </div>
                                <div id="actions_tab_content_2" class="tab-pane">
                                    <div class="margin_top">
                                        <div id="camera_files_result"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Javascript -->
        <script type="text/javascript">
            var session = {
                token: "<?php echo $token; ?>",
                activity: "<?php echo $sessionActivity; ?>",
                ipCameraId: "<?php echo $cameraId; ?>"
            };
            
            var path = {
                documentRoot: "<?php echo $_SERVER['DOCUMENT_ROOT']; ?>",
                root: "<?php echo $utility->getPathRoot(); ?>",
                rootFull: "<?php echo $utility->getPathRootFull(); ?>"
            };
            
            var url = {
                root: "<?php echo $utility->getUrlRoot(); ?>",
                public: "<?php echo $utility->getUrlPublic(); ?>",
                view: "<?php echo $utility->getUrlView(); ?>",
                ipCameraControl: "<?php echo $ipCamera->getControlUrl(); ?>"
            };
            
            var text = {
                warning: "Warning!",
                ok: "Ok",
                abort: "Abort",
                ajaxConnectionError: "Connection error, please reload the page.",
                ipCameraStatusActive: "Active.",
                ipCameraStatusNotActive: "Not active.",
                ipCameraCreateNew: "You would like create a new camera settings?",
                ipCameraDelete: "Really delete this camera?",
                ipCameraDeleteFile: "Really delete this file?",
                ipCameraDeleteAllFile: "Really delete all files?"
            };
            
            var settings = {
                maxWidth: "991px",
                minWidth: "992px",
                template: "<?php echo $settings['template']; ?>",
                serverUrl: "<?php echo $settings['server_url']; ?>"
            };
        </script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/lib/jquery_1.12.0.min.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/lib/jquery_ui_1.11.4.min.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/lib/jquery_mobile_1.4.5.min.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/lib/bootstrap_3.3.5.min.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/lib/bootstrap_switch_3.3.2.min.js"></script>
        <!--[if lte IE 9]>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/lib/media.match.min.js"></script>
        <![endif]-->
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/Utility.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/Ajax.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/Loader.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/FlashBag.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/PopupEasy.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/Download.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/Table.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/IpCamera.js"></script>
        <script type="text/javascript" src="<?php echo $utility->getUrlPublic(); ?>/js/sys/Index.js"></script>
    </body>
</html>