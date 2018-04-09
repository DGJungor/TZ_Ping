<?php
    $count=15;
    $url='http://192.168.2.122/PingServer/pingServer';
    // for($i=0;$i<$count;$i++) {
    //     $html .= file_get_contents($url.'locationAddr='.$_GET['ip'].'&count='.$i);
    // }

    $html = file_get_contents($url.'?locationAddr='.$_GET['ip'].'&count='.$_GET['count']);



    echo $html;
?>