var CompleteMenuMetadata = null;

function GetMenuMetaData() {
    var myAjaxobj = new WiNAiMAjax();
    myAjaxobj.url = GetRelativeUrl("/Login/GetMenus/");
    myAjaxobj.webMethod = "post";
    myAjaxobj.async = false;
    myAjaxobj.contentType = 'application/json; charset=utf-8';
    myAjaxobj.dataType = 'json';
    var result = myAjaxobj.execute();
    if (result != undefined && result != null && result != '') {
        try {
            result = result;
            if (typeof (result) == 'object')
                return result;
            else
                return null;
        }
        catch (ex) {
            return null;
        }
    }
    else {
        return null;
    }
}

function GetSmartMenuMetaData() {
    var myAjaxobj = new WiNAiMAjax();
    myAjaxobj.url = GetRelativeUrl("/Login/GetSmartMenu/");
    myAjaxobj.webMethod = "post";
    myAjaxobj.async = false;
    myAjaxobj.contentType = 'application/json; charset=utf-8';
    myAjaxobj.dataType = 'json';
    var result = myAjaxobj.execute();
    if (result != undefined && result != null && result != '') {
        try {
            result = result;
            if (typeof (result) == 'object')
                return result;
            else
                return null;
        }
        catch (ex) {
            return null;
        }
    }
    else {
        return null;
    }
}

function GetRouterUrlByKey(param) {
    var myAjaxobj = new WiNAiMAjax();
    myAjaxobj.url = GetRelativeUrl("/Login/GetRouterUrlByKey/");
    myAjaxobj.webMethod = "post";
    myAjaxobj.async = false;
    myAjaxobj.contentType = 'application/json; charset=utf-8';
    myAjaxobj.dataType = 'json';
    myAjaxobj.parameter = param;
    var result = myAjaxobj.execute();
    if (result != undefined && result != null && result != '') {
        try {
            result = result;
            if (typeof (result) == 'object')
                return result;
            else
                return null;
        }
        catch (ex) {
            return null;
        }
    }
    else {
        return null;
    }
}

function DatMenuComponent() {
    this.ControlId = '';
    this.MenuMetaData = null;
    this.MenuType = '';
    var myInstance = this;
    CompleteMenuMetadata = myInstance.MenuMetaData;
    this.Load = function () {
        MenuType = myInstance.MenuType;
        if (myInstance.MenuMetaData != undefined && myInstance.MenuMetaData != null && myInstance.MenuMetaData != '') {
            var oFactory = new Factory();
            var oMenuCreation = oFactory.MenuType(MenuType);
            oMenuCreation.MenuMetaData = myInstance.MenuMetaData;
            oMenuCreation.ControlId = myInstance.ControlId;
            oMenuCreation.Load();
        }
        else
            $("#shortcut").addClass('hide');
    }
}

function MenuCreation() {
    this.MenuMetaData = null;
    this.ControlId = '';
    this.MenuType = '';
    var myInstance = this;

    this.Load = function () {
        if (myInstance.MenuMetaData != undefined && myInstance.MenuMetaData != null) {
            var Html = '';
            var DatMenuDetails = myInstance.MenuMetaData;
            // var DatMenuDetails = myInstance.MenuMetaData.MenuConfig;
            if (DatMenuDetails != null && DatMenuDetails != '' && DatMenuDetails != undefined) {
                try {
                    //Html = myInstance.GetHtml(JSON.parse(DatMenuDetails));
                    Html = myInstance.GetHtml(DatMenuDetails);
                }
                catch (ex) {
                    Html = '';
                }
            }
            var oAppendOrSetHtml = new AppendOrSetHtml();
            oAppendOrSetHtml.ControlId = myInstance.ControlId;
            oAppendOrSetHtml.Html = Html;
            oAppendOrSetHtml.AppendToHtml();
        }
    }

    this.GetHtml = function (SubMenu) {
        var Html = '';
        if (SubMenu != undefined && SubMenu != null) {
            // var SubMenuLst = SubMenu.SubDatMenuDetails;
            var SubMenuLst = SubMenu;
            if (SubMenuLst != undefined && SubMenuLst != null && SubMenuLst.length > 0) {
                Html += myInstance.GetSubMenuHtml(SubMenuLst);
            }
        }
        return Html;
    }

    this.GetSubMenuHtml = function (MenuLst) {
        var Html = '';
        for (var itr = 0; itr < MenuLst.length; itr++) {
            var SubMenuLst = MenuLst[itr].SubDatMenuDetails;
            if (MenuLst[itr].IsMenuGroup != undefined && MenuLst[itr].IsMenuGroup != null && MenuLst[itr].IsMenuGroup &&
                SubMenuLst != undefined && SubMenuLst != null && SubMenuLst.length > 0) {
                Html += '<li class = "no-padding"><ul class = "collapsible collapsible-accordion"><li class="bold"><a href="javascript:void(0);" class = "collapsible-header  waves-effect waves-teal active"><i class="' + MenuLst[itr].Icon + '"></i> ' +
                    '<span class="menu-item-parent"> ' + _GetGlobalization.GetGlobalizationValue(MenuLst[itr].DisplayNameKey) + '</span></a>' +
                    '<div class="collapsible-body" style="display:none;"><ul>';
                Html += myInstance.GetSubMenuHtml(SubMenuLst);
                Html += '</ul></div></li></ul></li>';
            }
            else if (MenuLst[itr].IsMenuGroup != undefined && MenuLst[itr].IsMenuGroup != null && !MenuLst[itr].IsMenuGroup) {
                Html += myInstance.GetMenuDetailHtml(MenuLst[itr]);
            }
        }
        return Html;
    }

    this.GetMenuDetailHtml = function (MenuDetail) {
        var Html = '';
        if (MenuDetail != undefined && MenuDetail != null) {
            var Routerkey = null; /*GetRouterUrlByKey(JSON.stringify({ Routerkey: MenuDetail.RouterKey }));*/
            if (MenuDetail.MenuEventHandler != undefined && MenuDetail.MenuEventHandler != null && MenuDetail.MenuEventHandler.length > 0) {
                Html += '<li id="li_' + StringReplace(MenuDetail.RouterKey) + '">' +
              '<a href="javascript:void(0);" class = "waves-effect padding-hrz-15" title="' +
              _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '" onclick="RegisterEvent(this,' + MenuDetail.MenuEventHandler + ')"><i class="' + MenuDetail.Icon + '"></i> ' +
              '<span class="menu-item-parent">' + _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '</span></a>' +
                    '</li>';
            }
            else {
                Html += '<li id="li_' + StringReplace(MenuDetail.RouterKey) + '">' +
                 '<a class = "waves-effect padding-hrz-15" href="' + GetParentFolderOfApplication() + "/" + (Routerkey != null && Routerkey != undefined && Routerkey != '' ? Routerkey : MenuDetail.RouterKey) + '" title="' +
                 _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '"><i class="' + MenuDetail.Icon + '"></i> ' +
                 '<span class="menu-item-parent">' + _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '</span></a>' +
                       '</li>';
            }

        }
        return Html;
    }

    //var StringReplace = function (OldString, ReplaceChar, ReplaceWithChar) {
    //    OldString = OldString.replace(ReplaceChar, ReplaceWithChar);
    //    if (OldString.indexOf(ReplaceChar) >= 0) {
    //        OldString = StringReplace(OldString, ReplaceChar, ReplaceWithChar);
    //    }
    //    else
    //        return OldString;
    //    return OldString;
    //}
    var StringReplace = function (OldString) {
        OldString = OldString.replace(/[&\/\\#,+=()$~%.'":*?<>{}]/, '');
        if (OldString.match(/[&\/\\#,+=()$~%.'":*?<>{}]/)) {
            OldString = StringReplace(OldString);
        }
        else
            return OldString;
        return OldString;
    }
}

function OtherMenuCreation() {
    this.MenuMetaData = null;
    this.ControlId = '';
    var myInstance = this;

    this.Load = function () {
        if (myInstance.MenuMetaData != undefined && myInstance.MenuMetaData != null) {
            $("#shortcut").removeClass('hide');
            var Html = '';
            var DatMenuDetails = myInstance.MenuMetaData;
            if (DatMenuDetails != null && DatMenuDetails != '' && DatMenuDetails != undefined) {
                try {
                    Html = myInstance.GetHtml(DatMenuDetails);
                }
                catch (ex) {
                    Html = '';
                }
            }
            myInstance.SetHtml(myInstance.ControlId, Html);
        }
        else
            $("#shortcut").addClass('hide');
    }

    this.GetHtml = function (SubMenu) {
        var Html = '';
        if (SubMenu != undefined && SubMenu != null) {
            var SubMenuLst = SubMenu;
            if (SubMenuLst != undefined && SubMenuLst != null && SubMenuLst.length > 0) {
                Html += myInstance.GetSubMenuHtml(SubMenuLst);
            }
        }
        return Html;
    }

    this.GetSubMenuHtml = function (MenuLst) {
        var Html = '';
        for (var itr = 0; itr < MenuLst.length; itr++) {
            var SubMenuLst = MenuLst[itr].SubDatMenuDetails;
            if (MenuLst[itr].IsMenuGroup != undefined && MenuLst[itr].IsMenuGroup != null && MenuLst[itr].IsMenuGroup &&
                SubMenuLst != undefined && SubMenuLst != null && SubMenuLst.length > 0) {
                Html += '<li><a href="javascript:void(0);"><i class="' + MenuLst[itr].Icon + '"></i> ' +
                    '<span class="menu-item-parent"> ' + _GetGlobalization.GetGlobalizationValue(MenuLst[itr].DisplayNameKey) + '</span></a><ul>';
                Html += myInstance.GetSubMenuHtml(SubMenuLst);
                Html += '</ul></li>';
            }
            else if (MenuLst[itr].IsMenuGroup != undefined && MenuLst[itr].IsMenuGroup != null && !MenuLst[itr].IsMenuGroup) {
                Html += myInstance.GetMenuDetailHtml(MenuLst[itr]);
            }
        }
        return Html;
    }

    this.GetMenuDetailHtml = function (MenuDetail) {
        var Html = '';
        if (MenuDetail != undefined && MenuDetail != null) {
            var Routerkey = null; /*GetRouterUrlByKey(JSON.stringify({ Routerkey: MenuDetail.RouterKey }));*/
           
            if (MenuDetail.MenuEventHandler != undefined && MenuDetail.MenuEventHandler != null && MenuDetail.MenuEventHandler.length > 0) {
                Html += '<li id="li_' + StringReplace(MenuDetail.OperationKey) + '">' +
              '<a href="javascript:void(0);" title="' +
              _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '" onclick="RegistersEvent(this,\'' + MenuDetail.MenuEventHandler + '\')" class = "' + MenuDetail.Style.Styleclass + '" id="id_' + StringReplace(MenuDetail.OperationKey, "/", "") + '"><span class="iconbox"><i class="' + MenuDetail.Icon + '"></i> ' +
              '<span>' + _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '</span></span></a>' +
                    '</li>';
            }
            else {
                Html += '<li id="li_' + StringReplace(MenuDetail.OperationKey) + '">' +
                 '<a href="' + (Routerkey != null && Routerkey != undefined && Routerkey != '' ? GetParentFolderOfApplication() + "/" + Routerkey : (MenuDetail.RouterKey != null && MenuDetail.RouterKey != undefined && MenuDetail.RouterKey != '' ? GetParentFolderOfApplication() + "/" + MenuDetail.RouterKey : "javascript:void(0);")) + '" title="' +
                 _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '" class="' + MenuDetail.Style.Styleclass + '" id="id_' + StringReplace(MenuDetail.OperationKey, "/", "") + '"><span class="iconbox"><i class="' + MenuDetail.Icon + '"></i> ' +
                 '<span >' + _GetGlobalization.GetGlobalizationValue(MenuDetail.DisplayNameKey) + '</span></span></a>' +
                       '</li>';
            }

        }
        return Html;
    }

    this.SetHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
                Control.innerHTML = Html;
            }
        }
    }

    //var StringReplace = function (OldString, ReplaceChar, ReplaceWithChar) {
    //    OldString = OldString.replace(ReplaceChar, ReplaceWithChar);
    //    if (OldString.indexOf(ReplaceChar) >= 0) {
    //        OldString = StringReplace(OldString, ReplaceChar, ReplaceWithChar);
    //    }
    //    else
    //        return OldString;
    //    return OldString;
    //}

    var StringReplace = function (OldString) {
        OldString = OldString.replace(/[&\/\\#,+=()$~%.'":*?<>{}]/, '');
        if (OldString.match(/[&\/\\#,+=()$~%.'":*?<>{}]/)) {
            OldString = StringReplace(OldString);
        }
        else
            return OldString;
        return OldString;
    }

    var StyleSeparator = function (Styles) {
        var temp = new Array();
        temp = Styles.split(",");
        return temp;
    }
}

function RegistersEvent($this, JobName) {
    var jobEvent = new window[JobName]($this);
    if (jobEvent != undefined && jobEvent != null)
        jobEvent.execute();
}