<?php
class Log {
    // Vars
    private $utility;
    
    private $type;
    
    // Properties
    
    // Functions public
    public function __construct($utility, $type) {
        $this->utility = $utility;
        
        $this->type = $type;
        
        @mkdir($this->utility->getPathRootFull() . "/Resources/files");
        @touch($this->utility->getPathRootFull() . "/Resources/files/log.txt");
    }
    
    public function write($text) {
        $content = date("Y-m-d H:i:s") . " | $text\r";
        
        if ($this->type == "file")
            file_put_contents($this->utility->getPathRootFull() . "/Resources/files/log.txt", $content.PHP_EOL, FILE_APPEND);
    }

    // Functions private
}