<?php
    if(isset($_POST['upload']))
    {
        // require('./config.php');
        //print("hello");
        $file_name = $_FILES['file']['name'];
        $file_type = $_FILES['file']['type'];
        $file_size = $_FILES['file']['size'];
        $file_tem_Loc = $_FILES['file']['tmp_name'];
        $file_store = "upload/".$file_name;
        move_uploaded_file($file_tem_Loc,$file_store);
        
        echo "<script> localStorage.setItem('ImageUrl','".$file_store."'); 
        window.location.replace('./index.html');
        </script>";
    }
    
?>