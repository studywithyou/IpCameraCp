<?php
require_once(dirname(dirname(dirname(__DIR__))) . "/Classes/Utility.php");
require_once(dirname(dirname(dirname(__DIR__))) . "/Classes/IpCamera.php");

$utility = new Utility();

$ipCamera = new IpCamera();

$values = $ipCamera->filesList();
?>
<div id="camera_files_table" class="margin_bottom">
    <div class="margin_bottom">
        <button id="camera_files_refresh" class="btn btn-primary">Refresh</button>
        <button id="camera_files_delete_all" class="btn btn-danger">Delete all</button>
    </div>
    
    <?php require_once($utility->getPathRootFull() . "/Resources/views/include/table.php"); ?>
    
    <div class="overflow_y_hidden">
        <table class="table table-bordered table-striped margin_clear">
            <thead class="table_thead">
                <tr>
                    <th class="vertical_middle cursor_pointer">
                        #
                        <span class="fa fa-caret-down"></span>
                        <span class="fa fa-caret-up"></span>
                    </th>
                    <th class="vertical_middle cursor_pointer">
                        Name
                        <span class="fa fa-caret-down"></span>
                        <span class="fa fa-caret-up"></span>
                    </th>
                    <th class="vertical_middle cursor_pointer">
                        Size
                        <span class="fa fa-caret-down"></span>
                        <span class="fa fa-caret-up"></span>
                    </th>
                    <th class="vertical_middle cursor_pointer">
                        Download
                        <span class="fa fa-caret-down"></span>
                        <span class="fa fa-caret-up"></span>
                    </th>
                    <th class="vertical_middle cursor_pointer">
                        Remove
                        <span class="fa fa-caret-down"></span>
                        <span class="fa fa-caret-up"></span>
                    </th>
                </tr>
            </thead>
            <tbody class="table_tbody">
                <?php echo $values[2]; ?>
            </tbody>
        </table>
    </div>
</div>