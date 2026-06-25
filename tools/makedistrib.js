var files = new Array("yamy.ini", "104.mayu", "109.mayu", "default.mayu", "emacsedit.mayu", "104on109.mayu", "109on104.mayu", "dot.mayu", "workaround.mayu", "workaround.reg", "readme.txt", "yamy.exe", "yamy32", "yamy32.dll", "yamyd32", "yamy64", "yamy64.dll");

var config = WScript.Arguments.Item(0); // "Debug" or "Release"
var version = WScript.Arguments.Item(1); // x.yz
if (config == null || version == null) {
	throw new Error("usage: CScript.exe makedistrib.js {Debug | Release} <version>");
}

var targetDir = "..\\" + config + "\\";
var pkgFile = "yamy-" + version + ".zip";

var fso = WScript.CreateObject("Scripting.FileSystemObject");
if (fso == null) {
	throw new Error("can't create File System Object!");
}

var shell = WScript.CreateObject("WScript.Shell");
if (shell == null) {
	throw new Error("can't create WScript.Shell object!");
}

if (fso.FolderExists(targetDir) == false) {
	fso.CreateFolder(targetDir);
}

// resolve absolute paths before changing the current directory.
var absTargetDir = fso.GetAbsolutePathName(targetDir);
var absPkgPath = fso.BuildPath(absTargetDir, pkgFile);

// remove the old package if any.
if (fso.FileExists(absPkgPath)) {
	fso.DeleteFile(absPkgPath);
}

// verify all input files exist and build the argument list.
var args = "";
for (var i = 0; i < files.length; i++) {
	var path = fso.BuildPath(absTargetDir, files[i]);
	if (fso.FileExists(path) == false) {
		throw new Error("can't pack " + path + "!");
	}
	args += " \"" + files[i] + "\"";
}

// pack with tar.exe (bundled with Windows 10/11). running from inside the
// target directory stores entries without a directory prefix. unlike the
// old Shell.Application/CopyHere approach this works under CScript with no
// interactive desktop session.
shell.CurrentDirectory = absTargetDir;

var cmd = "tar.exe -a -c -f \"" + pkgFile + "\"" + args;
var rc = shell.Run(cmd, 0, true);
if (rc != 0) {
	if (fso.FileExists(absPkgPath)) {
		fso.DeleteFile(absPkgPath);
	}
	throw new Error("tar.exe failed with exit code " + rc + " for " + pkgFile);
}
