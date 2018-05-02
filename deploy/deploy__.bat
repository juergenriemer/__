SET nVersion=1.0.1
SET pathBuild=C:\Users\admin_jriemer\Projects\Osce.Lib.JS\builds\
echo "compress core"
SET pathCore=C:\\Users\\admin_jriemer\\Projects\\Osce.Lib.JS\\source\\core\\
SET pathPlugins=C:\\Users\\admin_jriemer\\Projects\\Osce.Lib.JS\\source\\plugins\\

echo "combine core"
type ^
	%pathCore%\async\__.async.min.js ^
	%pathCore%\dom\__.dom.min.js ^
	%pathCore%\class\__.class.min.js ^
	%pathCore%\event\__.event.min.js ^
	%pathCore%\utils\__.utils.min.js ^
	> %pathBuild%__.core.min.js

echo "combine plugins"
type ^
	%pathPlugins%autocomplete\__.autocomplete.min.js ^
	%pathPlugins%lock\__.lock.min.js ^
	%pathPlugins%mustache\mustache.min.js ^
	> %pathBuild%__.plugins.min.js

echo "combine SP"
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
	> %pathBuild%__.sp.min.js


echo "combine __"
type ^
	%pathBuild%__.core.min.js ^
	%pathBuild%__.plugins.min.js ^
	%pathBuild%__.sp.min.js ^
	> %pathBuild%__.%nVersion%.min.js

echo "copy to hive"

SET pathHive=C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\osce\
copy "%pathBuild%__.%nVersion%.min.js" "%pathHive%__.%nVersion%.min.js"



