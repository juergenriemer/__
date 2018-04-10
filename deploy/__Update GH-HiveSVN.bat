REM Copy __ JS files from GitHub to SVN Repo
robocopy "C:\Users\admin_jriemer\Documents\GitHub\__\source" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\source" /MIR /xf *.*~
REM Copy __ docs files from GitHub to SVN Repo
robocopy "C:\Users\admin_jriemer\Documents\GitHub\__\docs" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\docs" /MIR /xf *.*~
REM Copy __ docs files from GitHub to SVN Repo
robocopy "C:\Users\admin_jriemer\Documents\GitHub\__\deploy" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\deploy" /MIR /xf *.*~

REM Copy __ CSS files from GitHub to Hive
robocopy "C:\Users\admin_jriemer\Documents\GitHub\__\source" "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\osce\__" /MIR /xf *.*~
