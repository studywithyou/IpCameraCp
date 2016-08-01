<?php
require_once(dirname(dirname(dirname(__DIR__))) . "/Classes/Utility.php");

$utility = new Utility();

$settings = $utility->getSettings();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Download</title>
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
        <link href="<?php echo $utility->getUrlPublic(); ?>/css/sys/custom.css" rel="stylesheet"/>
    </head>
    <body class="user_select_none">
        <div class="container-fluid">
            <div class="message_single_page horizontal_center">
                <p>File not founded!</p>
                <a href="<?php echo $utility->getUrlRoot(); ?>/web/index.php">Go back</a>
            </div>
        </div>
    </body>
</html>