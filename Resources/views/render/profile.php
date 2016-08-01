<?php
require_once(dirname(dirname(dirname(__DIR__))) . "/Classes/Utility.php");

$utility = new Utility();

$token = isset($_SESSION['token']) == true ? $_SESSION['token'] : "";
$cameraId = isset($_SESSION['camera_id']) == true ? $_SESSION['camera_id'] : -1;

$cameraRow = $utility->selectCameraFromDatabase($cameraId);
?>
<form id="form_camera_profile" class="margin_bottom" action="<?php echo $utility->getUrlRoot() ?>/Requests/IpCameraRequest.php?controller=profileAction" method="post" novalidate="novalidate">
    <table class="table table-bordered table-striped">
        <thead class="table_thead">
            <tr>
                <th class="vertical_middle">
                    Name
                </th>
                <th class="vertical_middle">
                    Value
                </th>
            </tr>
        </thead>
        <tbody class="table_tbody">
            <tr>
                <td class="vertical_middle">
                    Video url
                </td>
                <td class="vertical_middle">
                    <input id="form_camera_profile_video_url" class="form-control" type="text" name="form_camera_profile[videoUrl]" value="<?php echo $cameraRow['video_url']; ?>" required="required"/>
                </td>
            </tr>
            <tr>
                <td class="vertical_middle">
                    Username
                </td>
                <td class="vertical_middle">
                    <input id="form_camera_profile_username" class="form-control" type="text" name="form_camera_profile[username]" value="<?php echo $cameraRow['username']; ?>" required="required"/>
                </td>
            </tr>
            <tr>
                <td class="vertical_middle">
                    Password
                </td>
                <td class="vertical_middle">
                    <input id="form_camera_profile_password" class="form-control" type="password" name="form_camera_profile[password]" value="<?php echo $cameraRow['password']; ?>" required="required"/>
                </td>
            </tr>
            <tr>
                <td class="vertical_middle">
                    Motion url
                </td>
                <td class="vertical_middle">
                    <input id="form_camera_profile_motion_url" class="form-control" type="text" name="form_camera_profile[motionUrl]" value="<?php echo $cameraRow['motion_url']; ?>" required="required"/>
                </td>
            </tr>
            <tr>
                <td class="vertical_middle">
                    Motion detection
                </td>
                <td class="vertical_middle">
                    <?php
                    $checked = $cameraRow['motion_detection_active'] == "start" ? "checked" : "";
                    ?>
                    <input id="form_camera_profile_detection_active" class="form-control" type="checkbox" name="form_camera_profile[motionDetectionActive]" value="<?php echo $cameraRow['motion_detection_active']; ?>" required="required" <?php echo $checked; ?> data-on-color="success" data-off-color="danger"/>
                    <input type="hidden" name="form_camera_profile[motionDetectionActive]" value="<?php echo $cameraRow['motion_detection_active']; ?>" required="required"/>
                </td>
            </tr>
        </tbody>
    </table>
    
    <input id="form_camera_profile_token" class="form-control" type="hidden" name="form_camera_profile[token]" value="<?php echo $token; ?>"/>
    <input class="btn btn-primary" type="submit" value="Update"/>
</form>

<div class="margin_bottom">
    <h3>Camera deletion</h3>

    <p>Warning! If you delete the camera is impossible return back.</p>

    <button id="camera_deletion" class="btn btn-primary" type="button">Delete</button>
</div>