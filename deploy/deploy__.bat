SET pathBuild=C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\
echo "compress core"
SET pathCore=C:\\Users\\admin_jriemer\\Projects\\Osce.Lib.JS\\source\\core\\
REM npx google-closure-compiler --js="%pathCore%DOM\\__.DOM.js" --js_output_file="%pathBuild%__.dom_1.0.0.min.js"
echo "next"
REM npx google-closure-compiler --js="%pathCore%Class\\__.Class.js" --js_output_file="%pathBuild%__.class_1.0.0.min.js"
echo "next"
REM npx google-closure-compiler --js="%pathCore%Event\\__.Event.js" --js_output_file="%pathBuild%__.event_1.0.0.min.js"
echo "next"
REM npx google-closure-compiler --js="%pathCore%Utils\\__.Utils.js" --js_output_file="%pathBuild%__.utils_1.0.0.min.js"
REM npx google-closure-compiler --js="%pathCore%Async\\__.Async.js" --js_output_file="%pathBuild%__.async_1.0.0.min.js"

echo "copy back to tests"

copy "%pathBuild%__.dom_1.0.0.min.js" "%pathCore%DOM\\__.DOM.min.js"
copy "%pathBuild%__.class_1.0.0.min.js" "%pathCore%Class\\__.Class.min.js"
copy "%pathBuild%__.event_1.0.0.min.js" "%pathCore%Event\\__.Event.min.js"
copy "%pathBuild%__.utils_1.0.0.min.js" "%pathCore%Utils\\__.Utils.min.js"
copy "%pathBuild%__.async_1.0.0.min.js" "%pathCore%Async\\__.Async.min.js"

echo "combine core"
type ^
	%pathBuild%__.async_1.0.0.min.js ^
	%pathBuild%__.dom_1.0.0.min.js ^
	%pathBuild%__.class_1.0.0.min.js ^
	%pathBuild%__.event_1.0.0.min.js ^
	%pathBuild%__.utils_1.0.0.min.js ^
	> %pathBuild%__.core_1.0.0.min.js

echo "compress plugins"

REM npx google-closure-compiler --js="C:\Users\admin_jriemer\Projects\Osce.Lib.JS\source\plugins\autocomplete\__.autocomplete.js" --js_output_file="C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\__.autocomplete_1.0.0.min.js"
copy "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\source\plugins\autocomplete\__.autocomplete.js" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\__.autocomplete_1.0.0.min.js"
copy "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\source\plugins\lock\__.lock.js" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\__.lock_1.0.0.min.js"
copy "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\source\plugins\mustache\mustache.min.js" "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\mustache.min.js"

echo "combine plugins"
type ^
	"C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\__.autocomplete_1.0.0.min.js" ^
	"C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\__.lock_1.0.0.min.js" ^
	"C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\mustache.min.js" ^
	> "C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\__.plugins_1.0.0.min.js"


echo "compress and combine SP"
SET pathSP=C:\Users\admin_jriemer\Projects\Osce.Lib.JS\source\SP\
type ^
	%pathSP%__.SP.js ^
	%pathSP%__.SP.caml.js ^
	%pathSP%__.SP.error.js ^
	%pathSP%__.SP.filter.js ^
	%pathSP%__.SP.filter.form.js ^
	%pathSP%__.SP.form.js ^
	%pathSP%__.SP.grid.js ^
	%pathSP%__.SP.item.js ^
	%pathSP%__.SP.list.js ^
	%pathSP%__.SP.modal.js ^
	%pathSP%__.SP.permission.js ^
	%pathSP%__.SP.ribbon.js ^
	%pathSP%__.SP.taxonomy.js ^
	%pathSP%__.SP.user.js ^
	%pathSP%__.SP.view.js ^
	%pathSP%__.SP.webpart.js ^
	%pathSP%__.SP.webservice.js ^
	> %pathBuild%__.sp_1.0.0.min.js


echo "combine __"
type ^
	%pathBuild%__.core_1.0.0.min.js ^
	%pathBuild%__.plugins_1.0.0.min.js ^
	%pathBuild%__.sp_1.0.0.min.js ^
	> %pathBuild%__.1.0.0.min.js

echo "copy to hive"

SET pathHive=C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\osce\
copy "%pathBuild%__.1.0.0.min.js" "%pathHive%__.1.0.0.min.js"

