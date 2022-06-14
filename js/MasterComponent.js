var _oEvalExpression = new EvalExpression();
var CurrentMasterComponentMetaData = null;
var CurrentMasterComponentConfig = null;
var DATTypes = null;
var Pagename = null;

var oFactory = new Factory();
var _oAppendOrSetHtml = new AppendOrSetHtml();

function MasterManagementFRM() {
    var myInstance = this;
    this.ComponentId = 0;
    this.UrlToGetMasterConfig = '/MasterManagementView/GetMasterPageConfig/';
    this.PageTitleControlId = 'PageTitle';
    this.TypeOfFrame = 'TabSelection';
    this.PageFrameId = 'widget-tab';
    this.ContentFrameId = '';
    this.MasterComponentMetaData = null;
    this.AppType = '';


    this.LoadPage = function () {

        if (myInstance.MasterComponentMetaData == undefined || myInstance.MasterComponentMetaData == null || myInstance.MasterComponentMetaData == "")
            myInstance.MasterComponentMetaData = myInstance.GetMasterComponent(parametertoload(myInstance.AppType));
        if (myInstance.MasterComponentMetaData != undefined && myInstance.MasterComponentMetaData != null && myInstance.MasterComponentMetaData != "") {
            CurrentMasterComponentMetaData = myInstance.MasterComponentMetaData;
            /* 2. Set Page Title */
            SetPageTitle();


            SetPageFrame();
        }
        else {
            ShowMessage('Master component not found!', 4);
        }
    }

    var GetGrid = function (CurrentMasterComponentMetaData) {
        var _GridFormatDisplayComponent = new GridFormatDisplayComponent();
        _GridFormatDisplayComponent.ControlId = 'ContentFrame';
        _GridFormatDisplayComponent.CurrentDisplayFormatConfig = CurrentMasterComponentConfig.MasterDisplayConfigLst[0];
        _GridFormatDisplayComponent.Load();

    }

    var parametertoload = function (AppType) {
        var parameterToLoadData = [];
        parameterToLoadData = { AppType: AppType };
        parameterToLoadData = JSON.stringify(parameterToLoadData);

        return parameterToLoadData;
    }

    var SetPageTitle = function () {
        if (myInstance.PageTitleControlId != undefined && myInstance.PageTitleControlId != null) {
            var pageTitleControlIdDom = document.getElementById(myInstance.PageTitleControlId);
            if (pageTitleControlIdDom != undefined && pageTitleControlIdDom != null) {
                pageTitleControlIdDom.innerHTML = _GetGlobalization.GetGlobalizationValue(myInstance.MasterComponentMetaData.HeaderNameKey);
            }
        }
    }

    var SetPageFrame = function () {
        if (myInstance.TypeOfFrame == 'TabSelection') {
            var _CreateMasterPageFrame = new CreateMasterPageFrame();
            _CreateMasterPageFrame.MasterComponentMetaData = myInstance.MasterComponentMetaData;
            _CreateMasterPageFrame.PDFExportControlId = myInstance.PDFExportControlId;
            _CreateMasterPageFrame.ExcelExportControlId = myInstance.ExcelExportControlId;
            _CreateMasterPageFrame.Load(myInstance.PageFrameId, myInstance.ContentFrameId);
        }
        else {
            var _Message = new OneViewMessageBox();
            _Message.ShowNotification("Not Implemented Exception", 4);
            return false;
        }
    }

    this.GetMasterComponent = function (parameterToLoadData) {
        var result = null;
        var _OneViewAjax = new WiNAiMAjax();
        _OneViewAjax.url = myInstance.UrlToGetMasterConfig;
        _OneViewAjax.webMethod = "post";
        _OneViewAjax.async = false;
        _OneViewAjax.contentType = 'application/json; charset=utf-8';
        _OneViewAjax.dataType = 'json';
        _OneViewAjax.parameter = parameterToLoadData;
        result = _OneViewAjax.execute();
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
}

function CreateMasterPageFrame() {
    var myInstance = this;
    this.MasterComponentMetaData = null;
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';
    this.CurrentRcoMasterComponent = null;
    this.ReportTabIndex = 0;
    var oMasterComponentConfigLst = null;
    var lPageFrameId = '';
    var lContentFrameId = '';
    var lAdvanceFilterFrameId = '';
    var lHeaderFrameId = '';
    this.Load = function (PageFrameId, ContentFrameId) {
        oMasterComponentConfigLst = myInstance.MasterComponentMetaData;
        if (oMasterComponentConfigLst != undefined && oMasterComponentConfigLst != null) {
            var FrameHtml = '';
          
            myInstance.CurrentRcoMasterComponent = oMasterComponentConfigLst;
            try {
                CurrentMasterComponentConfig = myInstance.CurrentRcoMasterComponent;
            }
            catch (ex) {
                console.log('CurrentMasterComponentConfig is undefined');
            }
            var _CreateTabHtml = new CreatePageTabHtml();
            _CreateTabHtml.TabConfigLst = oMasterComponentConfigLst;
            lPageFrameId = PageFrameId;
            lContentFrameId = ContentFrameId;
            myInstance.LoadPage();
        }
    }

    this.LoadPage = function () {
        try {
            myInstance.LoadFilterFrameHtml(lPageFrameId);
        }
        catch (ex) {
            console.log('Default Param Loading Problem');
        }
        try {
            myInstance.ContentFrameHtml(lContentFrameId);
           
        }
        catch (ex) {
            console.log('Content Loading Problem');
        }

        try {
            DATTypes = myInstance.CurrentRcoMasterComponent.DATType;
            Pagename = myInstance.CurrentRcoMasterComponent.HeaderNameKey;
        }
        catch (ex) { console.log('Dattype assigning Issue'); }

    }

    this.LoadFilterFrameHtml = function (PageFrameId) {
        var FrameHtml = '';
        if (PageFrameId != undefined && PageFrameId != null && PageFrameId != '') {
            var _CreateHTMLPage = new CreateHTMLPage();
            _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentRcoMasterComponent.PageConfig;
            FrameHtml += _CreateHTMLPage.Load();
            myInstance.setFrameHtml(PageFrameId, FrameHtml);

            myInstance.Initialize();


        }
    }

    this.ContentFrameHtml = function (ContentFrameId) {
        var _MasterDisplayFormatComponent = new MasterDisplayFormatComponent();
       // _MasterDisplayFormatComponent.ClearHtml(ContentFrameId);
        _MasterDisplayFormatComponent.lDisplayFormatConfigLst = myInstance.CurrentRcoMasterComponent.MasterDisplayConfigLst;
        _MasterDisplayFormatComponent.ContentFrameId = ContentFrameId;
        _MasterDisplayFormatComponent.Load();

        if (document.getElementById("tableDiv") != null && document.getElementById("tableDiv") != undefined)
        {
            document.getElementById("tableDiv").style.visibility = "visible";
            var tableHtml = document.getElementById('tableDiv');
            var Control = document.getElementById(ContentFrameId);
            if (Control != undefined && Control != null) {
                $(tableHtml).appendTo($(Control));
            }

            if (document.getElementById('Masterpage_length') != null && document.getElementById('Masterpage_length') != undefined)
            {
                document.getElementById('Masterpage_length').style.visibility = "hidden"
            }
        }
       
    }

    this.setFrameHtml = function (PageFrameId, FrameHtml) {
        if (PageFrameId != undefined && PageFrameId != null) {
            var PageFrameDom = document.getElementById(PageFrameId);
            if (PageFrameDom != undefined && PageFrameDom != null) {
                PageFrameDom.innerHTML = FrameHtml;
            }
        }
    }

    this.Initialize = function () {
        var _CreateHTMLPage = new CreateHTMLPage();
        _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentRcoMasterComponent.PageConfig;
        _CreateHTMLPage.Initialize(_CreateHTMLPage.lCurrentPageConfig.Type);
    }
}

function MasterDisplayFormatComponent() {
    var myInstance = this;
    this.lDisplayFormatConfigLst = null;
    this.FilterParamControlConfig = null;
    this.ContentFrameId = '';
    this.ParamToLoadGridData = null;
    var TypeOfDisplayFormat = '';

    this.Load = function () {
        var _ReportingDataViewDisplayFormatConfigLst = myInstance.lDisplayFormatConfigLst;
        if (_ReportingDataViewDisplayFormatConfigLst != undefined && _ReportingDataViewDisplayFormatConfigLst != null) {
            var _DisplayFormatComponent = new GridFormatDisplayComponentForMasterPage();
           // _DisplayFormatComponent.ClearHtml(myInstance.ContentFrameId);
            if (_ReportingDataViewDisplayFormatConfigLst.length > 0) {             
                for (var i = 0; i < _ReportingDataViewDisplayFormatConfigLst.length; i++) {
                    _DisplayFormatComponent.lDisplayFormatConfigLst = myInstance.lDisplayFormatConfigLst;
                    _DisplayFormatComponent.DisplayFrameId = myInstance.ContentFrameId;
                    _DisplayFormatComponent.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                    _DisplayFormatComponent.CurrentDisplayFormatConfig = _ReportingDataViewDisplayFormatConfigLst[i];
                    _DisplayFormatComponent.Load();
                    _DisplayFormatComponent.Init()
                }
               
            }
        }
    }

    this.ClearHtml = function (ControlId) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
            }
        }
    }
}

function GridFormatDisplayComponent() {
    var myInstance = this;
    this.ControlId = '';
    this.CurrentDisplayFormatConfig = '';
    this.FilterParamControlConfig = null;
    this.ParamToLoadGridData = null;

    this.Load = function () {
        var Html = myInstance.GetHtml();

        myInstance.SetHtml(myInstance.ControlId, Html);
    }

    this.GetHtml = function () {
        var Html = '<div class="widget-body-toolbar"></div><table id="' + myInstance.CurrentDisplayFormatConfig.ControlId + '" class="table" width="100%"></table>';
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

    this.Init = function (PaginatedEnabled) {
        var _GetGridDisplay = new GetGridDisplay();
        _GetGridDisplay.lGridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        if (PaginatedEnabled != undefined && PaginatedEnabled != null)
            _GetGridDisplay.PaginatedEnabled = PaginatedEnabled;
        _GetGridDisplay.ParamToLoadGridData = myInstance.ParamToLoadGridData;
        _GetGridDisplay.Load();

        _GetGridDisplay.Init();
    }
}


function MasterDBOperation() {
    this.OperationURL = '';
    this.ContentFrameId = '';
    this.SuccsessMessage = "";
    var myInstance = this;

    this.Save = function () {
        var Param = {};
        var ParamToLoad = {};
        var RCO_RCOMasterEntityId = document.getElementById(ModelUpdate.PageID + "_Id");
        if (RCO_RCOMasterEntityId.value != "" && RCO_RCOMasterEntityId.value != null && RCO_RCOMasterEntityId.value != undefined) {
            myInstance.OperationURL = GetRelativeUrl("/MasterManagementView/Update");
            myInstance.SuccsessMessage = "IN-SU-OHI-002 :: Master Updated Successfully";
        }
        else {
            myInstance.OperationURL = GetRelativeUrl('/MasterManagementView/Save');
            myInstance.SuccsessMessage = "IN-SU-OHI-002 :: Master Created Successfully";
        }
        var _oValidationFrameWork = new ValidationFrameWork(ModelUpdate);
        if (_oValidationFrameWork.validateControl()) {
            var result = AjaxCall(createparameterToLoadData(ModelUpdate));
        }
    }

    var success = function (sender, response) {
        result = response;
        if (result == true || result == "true") {
            var _CreateMasterPageFrame = new CreateMasterPageFrame();
            _CreateMasterPageFrame.CurrentRcoMasterComponent = CurrentMasterComponentMetaData;
            _CreateMasterPageFrame.ContentFrameHtml(myInstance.ContentFrameId);
            ShowMessage(myInstance.SuccsessMessage, 1);
        }
        else if (navigator != undefined && navigator != null && !navigator.onLine)
            ShowMessage("IN-ER-ALP-001 :: Please Check Your Internet Connectivity", 4);
        else
            ShowMessage(result, 4);

    }

    var error = function (sender, Request, textStatus, errorThrown) {
        if (navigator != undefined && navigator != null && !navigator.onLine)
            ShowMessage("IN-ER-ALP-001 :: Please Check Your Internet Connectivity", 4);
        else
            ShowMessage('IN-ER-OHI-001 :: Error in current operation.', 4);
    }

    var createparameterToLoadData = function (ModelUpdate) {
        var _DynamicPage = null;
        var PageParam = [];
        var parameterToLoadData = [];
        var Model = ModelUpdate;
        if (Model._HTMLPageConfigLst != undefined) {
            for (var i = 0; i < Model._HTMLPageConfigLst.length; i++) {
                var GridLoadParameters = [];
                var model = Model._HTMLPageConfigLst[i];
                _DynamicPage = new DynamicPage(model);
                if (model.ControlConfigDict != undefined) {
                    for (var item in model.ControlConfigDict) {
                        if (model.ControlConfigDict[item].ControlTypeName != "Label")
                            GridLoadParameters.push(model.ControlConfigDict[item].ClientID)
                    }
                    if (PageParam.length == 0)
                        PageParam.push(_DynamicPage.GetLoadParameterList(GridLoadParameters));
                    else
                        PageParam.push(_DynamicPage.GetLoadParameterList(GridLoadParameters));
                }
            }
        }
        else {
            var GridLoadParameters = [];
            _DynamicPage = new DynamicPage(Model);
            if (Model.ControlConfigDict != undefined) {
                for (var item in Model.ControlConfigDict) {
                    if (Model.ControlConfigDict[item].ControlTypeName != "Label")
                        GridLoadParameters.push(Model.ControlConfigDict[item].ClientID)
                }
            }
            else if (Model.ControlConfigDict == undefined) {
                GridLoadParameters = getGridLoadParameters(Model.ControlGroupConfigLst);
            }
            PageParam = _DynamicPage.GetLoadParameterList(GridLoadParameters);
        }

        parameterToLoadData = JSON.stringify(PageParam);
        parameterToLoadData = { request: parameterToLoadData, DATType: DATTypes };
        parameterToLoadData = JSON.stringify(parameterToLoadData);

        return parameterToLoadData;
    }

    this.Clear = function () {
        //var _CreatePop = new CreateRolePopUp();
        //_CreatePop.execute();
        var _oValidationFrameWork = new ValidationFrameWork(ModelUpdate);
        _oValidationFrameWork.removeValidate();

        var _CreateMasterPageFrame = new CreateMasterPageFrame();
        _CreateMasterPageFrame.CurrentRcoMasterComponent = CurrentMasterComponentMetaData;
        _CreateMasterPageFrame.ContentFrameHtml('ContentFrame');

        var _LoadControlData = new LoadControlData(ModelUpdate);
        if (_LoadControlData.Load != undefined)
            _LoadControlData.Load();
        else
            LoadControlData(ModelUpdate);
    }

    this.Delete = function () {
        var Param = {};
        var ParamToLoad = {};
        myInstance.OperationURL = GetRelativeUrl('/MasterManagementView/Delete');
        myInstance.SuccsessMessage = "IN-SU-OHI-002 :: Master Deleted Successfully";

        var _oValidationFrameWork = new ValidationFrameWork(ModelUpdate);
        if (_oValidationFrameWork.validateControl()) {
            var result = AjaxCall(createparameterToLoadData(ModelUpdate));
            myInstance.Clear();
        }
    }

    var AjaxCall = function (Param) {
        var result = null;
        var _OneViewAjax = new WiNAiMAjax();
        _OneViewAjax.url = myInstance.OperationURL;
        _OneViewAjax.webMethod = "post";
        _OneViewAjax.async = false;
        _OneViewAjax.contentType = 'application/json; charset=utf-8';
        _OneViewAjax.dataType = 'json';
        _OneViewAjax.parameter = Param;
        var args = {
            success: success,
            error: error,
            sender: this
        };
        result = _OneViewAjax.execute(args);
        if (result != undefined && result != null && result != '') {
            try {
                return result;
            }
            catch (ex) {
                return null;
            }
        }
        else {
            return null;
        }
    }
}

function MasterGridRowClickEvent() {
    var myInstance = this;
    this.ControlId = '';
    this.PageConfig = null;
    this.DataSourceConfig = null;
    var ImmdiateParentControlconfig = null;
    var RadioButtonControlConfig = null;

     var myInstance = this;
    this.ControlId = '';
    this.DataSourceConfig = null;
    var selected = [];

    this.execute = function (row) {
       
       
        if (selected != null && selected != undefined && selected.length < 1) {
            var currObj = this;
            var rowIndex = currObj.getAttribute("rowIndex");
            var IdColumn = currObj.childNodes['0'];
            var Id = null;
            if (IdColumn != null && $(IdColumn).hasClass("hide") && IdColumn.textContent != '') {
                try {
                    Id = parseInt(IdColumn.textContent);
                }
                catch (ex) {
                    Id = null;
                    console.error(ex);
                }
            }
            if (Id != null) {
                if ($(currObj).hasClass('row-selected')) {
                    $(currObj).removeClass('row-selected');
                    var index = selected.indexOf(Id);
                    if (index != -1)
                        selected.splice(index, 1);
                    var _CreateMasterPageFrame = new CreateMasterPageFrame();
                    _CreateMasterPageFrame.CurrentRcoMasterComponent = CurrentMasterComponentMetaData;
                    _CreateMasterPageFrame.LoadFilterFrameHtml("FilterParamFrame");
                }
                else {
                    $(currObj).addClass('row-selected');
                    if (selected.indexOf(Id) == -1 && Id != undefined && Id != null && Id != '')
                        selected.push(Id);

                    var _DynamicPage = null;
                    var GridLoadParameters = [];
                    var model = null;
                    var lcontrolConfigDict = null;
                    if (ModelUpdate != undefined && ModelUpdate != null)
                        model = ModelUpdate;
                    else {
                        for (var i = 0; i < oModel._HTMLPageConfigLst.length; i++) {
                            model = oModel._HTMLPageConfigLst[i];
                            if (lcontrolConfigDict != null) {
                                for (var item in model.ControlConfigDict) {
                                    lcontrolConfigDict[item] = model.ControlConfigDict[item];
                                }
                                model.ControlConfigDict = lcontrolConfigDict;
                            }
                            else {
                                lcontrolConfigDict = model.ControlConfigDict;
                            }
                        }
                    }
                    if (model != null) {
                        _DynamicPage = new DynamicPage(model);
                        if (model.ControlConfigDict != undefined) {
                            for (var item in model.ControlConfigDict) {
                                if (model.ControlConfigDict[item].ControlTypeName != "Label")
                                    GridLoadParameters.push(model.ControlConfigDict[item].ClientID)
                            }
                        }
                        else if (model.ControlConfigDict == undefined) {
                            GridLoadParameters = getGridLoadParameters(model.ControlGroupConfigLst);
                        }
                    }
                    var _oValidationFrameWork = new ValidationFrameWork(ModelUpdate);
                    _oValidationFrameWork.removeValidate();
                    if (GridLoadParameters.length > 0) {
                        for (var i = 0; i < GridLoadParameters.length; i++) {
                            var controlConfig = model.ControlGroupConfigLst[0].ControlConfigDict[GridLoadParameters[i]];
                            if (controlConfig != undefined && controlConfig != null) {
                                for (var j = 0; j < currObj.childNodes.length; j++) {
                                    if (controlConfig.ControlID == currObj.childNodes[j].id && controlConfig.ControlTypeName == "ComboBox" && controlConfig.ComboType == 1) {
                                        var _ComboBox = new WiNAiMComboBox(model);

                                        var arVeh = currObj.childNodes[j].outerText.split('|');
                                        var cleanArry = [];
                                        $.each(arVeh, function (idx, val) {

                                            cleanArry.push($.trim(this));

                                        });
                                        _ComboBox.setData(controlConfig, cleanArry);
                                        _ComboBox.onchange(controlConfig);
                                        break;
                                    }
                                    else if (controlConfig.ControlID == currObj.childNodes[j].id && controlConfig.ControlTypeName == "ComboBox") {
                                        var _ComboBox = new WiNAiMComboBox(model);
                                        _ComboBox.setData(controlConfig, currObj.childNodes[j].outerText);
                                        _ComboBox.onchange(controlConfig);
                                        break;
                                    }
                                    else if (controlConfig.ControlID == currObj.childNodes[j].id && controlConfig.ControlTypeName == "TextBox") {
                                        _DynamicPage.SetData(controlConfig, currObj.childNodes[j].outerText);
                                        break;
                                    }
                                    else if (controlConfig.ControlID == currObj.childNodes[j].id && controlConfig.ControlTypeName == "Hidden") {
                                        _DynamicPage.SetData(controlConfig, currObj.childNodes[j].outerText);
                                        break;
                                    }
                                    else if (controlConfig.ControlID == currObj.childNodes[j].id && controlConfig.ControlTypeName == "DatePicker") {
                                        _DynamicPage.SetData(controlConfig, currObj.childNodes[j].outerText + ',' + currObj.childNodes[j].outerText);
                                        break;
                                    }
                                    else if (controlConfig.ControlID == currObj.childNodes[j].id && controlConfig.ControlTypeName == "ImageControl") {
                                        _DynamicPage.SetData(controlConfig, currObj.childNodes[j].outerText);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {

            var currObj = this;
            var rowIndex = currObj.getAttribute("rowIndex");
            var IdColumn = currObj.childNodes['0'];
            var Id = null;
            if (IdColumn != null && $(IdColumn).hasClass("hide") && IdColumn.textContent != '') {
                try {
                    Id = parseInt(IdColumn.textContent);
                }
                catch (ex) {
                    Id = null;
                    console.error(ex);
                }
            }
            if (Id != null) {
                if ($(currObj).hasClass('row-selected')) {
                    $(currObj).removeClass('row-selected');
                    var index = selected.indexOf(Id);
                    if (index != -1)
                        selected.splice(index, 1);
                    var _CreateMasterPageFrame = new CreateMasterPageFrame();
                    _CreateMasterPageFrame.CurrentRcoMasterComponent = CurrentMasterComponentMetaData;
                    _CreateMasterPageFrame.LoadFilterFrameHtml("FilterParamFrame");
                }
            }
        }
    }


}

function SupportMethod() {
    this.OperationURL = '';

    var myInstance = this;
    this.GetDetails = function () {
        var Result = Pagename + "," + DATTypes;

        return Result;
    }

    this.Getpagetitle = function () {
        var Result = Pagename;

        return Result;
    }


}

function ExportData() {
    var myInstance = this;
    this.TypeOfExport = '';
    this.Export = function () {
        if ($('#grd_MasterGrid').DataTable().fnGetNodes().length == 0)
            ShowMessage("IN-WN-AHI-001 :: There are no Records for Export.", 2);
        else
            ExportClick(CurrentMasterComponentConfig, '/MasterManagementView/GetMasterData/', '', ("/DynamicPageConfig/" + Pagename), Pagename, myInstance.TypeOfExport);
    }

}