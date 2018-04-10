echo "combine and compress"
type ^
	"..\js\core\pre.js" ^
	"..\js\libs\class.js"  ^
	"..\js\libs\__.js" > pre.js
type	^
	"..\js\libs\jquery1_10_2_min.js" ^
	"..\js\libs\jquery_plugs.js" ^
	"..\js\libs\jquery.livequery.js" ^
	"..\js\libs\jquery-ui.min.js" ^
	"..\js\libs\jquery_storageapi_min.js" ^
	"..\js\libs\linq.min.js" ^
	"..\js\libs\jquery.circletpreloader.min.js" ^
	"..\js\libs\mustache.min.js" ^
	"..\js\libs\jquery_fancytree.min.js" > libs.js
type ^
	"..\js\core\Utils.js" ^
	"..\js\core\Urls.js" ^
	"..\js\core\SPCore.js" ^
	"..\js\core\SPWeb.js" ^
	"..\js\core\SPList.js" ^
	"..\js\core\SPDocLib.js" ^
	"..\js\core\SPUser.js" ^
	"..\js\core\SPCommunicator.js" ^
	"..\js\core\SPPermissions.js" ^
	"..\js\core\SPGrid.js" ^
	"..\js\core\SPMyList.js" ^
	"..\js\core\WebServices.js" ^
	"..\js\core\Analytics.js" ^
	"..\js\core\Misc.js" ^
	"..\js\core\ServiceRequestsSocket.js" ^
	"..\js\navigation\MainNavigation.js" ^
	"..\js\navigation\SideBar.js" ^
	"..\js\navigation\ManageLibraries.js" ^
	"..\js\navigation\TreeView.js" ^
	"..\js\navigation\Bookmarks.js" ^
	"..\js\navigation\Permissions.js" ^
	"..\js\navigation\DLTypes.js" ^
	"..\js\core\post.js" > post.js
type ^
	"..\css\SPCustom.css" ^
	"..\css\WebParts.css" ^
	"..\css\MainNavigation.css" ^
	"..\css\SideBar.css" ^
	"..\css\fancytree.css" > all.css
rem java -jar yuicompressor-2.4.8.jar pre.js -o pre.min.js
java -jar closure-compiler-v20170626.jar --js post.js --js_output_file post.min.js
java -jar yuicompressor-2.4.8.jar all.css -o osce.css
rem for debugging no coimpresseion
rem copy pre.js "pre.min.js"
rem copy post.js "post.min.js"
rem copy osce.css "osce.css"
type ^
	"pre.js" ^
	"__.js" ^
	"libs.js" ^
	"post.min.js" > osce.js

For /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
For /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)

set pathCSS=C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\1033\STYLES\Themable\osce\
set pathJS=C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\osce\

ren "%pathJS%js\osce.js" "osce.js.bak.%mydate%_%mytime%"
copy osce.js "%pathJS%js\osce.js"

ren "%pathCSS%css\osce.css" "osce.css.bak.%mydate%_%mytime%"
copy osce.css "%pathCSS%css\osce.css"

java -jar closure-compiler-v20170626.jar --js "..\js\core\mds.js" -js_output_file mds.js
copy mds.js "%pathJS%js\mds.js"

rem ui elements not accessible on subsite

del all.css
del libs.js
rem del post.js
del post.min.js
del pre.js
del pre.min.js
rem del osce.css
rem del osce.js
rem del mds.js
