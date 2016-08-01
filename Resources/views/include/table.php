<div class="input-group search_input pull-right margin_bottom">
    <input class="form-control" type="text" placeholder="Search" value="<?php echo $values[0]['value']; ?>"/>
    <span class="input-group-btn">
        <button class="btn btn-primary" type="button">
            <span class="fa fa-search"></span>
        </button>
    </span>
</div>
<div class="clearfix"></div>
<ul class="pagination-controle pagination margin_clear">
    <li class="previous">
        <a href="#">Previous</a>
    </li>
    <li><span class="text"><?php echo $values[1]['text']; ?></span></li>
    <li class="next">
        <a href="#">Next</a>
    </li>
</ul>