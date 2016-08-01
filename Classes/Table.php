<?php
class Table {
    // Vars
    private $searchIndex = "";
    private $paginationIndex = "";
    
    // Properties
    
    // Functions public
    public function __construct() {
    }
    
    public function search($index, $value) {
        $this->searchIndex = $index;
        
        if (isset($_SESSION[$index]) == false)
            $_SESSION[$index] = "";
        else if ($value != -1)
            $_SESSION[$index] = $value;
        
        return Array(
            'value' => $_SESSION[$index]
        );
    }
    
    public function pagination($index, $value, $count, $show) {
        $this->paginationIndex = $index;
        
        if (isset($_SESSION[$index]) == false)
            $_SESSION[$index] = "";
        if ($value > -1)
            $_SESSION[$index] = $value;
        
        $total = ceil($count / $show);
        $current = $total == 0 ? 0 : $_SESSION[$index] + 1;
        
        if ($_SESSION[$index] > $total)
            $_SESSION[$index] = $total;
        
        $offset = $_SESSION[$index] * $show;
        $text = "$current / $total";
        $limit = "$offset,$show";
        
        return Array(
            'show' => $show,
            'offset' => $offset,
            'text' => $text,
            'limit' => $limit
        );
    }
    
    // Functions private
}