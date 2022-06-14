var _oEvalExpression = new EvalExpression();
var CurrentApprovalPageComponentConfig = null;
var objFactory = new Factory();

function OACFrameWork() {
    var myInstance = this;
    this.ComponentId = 0;
    this.UrlToGetApprovalPageComponent = '/DCApproval/GetOneViewApprovalPageComponent';
    this.PageContentId = '';
    this.PageTitleControlId = 'PageTitle';
    this.TypeOfFrame = 'TabSelection';
    this.HeaderFrameId = '';
    this.PageFrameId = 'widget-tab';
    this.AdvanceFilterFrameId = '';
    this.ContentFrameId = '';
    this.ApprovalPageComponentMetaData = null;
    this.ApprovalPageTabIndex = 0;
    /* Now we enabled PDF and Excel, If you want to enable Other than that please give the Control Id for to Assign the HTML. */
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';

    this.LoadPage = function () {
        /* 1. Using Component Id getting the ApprovalPage Component Meta Data. */
        if (myInstance.ApprovalPageComponentMetaData == undefined || myInstance.ApprovalPageComponentMetaData == null || myInstance.ApprovalPageComponentMetaData == "")
            myInstance.ApprovalPageComponentMetaData = myInstance.GetApprovalPageComponent();
        if (myInstance.ApprovalPageComponentMetaData != undefined && myInstance.ApprovalPageComponentMetaData != null && myInstance.ApprovalPageComponentMetaData != "") {
            var _ApprovalPageCompSessionUpdation = new SessionUpdation();
            _ApprovalPageCompSessionUpdation.ClearMultipleSessionKey(["ApprovalPlace", "DCPlaceDetails", "DCUserInfo", "DCUserDetailLst", "DCApproval_StartDate", "DCApproval_EndDate", "ApprovalFilterParameter"]);
            CurrentApprovalPageComponentMetaData = myInstance.ApprovalPageComponentMetaData;
            /* 2. Set Page Title */
            myInstance.SetPageTitle();

            /* 3. Crearte Page Frame with Filter Param and Display Format. 
                    3.1. Create Filter Param Html and Fill Data.
                    3.2. Create Display Format Html and Fill Data.
                    3.3. Create Export Details.
                    3.4. Create Notification Details. */
            myInstance.SetPageFrame();
        }
        else {
            ShowMessage('Approval component not found!', 4);
        }
    }

    this.SetPageTitle = function () {
        if (myInstance.PageTitleControlId != undefined && myInstance.PageTitleControlId != null) {
            var pageTitleControlIdDom = document.getElementById(myInstance.PageTitleControlId);
            if (pageTitleControlIdDom != undefined && pageTitleControlIdDom != null) {
                pageTitleControlIdDom.innerHTML = _GetGlobalization.GetGlobalizationValue(myInstance.ApprovalPageComponentMetaData.DisplayNameKey);
            }
        }
    }

    this.SetPageFrame = function () {
        if (myInstance.TypeOfFrame == 'TabSelection') {
            var _CreateApprovalPageFrame = new CreateApprovalPageFrame();
            _CreateApprovalPageFrame.ApprovalPageComponentMetaData = myInstance.ApprovalPageComponentMetaData;
            _CreateApprovalPageFrame.PDFExportControlId = myInstance.PDFExportControlId;
            _CreateApprovalPageFrame.ExcelExportControlId = myInstance.ExcelExportControlId;
            _CreateApprovalPageFrame.ApprovalPageTabIndex = myInstance.ApprovalPageTabIndex;
            _CreateApprovalPageFrame.Load(myInstance.PageFrameId, myInstance.HeaderFrameId, myInstance.ContentFrameId, myInstance.AdvanceFilterFrameId);
        }
        else {
            var _Message = new OneViewMessageBox();
            _Message.ShowNotification("Not Implemented Exception", 4);
            return false;
        }
    }

    this.GetApprovalPageComponent = function () {
        var result = null;
        var _OneViewAjax = new WiNAiMAjax();
        _OneViewAjax.url = myInstance.UrlToGetApprovalPageComponent;
        _OneViewAjax.webMethod = "post";
        _OneViewAjax.async = false;
        _OneViewAjax.contentType = 'application/json; charset=utf-8';
        _OneViewAjax.dataType = 'json';
        _OneViewAjax.parameter = JSON.stringify({ ComponentId: myInstance.ComponentId });
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

function CreateApprovalPageFrame() {
    var myInstance = this;
    this.PageContentId = '';
    this.ApprovalPageComponentMetaData = null;
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';
    this.CurrentApprovalPageComponent = null;
    this.ApprovalPageTabIndex = 0;
    var oApprovalPageComponentConfigLst = null;
    var lPageFrameId = '';
    var lContentFrameId = '';
    var lAdvanceFilterFrameId = '';
    var lHeaderFrameId = '';
    var lPDFExportControlId = '';
    var lExcelExportControlId = '';
    this.Load = function (PageFrameId, HeaderFrameId, ContentFrameId, AdvanceFilterFrameId) {
        oApprovalPageComponentConfigLst = JSON.parse(JSON.stringify(myInstance.ApprovalPageComponentMetaData.ApprovalPageComponentConfigLst));
        if (oApprovalPageComponentConfigLst != undefined && oApprovalPageComponentConfigLst != null && oApprovalPageComponentConfigLst.length > 0) {
            var FrameHtml = '';
            /* From That list we going to order by based on Display Order but we have to get this field name from Meta Data. */
            oApprovalPageComponentConfigLst = oApprovalPageComponentConfigLst.sort(OneViewArraySorting('DisplayOrder', true, function (a) { return a; }));
            /* From that List we are going to load active that means first object data only. */
            myInstance.CurrentApprovalPageComponent = oApprovalPageComponentConfigLst[myInstance.ApprovalPageTabIndex];
            try {
                CurrentApprovalPageComponentConfig = myInstance.CurrentApprovalPageComponent;
            }
            catch (ex) {
                console.log('CurrentApprovalPageComponentConfig is undefined');
            }
            var _CreateTabHtml = new CreatePageTabHtml();
            _CreateTabHtml.TabConfigLst = oApprovalPageComponentConfigLst;
            _CreateTabHtml.tabclickEvent = tabclickEvent;
            _CreateTabHtml.CreateHeaderFrameForPage(HeaderFrameId);
            lPageFrameId = PageFrameId;
            lContentFrameId = ContentFrameId;
            lAdvanceFilterFrameId = AdvanceFilterFrameId;
            lHeaderFrameId = HeaderFrameId;
            lPDFExportControlId = myInstance.PDFExportControlId;
            lExcelExportControlId = myInstance.ExcelExportControlId;
            myInstance.LoadPage();
        }
    }

    this.LoadPage = function () {
        RefreshPageLayOut();
        var _Page = objFactory.GetOneViewSubPageComponentObject(CurrentApprovalPageComponentConfig.Type);
        _Page.PageContentId = myInstance.PageContentId;
        _Page.lPageFrameId = lPageFrameId;
        _Page.lDisplayFrameId = lContentFrameId;
        _Page.lAdvanceFilterFrameId = lAdvanceFilterFrameId;
        _Page.PDFExportControlId = myInstance.PDFExportControlId;
        _Page.ExcelExportControlId = myInstance.ExcelExportControlId;
        _Page.CurrentPageSubComponent = CurrentApprovalPageComponentConfig;
        _Page.Load();
    }

    var tabclickEvent = function () {
        RemoveMessage();
        var target = LoadingImage();
        var delay = 1;
        currentTab = this;
        setTimeout(function () {
            $("#" + lHeaderFrameId).find('button').each(function () {
                $(this).removeClass('active');
            });
            $(currentTab).addClass('active');
            var _ApprovalPageCompSessionUpdation = new SessionUpdation();
            _ApprovalPageCompSessionUpdation.ClearMultipleSessionKey(["ApprovalPlace", "DCPlaceDetails", "DCUserInfo", "DCUserDetailLst", "DCApproval_StartDate", "DCApproval_EndDate", "ApprovalFilterParameter"]);
            var TabIndex = currentTab.id;
            var pathname = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
            var _OACFrameWork = new OACFrameWork();
            _OACFrameWork.UrlToGetApprovalPageComponent = GetRelativeUrl("/DCApproval/GetOneViewApprovalPageComponent/" + pathname);
            _OACFrameWork.ApprovalPageComponentMetaData = null;
            if (CurrentApprovalPageComponentMetaData == undefined || CurrentApprovalPageComponentMetaData == null)
                myInstance.ApprovalPageComponentMetaData = _OACFrameWork.GetApprovalPageComponent();
            else
                myInstance.ApprovalPageComponentMetaData = CurrentApprovalPageComponentMetaData;
            if (myInstance.ApprovalPageComponentMetaData != undefined && myInstance.ApprovalPageComponentMetaData != null) {
                oApprovalPageComponentConfigLst = JSON.parse(JSON.stringify(myInstance.ApprovalPageComponentMetaData.ApprovalPageComponentConfigLst));
                if (oApprovalPageComponentConfigLst != undefined && oApprovalPageComponentConfigLst != null && oApprovalPageComponentConfigLst.length > 0) {
                    var FrameHtml = '';
                    /* From That list we going to order by based on Display Order but we have to get this field name from Meta Data. */
                    oApprovalPageComponentConfigLst = oApprovalPageComponentConfigLst.sort(OneViewArraySorting('DisplayOrder', true, function (a) { return a; }));
                    /* From that List we are going to load active that means first object data only. */
                    myInstance.CurrentApprovalPageComponent = oApprovalPageComponentConfigLst[TabIndex];
                    try {
                        CurrentApprovalPageComponentConfig = myInstance.CurrentApprovalPageComponent;
                    }
                    catch (ex) {
                        console.log('CurrentApprovalPageComponentConfig is undefined');
                    }
                    var _ExportFormatComponent = new ExportFormatComponent();
                    _ExportFormatComponent.PDFExportControlId = myInstance.PDFExportControlId;
                    _ExportFormatComponent.ExcelExportControlId = myInstance.ExcelExportControlId;
                    _ExportFormatComponent.ClearHtml(_ExportFormatComponent.PDFExportControlId);
                    _ExportFormatComponent.ClearHtml(_ExportFormatComponent.ExcelExportControlId);
                    _ExportFormatComponent.Hide(_ExportFormatComponent.PDFExportControlId);
                    _ExportFormatComponent.Hide(_ExportFormatComponent.ExcelExportControlId);
                    myInstance.LoadPage();
                }
            }
            RemoveLoadingImage(target);

            $(".con-right-cont").niceScroll({ cursorcolor: "#00F", horizrailenabled: false });
            $(".con-right-cont").getNiceScroll().resize();

            $(".con-left-cont").niceScroll({ cursorcolor: "#00F", horizrailenabled: false });
            $(".con-left-cont").getNiceScroll().resize();
        }, delay);
    }

    var RefreshPageLayOut = function () {
        var Html = '<div class="con-left">' +
            '<div class="con-left-head">' +
                '<nav class="z-depth-0">' +
                    '<div class="nav-wrapper blue-grey lighten-5 blue-grey-text text-darken-4 padding-hrz-15">' +
                        '<strong>Filters</strong>' +
                    '</div>' +
                '</nav>' +
            '</div>' +
            '<div class="con-left-cont" id="FilterArea">' +
            '</div>' +
            '<div class="con-left-footer center-align">' +
                '<a id="actionlnk_ShowRecords" class="waves-effect waves-light btn light-blue darken-2">Filter</a>' +
            '</div>' +
        '</div>' +
        '<div id="ContentArea" class="con-right">' +
        '</div>';
        $("#" + myInstance.PageContentId).html(Html);

        $('#actionlnk_ShowRecords').click(function () {
            RemoveMessage();
            var target = LoadingImage();
            var delay = 1;
            setTimeout(function () {
                LoadApprovalGrid(myInstance.PageContentId, lPageFrameId, lContentFrameId, lAdvanceFilterFrameId, lPDFExportControlId, lExcelExportControlId);

                RemoveLoadingImage(target);
                //$("[rel=popover]").popover();
            }, delay);

        });
    }
}

function LoadApprovalGrid(PageContentId, lPageFrameId, lContentFrameId, lAdvanceFilterFrameId, lPDFExportControlId, lExcelExportControlId) {
    var _DynamicApprovalPage = new DynamicApprovalPage();
    _DynamicApprovalPage.CurrentPageSubComponent = CurrentApprovalPageComponentConfig;
    _DynamicApprovalPage.PageContentId = PageContentId;
    _DynamicApprovalPage.lPageFrameId = lPageFrameId;
    _DynamicApprovalPage.lDisplayFrameId = lContentFrameId;
    _DynamicApprovalPage.lAdvanceFilterFrameId = lAdvanceFilterFrameId;
    _DynamicApprovalPage.CurrentPageSubComponent = CurrentApprovalPageComponentConfig;
    _DynamicApprovalPage.PDFExportControlId = lPDFExportControlId;
    _DynamicApprovalPage.ExcelExportControlId = lExcelExportControlId;
    _DynamicApprovalPage.ContentFrameHtml(lContentFrameId);

    $(".con-right-cont").niceScroll({ cursorcolor: "#00F", horizrailenabled: false });
    $(".con-right-cont").getNiceScroll().resize();
}

function DynamicApprovalPage() {
    var myInstance = this;
    this.PageContentId = '';
    this.lPageFrameId = '';
    this.lDisplayFrameId = '';
    this.lAdvanceFilterFrameId = '';
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';
    this.CurrentPageSubComponent = null;

    this.Load = function () {
        try {
            myInstance.LoadFilterFrameHtml(myInstance.lPageFrameId);
        }
        catch (ex) {
            console.log('Default Filter Param Loading Problem');
        }
        try {
            myInstance.LoadAdvanceFilterParamHtml(myInstance.lAdvanceFilterFrameId);
        }
        catch (ex) {
            console.log('Advance Filter Loading Problem');
        }
        try {
            myInstance.ContentFrameHtml(myInstance.lDisplayFrameId);
        }
        catch (ex) {
            console.log(JSON.stringify(ex));
            console.log('Content Loading Problem');
        }
    }

    this.LoadFilterFrameHtml = function (PageFrameId) {
        var FrameHtml = '';
        if (PageFrameId != undefined && PageFrameId != null && PageFrameId != '') {
            var _CreateHTMLPage = new CreateHTMLPage();
            _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentPageSubComponent.ApprovalPageFilterParamConfig;
            FrameHtml += _CreateHTMLPage.Load();
            myInstance.setFrameHtml(PageFrameId, FrameHtml);

            myInstance.Initialize();
        }
    }

    this.LoadAdvanceFilterParamHtml = function (FrameId) {
        var FrameHtml = '';
        if (FrameId != undefined && FrameId != null && FrameId != '') {
            var _CreateHTMLPage = new CreateHTMLPage();
            _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentPageSubComponent.AdvanceFilterParamConfig;
            _CreateHTMLPage.MergePageConfig = true;
            FrameHtml += _CreateHTMLPage.Load();
            myInstance.setFrameHtml(FrameId, FrameHtml);
            var advanceFilterButton = $('.advfilter-btn');
            if (advanceFilterButton != null && advanceFilterButton != undefined && advanceFilterButton.length > 0) {
                if (FrameHtml == '' || FrameHtml == undefined || FrameHtml == null) {
                    advanceFilterButton.addClass('hide');
                    advanceFilterButton.closest('.btn-header').next().addClass('hide');
                }
                else {
                    advanceFilterButton.removeClass('hide');
                    advanceFilterButton.closest('.btn-header').next().removeClass('hide');
                }
            }
            myInstance.AdvanceFilterInit();
        }
    }

    this.ContentFrameHtml = function (ContentFrameId) {
        selected = [];
        var _ApprovalPageComponentDetailConfigLst = myInstance.CurrentPageSubComponent.ApprovalPageComponentDetailConfigLst;
        if (_ApprovalPageComponentDetailConfigLst != undefined && _ApprovalPageComponentDetailConfigLst != null) {
            for (var i = 0; i < _ApprovalPageComponentDetailConfigLst.length; i++) {
                var _ApprovalPageComponentDetailConfig = _ApprovalPageComponentDetailConfigLst[i];
                var ExpressionValid = true;
                if (_ApprovalPageComponentDetailConfig.DynamicFormExpression != null) {
                    ExpressionValid = _oEvalExpression.Evaluate(_ApprovalPageComponentDetailConfig.DynamicFormExpression);
                }
                if (ExpressionValid) {
                    GetDisplayFormat(_ApprovalPageComponentDetailConfig, ContentFrameId);

                    GetExportFormat(_ApprovalPageComponentDetailConfig, ContentFrameId);
                }
            }
        }
        $("#" + ContentFrameId + ' .tooltipped').tooltip({ delay: 50 });
    }

    this.setFrameHtml = function (PageFrameId, FrameHtml) {
        if (PageFrameId != undefined && PageFrameId != null) {
            var PageFrameDom = document.getElementById(PageFrameId);
            if (PageFrameDom != undefined && PageFrameDom != null) {
                PageFrameDom.innerHTML = FrameHtml;
            }
        }
    }

    this.HideControl = function (PageFrameId) {
        if (PageFrameId != undefined && PageFrameId != null) {
            var PageFrameDom = document.getElementById(PageFrameId);
            if (PageFrameDom != undefined && PageFrameDom != null) {
                $(PageFrameDom).addClass('hide');
            }
        }
    }

    this.ShowControl = function (PageFrameId) {
        if (PageFrameId != undefined && PageFrameId != null) {
            var PageFrameDom = document.getElementById(PageFrameId);
            if (PageFrameDom != undefined && PageFrameDom != null) {
                $(PageFrameDom).removeClass('hide');
            }
        }
    }

    this.Initialize = function () {
        var _CreateHTMLPage = new CreateHTMLPage();
        _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentPageSubComponent.ApprovalPageFilterParamConfig;
        _CreateHTMLPage.Initialize(_CreateHTMLPage.lCurrentPageConfig.Type);
    }

    this.AdvanceFilterInit = function () {
        var _CreateHTMLPage = new CreateHTMLPage();
        _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentPageSubComponent.AdvanceFilterParamConfig;
        _CreateHTMLPage.MergePageConfig = true;
        if (_CreateHTMLPage.lCurrentPageConfig != undefined && _CreateHTMLPage.lCurrentPageConfig != null) {
            _CreateHTMLPage.Initialize(_CreateHTMLPage.lCurrentPageConfig.Type);
        }
    }

    var GetDisplayFormat = function (ApprovalPageComponentDetailConfig, ContentFrameId) {
        var _ApprovalPageDataViewDisplayFormatConfigLst = ApprovalPageComponentDetailConfig.ApprovalPageDataViewDisplayFormatConfigLst;
        if (_ApprovalPageDataViewDisplayFormatConfigLst != undefined && _ApprovalPageDataViewDisplayFormatConfigLst != null) {
            var _DisplayFormatComponent = new DisplayFormatComponent();
            _DisplayFormatComponent.ClearHtml(ContentFrameId);
            var expressionAnyValid = false;
            for (var i = 0; i < _ApprovalPageDataViewDisplayFormatConfigLst.length; i++) {
                var _ApprovalPageDataViewDisplayFormatConfig = _ApprovalPageDataViewDisplayFormatConfigLst[i];
                var ExpressionValid = true;
                if (_ApprovalPageDataViewDisplayFormatConfig.DynamicFormExpression != null) {
                    ExpressionValid = _oEvalExpression.Evaluate(_ApprovalPageDataViewDisplayFormatConfig.DynamicFormExpression);
                }
                if (ExpressionValid) {
                    expressionAnyValid = true;
                    var _DisplayFormatConfigLst = _ApprovalPageDataViewDisplayFormatConfig.DisplayFormatConfigLst;
                    if (_DisplayFormatConfigLst != undefined && _DisplayFormatConfigLst != null) {
                        _DisplayFormatComponent.lDisplayFormatConfigLst = _DisplayFormatConfigLst;
                        _DisplayFormatComponent.DisplayFrameId = ContentFrameId;
                        _DisplayFormatComponent.FilterParamControlConfig = myInstance.CurrentPageSubComponent.ApprovalPageFilterParamConfig;
                        _DisplayFormatComponent.Load();
                    }
                }
            }
            if (!expressionAnyValid)
                ShowMessage('Feature not supported.', 3);
        }
    }

    var GetExportFormat = function (ApprovalPageComponentDetailConfig, ContentFrameId) {
        var _ApprovalPageExportFormatConfigLst = ApprovalPageComponentDetailConfig.ApprovalPageExportFormatConfigLst;
        if (_ApprovalPageExportFormatConfigLst != undefined && _ApprovalPageExportFormatConfigLst != null && _ApprovalPageExportFormatConfigLst.length > 0) {
            var _ExportFormatComponent = new ExportFormatComponent();
            _ExportFormatComponent.PDFExportControlId = myInstance.PDFExportControlId;
            _ExportFormatComponent.ExcelExportControlId = myInstance.ExcelExportControlId;
            _ExportFormatComponent.ClearHtml(_ExportFormatComponent.PDFExportControlId);
            _ExportFormatComponent.ClearHtml(_ExportFormatComponent.ExcelExportControlId);
            _ExportFormatComponent.Hide(_ExportFormatComponent.PDFExportControlId);
            _ExportFormatComponent.Hide(_ExportFormatComponent.ExcelExportControlId);
            for (var i = 0; i < _ApprovalPageExportFormatConfigLst.length; i++) {
                var _ApprovalPageExportFormatConfig = _ApprovalPageExportFormatConfigLst[i];
                var ExpressionValid = true;
                if (_ApprovalPageExportFormatConfig.DynamicFormExpression != null) {
                    ExpressionValid = _oEvalExpression.Evaluate(_ApprovalPageExportFormatConfig.DynamicFormExpression);
                }
                if (ExpressionValid) {
                    var _ExportFormatConfigLst = _ApprovalPageExportFormatConfig.ExportFormatConfigLst;
                    if (_ExportFormatConfigLst != undefined && _ExportFormatConfigLst != null) {
                        _ExportFormatComponent.lExportFormatConfigLst = _ExportFormatConfigLst;
                        _ExportFormatComponent.FilterParamControlConfig = myInstance.CurrentPageSubComponent.ApprovalPageFilterParamConfig;
                        _ExportFormatComponent.Load();
                    }
                }
            }
        }
    }
}

function DownloadReportFile() {
    var myInstance = this;
    this.GetFile = function (element) {
        RemoveMessage();
        $('#AsyncReportGenStatus').html('');
        var target = LoadingImage();
        var delay = 1;
        setTimeout(function () {
            var LoclModel = CurrentApprovalPageComponentConfig.ApprovalPageFilterParamConfig;
            var parameterToLoadData = {};
            var ExportFormatConfigjson = $(element).attr('ExportFormatConfig');
            if (ExportFormatConfigjson != undefined && ExportFormatConfigjson != null && ExportFormatConfigjson != '') {
                var lExportFormatConfig = JSON.parse(ExportFormatConfigjson);
                var lDataSourceConfig = lExportFormatConfig.DataSourceConfig;
                if (lDataSourceConfig != undefined && lDataSourceConfig != null) {
                    parameterToLoadData["ExportFormatConfig"] = lExportFormatConfig;
                    parameterToLoadData["ExportType"] = $(element).attr('ExportType');
                    parameterToLoadData["OrderBy"] = lDataSourceConfig.OrderBy;

                    parameterToLoadData = GetParam(LoclModel, parameterToLoadData);

                    parameterToLoadData = { request: JSON.stringify(parameterToLoadData) };
                    parameterToLoadData = JSON.stringify(parameterToLoadData);

                    var myAjaxobj = new WiNAiMAjax();
                    myAjaxobj.url = GetRelativeUrl(lDataSourceConfig.ServiceKeyName);
                    myAjaxobj.webMethod = "post";
                    myAjaxobj.parameter = parameterToLoadData;
                    myAjaxobj.async = lDataSourceConfig.IsAsync;
                    var callBackparm = {
                        success: DownloadTemplateSuccesss,
                        error: DownloadTemplateError,
                        sender: this
                    }
                    myAjaxobj.execute(callBackparm);
                    if (lDataSourceConfig.IsAsync != null && lDataSourceConfig.IsAsync != undefined && lDataSourceConfig.IsAsync)
                        ShowMessage("IN-WN-APP-002 :: Report Generating", 3);

                    //Start_UpdateAsyncReportGenerationStatusTimer();
                    //UpdateAsyncReportGenerationNotificationBar();
                }
            }
            RemoveLoadingImage(target);
        }, delay);

        IsFirstNotificationAfterExport = true;
        Clear_UpdateNotificationBarTimer();
        setTimeout(function () { UpdateNotificationBar(); }, 3000);
    }

    var DownloadTemplateSuccesss = function (response, message) {
        UpdateNotificationBar();
        if (message == 'Session Failure') {
            window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
            return false;
        }
        else {
            var responseObj = null;
            if (message != undefined && message != null) {
                try {
                    responseObj = JSON.parse(message);
                }
                catch (ex) {
                    responseObj = null;
                }
            }
            if (responseObj != undefined && responseObj != null) {
                if (responseObj.IsAnyException)
                    ShowMessage(responseObj.ExceptionMessage, 4);
                else if (responseObj.IsSuccess && responseObj.ExceptionMessage != '')
                    ShowMessage(responseObj.ExceptionMessage, 1);
                else if (responseObj.IsSuccess)
                    ShowMessage("Success.", 1);
            }
        }
    }

    var DownloadTemplateError = function (sender, Request, textStatus, errorThrown) {
        UpdateNotificationBar();
        ShowMessage(errorThrown, 4);
    }

    //var DownloadTemplateSuccesss = function (response, message) {
    //    UpdateAsyncReportGenerationStatus();
    //    UpdateAsyncReportGenerationNotificationBar();
    //    if (message == 'Session Failure') {
    //        window.location.href = GetParentFolderOfApplication() + "//Login/LoginIndex";
    //        return false;
    //    }
    //    else if (message == '1')
    //        ShowMessage("IN-WN-REP-002 :: There are no records to Export!", 2);
    //    else if (message == "100") {
    //        ShowMessage("IN-WN-APP-002 :: Please select the specific template to export.", 2);
    //        var oAsyncReportGenLink = document.getElementById('AsyncReportGenLink');
    //        if (oAsyncReportGenLink != undefined && oAsyncReportGenLink != null) {
    //            $(oAsyncReportGenLink).addClass('hide');
    //        }
    //    }
    //    else {
    //        var responseObj = message;
    //        ajax_download(GetRelativeUrl("/Home/ExportDataCapture/"), { 'param1': responseObj });
    //    }
    //}

    //var DownloadTemplateError = function (sender, Request, textStatus, errorThrown) {
    //    UpdateAsyncReportGenerationStatus();
    //    UpdateAsyncReportGenerationNotificationBar();
    //    ShowMessage(errorThrown, 4);
    //}

    var GetParam = function (oModel, CustomParam) {
        var parameterToLoadData = {};
        var _LoadControlData = new LoadControlData(oModel);
        parameterToLoadData = _LoadControlData.GetParamFromControlConfig();
        for (var item in CustomParam) {
            parameterToLoadData[item] = CustomParam[item];
        }
        try {
            parameterToLoadData["DcDetail"] = JSON.stringify(selected);
        }
        catch (ex) {
            console.log('selected variable undefined');
        }
        return parameterToLoadData;
    }
}