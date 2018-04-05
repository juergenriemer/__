REM Copy __ JS files from Hive to SVN Repo
robocopy "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\osce\__" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\__\js" /MIR /xf *.*~

REM Copy __ CSS files from Hive to SVN Repo
robocopy "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\1033\STYLES\Themable\osce\__"  "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\__\css" /MIR /xf *.*~
