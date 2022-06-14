﻿var ModelUpdate = null;

function LoadControlData(PageModel) {
    var Model = PageModel;
    this.MergePageConfig = false;
    this.lcontrolDict = null;
    var myinstance = this;
    this.Load = function () {
        if (Model.ControlGroupConfigLst.length > 0) {
            Model = myinstance.GetControlConfigDict(Model);
            var ltempModel = Model;
            if (myinstance.MergePageConfig != undefined && myinstance.MergePageConfig != null) {
                if (!myinstance.MergePageConfig)
                    ModelUpdate = Model;
                else {
                    if (Model.ControlGroupConfigLst != undefined && Model.ControlGroupConfigLst != null && ModelUpdate.ControlGroupConfigLst != undefined
                        && ModelUpdate.ControlGroupConfigLst != null) {
                        for (var itr = 0; itr < Model.ControlGroupConfigLst.length; itr++) {
                            ModelUpdate.ControlGroupConfigLst.push(Model.ControlGroupConfigLst[itr]);
                        }
                        Model = myinstance.GetControlConfigDict(ModelUpdate);
                        ModelUpdate = Model;
                    }
                }
            }
            else
                ModelUpdate = Model;
            var _DynamicPage = new DynamicPage(ltempModel);
            _DynamicPage.LoadPage();
        }
    }

    this.GetControlConfigDict = function (Model) {
        if (Model.ControlGroupConfigLst.length > 0) {
            for (var groupItem in Model.ControlGroupConfigLst) {
                var lControlGroupConfigLst = Model.ControlGroupConfigLst[groupItem].ControlGroupConfigLst;
                var lControlConfigDict = Model.ControlGroupConfigLst[groupItem].ControlConfigDict;
                if (typeof (Model.ControlGroupConfigLst[groupItem]) != 'function' && lControlGroupConfigLst != undefined && lControlGroupConfigLst != null && lControlGroupConfigLst.length > 0) {
                    CollectControlsFromGroup(lControlGroupConfigLst);
                }
                if (lControlConfigDict != undefined && lControlConfigDict != null) {
                    if (this.lcontrolDict != null) {
                        for (var item in lControlConfigDict) {
                            this.lcontrolDict[item] = lControlConfigDict[item];
                        }
                        lControlConfigDict = this.lcontrolDict;
                    }
                    else {
                        this.lcontrolDict = lControlConfigDict;
                    }
                }
            }
            if (Model.ControlGroupConfigLst != undefined && Model.ControlGroupConfigLst != null && Model.ControlGroupConfigLst.length > 1)
                Model.ControlGroupConfigLst.remove(1, Model.ControlGroupConfigLst.length);
            Model.ControlGroupConfigLst[0].ControlConfigDict = this.lcontrolDict;
            Model.ControlGroupConfigLst[0].ControlGroupConfigLst = [];
        }
        return Model;
    }

    this.GetParamFromControlConfig = function () {
        if (Model.ControlGroupConfigLst != undefined && Model.ControlGroupConfigLst != null && Model.ControlGroupConfigLst.length > 0) {
            var _DynamicPage = new DynamicPage(Model);
            var GridLoadParameters = getGridLoadParameters(Model.ControlGroupConfigLst)
            var params = _DynamicPage.GetLoadParameterList(GridLoadParameters);
            return params;
        }
    }

    var getGridLoadParameters = function (ControlGroupConfigLst) {
        var GridLoadParameters = [];
        for (var ControlGroup in ControlGroupConfigLst) {
            if (ControlGroupConfigLst[ControlGroup].ControlGroupConfigLst != undefined && ControlGroupConfigLst[ControlGroup].ControlGroupConfigLst.length > 0) {
                var params = getGridLoadParameters(ControlGroup.ControlGroupConfigLst);
                for (var param in params)
                    GridLoadParameters.push(param);
            }
            else if (ControlGroupConfigLst[ControlGroup].ControlGroupConfigLst != undefined && ControlGroupConfigLst[ControlGroup].ControlGroupConfigLst.length == 0) {
                for (var Control in ControlGroupConfigLst[ControlGroup].ControlConfigDict) {
                    if (ControlGroupConfigLst[ControlGroup].ControlConfigDict[Control].ControlTypeName != "GridControl")
                        GridLoadParameters.push(ControlGroupConfigLst[ControlGroup].ControlConfigDict[Control].ClientID)
                }
            }
        }
        return GridLoadParameters;
    }

    var CollectControlsFromGroup = function (ControlGroupConfigLst) {
        for (var groupItem in ControlGroupConfigLst) {
            var lControlGroupConfigLst = ControlGroupConfigLst[groupItem].ControlGroupConfigLst;
            var lControlConfigDict = ControlGroupConfigLst[groupItem].ControlConfigDict;
            if (typeof (ControlGroupConfigLst[groupItem]) != 'function' && lControlGroupConfigLst.length > 0) {
                CollectControlsFromGroup(lControlGroupConfigLst);
            }
            if (typeof (ControlGroupConfigLst[groupItem]) != 'function' && lControlGroupConfigLst.length == 0 && lControlConfigDict != undefined && lControlConfigDict != null) {
                if (myinstance.lcontrolDict != null) {
                    for (var item in lControlConfigDict) {
                        myinstance.lcontrolDict[item] = lControlConfigDict[item];
                    }
                    lControlConfigDict = this.lcontrolDict;
                }
                else {
                    myinstance.lcontrolDict = lControlConfigDict;
                }
            }
        }
    }
}

function DynamicPage(Model) {
    var PageConfig = Model;
    _WiNAiMValidationConfig = PageConfig.WiNAiMValidationConfig;
    _LocalMessageList = PageConfig.LocalMessage;

    //this.PageConfig =_PageConfig;
    var myInstance = this;

    this.LoadPage = function () {
        $.each(PageConfig.RenderOrder, function (key, ClientID) {

            var ControlConfigObj = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];
            myInstance.LoadControlsWithData(ControlConfigObj);
        });
    }
    // It will clear the all values present in master config
    this.New = function () {
        var _DynamicPage = new DynamicPage(PageConfig.HTMLPageID);
        $.each(PageConfig.ControlGroupConfigLst[0].ControlConfigDict, function (key, ControlConfigDict) {
            _DynamicPage.SetData(ControlConfigDict, "");
        });
    }

    this.GetMyControlConfigUsingClientId = function (ClientId) {
        if (PageConfig != undefined && PageConfig != null) {
            if (PageConfig.ControlGroupConfigLst != undefined && PageConfig.ControlGroupConfigLst != null && PageConfig.ControlGroupConfigLst.length > 0) {
                var PageControlConfigDct = PageConfig.ControlGroupConfigLst[0].ControlConfigDict;
                if (PageControlConfigDct != undefined && PageControlConfigDct != null && PageControlConfigDct[ClientId] != null && PageControlConfigDct[ClientId] != undefined) {
                    return PageControlConfigDct[ClientId];
                }
            }
        }
        return null;
    }

    this.LoadControlsWithData = function (ControlConfigObj) {
        if (ControlConfigObj.ControlTypeName == 'ComboBox') {
            myInstance.LoadComboboxControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'TextBox') {
            myInstance.LoadTextBoxControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'RadioButton') {
            myInstance.LoadRadioButtonControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'CheckBox') {
            myInstance.LoadCheckBoxControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'DatePicker') {
            myInstance.LoadDatePickerControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'Hidden') {
            myInstance.LoadHiddenControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'LinkControl') {
            myInstance.LoadLinkControl(ControlConfigObj);
        }
        if (ControlConfigObj.ControlTypeName == 'ImageControl') {
            myInstance.LoadImageControl(ControlConfigObj);
        }
    }

    this.LoadComboboxControl = function (ControlConfig) {

        var _Combobox = new WiNAiMComboBox(PageConfig);
        _Combobox.async = ControlConfig.async;
        _Combobox.Load(ControlConfig);
        if (ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != undefined)
            _Combobox.setData(ControlConfig, ControlConfig.DefaultValue);
        
    }

    this.LoadTextBoxControl = function (ControlConfig) {
        var _TextBox = new WiNAiMTextBox(PageConfig);

        _TextBox.Load(ControlConfig);

        if (ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != undefined)
            _TextBox.setData(ControlConfig, ControlConfig.DefaultValue);
        else
            _TextBox.setData(ControlConfig, '');
        //alert(ControlConfig.DefaultValue);
    }

    this.LoadRadioButtonControl = function (ControlConfig) {
        var _RadioButton = new WiNAiMRadioButton(PageConfig);
        _RadioButton.Load(ControlConfig);
    }

    this.LoadCheckBoxControl = function (ControlConfig) {
        var _CheckBox = new WiNAiMCheckBox(PageConfig);
        _CheckBox.Load(ControlConfig, ControlConfig.checked);
    }

    this.LoadDatePickerControl = function (ControlConfig) {
        var _DatePicker = new WiNAiMDatePicker(PageConfig);
        _DatePicker.Load(ControlConfig);
        if (ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != undefined)
            _DatePicker.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.LoadHiddenControl = function (ControlConfig) {
        var _HiddenControl = new WiNAiMHiddenControl(PageConfig);
        _HiddenControl.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.LoadLinkControl = function (ControlConfig) {
        var _LinkControl = new WiNAiMLinkControl(PageConfig);
        _LinkControl.Load(ControlConfig);
    }

    this.LoadImageControl = function (ControlConfig) {
        var _ImageControl = new WiNAiMImageControl(PageConfig);
        if (ControlConfig.ImageControlTypeName == "File")
            _ImageControl.Load(ControlConfig);
        else
        _ImageControl.setData(ControlConfig, ControlConfig.DefaultValue);
    }
    ///******* get ControlValue start ********************

    this.getControlValue = function (ControlConfig) {

        if (ControlConfig.ControlTypeName == "ComboBox") {
            return myInstance.getControlValue_combo(ControlConfig);
        }

        else if (ControlConfig.ControlTypeName == "TextBox") {
            return myInstance.getControlValue_TextBox(ControlConfig);
        }

        else if (ControlConfig.ControlTypeName == "RadioButton") {
            return myInstance.getControlValue_RadioButton(ControlConfig);
        }

        else if (ControlConfig.ControlTypeName == "CheckBox") {
            return myInstance.getControlValue_CheckBox(ControlConfig);
        }

        else if (ControlConfig.ControlTypeName == "DatePicker") {
            return myInstance.getControlValue_DatePicker(ControlConfig);
        }

        else if (ControlConfig.ControlTypeName == "Hidden") {
            return myInstance.getControlValue_Hidden(ControlConfig);
        }
    }

    this.getControlValue_combo = function (ControlConfig) {

        var _Combobox = new WiNAiMComboBox(PageConfig);
        return _Combobox.SelectedValue(ControlConfig);
    }

    this.getControlName_combo = function (ControlConfig) {

        var _Combobox = new WiNAiMComboBox(PageConfig);
        return _Combobox.SelectedName(ControlConfig);
    }

    this.getControlValue_TextBox = function (ControlConfig) {

        var _TextBox = new WiNAiMTextBox(PageConfig);
        return _TextBox.Text(ControlConfig);
    }

    this.getControlValue_RadioButton = function (ControlConfig) {

        var _RadioButton = new WiNAiMRadioButton(PageConfig);
        return _RadioButton.getControlValueFromGroup(ControlConfig);
    }

    this.getSelectedOptionText_RadioButton = function (ControlConfig) {

        var _RadioButton = new WiNAiMRadioButton(PageConfig);
        return _RadioButton.getSelectedOptionText(ControlConfig);
    }

    this.getControlValue_CheckBox = function (ControlConfig) {

        var _CheckBox = new WiNAiMCheckBox(PageConfig);
        if (ControlConfig.CheckBoxType == 0)
            return _CheckBox.getControlValue(ControlConfig);
        else
            return _CheckBox.getControlValueFromGroup(ControlConfig);
    }

    this.getControlValue_DatePicker = function (ControlConfig) {

        var _DatePicker = new WiNAiMDatePicker(PageConfig);
        return _DatePicker.getControlValue(ControlConfig);
    }

    this.getControlValue_Hidden = function (ControlConfig) {

        var _HiddenControl = new WiNAiMHiddenControl(PageConfig);
        return _HiddenControl.Text(ControlConfig);
    }

    this.getControlValue_Image = function (ControlConfig) {

        var _ImageControl = new WiNAiMImageControl(PageConfig);
        return _ImageControl.getValue(ControlConfig);
    }

    ///******* get ControlValue end ********************


    ///******* Set ControlValue start ********************

    ///Result is result object(ex:UserEntity ,
    this.SetDataInPage = function (Result) {
        $.each(PageConfig.ControlGroupConfigLst[0].ControlConfigDict, function (key, ControlConfig) {
            myInstance.SetData(ControlConfig, Result[ControlConfig.ControlID]);
        });
    }

    //Description:
    //parm Info:
    //  'ControlConfig' =
    //  'value'=
    //Note:
    //ToDO:
    this.SetData = function (ControlConfig, value) {

        if (ControlConfig.ControlTypeName == "ComboBox") {
            myInstance.setControlValue_combo(ControlConfig, value);
        }
        if (ControlConfig.ControlTypeName == "TextBox") {
            myInstance.setControlValue_TextBox(ControlConfig, value);
        }
        if (ControlConfig.ControlTypeName == "RadioButton") {
            myInstance.setControlValue_RadioButton(ControlConfig, value);
        }
        if (ControlConfig.ControlTypeName == "CheckBox") {
            myInstance.setControlValue_CheckBox(ControlConfig, value);
        }
        if (ControlConfig.ControlTypeName == "DatePicker") {
            myInstance.setControlValue_DatePicker(ControlConfig, value);
        }
        if (ControlConfig.ControlTypeName == "Hidden") {
            myInstance.setControlValue_Hidden(ControlConfig, value);
        }
        if (ControlConfig.ControlTypeName == "ImageControl") {
            myInstance.setControlValue_Image(ControlConfig, value);
        }
    }

    this.setControlValue_combo = function (ControlConfig, value) {
        var _ComboBox = new WiNAiMComboBox(PageConfig);
        _ComboBox.setData(ControlConfig, value);
    }

    this.setControlValue_TextBox = function (ControlConfig, value) {
        var _TextBox = new WiNAiMTextBox(PageConfig);
        _TextBox.setData(ControlConfig, value);
    }

    this.setControlValue_RadioButton = function (ControlConfig, value) {
        var _RadioButton = new WiNAiMRadioButton(PageConfig);
        _RadioButton.setData(ControlConfig, value);
    }

    this.setControlValue_CheckBox = function (ControlConfig, value) {
        var _CheckBox = new WiNAiMCheckBox(PageConfig);
        _CheckBox.setData(ControlConfig, value);
    }

    this.setControlValue_DatePicker = function (ControlConfig, value) {
        var _DatePicker = new WiNAiMDatePicker(PageConfig);
        _DatePicker.setData(ControlConfig, value);
    }

    this.setControlValue_Hidden = function (ControlConfig, value) {
        var _HiddenControl = new WiNAiMHiddenControl(PageConfig);
        _HiddenControl.setData(ControlConfig, value);
    }

    this.setControlValue_Image = function (ControlConfig, value) {
        var _ImageControl = new WiNAiMImageControl(PageConfig);
        _ImageControl.setData(ControlConfig, value);
    }

    ///******* Set ControlValue end *********************


    ///******* Load ControlValue end ********************
    this.LoadLabel = function (ControlConfig) {

    }

    this.LoadDateTime = function (ControlConfig) {

    }

    this.LoadRadioButton = function (ControlConfig) {

    }

    this.LoadCheckBox = function (ControlConfig) {

    }
    ///******* Load ControlValue end *********************


    this.GetLoadParameterList = function (LoadParamClientIDList) {

        var result = {};
        var value;
        var name;
        if (LoadParamClientIDList != null) {
            $.each(LoadParamClientIDList, function (index, ClientID) {

                var ControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];

                if (ControlConfig.ControlTypeName == "ComboBox") {
                    value = myInstance.getControlValue_combo(ControlConfig);
                    name = myInstance.getControlName_combo(ControlConfig);
                    name = name == undefined || name == null || name == '' ? '' : name;
                    if (ControlConfig.IsAllowDataClear != undefined && ControlConfig.IsAllowDataClear != null && ControlConfig.IsAllowDataClear) {
                        var parentControl = $("#" + ControlConfig.ContainerId);
                        if (parentControl.hasClass("hide"))
                            result[ControlConfig.ControlID] = '';
                        else
                            result[ControlConfig.ControlID] = value == undefined || value == null || value == '' || value == -1 ? '' : value;
                    }
                    else if (ControlConfig.ControlID.indexOf('AttributeFilter_') != -1)
                        result[ControlConfig.ControlID] = value == undefined || value == null || value == '' || value == -1 ? '' : value;
                    else
                        result[ControlConfig.ControlID] = value == undefined || value == null || value == '' ? '-1' : value;
                    result[ControlConfig.ControlID + '_SelectedName'] = name;
                }
                if (ControlConfig.ControlTypeName == "TextBox") {
                    value = myInstance.getControlValue_TextBox(ControlConfig);
                    if (ControlConfig.IsAllowDataClear != undefined && ControlConfig.IsAllowDataClear != null && ControlConfig.IsAllowDataClear) {
                        var parentControl = $("#" + ControlConfig.ContainerId);
                        if (parentControl.hasClass("hide"))
                            result[ControlConfig.ControlID] = '';
                        else
                            result[ControlConfig.ControlID] = value;
                    }
                    else
                        result[ControlConfig.ControlID] = value;
                }
                if (ControlConfig.ControlTypeName == "RadioButton") {
                    value = myInstance.getControlValue_RadioButton(ControlConfig);
                    if (ControlConfig.IsAllowDataClear != undefined && ControlConfig.IsAllowDataClear != null && ControlConfig.IsAllowDataClear) {
                        var parentControl = $("#" + ControlConfig.ContainerId);
                        if (parentControl.hasClass("hide"))
                            result[ControlConfig.ControlID] = '';
                        else
                            result[ControlConfig.ControlID] = value;
                    }
                    else
                        result[ControlConfig.ControlID] = value;
                }
                if (ControlConfig.ControlTypeName == "CheckBox") {
                    value = myInstance.getControlValue_CheckBox(ControlConfig);
                    if (ControlConfig.IsAllowDataClear != undefined && ControlConfig.IsAllowDataClear != null && ControlConfig.IsAllowDataClear) {
                        var parentControl = $("#" + ControlConfig.ContainerId);
                        if (parentControl.hasClass("hide"))
                            result[ControlConfig.ControlID] = '';
                        else
                            result[ControlConfig.ControlID] = value;
                    }
                    else
                        result[ControlConfig.ControlID] = value;
                }
                if (ControlConfig.ControlTypeName == "DatePicker") {
                    value = myInstance.getControlValue_DatePicker(ControlConfig);
                    if (ControlConfig.IsAllowDataClear != undefined && ControlConfig.IsAllowDataClear != null && ControlConfig.IsAllowDataClear) {
                        var parentControl = $("#" + ControlConfig.ContainerId);
                        if (parentControl.hasClass("hide"))
                            result[ControlConfig.ControlID] = '';
                        else
                            result[ControlConfig.ControlID] = value;
                    }
                    else
                        result[ControlConfig.ControlID] = value;
                }

                if (ControlConfig.ControlTypeName == "Hidden") {
                    value = myInstance.getControlValue_Hidden(ControlConfig);
                    if (ControlConfig.IsAllowDataClear != undefined && ControlConfig.IsAllowDataClear != null && ControlConfig.IsAllowDataClear) {
                        var parentControl = $("#" + ControlConfig.ContainerId);
                        if (parentControl.hasClass("hide"))
                            result[ControlConfig.ControlID] = '';
                        else
                            result[ControlConfig.ControlID] = value;
                    }
                    else
                        result[ControlConfig.ControlID] = value;
                }
                if (ControlConfig.ControlTypeName == "ImageControl") {
                    result[ControlConfig.ControlID] = myInstance.getControlValue_Image(ControlConfig);
                }
            });
        }
        return result;
    }

    this.GetRequestParamOnlineDCList = function (LoadParamClientIDList) {
        var result = {};
        var value;
        var name;
        var Type;
        if (LoadParamClientIDList != null) {
            $.each(LoadParamClientIDList, function (index, ClientID) {
                var ControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];

                if (ControlConfig.ControlTypeName == "ComboBox") {
                    value = myInstance.getControlValue_combo(ControlConfig);
                    value = value == undefined || value == null || value == '' ? '-1' : value;
                    name = myInstance.getControlName_combo(ControlConfig);
                    name = name == undefined || name == null || name == '' ? '' : name;
                    Type = ControlConfig.ComboDATType;
                    result[ControlConfig.ControlID] = { "Answer": value, "AnswerType": "DDL", "AnswerFKType": Type, "AnswerValue": name, "AttrbuteId": 0, "ControlId": "", "Index": 0, "_ApprovalRequestAnswerDetail": [], "IsMulti": false };
                }

                if (ControlConfig.ControlTypeName == "TextBox") {
                    value = myInstance.getControlValue_TextBox(ControlConfig);
                    result[ControlConfig.ControlID] = { "Answer": value, "AnswerType": "STRING", "AnswerFKType": '', "AnswerValue": "", "AttrbuteId": 0, "ControlId": "", "Index": 0, "_ApprovalRequestAnswerDetail": [], "IsMulti": false };
                }

                if (ControlConfig.ControlTypeName == "RadioButton") {
                    value = myInstance.getControlValue_RadioButton(ControlConfig);
                    Type = ControlConfig.ComboDATType != undefined && ControlConfig.ComboDATType != null ? ControlConfig.ComboDATType : 0;
                    if (typeof (value) != 'string') {
                        listValue = [];
                        for (var itr = 0; itr < value.length; itr++) {
                            listValue.push({
                                "Answer": value[itr].id, "AnswerType": "INTEGER", "AnswerFKType": Type, "AnswerValue": value[itr].name, "AttrbuteId": 0, "ControlId": "", "Index": value[itr].index,
                                "_ApprovalRequestAnswerDetail": [], "IsMulti": value[itr].IsMulti, "IsDisabled": (value[itr].Isdisabled != undefined && value[itr].Isdisabled != null ? value[itr].Isdisabled : false)
                            });
                        }
                        result[ControlConfig.ControlID] = { "Answer": "", "AnswerType": "INTEGER", "AnswerFKType": Type, "AnswerValue": "", "AttrbuteId": 0, "ControlId": "", "Index": 0, "_ApprovalRequestAnswerDetail": listValue, "IsMulti": true };
                    }
                    else {
                        name = myInstance.getSelectedOptionText_RadioButton(ControlConfig);
                        var radiobuttons = document.getElementsByName("group_" + ControlConfig.ClientID);
                        if (radiobuttons.length > 0) {
                            if (radiobuttons.item(0).DataType != undefined && radiobuttons.item(0).DataType != null)
                                Type = radiobuttons.item(0).DataType;
                            else
                                Type = '';
                        }
                        else
                            Type = '';
                        result[ControlConfig.ControlID] = { "Answer": value, "AnswerType": "INTEGER", "AnswerFKType": Type, "AnswerValue": name, "AttrbuteId": 0, "ControlId": "", "Index": 0, "_ApprovalRequestAnswerDetail": [], "IsMulti": false };
                    }
                }

                if (ControlConfig.ControlTypeName == "CheckBox") {
                    result[ControlConfig.ControlID] = myInstance.getControlValue_CheckBox(ControlConfig);
                }

                if (ControlConfig.ControlTypeName == "DatePicker") {
                    value = '';
                    var _Datepicker = document.getElementById(ControlConfig.ClientID);
                    if (_Datepicker != null) {
                        var dateRangePicker = $(_Datepicker).data().daterangepicker;
                        if (dateRangePicker.startDate._d.toDateString() != dateRangePicker.oldStartDate._d.toDateString()) {
                            if (_Datepicker.getElementsByTagName("span").length > 0)
                                value = _Datepicker.getElementsByTagName("span")[0].innerHTML;
                            else
                                value = '';
                        }
                        else
                            value = '';
                    }
                    result[ControlConfig.ControlID] = { "Answer": value, "AnswerType": "DATE", "AnswerFKType": '', "AnswerValue": "", "AttrbuteId": 0, "ControlId": "", "Index": 0, "_ApprovalRequestAnswerDetail": [], "IsMulti": false };
                }

                if (ControlConfig.ControlTypeName == "ImageControl") {
                    value = myInstance.getControlValue_Image(ControlConfig);
                    if (typeof (value) != 'string') {
                        listValue = [];
                        for (var itr = 0; itr < value.length; itr++) {
                            listValue.push({
                                "Answer": value[itr].id, "AnswerType": "", "AnswerFKType": "", "AnswerValue": value[itr].name, "AttrbuteId": 0, "ControlId": "", "Index": value[itr].index,
                                "_ApprovalRequestAnswerDetail": [], "IsMulti": value[itr].IsMulti, "IsDisabled": (value[itr].Isdisabled != undefined && value[itr].Isdisabled != null ? value[itr].Isdisabled : false)
                            });
                        }
                        result[ControlConfig.ControlID] = { "Answer": "", "AnswerType": "INTEGER", "AnswerFKType": Type, "AnswerValue": "", "AttrbuteId": 0, "ControlId": "", "Index": 0, "_ApprovalRequestAnswerDetail": listValue, "IsMulti": true };
                    }
                }

                //if (ControlConfig.ControlTypeName == "Hidden") {
                //    result[ControlConfig.ControlID] = myInstance.getControlValue_Hidden(ControlConfig);
                //}
            });
        }
        return result;
    }

    this.RefreshControl = function (ClientID) {
        var _Combobox = new WiNAiMComboBox(PageConfig);
        _Combobox.async = ControlConfig.async;
        _Combobox.Load(ControlConfig);
    }
}

///******* WiNAiM ClinetSide Event Mgmt  start ********************
function WiNAiMClinetSideEventMgmt(_PageConfig) {
    var myInstance = this;
    var PageConfig = _PageConfig;

    this.EventExecution = function (EventName, ClientID) {
        var ControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];
        var ControlEventObject = ControlConfig.ClientSideEventsDict[EventName];

        if (ControlEventObject != null && ControlEventObject.JobList != null) {
            var totalJobs = Object.keys(ControlEventObject.JobList).length;

            for (var item in ControlEventObject.JobList) {
                var job = ControlEventObject.JobList[item];

                if (job.JobType == 'RefreshControlJob') {
                    (new refreshJob(PageConfig)).Execute(job);
                }
                if (job.JobType == 'CustomJob') {
                    var jobEvent = new window[job.CustomJobFunctionName](ControlConfig, PageConfig);
                    if (EventName == "onchange")
                        jobEvent.onchange();
                    else if (EventName == "onkeypress")
                        return jobEvent.onkeypress();
                    else if (EventName == "onclick")
                        return jobEvent.onclick();
                }
            }
        }
    }
}
///******* WiNAiM ClinetSide Event Mgmt  end **********************

///******* refreshJob  start ********************
function refreshJob(_PageConfig) {
    var DynamicPageObj = new DynamicPage(_PageConfig)
    var myInstance = this;
    var PageConfig = _PageConfig;
    ///************** refreshRelatedControls start *************************

    //load all control related to it
    this.Execute = function (job) {

        if (job.ExplicitRefreshNeeded == true) {
            //var ControlConfig = PageConfig.ControlConfigDict[ClientID];
            var parameterToLoadData = DynamicPageObj.GetLoadParameterList(job.ParametersForRefreshService);
            parameterToLoadData = JSON.stringify(parameterToLoadData);
            parameterToLoadData = { request: parameterToLoadData };
            parameterToLoadData = JSON.stringify(parameterToLoadData);

            var myAjaxobj = new WiNAiMAjax();
            myAjaxobj.url = job.RefreshControlServiceURL;
            myAjaxobj.webMethod = "post";
            myAjaxobj.parameter = parameterToLoadData;
            myAjaxobj.async = false;
            var result = myAjaxobj.execute();

            myInstance.doExplicitRefresh(result, job.ExplicitRefreshControlDict);
        }

        myInstance.doImplicitRefresh(job.ImplicitRefreshControlDict);

    }

    this.doExplicitRefresh = function (result, ExplicitRefreshControlDict) {
        var totalExplicitJobs = Object.keys(ExplicitRefreshControlDict).length;
        for (var item in ExplicitRefreshControlDict) {
            var ClientID = ExplicitRefreshControlDict[item];

            var ControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];
            DynamicPageObj.LoadControlsWithData(ControlConfig);
            //var value = DynamicPageObj.getControlValue(ControlConfig);
            //DynamicPageObj.SetData(ControlConfig, value);
            //document.getElementById(ControlConfig.ClientID).isContentEditable = true;
        }
    }


    //ex: to refresh the drop dowen , checkbox list,radiobutton list etc..
    //also exception case 
    //ex 1: load  text box with seprate ajax call
    this.doImplicitRefresh = function (ImplicitRefreshControlDict) {
        var totalImplicitJobs = Object.keys(ImplicitRefreshControlDict).length;
        for (var i = 1; i <= totalImplicitJobs; i++) {
            var ClientID = ImplicitRefreshControlDict[i.toString()];
            var ControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];

            DynamicPageObj.LoadControlsWithData(ControlConfig);
        }
    }

    this.RefresheventJobs = function (ClientID) {
        var ControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID];

        DynamicPageObj.LoadControlsWithData(ControlConfig);
    }

    ///************** refreshRelatedControls End *************************
}
///******* refreshJob  end **********************

///******* ComboBox config start ********************
function WiNAiMComboBox(_PageConfig) {
    this.DataValueField = 'Id';
    this.DataTextField = 'Name';
    this.PageConfig = _PageConfig;
    this.async = false;

    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (ComboType) {
        var ComboBox = null;
        //if(ComboType =="DefaultCombo")
        ComboBox = new DefaultComboBox(PageConfig);
        //else
        //alert("errro not implemented exception");               

        ComboBox.DataValueField = myInstance.DataValueField;
        ComboBox.DataTextField = myInstance.DataTextField;
        ComboBox.async = myInstance.async;

        return ComboBox;
    }

    this.getControlValue = function (ControlConfig) {
        var _DefaultComboBox = myInstance.factory(ControlConfig.ComboTypeName);
        _DefaultComboBox.getControlValue(ControlConfig);
    }

    this.Load = function (ControlConfig) {
        var _DefaultComboBox = myInstance.factory(ControlConfig.ComboTypeName);
        _DefaultComboBox.Load(ControlConfig);
    }

    this.setData = function (ControlConfig, value) {
        var _DefaultComboBox = myInstance.factory(ControlConfig.ComboTypeName);
        _DefaultComboBox.setData(ControlConfig, value);
    }

    this.SelectedValue = function (ControlConfig) {
        var _DefaultComboBox = myInstance.factory(ControlConfig.ComboTypeName);
        return _DefaultComboBox.SelectedValue(ControlConfig);
    }

    this.SelectedName = function (ControlConfig) {
        var _DefaultComboBox = myInstance.factory(ControlConfig.ComboTypeName);
        return _DefaultComboBox.SelectedName(ControlConfig);
    }

    this.onchange = function (ControlConfig) {
        var _DefaultComboBox = myInstance.factory(ControlConfig.ComboTypeName);
        _DefaultComboBox.SetClientID(ControlConfig.ClientID);
        _DefaultComboBox.PostUIJobs = ControlConfig.PostControlUIJobs;
        return _DefaultComboBox.onchange();
    }

    this.Clear = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultComboBox = myInstance.factory(oControlConfig.ComboTypeName);
        _DefaultComboBox.Clear(oControlConfig);
    }

    this.Refresh = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultComboBox = myInstance.factory(oControlConfig.ComboTypeName);
        _DefaultComboBox.Refresh(oControlConfig);
    }

    this.Hide = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultComboBox = myInstance.factory(oControlConfig.ComboTypeName);
        _DefaultComboBox.Hide(oControlConfig);
    }

    this.Show = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultComboBox = myInstance.factory(oControlConfig.ComboTypeName);
        _DefaultComboBox.Show(oControlConfig);
    }
}

function DefaultComboBox(_PageConfig) {
    this.DataValueField = 'Id';
    this.DataTextField = 'Name';
    this.async = false;
    this.PreUIJobs = null;
    this.PostUIJobs = null;
    this.currentPageConfig = _PageConfig;

    var PageConfig = _PageConfig;
    var myInstance = this;
    var ClientID = '';
    var controlConfig = null;

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        if (document.getElementById(ClientID) != undefined && document.getElementById(ClientID) != null)
            document.getElementById(ClientID).removeAttribute("disabled");
        //register events
        controlConfig = ControlConfig;
        if (ControlConfig.PreControlUIJobs != undefined && ControlConfig.PreControlUIJobs != null && ControlConfig.PreControlUIJobs.length > 0) {
            var _RegisterEvents =
                new RegisterEvents();
            _RegisterEvents.RegisterControlConfig = controlConfig;
            _RegisterEvents.ExcecuteUIJobs(ControlConfig.PreControlUIJobs);
        }
        //myInstance.PreUIJobs = ControlConfig.PreControlUIJobs;
        myInstance.PostUIJobs = ControlConfig.PostControlUIJobs;
        myInstance.registerEvents();

        if (ControlConfig.DefaultDataLoadAllowed) {
            if (ControlConfig.isStaticListItem == true)
                myInstance.LoadStaticData(ControlConfig);
            else {
                if (ControlConfig.DataSourceConfig != '' && ControlConfig.DataSourceConfig != null && ControlConfig.DataSourceConfig != undefined)
                    myInstance.LoadDynamicData(ControlConfig);
            }
        }
        if (ControlConfig.comboDefaultSelect == 1) {
            if ($("#" + ClientID).data().select2 != undefined && $("#" + ClientID).data().select2.clear != undefined) {
                $("#" + ClientID).data().select2.clear();
            }
        }
        else if (ControlConfig.comboDefaultSelect == 3) {
            for (var opt = 0; opt < $("#" + ClientID)[0].options.length; opt++) {
                $("#" + ClientID)[0].options[opt].selected = true;
            }
            if ($("#" + ClientID).data().select2 != undefined) /* && $("#" + ClientID).data().select2.clear != undefined */ {
                $("#" + ClientID).data().select2.updateSelection();
                $("#" + ClientID).data().select2.initSelection();
            }
        }
    }

    this.LoadStaticData = function (ControlConfig) {
        myInstance.DataBind(myInstance, ControlConfig.DefaultListItem);
    }

    this.LoadDynamicData = function (ControlConfig) {
        var oDynamicFormDataSourceComponent = new DynamicFormDataSourceComponent();
        oDynamicFormDataSourceComponent.DynamicFormDataSourceConfig = ControlConfig.DataSourceConfig;
        oDynamicFormDataSourceComponent.success = this.DataBind;
        oDynamicFormDataSourceComponent.error = this.error;
        oDynamicFormDataSourceComponent.complete = this.complete;
        oDynamicFormDataSourceComponent.sender = this;
        oDynamicFormDataSourceComponent.ComboDATType = ControlConfig.ComboDATType;
        oDynamicFormDataSourceComponent.async = ControlConfig.async;
        oDynamicFormDataSourceComponent.Load();
    }

    this.setData = function (ControlConfig, value) {
        ClientID = ControlConfig.ClientID;
        controlConfig = ControlConfig;
        //alert("Not implemented exception");
        var valueSelection = 0;
        var comboItem = document.getElementById(ControlConfig.ClientID);
        if (typeof (value) == 'string') {
            for (var i = 0; i < comboItem.options.length; i++) {
                if (comboItem.options[i].value == value) {
                    comboItem.options[i].selected = true;
                    valueSelection = 0;
                }
                else {
                    comboItem.options[i].selected = false;
                    valueSelection += 1;
                }
                if (valueSelection == comboItem.options.length) {
                    if ($("#" + ControlConfig.ClientID).data().select2 != undefined && $("#" + ControlConfig.ClientID).data().select2.clear != undefined) {
                        $("#" + ControlConfig.ClientID).data().select2.clear();
                    }
                }
            }
        }
        else if (typeof (value) == 'number') {
            for (var i = 0; i < comboItem.options.length; i++) {
                if (comboItem.options[i].value == value) {
                    comboItem.options[i].selected = true;
                    valueSelection = 0;
                }
                else {
                    comboItem.options[i].selected = false;
                    valueSelection += 1;
                }
                if (valueSelection == comboItem.options.length) {
                    if ($("#" + ControlConfig.ClientID).data().select2 != undefined && $("#" + ControlConfig.ClientID).data().select2.clear != undefined) {
                        $("#" + ControlConfig.ClientID).data().select2.clear();
                    }
                }
            }
        }
        else {
            //for (var i = 0; i < comboItem.options.length; i++) {
            //    comboItem.options[i].selected = false;
            //}
            for (var i = 0; i < comboItem.options.length; i++) {
                if (value.indexOf(comboItem.options[i].value) != -1) {
                    comboItem.options[i].selected = true;
                    valueSelection = 0;
                }
                else {
                    comboItem.options[i].selected = false;
                    valueSelection += 1;
                }
                if (valueSelection == comboItem.options.length) {
                    if ($("#" + ControlConfig.ClientID).data().select2 != undefined && $("#" + ControlConfig.ClientID).data().select2.clear != undefined) {
                        $("#" + ControlConfig.ClientID).data().select2.clear();
                    }
                }
            }
        }
        if ($("#" + ControlConfig.ClientID).data().select2 != undefined) {
            $("#" + ControlConfig.ClientID).data().select2.updateSelection();
            $("#" + ControlConfig.ClientID).data().select2.initSelection();
        }
        //myInstance.onchange();
    }

    this.getControlValue = function (ControlConfig) {
        var comboItem = document.getElementById(ControlConfig.ClientID);
        var comboItemId = comboItem.options[comboItem.selectedIndex].value;
        return comboItemId;
    }

    this.SelectedValue = function (ControlConfig) {
        var comboItem = document.getElementById(ControlConfig.ClientID);
        var comboItemId;
        if (comboItem.options.length != 0) {
            if (ControlConfig.isStaticListItem != undefined && ControlConfig.isStaticListItem != null && ControlConfig.isStaticListItem && ControlConfig.ComboType == 0) {
                if ((comboItem.options[comboItem.selectedIndex] == undefined ? -1 : comboItem.options[comboItem.selectedIndex].value) == 0) {
                    for (var item = 0; item < comboItem.children.length; item++) {
                        if (comboItemId != comboItem.children[item].value.toString() && comboItem.children[item].value.toString() != "0") {
                            if (comboItemId == undefined) {
                                comboItemId = [];
                                comboItemId.push(comboItem.children[item].value.toString());
                            }
                            else {
                                var index = comboItemId.indexOf(comboItem.children[item].value.toString());
                                if (index == -1)
                                    comboItemId.push(comboItem.children[item].value.toString());
                            }
                        }
                    }
                }
                else
                    comboItemId = comboItem.options[comboItem.selectedIndex] == undefined ? -1 : comboItem.options[comboItem.selectedIndex].value;
                if (comboItemId == undefined)
                    comboItemId = [];
            }
            else {
                if (ControlConfig.ComboType == 1) {
                    for (var item = 0; item < comboItem.children.length; item++) {
                        if (comboItem.children[item].selected && comboItemId != comboItem.children[item].value.toString()) {
                            if (comboItemId == undefined) {
                                comboItemId = [];
                                comboItemId.push(comboItem.children[item].value.toString());
                            }
                            else {
                                var index = comboItemId.indexOf(comboItem.children[item].value.toString());
                                if (index == -1)
                                    comboItemId.push(comboItem.children[item].value.toString());
                            }
                        }
                    }
                    if (comboItemId == undefined)
                        comboItemId = [];
                }
                else
                    comboItemId = comboItem.options[comboItem.selectedIndex] == undefined ? -1 : comboItem.options[comboItem.selectedIndex].value;
            }
        }
        return comboItemId;
    }

    this.SelectedName = function (ControlConfig) {
        var comboItem = document.getElementById(ControlConfig.ClientID);
        var comboItemId;
        if (comboItem.options.length != 0) {
            if (ControlConfig.ComboType == 1) {
                for (var item in comboItem.children) {
                    if (comboItem.children[item].selected && comboItemId != comboItem.children[item].value.toString()) {
                        if (comboItemId == undefined) {
                            comboItemId = [];
                            comboItemId.push(comboItem.children[item].text.toString());
                        }
                        else {
                            var index = comboItemId.indexOf(comboItem.children[item].text.toString());
                            if (index == -1)
                                comboItemId.push(comboItem.children[item].text.toString());
                        }
                    }
                }
                if (comboItemId == undefined)
                    comboItemId = [];
            }
            else
                comboItemId = comboItem.options[comboItem.selectedIndex] == undefined ? '' : comboItem.options[comboItem.selectedIndex].text;
        }
        return comboItemId;
    }

    this.error = function (e) {
        alert("errror on WiNAiMComboBox ajax call");
    }

    this.registerEvents = function () {
        var ddlCombo = document.getElementById(ClientID);
        if (ddlCombo != undefined && ddlCombo != null) {
            //ddlCombo.onclick = myInstance.onclick
            ddlCombo.onchange = myInstance.onchange;
        }
    }

    this.onclick = function () {
        var _RegisterEvents =
            new RegisterEvents();
        _RegisterEvents.RegisterControlConfig = controlConfig;
        _RegisterEvents.ExcecuteUIJobs(myInstance.PreUIJobs);
    }

    this.onchange = function () {
        var _RegisterEvents =
            new RegisterEvents();
        _RegisterEvents.RegisterControlConfig = controlConfig;
        _RegisterEvents.PageConfig = PageConfig;
        _RegisterEvents.ExcecuteUIJobs(myInstance.PostUIJobs);
    }

    this.DataBind = function (ComboBoxObjectref, DataSource) {
        var ddlCombo = document.getElementById(ClientID);
        if (ComboBoxObjectref.currentPageConfig != undefined && ComboBoxObjectref.currentPageConfig != null && ComboBoxObjectref.currentPageConfig.ControlGroupConfigLst.length > 0
            && ComboBoxObjectref.currentPageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID] != null)
            ComboBoxObjectref.currentPageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID]["DataLst"] = DataSource;
        if (ddlCombo != undefined && ddlCombo != null) {
            //remove existing elements
            if (ddlCombo.options) {
                while (ddlCombo.options.length > 0) {
                    ddlCombo.remove(0);
                }
                if ($("#" + ClientID).material_select != undefined && $("#" + ClientID).material_select != null)
                    $("#" + ClientID).material_select();
                if ($("#" + ClientID).data().select2 != undefined) {
                    $("#" + ClientID).data().select2.updateSelection();
                    $("#" + ClientID).data().select2.initSelection();
                }
            }

            //-- Add default elements.
            if (PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].DefaultListItem != null && PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].DefaultListItem != undefined && DataSource.length != 0) {
                var defaultitem = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].DefaultListItem;
                var alreadySelected = false;
                if (PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].DefaultListItem.length != 0 && DataSource.length > 0) {
                    for (var i = 0; i < defaultitem.length; i++) {
                        var data = defaultitem[i];
                        var selected = false;
                        if (defaultitem.length == 1 && PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].comboDefaultSelect != 1) {
                            selected = true;
                            alreadySelected = true;
                        }
                        ComboBoxObjectref.addOption(ddlCombo, data[ComboBoxObjectref.DataValueField], data["Text"], selected);
                        if (i == 0) {
                            if ($("#" + ClientID).data().select2 != undefined) {
                                $("#" + ClientID).data().select2.updateSelection();
                                $("#" + ClientID).data().select2.initSelection();
                            }
                        }
                    }
                }
                if (!PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].isStaticListItem) {
                    for (var i = 0; i < DataSource.length; i++) {
                        var data = DataSource[i];
                        var selected = false;
                        if (DataSource.length == 1 && defaultitem.length == 0)
                            selected = true;
                        if (!selected && !alreadySelected && DataSource[i]["Selected"] != undefined && DataSource[i]["Selected"] != null && DataSource[i]["Selected"]) {
                            selected = DataSource[i]["Selected"];
                        }
                        ComboBoxObjectref.addOption(ddlCombo, data[ComboBoxObjectref.DataValueField], data[ComboBoxObjectref.DataTextField], selected);
                        if (i == 0 || selected) {
                            if ($("#" + ClientID).data().select2 != undefined) {
                                $("#" + ClientID).data().select2.updateSelection();
                                $("#" + ClientID).data().select2.initSelection();
                            }
                        }
                    }
                }
                if ($("#" + ClientID).data().select2 != undefined) {
                    $("#" + ClientID).data().select2.updateSelection();
                    $("#" + ClientID).data().select2.initSelection();
                }
            }
            //add elements
            if (PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].DefaultListItem == null || PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientID].DefaultListItem == undefined) {
                for (var i = 0; i < DataSource.length; i++) {
                    var data = DataSource[i];
                    var selected = false;
                    if (DataSource.length == 1)
                        selected = true;
                    if (!selected && !alreadySelected && DataSource[i]["Selected"] != undefined && DataSource[i]["Selected"] != null && DataSource[i]["Selected"]) {
                        selected = DataSource[i]["Selected"];
                        alreadySelected = true;
                    }
                    ComboBoxObjectref.addOption(ddlCombo, data[ComboBoxObjectref.DataValueField], data[ComboBoxObjectref.DataTextField], selected);
                    if (i == 0 || selected) {
                        if ($("#" + ClientID).data().select2 != undefined) {
                            $("#" + ClientID).data().select2.updateSelection();
                            $("#" + ClientID).data().select2.initSelection();
                        }
                    }
                }
            }
            if ($("#" + ClientID).material_select != undefined && $("#" + ClientID).material_select != null)
                $("#" + ClientID).material_select();
            //myInstance.onchange();
        }
    };

    //private
    this.addOption = function (selectbox, value, text, selected) {
        var optn = document.createElement("OPTION");
        optn.text = text;
        optn.value = value;
        optn.selected = selected;
        selectbox.options.add(optn);
    }

    this.SetClientID = function (clientid) {
        ClientID = clientid;
    }

    this.Clear = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var Control = document.getElementById(ClientID);
        if (Control != undefined && Control != null && Control.options != undefined && Control.options.length > 0) {
            for (var i = 0; i < Control.options.length; i++) {
                Control.options[i].selected = false;
            }
            if ($("#" + ClientID).data().select2 != undefined && $("#" + ClientID).data().select2.clear != undefined) {
                $("#" + ClientID).data().select2.clear();
            }
            if ($("#" + ClientID).data().select2 != undefined) {
                $("#" + ClientID).data().select2.updateSelection();
                $("#" + ClientID).data().select2.initSelection();
            }
        }
    }

    this.Refresh = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        if (ControlConfig.isStaticListItem == true)
            myInstance.LoadStaticData(ControlConfig);
        else {
            if (ControlConfig.DataSourceConfig != '' && ControlConfig.DataSourceConfig != null && ControlConfig.DataSourceConfig != undefined)
                myInstance.LoadDynamicData(ControlConfig);
        }
        if (ControlConfig.comboDefaultSelect == 1) {
            if ($("#" + ClientID).data().select2 != undefined && $("#" + ClientID).data().select2.clear != undefined) {
                $("#" + ClientID).data().select2.clear();
            }
        }
        else if (ControlConfig.comboDefaultSelect == 3) {
            for (var opt = 0; opt < $("#" + ClientID)[0].options.length; opt++) {
                $("#" + ClientID)[0].options[opt].selected = true;
            }
            if ($("#" + ClientID).data().select2 != undefined) /* && $("#" + ClientID).data().select2.clear != undefined */ {
                $("#" + ClientID).data().select2.updateSelection();
                $("#" + ClientID).data().select2.initSelection();
            }
        }
    }

    this.Hide = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).addClass("hide");
    }

    this.Show = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).removeClass("hide");

        if (ControlConfig.isStaticListItem == true)
            myInstance.LoadStaticData(ControlConfig);
        else {
            if (ControlConfig.DataSourceConfig != '' && ControlConfig.DataSourceConfig != null && ControlConfig.DataSourceConfig != undefined)
                myInstance.LoadDynamicData(ControlConfig);
        }
        if (ControlConfig.comboDefaultSelect == 1) {
            if ($("#" + ClientID).data().select2 != undefined && $("#" + ClientID).data().select2.clear != undefined) {
                $("#" + ClientID).data().select2.clear();
            }
        }
    }
}
///******* ComboBox config  end *********************

///******* Hidden start ********************
function WiNAiMHiddenControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (TextBoxtype) {
        var TexBox = null;
        if (TextBoxtype == "Default")
            TexBox = new DefaultHiddenControl(PageConfig);
        else
            alert("errro not implemented exception");

        return TexBox;
    }

    this.setData = function (ControlConfig, value) {
        //var _DefaultHiddenControl=myInstance.factory(ControlConfig.TextBoxTypeName);
        var _DefaultHiddenControl = new DefaultHiddenControl();
        _DefaultHiddenControl.setData(ControlConfig, value);
    }

    this.Text = function (ControlConfig, value) {
        //var _DefaultHiddenControl=myInstance.factory(ControlConfig.TextBoxTypeName);
        var _DefaultHiddenControl = new DefaultHiddenControl();
        return _DefaultHiddenControl.Text(ControlConfig);
    }
}

function DefaultHiddenControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.setData = function (ControlConfig, Value) {
        var DefaultHiddenControl = document.getElementById(ControlConfig.ClientID);
        if (DefaultHiddenControl != null)
            DefaultHiddenControl.value = Value;
    }

    this.Text = function (ControlConfig) {
        var DefaultHiddenControl = document.getElementById(ControlConfig.ClientID);
        if (DefaultHiddenControl != null)
            return DefaultHiddenControl.value;
        else
            return "";
    }
}
///******* Hidden end **********************

///******* TextBox start ********************
function WiNAiMTextBox(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (TextBoxtype) {
        var TexBox = null;
        if (TextBoxtype == "Default")
            TexBox = new DefaultTextBox(PageConfig);
        else if (TextBoxtype == "Password")
            TexBox = new DefaultTextBox(PageConfig);
        else if (TextBoxtype == "TextArea")
            TexBox = new DefaultTextBox(PageConfig);
        else if (TextBoxtype == "Search")
            TexBox = new DefaultTextBox(PageConfig);
        else
            alert("errro not implemented exception");

        return TexBox;
    }

    this.Load = function (ControlConfig) {
        var _DefaultTextBox = myInstance.factory(ControlConfig.TextBoxTypeName);
        _DefaultTextBox.Load(ControlConfig);
    }

    this.setData = function (ControlConfig, value) {
        //var _DefaultTextBox=myInstance.factory(ControlConfig.TextBoxTypeName);
        var _DefaultTextBox = new DefaultTextBox(PageConfig);
        _DefaultTextBox.setData(ControlConfig, value);
    }

    this.Text = function (ControlConfig, value) {
        var _DefaultTextBox = myInstance.factory(ControlConfig.TextBoxTypeName);
        return _DefaultTextBox.Text(ControlConfig);
    }

    this.Clear = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultTextBox = myInstance.factory(oControlConfig.TextBoxTypeName);
        _DefaultTextBox.Clear(oControlConfig);
    }

    this.Refresh = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultTextBox = myInstance.factory(oControlConfig.TextBoxTypeName);
        _DefaultTextBox.Refresh(oControlConfig);
    }

    this.Hide = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultTextBox = myInstance.factory(oControlConfig.TextBoxTypeName);
        _DefaultTextBox.Hide(oControlConfig);
    }

    this.Show = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultTextBox = myInstance.factory(oControlConfig.TextBoxTypeName);
        _DefaultTextBox.Show(oControlConfig);
    }
}

function DefaultTextBox(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    var ClientID = '';
    this.PostUIJobs = null;
    var controlConfig = null;

    this.setData = function (ControlConfig, Value) {
        ClientID = ControlConfig.ClientID;
        var TextBox = document.getElementById(ControlConfig.ClientID);
        if (Value != null)
            TextBox.value = Value.replace(/&amp;/g, '&');
        else
            TextBox.value = Value;

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            myInstance.onchange();
    }

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        //register events
        controlConfig = ControlConfig;
        if (ControlConfig.PreControlUIJobs != undefined && ControlConfig.PreControlUIJobs != null && ControlConfig.PreControlUIJobs.length > 0) {
            var _RegisterEvents =
                new RegisterEvents();
            _RegisterEvents.RegisterControlConfig = ControlConfig;
            _RegisterEvents.ExcecuteUIJobs(ControlConfig.PreControlUIJobs);
        }
        myInstance.PostUIJobs = ControlConfig.PostControlUIJobs;
        myInstance.registerEvents();

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            this.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.Text = function (ControlConfig) {
        var TextBox = document.getElementById(ControlConfig.ClientID);
        return TextBox.value;
    }

    this.registerEvents = function () {
        var txtControl = document.getElementById(ClientID);
        txtControl.onchange = myInstance.onchange;
        //txtControl.onkeypress = myInstance.onkeypress;
    }

    this.onchange = function () {
        var _RegisterEvents =
            new RegisterEvents();
        _RegisterEvents.RegisterControlConfig = controlConfig;
        _RegisterEvents.ExcecuteUIJobs(myInstance.PostUIJobs);
    }

    this.onkeypress = function (event) {
        KeyEvent = event;
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        return _WiNAiMClinetSideEventMgmt.EventExecution("onkeypress", ClientID);
    }

    this.Clear = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var Control = document.getElementById(ClientID);
        if (Control != undefined && Control != null) {
            Control.value = '';
        }
    }

    this.Refresh = function (ControlConfig) {
        (new refreshJob(PageConfig)).RefresheventJobs(ControlConfig.ClientID);
    }

    this.Hide = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).addClass("hide");
    }

    this.Show = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).removeClass("hide");
    }
}
///******* TextBox end **********************

///******* Calender start ********************
function WiNAiMDatePicker(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (DatePickerType) {
        var DatePicker = null;
        if (DatePickerType == "Default")
            DatePicker = new DefaultDatePicker(PageConfig);
        else if (DatePickerType == "AdvancedDatePicker")
            DatePicker = new AdvancedDatePicker(PageConfig);
        else
            alert("errro not implemented exception");

        return DatePicker;
    }

    this.Load = function (ControlConfig) {
        var _DatePicker = myInstance.factory(ControlConfig.DatePickerTypeName);
        return _DatePicker.Load(ControlConfig);
    }

    this.setData = function (ControlConfig, value) {
        var _DefaultDatePicker = myInstance.factory(ControlConfig.DatePickerTypeName);
        _DefaultDatePicker.setData(ControlConfig, value);
    }

    this.getControlValue = function (ControlConfig, value) {
        var _DefaultDatePicker = myInstance.factory(ControlConfig.DatePickerTypeName);
        return _DefaultDatePicker.getControlValue(ControlConfig);
    }

    this.Refresh = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DatePicker = myInstance.factory(oControlConfig.DatePickerTypeName);
        _DatePicker.Refresh(oControlConfig);
    }

    this.Hide = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DatePicker = myInstance.factory(oControlConfig.DatePickerTypeName);
        _DatePicker.Hide(oControlConfig);
    }

    this.Show = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DatePicker = myInstance.factory(oControlConfig.DatePickerTypeName);
        _DatePicker.Show(oControlConfig);
    }

    this.Clear = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DatePicker = myInstance.factory(oControlConfig.DatePickerTypeName);
        _DatePicker.Clear(oControlConfig);
    }
}

function DefaultDatePicker(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    this.PreUIJobs = null;
    this.PostUIJobs = null;
    var ClientID = '';

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        //register events
        myInstance.PreUIJobs = ControlConfig.PreControlUIJobs;
        myInstance.PostUIJobs = ControlConfig.PostControlUIJobs;
        myInstance.registerEvents();
    }

    this.setData = function (ControlConfig, Value) {
        var _Datepicker = document.getElementById(ControlConfig.ClientID);
        if (_Datepicker != null)
            _Datepicker.value = Value;
    }

    this.registerEvents = function () {
        var domElement = document.getElementById(ClientID);
        //domElement.onclick = myInstance.onclick
        $(domElement).on('apply.daterangepicker', function (ev, picker) { myInstance.onchange });
    }

    this.onchange = function () {
        var _RegisterEvents =
            new RegisterEvents();
        _RegisterEvents.ExcecuteUIJobs(myInstance.PostUIJobs);
    }

    this.getControlValue = function (ControlConfig, value) {
        var _Datepicker = document.getElementById(ControlConfig.ClientID);
        if (_Datepicker != null)
            return _Datepicker.value
    }

    this.Refresh = function (ControlConfig) {
        (new refreshJob(PageConfig)).RefresheventJobs(ControlConfig.ClientID);
    }
}

function AdvancedDatePicker(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    this.PreUIJobs = null;
    this.PostUIJobs = null;
    var controlConfig = null;
    var ClientID = '';

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        controlConfig = ControlConfig;
        //register events
        myInstance.PreUIJobs = ControlConfig.PreControlUIJobs;
        myInstance.PostUIJobs = ControlConfig.PostControlUIJobs;
        //myInstance.registerEvents();

        var DatetimepickerControl = myInstance.AdvIntializeDateRangePickerLoad(ControlConfig);
        if (DatetimepickerControl != null && DatetimepickerControl != undefined)
            ControlConfig["DatetimepickerControlInstance"] = DatetimepickerControl;
        if (ControlConfig.PreControlUIJobs != undefined && ControlConfig.PreControlUIJobs != null && ControlConfig.PreControlUIJobs.length > 0) {
            var _RegisterEvents =
                new RegisterEvents();
            _RegisterEvents.RegisterControlConfig = controlConfig;
            _RegisterEvents.ExcecuteUIJobs(ControlConfig.PreControlUIJobs);
        }
    }

    this.AdvIntializeDateRangePickerLoad = function (ControlConfig) {
        var oAdvIntializeDateRangePicker = new AdvIntializeDateRangePicker();
        oAdvIntializeDateRangePicker.subtractDays = ControlConfig.NoOfDateToSelect;
        oAdvIntializeDateRangePicker.IsRangesAvail = (ControlConfig.IsSingleDateSelection ? false : true);
        oAdvIntializeDateRangePicker.singleDatePicker = ControlConfig.IsSingleDateSelection;
        oAdvIntializeDateRangePicker.MinDate = ControlConfig.MinDate;
        oAdvIntializeDateRangePicker.MaxDate = ControlConfig.MaxDate;
        oAdvIntializeDateRangePicker.StartDate = ControlConfig.StartDate;
        oAdvIntializeDateRangePicker.EndDate = ControlConfig.EndDate;
        oAdvIntializeDateRangePicker.onChange = myInstance.onchange;
       return oAdvIntializeDateRangePicker.Load(ClientID);
    }

    this.setData = function (ControlConfig, Value) {
        var _Datepicker = document.getElementById(ControlConfig.ClientID);
        if (_Datepicker != null) {
            if (Value.split(",").length > 1) {
                if (Value.split(',')[0] == '' && Value.split(',')[1] == '') {
                    var picker = $("#" + ControlConfig.ClientID).data().daterangepicker;
                    picker.startDate = null;
                    picker.endDate = null;
                    picker.updateView();
                    picker.updateCalendars();
                    picker.hide();
                    $(_Datepicker).find('span').html('');
                }

                else {
                    if (Value.split(",").length > 1) {
                        if ($("#" + ControlConfig.ClientID).data().daterangepicker != undefined) {
                            if (Value.indexOf('/Date(') != -1) {
                                if (Value.split(",")[0].toString() != "" && Value.split(",")[1].toString()) {
                                    var startdate = moment(JSON.parseWithDate(JSON.stringify(Value.split(",")[0])));
                                    var enddate = moment(JSON.parseWithDate(JSON.stringify(Value.split(",")[1])));
                                    _Datepicker.getElementsByTagName("span")[0].innerHTML = startdate.format('MMMM D, YYYY') + " - " + enddate.format('MMMM D, YYYY');

                                    $("#" + ControlConfig.ClientID).data().daterangepicker.setStartDate(new Date(startdate.format('MMMM D, YYYY')));
                                    $("#" + ControlConfig.ClientID).data().daterangepicker.setEndDate(new Date(enddate.format('MMMM D, YYYY')));
                                }
                            }
                            else {
                                if (Value.split(",")[0].toString() != "" && Value.split(",")[1].toString()) {
                                    _Datepicker.getElementsByTagName("span")[0].innerHTML = moment(Value.split(",")[0], 'D-MM-YYYY H:mm:ss').format('MMMM D, YYYY') + " - " + moment(Value.split(",")[1], 'D-MM-YYYY H:mm:ss').format('MMMM D, YYYY');

                                    $("#" + ControlConfig.ClientID).data().daterangepicker.setStartDate(new Date(moment(Value.split(",")[0], 'D-MM-YYYY H:mm:ss').format('MMMM D, YYYY')));
                                    $("#" + ControlConfig.ClientID).data().daterangepicker.setEndDate(new Date(moment(Value.split(",")[1], 'D-MM-YYYY H:mm:ss').format('MMMM D, YYYY')));
                                }
                            }
                            //IntializeDateRangePicker(ControlConfig.ClientID, 0, false);
                        }
                    }
                }
            }
            else if (Value.split("-").length > 1) {
                _Datepicker.getElementsByTagName("span")[0].innerHTML = Value;
                if ($("#" + ControlConfig.ClientID).data().daterangepicker != undefined) {
                    $("#" + ControlConfig.ClientID).data().daterangepicker.setStartDate(new Date(Value.split("-")[0]));
                    $("#" + ControlConfig.ClientID).data().daterangepicker.setEndDate(new Date(Value.split("-")[1]));
                }
            }
        }
    }

    this.registerEvents = function () {
        var domElement = document.getElementById(ClientID);
        //domElement.onclick = myInstance.onclick
        $(domElement).on('change', myInstance.onchange);
    }

    this.onchange = function (ev, picker) {
        if (controlConfig.IsSingleDateSelection || ev.length == 2) {
            var _RegisterEvents =
                new RegisterEvents();
            _RegisterEvents.RegisterControlConfig = controlConfig;
            _RegisterEvents.PageConfig = PageConfig;
            _RegisterEvents.ExcecuteUIJobs(myInstance.PostUIJobs);
        }
    }

    this.getControlValue = function (ControlConfig, value) {
        var _Datepicker = document.getElementById(ControlConfig.ClientID);
        if (_Datepicker != null) {
            return _Datepicker.value;
        }
        return '';
    }

    this.Refresh = function (ControlConfig) {
        (new refreshJob(PageConfig)).RefresheventJobs(ControlConfig.ClientID);
    }

    this.Hide = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).addClass("hide");
    }

    this.Show = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).removeClass("hide");
    }

    this.Clear = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var Control = document.getElementById(ClientID);
        if (Control != undefined && Control != null && ControlConfig["DatetimepickerControlInstance"] != null && ControlConfig["DatetimepickerControlInstance"] != undefined) {
            ControlConfig["DatetimepickerControlInstance"].clear();
        }
    }
}
///******* Calender end **********************

///******* RadioButton start ********************
function WiNAiMRadioButton(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (RadioButtontype) {
        var RadioButton = null;
        if (RadioButtontype == "Default")
            RadioButton = new DefaultRadioButton(PageConfig);
        else if(RadioButtontype == "ListGroup")
            RadioButton = new ListGroupRadioButton(PageConfig);
        else
            alert("errro not implemented exception");

        return RadioButton;
    }

    this.onchange = function (ControlConfig) {
        var _DefaultRadioButton = myInstance.factory(ControlConfig.RadioButtonTypeName);
        _DefaultRadioButton.PostUIJobs = ControlConfig.PostControlUIJobs;
        return _DefaultRadioButton.onchange();
    }

    this.Load = function (ControlConfig) {
        var _DefaultRadioButton = myInstance.factory(ControlConfig.RadioButtonTypeName);
        return _DefaultRadioButton.Load(ControlConfig);
    }

    this.setData = function (ControlConfig, value) {
        var _DefaultRadioButton = myInstance.factory(ControlConfig.RadioButtonTypeName);
        return _DefaultRadioButton.setData(ControlConfig, value);
    }

    this.getControlValue = function (ControlConfig, value) {
        var _DefaultRadioButton = myInstance.factory(ControlConfig.RadioButtonTypeName);
        return _DefaultRadioButton.getControlValue(ControlConfig);
    }

    this.getSelectedOptionText = function (ControlConfig, value) {
        var _DefaultRadioButton = myInstance.factory(ControlConfig.RadioButtonTypeName);
        return _DefaultRadioButton.getSelectedOptionText(ControlConfig);
    }

    this.getControlValueFromGroup = function (ControlConfig, value) {
        var _DefaultRadioButton = myInstance.factory(ControlConfig.RadioButtonTypeName);
        return _DefaultRadioButton.getControlValueFromGroup(ControlConfig);
    }

    this.Hide = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultRadioButton = myInstance.factory(oControlConfig.RadioButtonTypeName);
        _DefaultRadioButton.Hide(oControlConfig);
    }

    this.Show = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultRadioButton = myInstance.factory(oControlConfig.RadioButtonTypeName);
        _DefaultRadioButton.Show(oControlConfig);
    }

    this.Clear = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _DefaultRadioButton = myInstance.factory(oControlConfig.RadioButtonTypeName);
        _DefaultRadioButton.Clear(oControlConfig);
    }
}

function DefaultRadioButton(_PageConfig) {

    var PageConfig = _PageConfig;
    var myInstance = this;
    this.async = false;
    var ContainerId = "";
    var ClientID = '';
    var controlConfig = null;
    this.PostUIJobs = null;

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        ContainerId = ControlConfig.ContainerId;

        if (ControlConfig.isStaticListItem == true)
            myInstance.LoadStaticData(ControlConfig);
        else
            myInstance.LoadDynamicData(ControlConfig);

        //register events
        controlConfig = ControlConfig;
        if (ControlConfig.PreControlUIJobs != undefined && ControlConfig.PreControlUIJobs != null && ControlConfig.PreControlUIJobs.length > 0) {
            var _RegisterEvents =
                new RegisterEvents();
            _RegisterEvents.RegisterControlConfig = controlConfig;
            _RegisterEvents.ExcecuteUIJobs(ControlConfig.PreControlUIJobs);
        }
        myInstance.PostUIJobs = ControlConfig.PostControlUIJobs;
        myInstance.registerEvents();
    }

    this.LoadStaticData = function (ControlConfig) {
        myInstance.DataBind(ControlConfig, ControlConfig.DefaultListItem);
    }

    this.LoadDynamicData = function (ControlConfig) {
        var oDynamicFormDataSourceComponent = new DynamicFormDataSourceComponent();
        oDynamicFormDataSourceComponent.DynamicFormDataSourceConfig = ControlConfig.DataSourceConfig;
        oDynamicFormDataSourceComponent.success = this.DataBind;
        oDynamicFormDataSourceComponent.error = this.error;
        oDynamicFormDataSourceComponent.complete = this.complete;
        oDynamicFormDataSourceComponent.sender = ControlConfig;
        oDynamicFormDataSourceComponent.ComboDATType = ControlConfig.ComboDATType;
        oDynamicFormDataSourceComponent.async = ControlConfig.async;
        oDynamicFormDataSourceComponent.Load();
    }

    this.registerEvents = function () {
        var RadioButton = document.getElementById(ClientID);
        if (RadioButton == null) {
            RadioButton = document.getElementsByName("group_" + ClientID);
            for (var i = 1; i <= RadioButton.length; i++) {
                RadioButton.item(i - 1).onchange = myInstance.onchange;
            }
        }
    }

    this.DataBind = function (ControlConfig, DataSource) {
        var RadioButtonList = "";

        if (ControlConfig.isStaticListItem == true) {
            var parentControl = $(document.getElementById(ControlConfig.ContainerId)).find('.row.responsive-sm.no-margin.ans-mode');
            try {
                var divChild = parentControl.find('.input-group');
                for (var i = 0; i < divChild.length; i++) {
                    parentControl.children(divChild[i]).remove();
                }
            }
            catch (ex) { }

            var divElement = document.createElement('div');
            divElement.classList.add("input-group");
            for (var i = 0; i < DataSource.length; i++) {
                var radioelement = document.createElement('input');
                radioelement.type = 'radio';
                radioelement.name = 'group_' + ControlConfig.ClientID;
                radioelement.id = (ControlConfig.ClientID + '_' + DataSource[i].Id);
                radioelement.value = DataSource[i].Id;
                radioelement.checked = DataSource[i].Selected;

                var labelelement = document.createElement('label');
                labelelement.setAttribute("for", (ControlConfig.ClientID + '_' + DataSource[i].Id));
                labelelement.innerHTML = DataSource[i].Text;

                var paragraph = document.createElement("p");
                paragraph.appendChild(radioelement);
                paragraph.appendChild(labelelement);

                divElement.appendChild(paragraph);
                //RadioButtonList += "<input type='radio' DataType = '" + DataSource[i].Dimension + "' name='group_" + ControlConfig.ClientID + "' value='" + DataSource[i].Id + "'/>" + DataSource[i].Name + "</br>";
            }
            parentControl.append(divElement);
            if (ControlConfig.IsAllowDataClear) {
                ClientID = ControlConfig.ClientID;
                var button = document.createElement('button');
                button.type = "button";
                button.innerHTML = '<i class="mdi mdi-close-circle-outline"></i> Clear';
                button.onclick = myInstance.selfClear;
                button.style.position = "absolute";
                button.style.right = "15px";
                button.style.top = "0";
                button.style.padding = "0 5px";
                button.style.background = "transparent";
                button.style.border = "0px";
                //button.className = "btn btn-default";
                divElement.appendChild(button);
            }
        }
        else {
            var parentControl = $(document.getElementById(ControlConfig.ContainerId)).find('.row.responsive-sm.no-margin.ans-mode');
            try {
                var divChild = parentControl.find('.input-group');
                for (var i = 0; i < divChild.length; i++) {
                    parentControl.children(divChild[i]).remove();
                }
            }
            catch (ex) { }

            var divElement = document.createElement('div');
            divElement.classList.add("input-group");
            for (var i = 0; i < DataSource.length; i++) {
                var radioelement = document.createElement('input');
                radioelement.type = 'radio';
                radioelement.name = 'group_' + ControlConfig.ClientID;
                radioelement.id = (ControlConfig.ClientID + '_' + DataSource[i].Id);
                radioelement.value = DataSource[i].Id;
                radioelement.DataType = DataSource[i].Dimension;
                radioelement.checked = DataSource[i].Selected;

                var labelelement = document.createElement('label');
                labelelement.setAttribute("for", (ControlConfig.ClientID + '_' + DataSource[i].Id));
                labelelement.innerHTML = DataSource[i].Name;
                divElement.appendChild(radioelement);
                divElement.appendChild(labelelement);
                //RadioButtonList += "<input type='radio' DataType = '" + DataSource[i].Dimension + "' name='group_" + ControlConfig.ClientID + "' value='" + DataSource[i].Id + "'/>" + DataSource[i].Name + "</br>";
            }
            parentControl.append(divElement);
            if (ControlConfig.IsAllowDataClear) {
                ClientID = ControlConfig.ClientID;
                var button = document.createElement('button');
                button.type = "button";
                button.innerHTML = '<i class="mdi mdi-close-circle-outline"></i> Clear';
                button.onclick = myInstance.selfClear;
                button.style.position = "absolute";
                button.style.right = "15px";
                button.style.top = "0";
                button.style.padding = "0 5px";
                button.style.background = "transparent";
                button.style.border = "0px";
                //button.className = "btn btn-default";
                divElement.appendChild(button);
            }
        }

        myInstance.onchange();
    }

    this.setData = function (ControlConfig, value) {
        ClientID = ControlConfig.ClientID;
        var RadioButton = document.getElementById(ControlConfig.ClientID);
        if (RadioButton == null) {
            RadioButton = document.getElementsByName("group_" + ControlConfig.ClientID);
            for (var i = 1; i <= RadioButton.length; i++) {
                if (i == value || RadioButton.item(i - 1).value == value)
                    RadioButton.item(i - 1).checked = true;
                else
                    RadioButton.item(i - 1).checked = false;
            }
        }
        else
            RadioButton.checked = true;

        myInstance.onchange();
    }

    this.getControlValue = function (ControlConfig, value) {
        var RadioButton = document.getElementById(ControlConfig.ClientID);
        return RadioButton.checked;
    }

    this.getSelectedOptionText = function (ControlConfig, value) {
        var result = "";
        var group = document.getElementsByName("group_" + ControlConfig.ClientID)
        for (var i = 0; i < group.length; i++) {
            if (group[i].checked) {
                if (group[i].parentNode != undefined && group[i].parentNode != null)
                    result = group[i].parentNode.textContent.trim();
                return result;
            }
        }
        return '';
    }

    this.getControlValueFromGroup = function (ControlConfig, value) {
        var result = "";
        var group = document.getElementsByName("group_" + ControlConfig.ClientID);
        for (var i = 0; i < group.length; i++) {
            if (group[i].checked) {
                result = group[i].value;
                return result;
            }
        }
        return '';
    }

    this.onchange = function () {
        var _RegisterEvents =
            new RegisterEvents();
        _RegisterEvents.RegisterControlConfig = controlConfig;
        _RegisterEvents.ExcecuteUIJobs(myInstance.PostUIJobs);
    }

    this.Hide = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).addClass("hide");
    }

    this.Show = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var containerControl = document.getElementById(ControlConfig.ContainerId);
        $(containerControl).removeClass("hide");
    }

    this.selfClear = function () {
        var RadioButton = document.getElementById(ClientID);
        if (RadioButton == null) {
            RadioButton = document.getElementsByName("group_" + ClientID);
            for (var i = 1; i <= RadioButton.length; i++) {
                RadioButton.item(i - 1).checked = false;
            }
        }
        else
            RadioButton.checked = false;
    }

    this.Clear = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var RadioButton = document.getElementById(ControlConfig.ClientID);
        if (RadioButton == null) {
            RadioButton = document.getElementsByName("group_" + ControlConfig.ClientID);
            for (var i = 1; i <= RadioButton.length; i++) {
                RadioButton.item(i - 1).checked = false;
            }
        }
        else
            RadioButton.checked = false;
    }
}

//sample var ListViewModel = { 'ControlId1': [{ id: 1, name: 'www',index:'', Isdisabled: true } , id: 1, name: 'www',index:'', Isdisabled: true } ] ,'ControlId2': [{ id: 1, name: 'www',index:'', Isdisabled: true } , id: 1, name: 'www',index:'', Isdisabled: true } ]};
var ListViewModel = {};

function ListGroupRadioButton(_PageConfig) {

    var PageConfig = _PageConfig;
    var myInstance = this;
    this.async = false;
    var ContainerId = "";
    var ClientID = '';

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        ContainerId = ControlConfig.ContainerId;

        //register events
        myInstance.registerEvents();

        if (ControlConfig.isStaticListItem == true)
            myInstance.LoadStaticData(ControlConfig);
        else
            myInstance.LoadDynamicData(ControlConfig);
    }

    this.LoadStaticData = function (ControlConfig) {
        myInstance.DataBind(ControlConfig, ControlConfig.DefaultListItem);
    }

    this.LoadDynamicData = function (ControlConfig) {
        var parameterToLoadData = (new DynamicPage(PageConfig)).GetLoadParameterList(ControlConfig.LoadParamControlList);
        parameterToLoadData = JSON.stringify(parameterToLoadData);

        parameterToLoadData = { request: parameterToLoadData };
        var data = JSON.stringify(parameterToLoadData);

        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = ControlConfig.GetServiceURL;
        myAjaxobj.webMethod = "POST";
        myAjaxobj.parameter = data;
        myAjaxobj.async = myInstance.async;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var callBackparm = {
            success: this.DataBind,
            complete: this.complete,
            sender: ControlConfig
        }
        myAjaxobj.execute(callBackparm);
    }

    this.registerEvents = function () {
        var RadioButton = document.getElementById(ClientID);
        if (RadioButton == null) {
            RadioButton = document.getElementsByName("group_" + ClientID);
            for (var i = 1; i <= RadioButton.length; i++) {
                RadioButton.item(i - 1).onchange = myInstance.onchange;
            }
        }
    }

    this.DataBind = function (ControlConfig, DataSource) {
        var RadioButtonList = "";

        if (ControlConfig.isStaticListItem != true) {
            var parentControl = document.getElementById(ControlConfig.ContainerId);
            if (parentControl != null && parentControl != undefined) {
                for (var i = 0; i < DataSource.length; i++) {
                    RadioButtonList += "<li class='list-group-item' id='" + DataSource[i].Id + "' name='group_" + ControlConfig.ClientID + "'>" + DataSource[i].Name + "</li>";
                }
                var divElement = document.createElement('ul');
                divElement.classList.add("list-group");
                divElement.classList.add("predefined");
                divElement.classList.add("checked-list-box");
                divElement.style.height = "116px";
                divElement.id = "group_" + ControlConfig.ClientID;
                divElement.innerHTML = RadioButtonList;
                try {
                    var divChild = $(parentControl).find('.list-group');
                    for (var i = 0; i < divChild.length; i++) {
                        parentControl.removeChild(divChild[i]);
                    }
                }
                catch (ex) { }
                parentControl.appendChild(divElement);

                $(function () {
                    $('.list-group.checked-list-box .list-group-item').each(function () {

                        // Settings
                        var $widget = $(this),
                            $checkbox = $('<input type="checkbox" class="hidden" />'),
                            color = ($widget.data('color') ? $widget.data('color') : "primary"),
                            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
                            settings = {
                                on: {
                                    icon: 'glyphicon glyphicon-check'
                                },
                                off: {
                                    icon: 'glyphicon glyphicon-unchecked'
                                }
                            };

                        $widget.css('cursor', 'pointer')
                        $widget.append($checkbox);

                        // Event Handlers
                        $widget.on('click', function () {
                            $checkbox.prop('checked', !$checkbox.is(':checked'));
                            $checkbox.triggerHandler('change');
                            updateDisplay();
                        });
                        $checkbox.on('change', function () {
                            updateDisplay();
                        });


                        // Actions
                        function updateDisplay() {
                            var isChecked = $checkbox.is(':checked');

                            // Set the button's state
                            $widget.data('state', (isChecked) ? "on" : "off");

                            // Set the button's icon
                            $widget.find('.state-icon')
                                .removeClass()
                                .addClass('state-icon ' + settings[$widget.data('state')].icon);

                            // Update the button's color
                            if (isChecked) {
                                $widget.addClass(style + color + ' active');
                            } else {
                                $widget.removeClass(style + color + ' active');
                            }
                        }

                        // Initialization
                        function init() {

                            if ($widget.data('checked') == true) {
                                $checkbox.prop('checked', !$checkbox.is(':checked'));
                            }

                            updateDisplay();

                            // Inject the icon if applicable
                            if ($widget.find('.state-icon').length == 0) {
                                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
                            }
                        }
                        init();
                    });

                    $('#get-checked-data').on('click', function (event) {
                        event.preventDefault();
                        var checkedItems = {}, counter = 0;
                        $("#check-list-box li.active").each(function (idx, li) {
                            checkedItems[counter] = $(li).text();
                            counter++;
                        });
                        $('#display-json').html(JSON.stringify(checkedItems, null, '\t'));
                    });
                });

                $('.list-group a').on('click', function () {
                    if ($(this).hasClass("active") == true) {
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                    }
                });
            }
        }
        else {
            var parentControl = document.getElementById("group_" + ControlConfig.ClientID);
            if (parentControl != null && parentControl != undefined) {
                try {
                    var divChild = $(parentControl).find('.list-group-item');
                    for (var i = 0; i < divChild.length; i++) {
                        parentControl.removeChild(divChild[i]);
                    }
                }
                catch (ex) { }
            }
        }

        myInstance.onchange();
    }

    this.setData = function (ControlConfig, value) {
        ClientID = ControlConfig.ClientID;
        var result = value.split('|');
        if (!ControlConfig.IsCustom) {
            var RadioButton = document.getElementsByName("group_" + ControlConfig.ClientID);
            if (RadioButton != undefined && RadioButton != null) {
                for (var i = 0; i < RadioButton.length; i++) {
                    for (var j = 0; j < result.length; j++) {
                        var IdIndex = result[j].split('$sp$');
                        if (IdIndex[0] == RadioButton.item(i).id.toString()) {
                            RadioButton.item(i).classList.add("list-group-item-primary");
                            RadioButton.item(i).classList.add("active");
                            $(RadioButton.item(i)).find('.state-icon')
                            .removeClass()
                            .addClass('state-icon glyphicon glyphicon-check');
                            RadioButton.item(i).index = IdIndex.length > 1 ? IdIndex[1] : 0;
                            if ($(RadioButton.item(i)).find('input').length > 0)
                                $(RadioButton.item(i)).find('input')[0].checked = true;
                            break;
                        }
                        else {
                            RadioButton.item(i).classList.remove("list-group-item-primary");
                            RadioButton.item(i).classList.remove("active");
                            $(RadioButton.item(i)).find('.state-icon')
                            .removeClass()
                            .addClass('state-icon glyphicon glyphicon-unchecked');
                            if ($(RadioButton.item(i)).find('input').length > 0)
                                $(RadioButton.item(i)).find('input')[0].checked = false;
                        }
                    }
                }
            }
        }
        else {
            var RadioButton = document.getElementById("group_" + ControlConfig.ClientID);
            if (ListViewModel["group_" + ControlConfig.ClientID] == null) {
                ListViewModel["group_" + ControlConfig.ClientID] = [];
            }
            if (RadioButton != undefined && RadioButton != null) {
                var listgroupitem = $(RadioButton).find(".list-group-item");
                for (var i = 0; i < listgroupitem.length; i++) {
                    RadioButton.removeChild(listgroupitem[i]);
                }
                for (var j = 0; j < result.length; j++) {
                    var IdIndex = result[j].split('$sp$');
                    if (IdIndex[0] != '' && IdIndex[0] != undefined && IdIndex[0] != null) {

                        var litag = document.createElement("li");
                        litag.classList.add("list-group-item");
                        litag.innerHTML = IdIndex[0] + '<a groupId=\'' + "group_" + ControlConfig.ClientID + '\'  ItemId=\'' + IdIndex[2] + '\' itemvalue = \'' + IdIndex[0] + '\' class="btn btn-danger pull-right" href="javascript:void(0);"><i class="fa fa-minus"></i></a>';
                        litag.index = IdIndex.length > 1 ? IdIndex[1] : 0;
                        litag.setAttribute("uniqueRef", (j + 1));
                        RadioButton.appendChild(litag);
                        ListViewModel["group_" + ControlConfig.ClientID].push({ id: IdIndex[2], uniqueRef: (j +1), name: IdIndex[0], index: litag.index, Isdisabled: false, IsMulti: true });
                       
                    }
                }
                $('.list-group-item a').on('click', function () {
                    if (ListViewModel[this.attributes["groupId"].value] != undefined && ListViewModel[this.attributes["groupId"].value] != null)
                    {
                        if (this.attributes["groupId"] != undefined && this.attributes["groupId"] != null && this.attributes["ItemId"] != undefined && this.attributes["ItemId"] != null) {
                            for (var i = 0; i < ListViewModel[this.attributes["groupId"].value].length; i++) {
                                if (ListViewModel[this.attributes["groupId"].value][i].id == this.attributes["ItemId"].value) {
                                    ListViewModel[this.attributes["groupId"].value][i].Isdisabled = true;
                                }
                            }
                        }
                    }

                    $(this).closest('li').remove();
                });
                AddClickEventForListGroupItem(ControlConfig.ControlID);
            }
        }
        myInstance.onchange();
    }

    this.getControlValue = function (ControlConfig, value) {
        var RadioButton = document.getElementById(ControlConfig.ClientID);
        return RadioButton.checked;
    }

    this.getControlValueFromGroup = function (ControlConfig, value) {
        var result = [];
        if (!ControlConfig.IsCustom) {
            var group = document.getElementsByName("group_" + ControlConfig.ClientID);
            for (var i = 0; i < group.length; i++) {
                if (group.item(i).classList.contains("active")) {
                    if (result.length == 0) {
                        result.push({ id: group.item(i).id, name: group.item(i).textContent, index: group.item(i).index == undefined ? -1 : group.item(i).index, IsMulti: true });
                    }
                    else {
                        result.push({ id: group.item(i).id, name: group.item(i).textContent, index: group.item(i).index == undefined ? -1 : group.item(i).index, IsMulti: true });
                    }
                }
                else if ((group.item(i).index != undefined && group.item(i).index != null)) {
                    if (result.length == 0) {
                        result.push({ id: '', name: '', index: group.item(i).index == undefined ? 0 : group.item(i).index, IsMulti: true });
                    }
                    else {
                        result.push({ id: '', name: '', index: group.item(i).index == undefined ? 0 : group.item(i).index, IsMulti: true });
                    }
                }
            }
        }
        else {
            if (ListViewModel != undefined)
                result = ListViewModel["group_" + ControlConfig.ClientID];
        }
        return result;
    }

    this.getControlValueFromGroupOld = function (ControlConfig, value) {
        var result = [];
        if (!ControlConfig.IsCustom) {
            var group = document.getElementsByName("group_" + ControlConfig.ClientID);
            for (var i = 0; i < group.length; i++) {
                if (group.item(i).classList.contains("active")) {
                    if (result.length == 0) {
                        result.push({ id: group.item(i).id, name: group.item(i).text, index: group.item(i).index == undefined ? -1 : group.item(i).index, IsMulti: true });
                    }
                    else {
                        result.push({ id: group.item(i).id, name: group.item(i).text, index: group.item(i).index == undefined ? -1 : group.item(i).index, IsMulti: true });
                    }
                }
                else if ((group.item(i).index != undefined && group.item(i).index != null)) {
                    if (result.length == 0) {
                        result.push({ id: '', name: '', index: group.item(i).index == undefined ? 0 : group.item(i).index, IsMulti: true });
                    }
                    else {
                        result.push({ id: '', name: '', index: group.item(i).index == undefined ? 0 : group.item(i).index, IsMulti: true });
                    }
                }
            }
        }
        else {
            var group = document.getElementById("group_" + ControlConfig.ClientID);
            for (var i = 0; i < group.children.length; i++) {
                if (result.length == 0) {
                    result.push({ id: group.children.item(i).textContent, name: group.children.item(i).textContent, index: group.children.item(i).index == undefined ? -1 : group.children.item(i).index, IsMulti: true });
                }
                else {
                    result.push({ id: group.children.item(i).textContent, name: group.children.item(i).textContent, index: group.children.item(i).index == undefined ? -1 : group.children.item(i).index, IsMulti: true });
                }
            }
        }
        return result;
    }

    this.onchange = function () {
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        _WiNAiMClinetSideEventMgmt.EventExecution("onchange", ClientID);
    }
}
///******* RadioButton end **********************

///******* CheckBox start ********************
function WiNAiMCheckBox(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (CheckBoxtype) {
        var CheckBox = null;
        if (CheckBoxtype == "Default")
            CheckBox = new DefaultCheckBox(PageConfig);
        else
            CheckBox = new DefaultCheckBox(PageConfig);

        return CheckBox;
    }

    this.Load = function (ControlConfig) {
        var _DefaultCheckBox = myInstance.factory(ControlConfig.CheckBoxTypeName);
        return _DefaultCheckBox.Load(ControlConfig);
    }

    this.setData = function (ControlConfig, value) {
        var _DefaultCheckBox = myInstance.factory(ControlConfig.CheckBoxTypeName);
        return _DefaultCheckBox.setData(ControlConfig, value);
    }

    this.getControlValue = function (ControlConfig, value) {
        var _DefaultCheckBox = myInstance.factory(ControlConfig.CheckBoxTypeName);
        return _DefaultCheckBox.getControlValue(ControlConfig);
    }

    this.getControlValueFromGroup = function (ControlConfig, value) {
        var _DefaultCheckBox = myInstance.factory(ControlConfig.CheckBoxTypeName);
        return _DefaultCheckBox.getControlValueFromGroup(ControlConfig);
    }
}

function DefaultCheckBox(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.async = false;
    var ContainerId = "";

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        if (ControlConfig.CheckBoxTypeName != "Default") {
            if (ControlConfig.isStaticListItem == true)
                myInstance.LoadStaticData(ControlConfig);
            else
                myInstance.LoadDynamicData(ControlConfig);
        }
    }

    this.LoadStaticData = function (ControlConfig) {
        myInstance.DataBind(ControlConfig, ControlConfig.DefaultListItem);
    }

    this.LoadDynamicData = function (ControlConfig) {
        var parameterToLoadData = (new DynamicPage(PageConfig)).GetLoadParameterList(ControlConfig.LoadParamControlList);
        parameterToLoadData = JSON.stringify(parameterToLoadData);

        parameterToLoadData = { request: parameterToLoadData };
        var data = JSON.stringify(parameterToLoadData);

        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = ControlConfig.GetServiceURL;
        myAjaxobj.webMethod = "post";
        myAjaxobj.parameter = data;
        myAjaxobj.async = myInstance.async;
        var result = myAjaxobj.execute();
        myInstance.DataBind(ControlConfig, result);
    }

    this.DataBind = function (ControlConfig, DataSource) {
        var CheckBoxList = "";

        if (typeof (DataSource) == 'string') {
            DataSource = JSON.parse(DataSource);
            for (var i = 0; i < DataSource.length; i++) {
                CheckBoxList += "<label class='checkbox'><input type='checkbox' name='group_" + ControlConfig.ContainerId + "' value='" + DataSource[i].Id + "'/><i></i>" + DataSource[i].Name + "</label>";
            }
            $("#" + ControlConfig.ContainerId).empty();
            $("#" + ControlConfig.ContainerId).append(CheckBoxList);
        }
    }

    this.setData = function (ControlConfig, value) {
        var CheckBox = document.getElementById(ControlConfig.ClientID)
        if (value == 'true')
            CheckBox.checked = true;
        else
            CheckBox.checked = false;
    }

    this.getControlValue = function (ControlConfig, value) {
        var CheckBox = document.getElementById(ControlConfig.ClientID);
        return CheckBox.checked;
    }

    this.getControlValueFromGroup = function (ControlConfig, value) {
        var group = document.getElementsByName("group_" + ControlConfig.ContainerId)
        var CheckList = [];
        for (var i = 0; i < group.length; i++) {
            if (group[i].checked) {
                CheckList.push(group[i].value);
            }
        }
        return CheckList;

    }
}
///******* CheckBox end **********************

///******* Image start ********************
function WiNAiMImageControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (controltype) {
        var ImageControl = null;
        if (controltype == "Default")
            ImageControl = new DefaultImageControl(PageConfig);
        else if (controltype == "ImageList")
            ImageControl = new ImageListControl(PageConfig);
        else if (controltype == "File")
            ImageControl = new FileControl(PageConfig);
        else
            alert("errro not implemented exception");

        return ImageControl;
    }

    this.Load = function (ControlConfig) {
        var _DefaultImageControl = myInstance.factory(ControlConfig.ImageControlTypeName);
        _DefaultImageControl.Load(ControlConfig);
    }

    this.setData = function (ControlConfig, value) {
        var _DefaultTextBox = myInstance.factory(ControlConfig.ImageControlTypeName);
        _DefaultTextBox.setData(ControlConfig, value);
    }

    this.Text = function (ControlConfig, value) {
        var _DefaultTextBox = myInstance.factory(ControlConfig.ImageControlTypeName);
        return _DefaultTextBox.Text(ControlConfig);
    }

    this.getValue = function (ControlConfig) {
        var _DefaultImageControl = myInstance.factory(ControlConfig.ImageControlTypeName);
        return _DefaultImageControl.getValue(ControlConfig);
    }
}

function DefaultImageControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    var ClientID = '';

    this.setData = function (ControlConfig, Value) {
        ClientID = ControlConfig.ClientID;
        var TextBox = document.getElementById(ControlConfig.ClientID);
        if (Value != null)
            TextBox.value = Value.replace(/&amp;/g, '&');
        else
            TextBox.value = Value;

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            myInstance.onchange();
    }

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        //register events
        myInstance.registerEvents();

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            this.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.Text = function (ControlConfig) {
        var TextBox = document.getElementById(ControlConfig.ClientID);
        return TextBox.value;
    }

    this.registerEvents = function () {
        var txtControl = document.getElementById(ClientID);
        txtControl.onchange = myInstance.onchange;
        txtControl.onkeypress = myInstance.onkeypress;
    }

    this.onchange = function () {
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        _WiNAiMClinetSideEventMgmt.EventExecution("onchange", ClientID);
    }

    this.onkeypress = function (event) {
        KeyEvent = event;
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        return _WiNAiMClinetSideEventMgmt.EventExecution("onkeypress", ClientID);
    }
}

function ImageListControl(_PageConfig) {
    var PageConfig = _PageConfig;
    this.async = false;
    var myInstance = this;
    var ClientID = '';

    this.setData = function (ControlConfig, Value) {
        ClientID = ControlConfig.ClientID;
        if (Value != undefined && Value != null && Value != '') {
            var result = Value.split('|');
            var ImageControl = document.getElementsByName("group_" + ControlConfig.ClientID);
            if (ImageControl != undefined && ImageControl != null) {
                var parameterToLoadData = [];
                for (var j = 0; j < result.length; j++) {
                    var IdIndex = result[j].split('$sp$');
                    var id = 0;
                    var Url = '';
                    if (IdIndex.length > 1) {
                        Url = IdIndex[1];
                        id = IdIndex[0];
                    }
                    else
                        Url = IdIndex[0];

                    parameterToLoadData.push({ id: id, Url: Url });
                }
                var data = JSON.stringify({ request: JSON.stringify(parameterToLoadData) });

                var myAjaxobj = new WiNAiMAjax();
                myAjaxobj.url = ControlConfig.GetServiceURL;
                myAjaxobj.webMethod = "POST";
                myAjaxobj.parameter = data;
                myAjaxobj.async = myInstance.async;
                myAjaxobj.contentType = 'application/json; charset=utf-8';
                myAjaxobj.dataType = 'json';
                var callBackparm = {
                    success: this.DataBind,
                    complete: this.complete,
                    sender: ControlConfig
                }
                myAjaxobj.execute(callBackparm);
            }
        }
        else {
            var parentControl = document.getElementById(ControlConfig.ContainerId);
            if (parentControl != undefined && parentControl != null) {
                for (var itr = 0; itr < parentControl.children.length;) {
                    parentControl.removeChild(parentControl.children[itr]);
                }
            }
            ListViewModel["group_" + ControlConfig.ClientID] = [];
        }
    }

    this.DataBind = function (ControlConfig, DataSource) {
        var RadioButtonList = "";
        var parentControl = document.getElementById(ControlConfig.ContainerId);
        if (parentControl != undefined && parentControl != null) {
            for (var itr = 0; itr < parentControl.children.length;) {
                parentControl.removeChild(parentControl.children[itr]);
            }
            var mainDivElement = document.createElement('div');
            mainDivElement.id = ("group_" + ControlConfig.ClientID);
            for (var i = 0; i < DataSource.length; i++) {
                var divelement = document.createElement('div');
                divelement.classList.add('superbox-list');
                var aelement = document.createElement('a');
                aelement.href = DataSource[i].Url;
                aelement.setAttribute("data-lightbox", "roadtrip");
                aelement.setAttribute("uniqueRef", DataSource[i].id);
                var imgelement = document.createElement('img');
                imgelement.src = DataSource[i].Url;
                imgelement.setAttribute("uniqueRef", DataSource[i].id);
                imgelement.classList.add("superbox-img");
                aelement.appendChild(imgelement);
                divelement.appendChild(aelement);
                mainDivElement.appendChild(divelement);
                if (ListViewModel["group_" + ControlConfig.ClientID] == null) {
                    ListViewModel["group_" + ControlConfig.ClientID] = [];
                }
                ListViewModel["group_" + ControlConfig.ClientID].push({ id: DataSource[i].id, uniqueRef: (i + 1), name: DataSource[i].Url, Isdisabled: false, IsMulti: false });
            }
            parentControl.appendChild(mainDivElement);
        }
    }

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        //register events
        myInstance.registerEvents();

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            this.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.Text = function (ControlConfig) {
        var TextBox = document.getElementById(ControlConfig.ClientID);
        return TextBox.value;
    }

    this.getValue = function (ControlConfig) {
        var result = [];
        if (!ControlConfig.IsCustom) {
            var group = document.getElementsByName("group_" + ControlConfig.ClientID);
            if (group != undefined && group != null) {
                var ImageLst = ListViewModel["group_" + ControlConfig.ClientID];
                if (ImageLst != undefined && ImageLst != null) {
                    for (var i = 0; i < ImageLst.length; i++) {
                        if (result.length == 0) {
                            result.push({ id: ImageLst[i].id, name: ImageLst[i].name, index: ImageLst[i].index == undefined ? -1 : ImageLst[i].index, IsMulti: false });
                        }
                        else {
                            result.push({ id: ImageLst[i].id, name: ImageLst[i].name, index: ImageLst[i].index == undefined ? -1 : ImageLst[i].index, IsMulti: false });
                        }
                    }
                }
            }
        }
        else {
            if (ListViewModel != undefined)
                result = ListViewModel["group_" + ControlConfig.ClientID];
        }
        return result;
    }

    this.registerEvents = function () {
        var txtControl = document.getElementById(ClientID);
        txtControl.onchange = myInstance.onchange;
        txtControl.onkeypress = myInstance.onkeypress;
    }

    this.onchange = function () {
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        _WiNAiMClinetSideEventMgmt.EventExecution("onchange", ClientID);
    }

    this.onkeypress = function (event) {
        KeyEvent = event;
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        return _WiNAiMClinetSideEventMgmt.EventExecution("onkeypress", ClientID);
    }
}

function FileControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    var ClientID = '';

    this.setData = function (ControlConfig, Value) {
        ClientID = ControlConfig.ClientID;
        if (Value != undefined && Value != null && Value != '') {
            var group = document.getElementById(ControlConfig.ClientID);
            if (group != undefined && group != null) {
                var DataSourceConfig = ControlConfig.DataSourceConfig;
                var ServiceName = "";
                if (DataSourceConfig != undefined && DataSourceConfig != null)
                    ServiceName = DataSourceConfig.ServiceKeyName;
                if (ServiceName != undefined && ServiceName != null && ServiceName != '') {
                    var parameterToLoadData = [];
                    parameterToLoadData.push({ id: 0, Url: Value });
                    var data = JSON.stringify({ request: JSON.stringify(parameterToLoadData) });

                    var myAjaxobj = new WiNAiMAjax();
                    myAjaxobj.url = GetRelativeUrl(ServiceName);
                    myAjaxobj.webMethod = "POST";
                    myAjaxobj.parameter = data;
                    myAjaxobj.async = ControlConfig.async;
                    myAjaxobj.contentType = 'application/json; charset=utf-8';
                    myAjaxobj.dataType = 'json';
                    var callBackparm = {
                        success: this.DataBind,
                        complete: this.complete,
                        sender: ControlConfig
                    }
                    myAjaxobj.execute(callBackparm);
                }
            }
        }
        else {
            var group = document.getElementById(ControlConfig.ClientID);
            if (group != undefined && group != null)
                $(group).find('img').attr('src', '');
        }
    }

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        var group = document.getElementById(ControlConfig.ClientID);
        if (group != undefined && group != null)
            $(group).find('img').attr('src', '');
        //register events
        //myInstance.registerEvents();

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            this.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.Text = function (ControlConfig) {
        var TextBox = document.getElementById(ControlConfig.ClientID);
        return TextBox.value;
    }

    this.DataBind = function (ControlConfig, DataSource) {
        var RadioButtonList = "";
        var parentControl = document.getElementById(ControlConfig.ClientID);
        if (parentControl != undefined && parentControl != null) {
            $(parentControl).find('img').attr('src', '');
            for (var i = 0; i < DataSource.length; i++) {
                $(parentControl).find('img').attr('src', DataSource[i].Url);
            }
        }
    }

    this.getValue = function (ControlConfig) {
        var result = [];
        var group = document.getElementById(ControlConfig.ClientID);
        if (group != undefined && group != null) {
            var Image = $(group).find('img');
            if (Image != undefined && Image != null && Image.length > 0) {
                var imageControl = Image[0];
                result = imageControl.getAttribute('src');
            }
        }
        return result;
    }

    this.onchange = function () {
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        _WiNAiMClinetSideEventMgmt.EventExecution("onchange", ClientID);
    }

    this.onkeypress = function (event) {
        KeyEvent = event;
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        return _WiNAiMClinetSideEventMgmt.EventExecution("onkeypress", ClientID);
    }
}
///******* Image end **********************

///******* Link start ********************
function WiNAiMLinkControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;

    this.factory = function (TextBoxtype) {
        var Link = null;
        if (TextBoxtype == "Default")
            Link = new DefaultLinkControl(PageConfig);
        if (TextBoxtype == "Button")
            Link = new ButtonLinkControl(PageConfig);
        else
            alert("errro not implemented exception");

        return Link;
    }

    this.Load = function (ControlConfig) {
        var _DefaultLinkBox = myInstance.factory(ControlConfig.LinkTypeName);
        _DefaultLinkBox.Load(ControlConfig);
    }

    this.Refresh = function (ControlId) {
        var oControlConfig = PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId]
        var _LinkControl = myInstance.factory(oControlConfig.LinkTypeName);
        _LinkControl.Refresh(oControlConfig);
    }
}

function DefaultLinkControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    var ClientID = '';

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        //register events
        myInstance.registerEvents();

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            this.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.registerEvents = function () {
        var LinkControl = document.getElementById(ClientID);
        LinkControl.onclick = myInstance.onclick;
    }

    this.onclick = function () {
        var _WiNAiMClinetSideEventMgmt =
            new WiNAiMClinetSideEventMgmt(PageConfig);

        _WiNAiMClinetSideEventMgmt.EventExecution("onclick", ClientID);
    }
}

function ButtonLinkControl(_PageConfig) {
    var PageConfig = _PageConfig;
    var myInstance = this;
    this.PostUIJobs = null;
    var ClientID = '';
    var controlConfig = null;

    this.Load = function (ControlConfig) {
        ClientID = ControlConfig.ClientID;
        //register events
        controlConfig = ControlConfig;
        if (ControlConfig.PreControlUIJobs != undefined && ControlConfig.PreControlUIJobs != null && ControlConfig.PreControlUIJobs.length > 0) {
            var _RegisterEvents =
                new RegisterEvents();
            _RegisterEvents.RegisterControlConfig = controlConfig;
            _RegisterEvents.ExcecuteUIJobs(ControlConfig.PreControlUIJobs);
        }
        myInstance.PostUIJobs = ControlConfig.PostControlUIJobs;
        myInstance.registerEvents();

        if (ControlConfig.DefaultValue != undefined && ControlConfig.DefaultValue != null && ControlConfig.DefaultValue != "")
            this.setData(ControlConfig, ControlConfig.DefaultValue);
    }

    this.registerEvents = function () {
        var LinkControl = document.getElementById(ClientID);
        LinkControl.onclick = myInstance.onclick;
    }

    this.onclick = function () {
        var _RegisterEvents =
            new RegisterEvents();
        _RegisterEvents.RegisterControlConfig = controlConfig;
        _RegisterEvents.ExcecuteUIJobs(myInstance.PostUIJobs);
    }

    this.Refresh = function (ControlConfig) {
        (new refreshJob(PageConfig)).RefresheventJobs(ControlConfig.ClientID);
    }
}
///******* Link end **********************

function GetControlValueByClientId(ClientId) {
    var ControlValue = null;
    var ClientControlConfig = ModelUpdate.ControlGroupConfigLst[0].ControlConfigDict[ClientId];
    if (ClientControlConfig != undefined && ClientControlConfig != null) {
        var LocalTreeDataSource_DynamicPageObject = new DynamicPage(ModelUpdate);
        ControlValue = LocalTreeDataSource_DynamicPageObject.getControlValue(ClientControlConfig);
    }
    return ControlValue;
}

function GetComboSelectedNameByClientId(ClientId) {
    var ControlValue = null;
    var ClientControlConfig = ModelUpdate.ControlGroupConfigLst[0].ControlConfigDict[ClientId];
    if (ClientControlConfig != undefined && ClientControlConfig != null) {
        var DynamicPageObject = new DynamicPage(ModelUpdate);
        if (DynamicPageObject != null && DynamicPageObject != undefined) {
            ControlValue = DynamicPageObject.getControlName_combo(ClientControlConfig);
        }
    }
    return ControlValue;
}

function DynamicFormDataSourceComponent() {
    var myInstance = this;
    this.DynamicFormDataSourceConfig = null;
    this.success = null;
    this.error = null;
    this.complete = null;
    this.sender = null;
    this.ComboDATType = null;
    this.async = false;

    this.Load = function () {
        var _oFactory = new Factory();
        var oGetDataSource = _oFactory.GetDataSource(myInstance.DynamicFormDataSourceConfig.Type);
        oGetDataSource.DynamicFormDataSourceConfig = myInstance.DynamicFormDataSourceConfig;
        oGetDataSource.success = myInstance.success;
        oGetDataSource.error = myInstance.error;
        oGetDataSource.complete = myInstance.complete;
        oGetDataSource.sender = myInstance.sender;
        oGetDataSource.ComboDATType = myInstance.ComboDATType;
        oGetDataSource.async = myInstance.async;
        var DataSource = oGetDataSource.Load();
        return DataSource;
    }
}

function V3ServiceDynamicFormDataSourceComponent() {
    var myInstance = this;
    this.DynamicFormDataSourceConfig = null;
    this.success = null;
    this.error = null;
    this.complete = null;
    this.sender = null;
    this.ComboDATType = null;
    this.async = false;

    this.Load = function () {
        var result = myInstance.GetData();
        return result;
    }

    this.GetData = function () {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl(myInstance.DynamicFormDataSourceConfig.ServiceKeyName);
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = myInstance.async;
        myAjaxobj.parameter = GetParam(myInstance.DynamicFormDataSourceConfig.LoadParms);
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var callBackparm = {
            success: myInstance.success,
            error: myInstance.error,
            complete: myInstance.complete,
            sender: myInstance.sender
        }
        var result = myAjaxobj.execute(callBackparm);
        if (result != undefined && result != null && result != '') {
            try {
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

    var GetParam = function (LoadParms) {
        var pramtoLoad = {};
        var requestParam = {};
        if (LoadParms != undefined && LoadParms != null) {
            for (var param in LoadParms) {
                var paramValue = '';
                try {
                    paramValue = eval(LoadParms[param]);
                }
                catch (ex) {
                    console.log('param not correct');
                }
                if (paramValue != undefined && paramValue != null && paramValue != '')
                    pramtoLoad[param] = paramValue;
            }
        }
        requestParam = { request: JSON.stringify(pramtoLoad), DATType: myInstance.ComboDATType };
        return JSON.stringify(requestParam);
    }
}

function LocalTreeDataSourceComponent() {
    var myInstance = this;
    this.DynamicFormDataSourceConfig = null;
    this.success = null;
    this.error = null;
    this.complete = null;
    this.sender = null;
    this.ComboDATType = null;
    this.async = false;

    this.Load = function () {
        var result = myInstance.GetData();
        return result;
    }

    this.GetData = function () {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl(myInstance.DynamicFormDataSourceConfig.ServiceKeyName);
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = myInstance.async;
        myAjaxobj.parameter = GetParam(myInstance.DynamicFormDataSourceConfig.LoadParms);
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var callBackparm = {
            success: myInstance.success,
            error: myInstance.error,
            complete: myInstance.complete,
            sender: myInstance.sender
        }
        var result = myAjaxobj.execute(callBackparm);
        if (result != undefined && result != null && result != '') {
            try {
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

    var GetParam = function (LoadParms) {
        var pramtoLoad = {};
        var requestParam = {};
        if (LoadParms != undefined && LoadParms != null) {
            for (var param in LoadParms) {
                var paramValue = '';
                try {
                    paramValue = eval(LoadParms[param]);
                }
                catch (ex) {
                    console.log('param not correct');
                }
                if (paramValue != undefined && paramValue != null && paramValue != '')
                    pramtoLoad[param] = paramValue;
            }
        }
        if (myInstance.DynamicFormDataSourceConfig != undefined && myInstance.DynamicFormDataSourceConfig != null &&
            myInstance.DynamicFormDataSourceConfig.ParentControlIdLst != undefined && myInstance.DynamicFormDataSourceConfig.ParentControlIdLst != null &&
            myInstance.DynamicFormDataSourceConfig.ParentControlIdLst.length > 0) {
            var ParentControlIdLst = myInstance.DynamicFormDataSourceConfig.ParentControlIdLst;
            for (var itr = 0; itr < ParentControlIdLst.length; itr++) {
                if (myInstance.sender.currentPageConfig != undefined && myInstance.sender.currentPageConfig != null) {
                    var ParentControlConfig = new DynamicPage(myInstance.sender.currentPageConfig).GetMyControlConfigUsingClientId(ParentControlIdLst[itr]);
                    pramtoLoad["ParentControlId" + (itr + 1)] = GetControlValueByClientId(ParentControlIdLst[itr]);
                    if (ParentControlConfig.ControlTypeName = "ComboBox")
                        pramtoLoad["ParentControlDATType" + (itr + 1)] = ParentControlConfig.ComboDATType;
                }
            }
        }
        requestParam = { request: JSON.stringify(pramtoLoad), DATType: myInstance.ComboDATType };
        return JSON.stringify(requestParam);
    }

    var GetControlValueByClientId = function (ClientId) {
        var ControlValue = null;
        if (myInstance.sender.currentPageConfig != undefined && myInstance.sender.currentPageConfig != null) {
            var ClientControlConfig = myInstance.sender.currentPageConfig.ControlGroupConfigLst[0].ControlConfigDict[ClientId];
            if (ClientControlConfig != undefined && ClientControlConfig != null) {
                var LocalTreeDataSource_DynamicPageObject = new DynamicPage(myInstance.sender.currentPageConfig);
                ControlValue = LocalTreeDataSource_DynamicPageObject.getControlValue(ClientControlConfig);
            }
        }
        return ControlValue;
    }
}

function RegisterEvents() {
    var myInstance = this;
    var oFactory = new Factory();

    this.NotificationDisplayType = "DefaultJavaScriptAlert";
    //this.NotificationType = "DefaultNativeToast";
    this.DefaultNotificationComponentKey = "LVDefaultNotificationComponent";
    this.PageConfig = ModelUpdate;
    this.RegisterControlConfig = null;

    /// <summary>
    /// ExcecuteUIJobs
    /// </summary>
    /// <param name="ControlUIJobs">ControlUIJobs</param>    
    this.ExcecuteUIJobs = function (ControlUIJobs) {
            try {
                for (var i = 0; i < ControlUIJobs.length; i++) {

                    if (ControlUIJobs[i].Type == "DynamicFormControlUIOperationsRule") {

                        var IsSuccess = true;

                        if (ControlUIJobs[i].FinalJavaScriptEquation != undefined && ControlUIJobs[i].FinalJavaScriptEquation != null && ControlUIJobs[i].FinalJavaScriptEquation != '')
                            IsSuccess = ValidateRule(ControlUIJobs[i].FinalJavaScriptEquation);

                        if (IsSuccess == true) {
                            if (ControlUIJobs[i].MessageKey != undefined && ControlUIJobs[i].MessageKey != null && ControlUIJobs[i].MessageKey != "") {
                                var _oNotificationComponent = oLVFactory.GetNotificationComponent(myInstance.LVDefaultNotificationComponentKey);
                                _oNotificationComponent.Notify(ControlUIJobs[i].MessageKey, myInstance.NotificationDisplayType);
                            }

                            if (ControlUIJobs[i].ClearControls != null) {
                                var _oClearUIEventJobComponent = new ClearUIEventJobComponent();
                                _oClearUIEventJobComponent.PageConfig = myInstance.PageConfig;
                                _oClearUIEventJobComponent.ClearControls(ControlUIJobs[i].ClearControls);
                            }

                            if (ControlUIJobs[i].RefreshControls != null) {
                                var _oRefreshUIEventJobComponent = new RefreshUIEventJobComponent();
                                _oRefreshUIEventJobComponent.PageConfig = myInstance.PageConfig;
                                _oRefreshUIEventJobComponent.RefreshControls(ControlUIJobs[i].RefreshControls);
                            }

                            if (ControlUIJobs[i].HideControls != null) {
                                var _oHideUIEventJobComponent = new HideUIEventJobComponent();
                                _oHideUIEventJobComponent.PageConfig = myInstance.PageConfig;
                                _oHideUIEventJobComponent.HideControls(ControlUIJobs[i].HideControls);
                            }

                            if (ControlUIJobs[i].ShowControls != null) {
                                var _oShowUIEventJobComponent = new ShowUIEventJobComponent();
                                _oShowUIEventJobComponent.PageConfig = myInstance.PageConfig;
                                _oShowUIEventJobComponent.ShowControls(ControlUIJobs[i].ShowControls);
                            }
                        }
                    }
                    else if (ControlUIJobs[i].Type == "DynamicFormCustomControlUIOperationsRule") {
                        var jobEvent = new window[ControlUIJobs[i].OfflineValidationConfigObjectKey](myInstance.RegisterControlConfig);
                        if (jobEvent != undefined && jobEvent != null)
                            jobEvent.execute();
                    }
                    else {
                        //alert("Not implemented exception, Type = " + ControlUIJobs[i].Type + ", LVTemplateUIEventJobComponent.ExcecutePostUIJobs");
                    }
                }
                return IsSuccess;
            }

            catch (Excep) {
                //throw oOneViewExceptionHandler.Create("Framework", "LVTemplateUIEventJobConfigComponent.ExcecutePostUIJobs", Excep);
            }
        
    }


    /// <summary>
    /// Validate Rule
    /// </summary>
    /// <param name="Rule">Rule</param>   
    /// <returns>true or false</returns> 
    var ValidateRule = function (Rule) {

        try {
            Rule = Rule.replace(/#/g, "'");
            var IsSuccess = eval(Rule);
            return IsSuccess;
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("Framework", "LVTemplateUIEventJobConfigComponent.ValidateRule", Excep);
        }
    }
}

// ClearUIEventJobComponent
function ClearUIEventJobComponent() {

    var MyInstance = this;
    this.PageConfig = null;

    /// <summary>
    /// Clear Controls
    /// </summary>
    /// <param name="ClearControls">List of ClearControl</param>    
    this.ClearControls = function (ClearControls) {

        try {
            if (ClearControls != null && ClearControls != undefined) {

                for (var itrClearControl in ClearControls) {

                    for (var i = 0; i < ClearControls[itrClearControl].length; i++) {

                        MyInstance.Clear(ClearControls[itrClearControl][i]);
                    }
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVClearUIEventJobComponent.ClearControls", Excep);
        }
    }


    /// <summary>
    /// Clear
    /// </summary>
    /// <param name="TemplateNodeId">TemplateNodeId</param> 
    /// <param name="ControlId">ControlId</param> 
    this.Clear = function (ControlId) {

        try {
            var ControlConfig = MyInstance.PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId];

            if (ControlConfig != null && ControlConfig != undefined) {

                if (ControlConfig.Type == "DCListViewControlConfig") {

                    if (ControlConfig.ListViewDataSourceConfig.Type == "DefaultTreeListViewDataSourceConfig") {

                        if (ControlConfig.ListViewDisplay === 3) {

                            var _oDefaultHtmlDropdownControl = new DefaultHtmlDropdownControl();
                            _oDefaultHtmlDropdownControl.Clear(TemplateNodeId, ControlId);
                        }
                        else {
                            //alert("Not implemented exception, ListViewDisplay = " + ControlConfig.ListViewDisplay + ", LVClearUIEventJobComponent.Clear");
                        }
                    }
                    else {
                        //alert("Not implemented exception, ListViewDataSourceConfig = " + ControlConfig.ListViewDataSourceConfig + ", LVClearUIEventJobComponent.Clear");
                    }
                }
                else if (ControlConfig.Type == "DefaultHTMLPageComboControlConfig") {
                    var _WinAimComboBox = new WiNAiMComboBox(MyInstance.PageConfig);
                    _WinAimComboBox.Clear(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageTextBoxControlConfig" || ControlConfig.Type == "DefaultHTMLPageNumericTextBoxControlConfig"
                     || ControlConfig.Type == "DefaultHTMLPageTextAreaBoxControlConfig") {
                    var _WiNAiMTextBox = new WiNAiMTextBox(MyInstance.PageConfig);
                    _WiNAiMTextBox.Clear(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageRadioButtonControlConfig") {
                    var _WiNAiMRadioButton = new WiNAiMRadioButton(MyInstance.PageConfig);
                    _WiNAiMRadioButton.Clear(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageDatePickerControlConfig") {
                    var _DatePicker = new WiNAiMDatePicker(MyInstance.PageConfig);
                    _DatePicker.Clear(ControlId);
                }
                else {
                    //alert("Not implemented exception, Type = " + ControlConfig.Type + ", LVClearUIEventJobComponent.Clear");
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVClearUIEventJobComponent.Clear", Excep);
        }
        finally {

        }
    }
}

// RefreshUIEventJobComponent
function RefreshUIEventJobComponent() {

    var MyInstance = this;
    this.PageConfig = null;

    /// <summary>
    /// Refresh Controls
    /// </summary>
    /// <param name="RefreshControls">List of RefreshControl</param>    
    this.RefreshControls = function (RefreshControls) {

        try {
            if (RefreshControls != null && RefreshControls != undefined) {

                for (var itrRefreshControl in RefreshControls) {

                    for (var i = 0; i < RefreshControls[itrRefreshControl].length; i++) {

                        MyInstance.Refresh(RefreshControls[itrRefreshControl][i]);
                    }
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVRefreshControlComponent.RefreshControls", Excep);
        }
    }


    /// <summary>
    /// Refresh
    /// </summary>
    /// <param name="TemplateNodeId">TemplateNodeId</param> 
    /// <param name="ControlId">ControlId</param> 
    this.Refresh = function (ControlId) {

        try {
            var ControlConfig = MyInstance.PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId];

            if (ControlConfig != null && ControlConfig != undefined) {

                if (ControlConfig.Type == "DCListViewControlConfig") {

                    if (ControlConfig.ListViewDataSourceConfig.Type == "DefaultTreeListViewDataSourceConfig") {

                        if (ControlConfig.ListViewDisplay === 3) {

                            var _oDefaultHtmlDropdownControl = new DefaultHtmlDropdownControl();
                            _oDefaultHtmlDropdownControl.Refresh(TemplateNodeId, ControlId);
                        }
                        else {
                            //alert("Not implemented exception, ListViewDisplay = " + ControlConfig.ListViewDisplay + ", LVRefreshControlComponent.Refresh");
                        }
                    }
                    else {
                        //alert("Not implemented exception, ListViewDataSourceConfig = " + ControlConfig.ListViewDataSourceConfig + ", LVRefreshControlComponent.Refresh");
                    }
                }
                else if (ControlConfig.Type == "DefaultHTMLPageComboControlConfig") {
                    var _WinAimComboBox = new WiNAiMComboBox(MyInstance.PageConfig);
                    _WinAimComboBox.Refresh(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageTextBoxControlConfig" || ControlConfig.Type == "DefaultHTMLPageNumericTextBoxControlConfig"
                     || ControlConfig.Type == "DefaultHTMLPageTextAreaBoxControlConfig") {
                    var _WiNAiMTextBox = new WiNAiMTextBox(MyInstance.PageConfig);
                    _WiNAiMTextBox.Refresh(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageDatePickerControlConfig") {
                    var _WiNAiMDatePicker = new WiNAiMDatePicker(MyInstance.PageConfig);
                    _WiNAiMDatePicker.Refresh(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageLinkControlConfig") {
                    var _WiNAiMLinkControl = new WiNAiMLinkControl(MyInstance.PageConfig);
                    _WiNAiMLinkControl.Refresh(ControlId);
                }
                else {
                    //alert("Not implemented exception, Type = " + ControlConfig.Type + ", LVRefreshControlComponent.Refresh");
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVRefreshControlComponent.Refresh", Excep);
        }
        finally {
            //_oLVDefaultHtmlDropdownControl = null;
        }
    }
}

// HideUIEventJobComponent
function HideUIEventJobComponent() {

    var MyInstance = this;
    this.PageConfig = null;

    /// <summary>
    /// Hide Controls
    /// </summary>
    /// <param name="ClearControls">List of ClearControl</param>    
    this.HideControls = function (HideControls) {

        try {
            if (HideControls != null && HideControls != undefined) {

                for (var itrHideControl in HideControls) {

                    for (var i = 0; i < HideControls[itrHideControl].length; i++) {

                        MyInstance.Hide(HideControls[itrHideControl][i]);
                    }
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVClearUIEventJobComponent.ClearControls", Excep);
        }
    }

    /// <summary>
    /// Hide
    /// </summary>
    /// <param name="ControlId">ControlId</param> 
    this.Hide = function (ControlId) {

        try {
            var ControlConfig = MyInstance.PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId];

            if (ControlConfig != null && ControlConfig != undefined) {
                if (ControlConfig.Type == "DefaultHTMLPageComboControlConfig") {
                    var _WinAimComboBox = new WiNAiMComboBox(MyInstance.PageConfig);
                    _WinAimComboBox.Hide(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageTextBoxControlConfig" || ControlConfig.Type == "DefaultHTMLPageNumericTextBoxControlConfig"
                     || ControlConfig.Type == "DefaultHTMLPageTextAreaBoxControlConfig") {
                    var _WiNAiMTextBox = new WiNAiMTextBox(MyInstance.PageConfig);
                    _WiNAiMTextBox.Hide(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageRadioButtonControlConfig") {
                    var _WiNAiMRadioButton = new WiNAiMRadioButton(MyInstance.PageConfig);
                    _WiNAiMRadioButton.Hide(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageDatePickerControlConfig") {
                    var _DatePicker = new WiNAiMDatePicker(MyInstance.PageConfig);
                    _DatePicker.Hide(ControlId);
                }
                else {
                    //alert("Not implemented exception, Type = " + ControlConfig.Type + ", LVClearUIEventJobComponent.Clear");
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVClearUIEventJobComponent.Clear", Excep);
        }
        finally {

        }
    }
}

// ShowUIEventJobComponent
function ShowUIEventJobComponent() {

    var MyInstance = this;
    this.PageConfig = null;

    /// <summary>
    /// Show Controls
    /// </summary>
    /// <param name="ClearControls">List of ClearControl</param>    
    this.ShowControls = function (ShowControls) {

        try {
            if (ShowControls != null && ShowControls != undefined) {

                for (var itrShowControl in ShowControls) {

                    for (var i = 0; i < ShowControls[itrShowControl].length; i++) {

                        MyInstance.Show(ShowControls[itrShowControl][i]);
                    }
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVClearUIEventJobComponent.ClearControls", Excep);
        }
    }

    /// <summary>
    /// Show
    /// </summary>
    /// <param name="ControlId">ControlId</param> 
    this.Show = function (ControlId) {

        try {
            var ControlConfig = MyInstance.PageConfig.ControlGroupConfigLst[0].ControlConfigDict[ControlId];

            if (ControlConfig != null && ControlConfig != undefined) {
                if (ControlConfig.Type == "DefaultHTMLPageComboControlConfig") {
                    var _WinAimComboBox = new WiNAiMComboBox(MyInstance.PageConfig);
                    _WinAimComboBox.Show(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageTextBoxControlConfig" || ControlConfig.Type == "DefaultHTMLPageNumericTextBoxControlConfig"
                     || ControlConfig.Type == "DefaultHTMLPageTextAreaBoxControlConfig") {
                    var _WiNAiMTextBox = new WiNAiMTextBox(MyInstance.PageConfig);
                    _WiNAiMTextBox.Show(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageRadioButtonControlConfig") {
                    var _WiNAiMRadioButton = new WiNAiMRadioButton(MyInstance.PageConfig);
                    _WiNAiMRadioButton.Show(ControlId);
                }
                else if (ControlConfig.Type == "DefaultHTMLPageDatePickerControlConfig") {
                    var _DatePicker = new WiNAiMDatePicker(MyInstance.PageConfig);
                    _DatePicker.Show(ControlId);
                }
                else {
                    //alert("Not implemented exception, Type = " + ControlConfig.Type + ", LVClearUIEventJobComponent.Clear");
                }
            }
        }
        catch (Excep) {
            //throw oOneViewExceptionHandler.Create("FrameWork", "LVClearUIEventJobComponent.Clear", Excep);
        }
        finally {

        }
    }
}

//function CreatePageFramePartial(Model) {
//    var FrameHTML = '';
//    for (var rowIndex = 1; rowIndex <= Model.totalRows; rowIndex++) {
//        FrameHTML = FrameHTML + '<div class="row">';
//        FrameHTML = FrameHTML + CreateFrame(Model.ControlGroupConfigLst, rowIndex);
//        FrameHTML = FrameHTML + '</div>';
//    }
//    return FrameHTML;
//}

//function CreateFrame(ControlGroupConfigLst, rowIndex) {
//    var FrameHTML = '';
//    if (ControlGroupConfigLst != null) {
//        for (var itrValue in ControlGroupConfigLst) {
//            var itr = ControlGroupConfigLst[itrValue];
//            if (itr.RowIndex == rowIndex) {
//                FrameHTML = FrameHTML + '<section class="' + itr.Class + ' no-margin">'
//                if (itr.DisplayHeaderNameKey != '' && itr.DisplayHeaderNameKey != null) {
//                    FrameHTML = FrameHTML + '<header>' + itr.DisplayHeaderNameKey + '</header>';
//                }
//                if (itr.ControlGroupConfigLst.length > 0) {
//                    for (var SubrowIndex = 1; SubrowIndex <= itr.totalRows; SubrowIndex++) {
//                        CreateFrame(itr.ControlGroupConfigLst, SubrowIndex)
//                    }
//                }
//                if (itr.ControlConfigDict != undefined && itr.ControlConfigDict != null) {
//                    for (var SubrowIndex = 1; SubrowIndex <= itr.totalRows; SubrowIndex++) {
//                        FrameHTML = FrameHTML + '<div class="row">';
//                        for (var itrControlValue in itr.ControlConfigDict) {
//                            var count = getCountControlConfigDict(itr.ControlConfigDict, SubrowIndex);
//                            var itrControl = itr.ControlConfigDict[itrControlValue];
//                            var hiddenClass = "";
//                            if (itrControl.ControlTypeName == "Hidden") {
//                                hiddenClass = " hide";
//                            }
//                            else {
//                                hiddenClass = "";
//                            }
//                            if (itrControl.RowIndex == SubrowIndex && itrControl.ControlTypeName != "GridControl") {
//                                var colClass = '';
//                                if (itrControl.Style != null && itrControl.Style.Styleclass != null && itrControl.Style.Styleclass != '') {
//                                    colClass = itrControl.Style.Styleclass + hiddenClass;
//                                }
//                                else {
//                                    colClass = "col col-xs-6 col-sm-6 col-md-" + Math.round(12 / count) + hiddenClass;
//                                }
//                                FrameHTML = FrameHTML + '<section id="' + itrControl.ContainerId + '" class="' + colClass + '"></section>';
//                            }
//                        }
//                        FrameHTML = FrameHTML + '</div>';
//                    }
//                }
//                FrameHTML = FrameHTML + '</section>';
//            }
//        }
//    }
//    return FrameHTML;
//}

//function getCountControlConfigDict(ControlConfigDict, SubrowIndex) {
//    var count = 0;
//    for (var itrControlValue in ControlConfigDict) {
//        if (ControlConfigDict[itrControlValue].RowIndex == SubrowIndex)
//            count = count + 1;
//    }
//    return count;
//}

//function CreateControls(ControlGroupConfigLst) {
//    var ControlLstHTML = '';
//    if (ControlGroupConfigLst != null) {
//        for (var itr in ControlGroupConfigLst) {
//            var item = ControlGroupConfigLst[itr];
//            if (typeof (item) != 'function') {
//                if (item.ControlGroupConfigLst.length > 0) {
//                    CreateControls(item.ControlGroupConfigLst)
//                }
//                if (item.ControlConfigDict != undefined && item.ControlConfigDict != null) {
//                    for (var itrControlValue in item.ControlConfigDict) {
//                        var itrControl = item.ControlConfigDict[itrControlValue];
//                        ControlLstHTML = ControlLstHTML + '<div id="div_' + itrControl.ClientID + '">';
//                        if (itrControl.Name != null && itrControl.Name != '' && itrControl.ControlTypeName != "LinkControl"
//                            && itrControl.ControlTypeName != "CheckBox") {
//                            ControlLstHTML = ControlLstHTML + '<label class="label">' + itrControl.Name + '</label>';
//                        }
//                        if (itrControl.ControlTypeName == "ComboBox") {
//                            if (itrControl.ComboType == 1) /* Advance Combobox */ {
//                                ControlLstHTML = ControlLstHTML + '<select id="' + itrControl.ClientID +
//                                    '" style="width:100%" class="select2" multiple="multiple"><option></option></select>';
//                            }
//                            else {
//                                ControlLstHTML = ControlLstHTML + '<select id="' + itrControl.ClientID +
//                                    '" style="width:100%" class="select2"><option></option></select>';
//                            }
//                        }

//                        if (itrControl.ControlTypeName == "TextBox") {
//                            var disabledClass = "";
//                            if (!itrControl.Enabled) {
//                                disabledClass = "disabled";
//                            }
//                            if (itrControl.TextBoxType == 5) /* Text Area */ {
//                                ControlLstHTML = ControlLstHTML + '<div class="form-group">';
//                                ControlLstHTML = ControlLstHTML + '<textarea id="' + itrControl.ClientID +
//                                    '" class="form-control" rows="5" ' + disabledClass + '></textarea></div>';
//                            }
//                            else if (itrControl.TextBoxType == 4)/* Password */ {
//                                ControlLstHTML = ControlLstHTML + '<label class="input">';
//                                ControlLstHTML = ControlLstHTML + '<input type="password" id="' + itrControl.ClientID + '" ' + disabledClass +
//                                    ' /> </label>';
//                            }
//                            else {
//                                ControlLstHTML = ControlLstHTML + '<label class="input">';
//                                ControlLstHTML = ControlLstHTML + '<input type="text" id="' + itrControl.ClientID + '" ' + disabledClass +
//                                    ' /> </label>';
//                            }
//                        }

//                        if (itrControl.ControlTypeName == "RadioButton" && itrControl.RadioButtonType == 0) /* Default Radio Button Type */ {
//                            if (itrControl.isStaticListItem) {
//                                ControlLstHTML = ControlLstHTML + '<div class="inline-group">';
//                                for (var i = 0; i < itrControl.DefaultListItem.length; i++) {
//                                    var DefaultLst = itrControl.DefaultListItem[i];
//                                    ControlLstHTML = ControlLstHTML + '<label class="radio">';
//                                    ControlLstHTML = ControlLstHTML + '<input type="radio" name="group_' + itrControl.ClientID +
//                                        '" checked="' + DefaultLst.Selected + '" value="' + DefaultLst.Value + '" /><i></i>' + DefaultLst.Text + '</label>';
//                                }
//                                ControlLstHTML = ControlLstHTML + '</div>';
//                            }
//                        }

//                        if (itrControl.ControlTypeName == "RadioButton" && itrControl.RadioButtonType == 1) /* List Group Radio Button Type */ {
//                            var radiobutton = itrControl;
//                            if (radiobutton.isStaticListItem && !radiobutton.IsCustom) {
//                                ControlLstHTML = ControlLstHTML + '<ul class="list-group predefined checked-list-box" id="group_' + radiobutton.ClientID + '">';
//                                for (var i = 0; i < itrControl.DefaultListItem.length; i++) {
//                                    var DefaultLst = itrControl.DefaultListItem[i];
//                                    ControlLstHTML = ControlLstHTML + '<li class="list-group-item" id="' + DefaultLst.Id + '">' + DefaultLst.Text + '</li>';
//                                }
//                                ControlLstHTML = ControlLstHTML + '</ul>';
//                            }
//                            else if (radiobutton.IsCustom) {
//                                ControlLstHTML = ControlLstHTML + '<ul class="list-group custom" id="group_' + radiobutton.ClientID + '"></ul>';
//                                ControlLstHTML = ControlLstHTML + '<div class="input-group">' +
//                                    '<input class="form-control appendbutton" id="appendbutton_' + radiobutton.ClientID + '" type="text">' +
//                                    '<div class="input-group-btn">' +
//                                        '<a id="a_' + radiobutton.ClientID +
//                                        '" href="javascript:void(0);" class="btn btn-success add-custom"><i class="fa fa-plus fa-lg"></i> <span class="hidden-tablet">Add</span></a>' +
//                                    '</div></div>';
//                            }
//                        }

//                        if (itrControl.ControlTypeName == "CheckBox") {
//                            ControlLstHTML = ControlLstHTML + '<label class="checkbox">' +
//                            '<input type="checkbox" id="' + itrControl.ClientID + '" name="checkbox-inline" />' +
//                            '<i></i>' + itrControl.Name + '</label>';
//                        }

//                        if (itrControl.ControlTypeName == "DatePicker" && itrControl.DatePickerType == 1) /* Advance Date Picker Type */ {
//                            ControlLstHTML = ControlLstHTML + '<label class="input reportrange" id="' + itrControl.ClientID + '">' +
//                                '<i class="fa fa-calendar"></i>' +
//                                '<span></span> <i class="fa icon-append fa-chevron-down"></i>' +
//                            '</label>';
//                        }
//                        if (itrControl.ControlTypeName == "DatePicker" && itrControl.DatePickerType == 0) /* Default Date Picker Type */ {
//                            ControlLstHTML = ControlLstHTML + '<div class="input-group">' +
//                                '<input id="' + itrControl.ClientID +
//                                '" type="text" name="mydate" placeholder="Select a date" class="form-control datepicker" data-dateformat="dd/mm/yy">' +
//                                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
//                            '</div>';
//                        }

//                        if (itrControl.ControlTypeName == "Hidden") {
//                            ControlLstHTML = ControlLstHTML + '<input type="hidden" id="' + itrControl.ClientID + '" />';
//                        }
//                        if (itrControl.ControlTypeName == "LinkControl") {
//                            ControlLstHTML = ControlLstHTML + '<a href="javascript:void(0);" rel="tooltip" data-placement="top" data-original-title="' +
//                                itrControl.Name + '" id="' + itrControl.ClientID + '"> <span class="hidden-tablet">' + itrControl.Name + '</span></a>';
//                        }

//                        if (itrControl.ControlTypeName == "ImageControl") {

//                            if (itrControl.ImageControlType == 2) /* File */ {
//                                ControlLstHTML = ControlLstHTML + ' <div id="' + itrControl.ClientID + '"> <div class="pull-left" id="user_img" style="width:20%">';
//                                ControlLstHTML = ControlLstHTML + '<img src="" alt="Image" style="border: 1px #ccc solid; padding: 2px; margin-right: 20px; margin-top: 4px; width: 100%; height: 100%;" />' +
//                                       '</div> <div class="input input-file pull-right" style="width:75%;">';
//                                ControlLstHTML = ControlLstHTML + '<span class="button"><input type="file" id="file" name="file" onchange="Show(this)" onclick="ImageUploadClickEvent(this)">Browse</span><input type="text" placeholder="Supported format PNG,JPG,GIF,TIFF" readonly="" style="font-size:10px"> </div> </div>';
//                            }
//                        }
//                        ControlLstHTML = ControlLstHTML + '</div>';
//                    }
//                }
//            }
//        }
//    }
//    return ControlLstHTML;
//}

//function SetControls(ControlGroupConfigLst) {
//    if (ControlGroupConfigLst != null) {
//        for (var itr in ControlGroupConfigLst) {
//            var item = ControlGroupConfigLst[itr];
//            if (typeof (item) != 'function') {
//                if (item.ControlGroupConfigLst.length > 0) {
//                    SetControls(item.ControlGroupConfigLst);
//                }
//                if (item.ControlConfigDict != undefined && item.ControlConfigDict != null) {
//                    for (var itrControlValue in item.ControlConfigDict) {
//                        var itrControl = item.ControlConfigDict[itrControlValue];
//                        if (itrControl.ControlTypeName == "AdvCombo") {
//                            document.getElementById(itrControl.ContainerId).innerHTML += document.getElementById('div_' + itrControl.ClientID + 'AdvCombo').innerHTML;
//                            var $this = $("#" + itrControl.ClientID);
//                            var width = $this.attr('data-select-width') || '100%';
//                            $("#" + itrControl.ClientID).select2({
//                                //showSearchInput : _showSearchInput,
//                                allowClear: true,
//                                width: width
//                            });
//                        }
//                        else if (itrControl.ControlTypeName != "GridControl" && itrControl.ControlTypeName != "DatePicker") {
//                            var control = document.getElementById(itrControl.ContainerId);
//                            var divControl = document.getElementById('div_' + itrControl.ClientID);
//                            ControlAppend(control, divControl);
//                            if (itrControl.ControlTypeName == "ComboBox") {
//                                var $this = $("#" + itrControl.ClientID);
//                                var width = $this.attr('data-select-width') || '100%';
//                                $("#" + itrControl.ClientID).select2({
//                                    //showSearchInput : _showSearchInput,
//                                    allowClear: itrControl.IsAllowDataClear,
//                                    width: width
//                                });
//                            }
//                        }
//                        else if (itrControl.ControlTypeName == "DatePicker" && itrControl.DatePickerType == 1) /* Advance Date Picker Type */ {
//                            var control = document.getElementById(itrControl.ContainerId);
//                            var divControl = document.getElementById('div_' + itrControl.ClientID);
//                            ControlAppend(control, divControl);
//                        }
//                        else if (itrControl.ControlTypeName == "LinkControl") {
//                            var control = document.getElementById(itrControl.ContainerId);
//                            var divControl = document.getElementById('div_' + itrControl.ClientID);
//                            ControlAppend(control, divControl);
//                        }
//                        else if (itrControl.ControlTypeName == "DatePicker" && itrControl.DatePickerType == 0) {
//                            document.getElementById(itrControl.ContainerId).innerHTML += document.getElementById('div_' + itrControl.ClientID).innerHTML;
//                        }
//                        else if (itrControl.ControlTypeName == "ImageControl" && itrControl.ImageControlType == 2) {
//                            document.getElementById(itrControl.ContainerId).innerHTML += document.getElementById('div_' + itrControl.ClientID).innerHTML;
//                        }
//                    }
//                }
//            }
//        }
//    }
//}