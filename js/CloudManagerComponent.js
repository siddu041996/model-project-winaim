function GetServiceDetails() {
    var myAjaxobj = new WiNAiMAjax();
    myAjaxobj.url = GetRelativeUrl("/Login/GetMyServiceDetails/");
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

function CloudManagerComponent() {
    this.ControlId = '';
    this.ProjectSelectorControlId = '';
    this.CloudManagerMetaData = null;
    var myInstance = this;

    this.Load = function () {
        if (myInstance.CloudManagerMetaData != undefined && myInstance.CloudManagerMetaData != null && myInstance.CloudManagerMetaData != '') {
            var oServiceDetailCreation = new ServiceDetailCreation();
            oServiceDetailCreation.CloudManagerMetaData = myInstance.CloudManagerMetaData;
            oServiceDetailCreation.ControlId = myInstance.ControlId;
            oServiceDetailCreation.ProjectSelectorControlId = myInstance.ProjectSelectorControlId;
            oServiceDetailCreation.Load();
        }
    }
}

function ServiceDetailCreation() {
    this.CloudManagerMetaData = null;
    this.ControlId = '';
    this.ProjectSelectorControlId = '';
    var myInstance = this;

    this.Load = function () {
        if (myInstance.CloudManagerMetaData != undefined && myInstance.CloudManagerMetaData != null) {
            var Html = '';
            var ServiceSettingDetails = myInstance.CloudManagerMetaData.ServiceSettingDetailsDTO;
            if (ServiceSettingDetails != null && ServiceSettingDetails != undefined && ServiceSettingDetails.length > 0) {
                try {
                    Html = myInstance.GetHtml(ServiceSettingDetails);
                }
                catch (ex) {
                    Html = '';
                }
            }
            myInstance.SetHtml(myInstance.ControlId, Html);
            myInstance.UpdateServiceSelection(myInstance.ControlId);

            $("#" + myInstance.ControlId).change(function () {
                var $this = $(this);
                window.localStorage.setItem("ServiceId", this.value);
                var _SessionUpdation = new SessionUpdation();
                _SessionUpdation.ClearMultipleSessionKey(["MyMenu", "ReportPlace", "ApprovalPlace", "DCPlaceDetails", "ShiftDataCaptureLst", "QueryStringValue"]);

                _SessionUpdation.SetSessionValue("ServiceId", this.value);
                //_SessionUpdation.SetSessionValue("ServiceName", this.textContent);
                window.localStorage.removeItem('CurrentMenuId');
                window.location.href = GetParentFolderOfApplication() + '/Login/HomePage';
            });
        }
    }

    this.GetHtml = function (ServiceSettingDetails) {
        var Html = '';
        var ServiceId = window.localStorage.getItem("ServiceId");
        if (ServiceSettingDetails != undefined && ServiceSettingDetails != null && ServiceSettingDetails.length > 0) {
            for (var itr = 0; itr < ServiceSettingDetails.length; itr++) {
                var ServiceMaster = ServiceSettingDetails[itr].ServiceMasterDTO;
                var ServiceName = _GetGlobalization.GetGlobalizationValue(ServiceMaster.Name);
                Html += '<option value = "' + ServiceMaster.OSGuid + '">' + ServiceName +
                '</option>';
                if ((ServiceId == null || ServiceId == undefined) && itr == 0) {
                    //var ProjectSelectorHtml = myInstance.GetProjectSelectorHtml(ServiceName);
                    //myInstance.SetHtml(myInstance.ProjectSelectorControlId, ProjectSelectorHtml);

                    updateServiceReleatedLocalStorageAndSession(ServiceMaster);
                }
                else if (ServiceId != null && ServiceId != undefined && ServiceMaster.OSGuid == ServiceId) {
                    //var ProjectSelectorHtml = myInstance.GetProjectSelectorHtml(ServiceName);
                    //myInstance.SetHtml(myInstance.ProjectSelectorControlId, ProjectSelectorHtml);

                    updateServiceReleatedLocalStorageAndSession(ServiceMaster);
                }
            }
        }
        return Html;
    }

    var updateServiceReleatedLocalStorageAndSession = function (ServiceMaster) {
        window.localStorage.setItem("ServiceId", ServiceMaster.OSGuid);
        window.localStorage.setItem("ServiceName", ServiceMaster.Name);
        var _SessionUpdation = new SessionUpdation();
        _SessionUpdation.SetSessionValue("ServiceId", ServiceMaster.OSGuid);
        _SessionUpdation.SetSessionValue("ServiceName", ServiceMaster.Name);
        if (ServiceMaster.ImageIcon != undefined && ServiceMaster.ImageIcon != null) {
            window.localStorage.setItem("ServiceImageIcon", ServiceMaster.ImageIcon);
            _SessionUpdation.SetSessionValue("ServiceImageIcon", ServiceMaster.ImageIcon);
        }
        if (ServiceMaster.HomePageUrl != undefined && ServiceMaster.HomePageUrl != null) {
            window.localStorage.setItem("ServiceHomePageUrl", ServiceMaster.HomePageUrl);
            _SessionUpdation.SetSessionValue("ServiceHomePageUrl", ServiceMaster.HomePageUrl);
        }
    }

    this.GetProjectSelectorHtml = function (ProjectSelectorName) {
        var Html = ProjectSelectorName + '<i class="material-icons right mdi mdi-chevron-down"></i>';
        return Html;
    }

    this.UpdateServiceSelection = function (ServiceDDLControlId) {
        var ServiceId = window.localStorage.getItem("ServiceId");
        var oServiceDDLControlId = document.getElementById(ServiceDDLControlId);
        if (oServiceDDLControlId != null && oServiceDDLControlId != undefined && oServiceDDLControlId.options != null && oServiceDDLControlId.options != undefined) {
            for (var itr = 0; itr < oServiceDDLControlId.options.length; itr++) {
                if (oServiceDDLControlId.options[itr].value == ServiceId)
                    oServiceDDLControlId.options[itr].selected = true;
                else
                    oServiceDDLControlId.options[itr].selected = false;
            }
        }
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
}