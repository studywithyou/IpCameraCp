<?php
require_once(dirname(__DIR__) . "/Classes/Utility.php");
require_once(dirname(__DIR__) . "/Classes/Ajax.php");
require_once(dirname(__DIR__) . "/Classes/Table.php");

class IpCamera {
    // Vars
    private $utility;
    private $database;
    private $ajax;
    private $table;
    
    private $settings;
    
    private $videoUrl;
    private $controlUrl;
    
    private $resolution;
    private $rate;
    
    private $response;
    
    // Properties
    public function getVideoUrl() {
        return $this->videoUrl;
    }
    
    public function getControlUrl() {
        return $this->controlUrl;
    }
    
    // Functions public
    public function __construct() {
        $this->utility = new Utility();
        $this->database = new Database();
        $this->ajax = new Ajax();
        $this->table = new Table();
        
        $this->settings = $this->utility->getSettings();
        
        $this->videoUrl = "";
        $this->controlUrl = "";
        
        $this->resolution = 0;
        $this->rate = 0;
        
        $this->response = Array();
        
        $id = isset($_SESSION['camera_id']) == true ? $_SESSION['camera_id'] : 1;
        
        $this->parameters($id);
    }
    
    public function phpInput() {
        $sessionActivity = $this->utility->checkSessionOverTime();
        
        if ($sessionActivity != "")
            $this->response['session']['activity'] = $sessionActivity;
        else {
            $content = file_get_contents("php://input");
            $json = json_decode($content);
            
            if ($json != null) {
                if (isset($_GET['controller']) == true) {
                    $token = is_array($json) == true ? end($json)->value : $json->token;

                    if (isset($_SESSION['token']) == true && $token == $_SESSION['token']) {
                        if ($_GET['controller'] == "selectionAction")
                            $this->selectionAction($json);
                        else if ($_GET['controller'] == "profileAction")
                            $this->profileAction($json);
                        else if ($_GET['controller'] == "controlsAction")
                            $this->controlsAction($json);
                        else if ($_GET['controller'] == "filesAction")
                            $this->filesAction($json);
                        else if ($_GET['controller'] == "deleteAction")
                            $this->deleteAction();
                    }
                }
                else {
                    if (isset($_GET['tableType']) == true) {
                        if ($_GET['tableType'] == "filesTable")
                            $this->filesList($json);
                    }
                }
            }
            else
                $this->response['messages']['error'] = "Json error!";
        }
        
        echo $this->ajax->response(Array(
            'response' => $this->response
        ));
        
        $this->database->close();
    }
    
    public function generateSelectOptionFromMotionFolders() {
        $motionFolderPath = "{$_SERVER['DOCUMENT_ROOT']}/motion";
        
        $scanDirElements = @scandir($motionFolderPath, 1);
        
        if ($scanDirElements != false) {
            asort($scanDirElements);
            
            $count = 0;
            
            foreach ($scanDirElements as $key => $value) {
                if ($value != "." && $value != ".." && $value != ".htaccess" && is_dir("$motionFolderPath/$value") == true) {
                    $count ++;
                    
                    echo "<option value=\"$count\">Camera $count</option>";
                }
            }
        }
    }
    
    public function filesList($json = null) {
        $motionFolderPath = "{$_SERVER['DOCUMENT_ROOT']}/motion/camera_{$_SESSION['camera_id']}";
        
        $scanDirElements = @scandir($motionFolderPath);
        
        if ($scanDirElements == true) {
            if ($scanDirElements[0] == ".") {
                unset($scanDirElements[0]);
                unset($scanDirElements[1]);
                
                $index = array_search("lastsnap.jpg", $scanDirElements);
                unset($scanDirElements[$index]);
            }
            
            $scanDirElements = array_reverse($scanDirElements, true);
            
            // Table - search
            $searchWritten = isset($json->searchWritten) == true ? $json->searchWritten : -1;
            $search = $this->table->search("searchFiles", $searchWritten);
            $elements = $this->utility->arrayLike($scanDirElements, $search['value']);
            
            // Table - pagination
            $paginationCurrent = isset($json->paginationCurrent) == true ? $json->paginationCurrent : -1;
            $pagination = $this->table->pagination("paginationFiles", $paginationCurrent, count($elements), 5);
            $filesList = array_slice($elements, $pagination['offset'], $pagination['show']);
            
            $count = 0;
            $pageList = "";
            
            foreach ($filesList as $key => $value) {
                $count ++;
                
                $pageList .= "<tr>
                    <td class=\"vertical_middle\">
                        $count
                    </td>
                    <td class=\"vertical_middle name_column\">
                        $value
                    </td>
                    <td class=\"vertical_middle\">
                        {$this->utility->sizeUnits(filesize("$motionFolderPath/$value"))}
                    </td>
                    <td class=\"vertical_middle horizontal_center\">
                        <button class=\"camera_files_download btn btn-primary\"><span class=\"fa fa-download\"></span></button>
                    </td>
                    <td class=\"vertical_middle horizontal_center\">
                        <button class=\"camera_files_delete btn btn-danger\"><span class=\"fa fa-remove\"></span></button>
                    </td>
                </tr>";
            }
            
            $this->response['values']['search'] = $search['value'];
            $this->response['values']['pagination'] = $pagination['text'];
            $this->response['values']['pageList'] = $pageList;
            
            return Array(
                $search,
                $pagination,
                $pageList
            );
        }
        
        return Array(
            '',
            '',
            ''
        );
    }
    
    // Functions private
    private function parameters($id) {
        $_SESSION['camera_id'] = $id;
        
        $cameraRow = $this->utility->selectCameraFromDatabase($id);
        
        $this->resolution = 32;
        $this->rate = 0;
        
        $this->videoUrl = "{$cameraRow['video_url']}/videostream.cgi?user={$cameraRow['username']}&pwd={$cameraRow['password']}&resolution=$this->resolution&rate=$this->rate";
        $this->controlUrl = "{$cameraRow['video_url']}/decoder_control.cgi?user={$cameraRow['username']}&pwd={$cameraRow['password']}";
    }
    
    private function profileConfig($videoUrl, $username, $password, $motionUrl, $motionDetectionActive, $id) {
        @mkdir("{$_SERVER['DOCUMENT_ROOT']}/motion/camera_$id");
        @chmod("{$_SERVER['DOCUMENT_ROOT']}/motion/camera_$id", 0777);
        
        $netcamUrl = $motionUrl == "" ? $videoUrl : $motionUrl;
        $threshold = $motionDetectionActive == "start" ? "1500" : "0";
        
        $content = "framerate 30\n";
        $content .= "netcam_url $netcamUrl/videostream.cgi?user=$username&pwd=$password&resolution=$this->resolution\n";
        $content .= "netcam_http 1.0\n";
        $content .= "threshold $threshold\n";
        $content .= "ffmpeg_cap_new on\n";
        $content .= "target_dir /home/user_1/www/motion/camera_$id";
        
        file_put_contents("{$_SERVER['DOCUMENT_ROOT']}/motion/camera_$id.conf", $content.PHP_EOL);
        
        // Set threshold
        $this->curlCommandsUrls(Array(
                "{$this->settings['server_url']}/$id/config/set?threshold=$threshold"
            )
        );
    }
    
    private function curlCommandsUrls($urls) {
        $curl = curl_init();
        
        foreach ($urls as $url)
            curl_setopt($curl, CURLOPT_URL, $url);
        
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_exec($curl);
        curl_close($curl);
    }
    
    // Controllers
    private function selectionAction($json) {
        $elements = Array();
        
        foreach($json as $key => $value)
            $elements[] = $value->value;
        
        if ($elements[0] == 0) {
            $videoUrl = "";
            $username = "";
            $password = "";
            $motionUrl = "";
            $motionDetectionActive = "pause";
            
            $query = $this->database->getPdo()->prepare("INSERT INTO cameras (
                                                            video_url,
                                                            username,
                                                            password,
                                                            motion_url,
                                                            motion_detection_active
                                                        )
                                                        VALUES (
                                                            :videoUrl,
                                                            :username,
                                                            :password,
                                                            :motionUrl,
                                                            :motionDetectionActive
                                                        );");
            
            $query->bindValue(":videoUrl", $videoUrl);
            $query->bindValue(":username", $username);
            $query->bindValue(":password", $password);
            $query->bindValue(":motionUrl", $motionUrl);
            $query->bindValue(":motionDetectionActive", $motionDetectionActive);
            
            $query->execute();
            
            $lastInsertId = $this->database->getPdo()->lastInsertId();
            
            $this->profileConfig("", "", "", "", "pause", $lastInsertId);
            
            $this->utility->searchInFile("/etc/motion/motion.conf", "thread /home/user_1/www/motion/camera_$lastInsertId.conf");
            
            // Pause
            $this->curlCommandsUrls(Array(
                    "{$this->settings['server_url']}/$lastInsertId/detection/pause"
                )
            );
            
            $_SESSION['camera_id'] = $lastInsertId;
            
            $this->response['messages']['success'] = "New camera created with success.";
        }
        else if ($elements[0] > 0) {
            $_SESSION['camera_id'] = $elements[0];
            
            $this->response = "ok";
        }
    }
    
    private function profileAction($json) {
        $id = $_SESSION['camera_id'];
        
        $motionDetectionActive = "";
                
        $elements = Array();
        
        foreach($json as $key => $value) {
            $elements[] = $value->value;
            
            // Detection
            $curl = curl_init();
            
            if ($key == 4) {
                $motionDetectionActive = $elements[$key];
                curl_setopt($curl, CURLOPT_URL, "{$this->settings['server_url']}/$id/detection/$motionDetectionActive");
            }
            
            curl_setopt($curl, CURLOPT_HEADER, 0);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_exec($curl);
            curl_close($curl);
        }
        
        $this->profileConfig($elements[0], $elements[1], $elements[2], $elements[3], $motionDetectionActive, $id);
        
        $query = $this->database->getPdo()->prepare("UPDATE cameras
                                                        SET video_url = :videoUrl,
                                                            username = :username,
                                                            password = :password,
                                                            motion_url = :motionUrl,
                                                            motion_detection_active = :motionDetectionActive
                                                        WHERE id = :id");
        
        $query->bindValue(":videoUrl", $elements[0]);
        $query->bindValue(":username", $elements[1]);
        $query->bindValue(":password", $elements[2]);
        $query->bindValue(":motionUrl", $elements[3]);
        $query->bindValue(":motionDetectionActive", $motionDetectionActive);
        $query->bindValue(":id", $id);
        
        $query->execute();
        
        // Restart
        $this->curlCommandsUrls(Array(
                "{$this->settings['server_url']}/$id/action/restart"
            )
        );
        
        $this->response['messages']['success'] = "Settings updated with success.";
    }
    
    private function controlsAction($json) {
        // Snapshot
        $curl = curl_init();
        
        if ($json->event == "picture") {
            curl_setopt($curl, CURLOPT_URL, "{$this->settings['server_url']}/{$_SESSION['camera_id']}/action/snapshot");
            
            $this->response['messages']['success'] = "Picture taked, please refresh the file lists.";
        }
        
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_exec($curl);
        curl_close($curl);
    }
    
    private function filesAction($json) {
        $path = "{$_SERVER['DOCUMENT_ROOT']}/motion/camera_{$_SESSION['camera_id']}/$json->name";
        
        if ($json->event == "delete") {
            if (file_exists($path))
                unlink($path);
            
            $this->response['messages']['success'] = "File deleted with success!";
        }
        else if ($json->event == "deleteAll") {
            $this->utility->removeDirRecursive($path, false);
            
            $this->response['messages']['success'] = "All files deleted with success!";
        }
        
        $this->filesList(null);
    }
    
    private function deleteAction() {
        $id = $_SESSION['camera_id'];
        
        $this->utility->removeDirRecursive("{$_SERVER['DOCUMENT_ROOT']}/motion/camera_$id");
        unlink("{$_SERVER['DOCUMENT_ROOT']}/motion/camera_$id.conf");
        
        $this->utility->searchInFile("/etc/motion/motion.conf", "thread /home/user_1/www/motion/camera_$id.conf", " ");
        
        $query = $this->database->getPdo()->prepare("DELETE FROM cameras
                                                        WHERE id = :id");
        
        $query->bindValue(":id", $id);
        
        $query->execute();
        
        // Quit
        $this->curlCommandsUrls(Array(
                "{$this->settings['server_url']}/$id/action/quit"
            )
        );
        
        $_SESSION['camera_id'] = -1;
        
        $this->response['messages']['success'] = "Camera deleted with success!";
    }
}