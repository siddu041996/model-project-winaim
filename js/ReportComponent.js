var _oEvalExpression = new EvalExpression();
var CurrentReportingComponentConfig = null;
var objFactory = new Factory();
var DashboardCommonFilterparamConfig = null;

function ORCFrameWork() {
    var myInstance = this;
    this.ComponentId = 0;
    this.UrlToGetReportingComponent = '/ReportingComponent/GetReportingCompont';
    this.PageTitleControlId = 'PageTitle';
    this.TypeOfFrame = 'TabSelection';
    this.PageContentId = '';
    this.HeaderFrameId = '';
    this.PageFrameId = 'widget-tab';
    this.AdvanceFilterFrameId = '';
    this.DisplayFrameId = '';
    this.ReportingComponentMetaData = null;
    this.ReportTabIndex = 0;
    /* Now we enabled PDF and Excel, If you want to enable Other than that please give the Control Id for to Assign the HTML. */
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';
    this.DashboardCommonFilterparam = null;

    this.LoadPage = function () {
        if (myInstance.DashboardCommonFilterparam != null)
            DashboardCommonFilterparamConfig = myInstance.DashboardCommonFilterparam;
        /* 1. Using Component Id getting the Reporting Component Meta Data. */
        if (myInstance.ReportingComponentMetaData == undefined || myInstance.ReportingComponentMetaData == null || myInstance.ReportingComponentMetaData == "")
            myInstance.ReportingComponentMetaData = myInstance.GetReportingComponent();
        if (myInstance.ReportingComponentMetaData != undefined && myInstance.ReportingComponentMetaData != null && myInstance.ReportingComponentMetaData != "") {
            var _ReportCompSessionUpdation = new SessionUpdation();
            _ReportCompSessionUpdation.ClearMultipleSessionKey(["ReportPlace", "DCPlaceDetails", "DCUserInfo", "DCUserDetailLst"]);
            CurrentReportingComponentMetaData = myInstance.ReportingComponentMetaData;
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
            ShowMessage('Report component not found!', 4);
        }

       
    }

    this.SetPageTitle = function () {
        if (myInstance.PageTitleControlId != undefined && myInstance.PageTitleControlId != null) {
            var pageTitleControlIdDom = document.getElementById(myInstance.PageTitleControlId);
            if (pageTitleControlIdDom != undefined && pageTitleControlIdDom != null) {
                pageTitleControlIdDom.innerHTML = _GetGlobalization.GetGlobalizationValue(myInstance.ReportingComponentMetaData.DisplayNameKey);
            }
        }
    }

    this.SetPageFrame = function () {
        if (myInstance.TypeOfFrame == 'TabSelection') {
            var _CreateReportPageFrame = new CreateReportPageFrame();
            _CreateReportPageFrame.ReportingComponentMetaData = myInstance.ReportingComponentMetaData;
            _CreateReportPageFrame.PDFExportControlId = myInstance.PDFExportControlId;
            _CreateReportPageFrame.ExcelExportControlId = myInstance.ExcelExportControlId;
            _CreateReportPageFrame.ReportTabIndex = myInstance.ReportTabIndex;
            _CreateReportPageFrame.PageContentId = myInstance.PageContentId;
            _CreateReportPageFrame.Load(myInstance.PageFrameId, myInstance.HeaderFrameId, myInstance.DisplayFrameId, myInstance.AdvanceFilterFrameId);
        }
        else {
            var _Message = new OneViewMessageBox();
            _Message.ShowNotification("Not Implemented Exception", 4);
            return false;
        }
    }

    this.GetReportingComponent = function () {
        var result = null;
        var _OneViewAjax = new WiNAiMAjax();
        _OneViewAjax.url = myInstance.UrlToGetReportingComponent;
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

function CreateReportPageFrame() {
    var myInstance = this;
    this.PageContentId = '';
    this.ReportingComponentMetaData = null;
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';
    this.CurrentReportingComponent = null;
    this.ReportTabIndex = 0;
    var oReportingComponentConfigLst = null;
    var lPageFrameId = '';
    var lDisplayFrameId = '';
    var lAdvanceFilterFrameId = '';
    var lHeaderFrameId = '';
  
    this.Load = function (PageFrameId, HeaderFrameId, DisplayFrameId, AdvanceFilterFrameId) {
        oReportingComponentConfigLst = JSON.parse(JSON.stringify(myInstance.ReportingComponentMetaData.ReportingComponentConfigLst));
        if (oReportingComponentConfigLst != undefined && oReportingComponentConfigLst != null && oReportingComponentConfigLst.length > 0) {
            var FrameHtml = '';
            /* From That list we going to order by based on Display Order but we have to get this field name from Meta Data. */
            oReportingComponentConfigLst = oReportingComponentConfigLst.sort(OneViewArraySorting('DisplayOrder', true, function (a) { return a; }));
            /* From that List we are going to load active that means first object data only. */
            myInstance.CurrentReportingComponent = oReportingComponentConfigLst[myInstance.ReportTabIndex];
            try {
                CurrentReportingComponentConfig = myInstance.CurrentReportingComponent;
            }
            catch (ex) {
                console.log('CurrentReportingComponentConfig is undefined');
            }
            /* If ReportingComponentConfig its one then no need to show the tab row. */
            if (oReportingComponentConfigLst.length == 1)
                $("#" + myInstance.PageContentId).css("top", "0px");
            var _CreateTabHtml = new CreatePageTabHtml();
            _CreateTabHtml.TabConfigLst = oReportingComponentConfigLst;
            _CreateTabHtml.tabclickEvent = tabclickEvent;
            _CreateTabHtml.CreateHeaderFrameForPage(HeaderFrameId);
            lPageFrameId = PageFrameId;
            lDisplayFrameId = DisplayFrameId;
            lAdvanceFilterFrameId = AdvanceFilterFrameId;
            lHeaderFrameId = HeaderFrameId;
            lPDFExportControlId = myInstance.PDFExportControlId;
            lExcelExportControlId = myInstance.ExcelExportControlId;

            myInstance.LoadPage();
        }
    }

    this.LoadPage = function () {
        RefreshPageLayOut();
        var _Page = objFactory.GetOneViewSubPageComponentObject(CurrentReportingComponentConfig.Type);
        _Page.PageContentId = myInstance.PageContentId;
        _Page.lPageFrameId = lPageFrameId;
        _Page.lDisplayFrameId = lDisplayFrameId;
        _Page.lAdvanceFilterFrameId = lAdvanceFilterFrameId;
        _Page.CurrentPageSubComponent = CurrentReportingComponentConfig;
        _Page.PDFExportControlId = lPDFExportControlId;
        _Page.ExcelExportControlId = lExcelExportControlId;
      

        _Page.Load();
    }

    var tabclickEvent = function () {
        RemoveMessage();
        var target = LoadingImage();
        var delay = 1;
        currentTab = this;
        setTimeout(function () {
            $("#" + lHeaderFrameId).find('a').each(function () {
                $(this).removeClass('active');
            });
            $(currentTab).addClass('active');
            var _ReportCompSessionUpdation = new SessionUpdation();
            _ReportCompSessionUpdation.ClearMultipleSessionKey(["ReportPlace", "DCPlaceDetails"]);
            var TabIndex = currentTab.id;
            var pathname = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
            var _ORCFrameWork = new ORCFrameWork();
            _ORCFrameWork.UrlToGetReportingComponent = GetRelativeUrl("/Report/GetOneViewReportComponent/" + pathname);
            _ORCFrameWork.ReportingComponentMetaData = null;
            if (CurrentReportingComponentMetaData == undefined || CurrentReportingComponentMetaData == null)
                myInstance.ReportingComponentMetaData = _ORCFrameWork.GetReportingComponent();
            else
                myInstance.ReportingComponentMetaData = CurrentReportingComponentMetaData;
            if (myInstance.ReportingComponentMetaData != undefined && myInstance.ReportingComponentMetaData != null) {
                oReportingComponentConfigLst = JSON.parse(JSON.stringify(myInstance.ReportingComponentMetaData.ReportingComponentConfigLst));
                if (oReportingComponentConfigLst != undefined && oReportingComponentConfigLst != null && oReportingComponentConfigLst.length > 0) {
                    var FrameHtml = '';
                    /* From That list we going to order by based on Display Order but we have to get this field name from Meta Data. */
                    oReportingComponentConfigLst = oReportingComponentConfigLst.sort(OneViewArraySorting('DisplayOrder', true, function (a) { return a; }));
                    /* From that List we are going to load active that means first object data only. */
                    myInstance.CurrentReportingComponent = oReportingComponentConfigLst[TabIndex];
                    try {
                        CurrentReportingComponentConfig = myInstance.CurrentReportingComponent;
                    }
                    catch (ex) {
                        console.log('CurrentReportingComponentConfig is undefined');
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
            '<div id="divreportbutoncontent" class="con-left-footer center-align">' +
                '<a id="actionlnk_ShowRecords"  class="waves-effect waves-light btn light-blue darken-2">Filter</a>' +
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
                var _DynamicReportPage = new DynamicReportPage();
                _DynamicReportPage.CurrentPageSubComponent = CurrentReportingComponentConfig;
                _DynamicReportPage.PageContentId = myInstance.PageContentId;
                _DynamicReportPage.lPageFrameId = lPageFrameId;
                _DynamicReportPage.lDisplayFrameId = lDisplayFrameId;
                _DynamicReportPage.lAdvanceFilterFrameId = lAdvanceFilterFrameId;
                _DynamicReportPage.CurrentPageSubComponent = CurrentReportingComponentConfig;
                _DynamicReportPage.PDFExportControlId = lPDFExportControlId;
                _DynamicReportPage.ExcelExportControlId = lExcelExportControlId;
                _DynamicReportPage.ContentFrameHtml('ContentArea');

                $(".con-right-cont").niceScroll({ cursorcolor: "#00F", horizrailenabled: false });
                $(".con-right-cont").getNiceScroll().resize();
                RemoveLoadingImage(target);
                //$("[rel=popover]").popover();
            }, delay);

        });
    }
}


function ShowRecords() {
    RemoveMessage();
    var target = LoadingImage();
    var delay = 1;
    setTimeout(function () {
        var _CreateReportPageFrame = new CreateReportPageFrame();
        _CreateReportPageFrame.CurrentReportingComponent = CurrentReportingComponentConfig;
        _CreateReportPageFrame.PDFExportControlId = 'PDFExport';
        _CreateReportPageFrame.ExcelExportControlId = 'ExcelExport';
        _CreateReportPageFrame.ContentFrameHtml('ContentArea');

        $(".con-right-cont").niceScroll({ cursorcolor: "#00F", horizrailenabled: false });
        $(".con-right-cont").getNiceScroll().resize();
        RemoveLoadingImage(target);
        //$("[rel=popover]").popover();
    }, delay);
}
function DynamicReportPage() {
    var myInstance = this;
    this.PageContentId = '';
    this.lPageFrameId = '';
    this.lDisplayFrameId = '';
    this.lAdvanceFilterFrameId = '';
    this.CurrentPageSubComponent = null;
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';

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
        if (PageFrameId != undefined && PageFrameId != null && PageFrameId != '' && myInstance.CurrentPageSubComponent.ReportFilterParamConfig != null) {
            var _CreateHTMLPage = new CreateHTMLPage();
            _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentPageSubComponent.ReportFilterParamConfig;
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

    this.ContentFrameHtml = function (DisplayFrameId) {
        selected = [];
        var _ReportingComponentDetailConfigLst = myInstance.CurrentPageSubComponent.ReportingComponentDetailConfigLst;
        if (_ReportingComponentDetailConfigLst != undefined && _ReportingComponentDetailConfigLst != null) {
            for (var i = 0; i < _ReportingComponentDetailConfigLst.length; i++) {
                var _ReportingComponentDetailConfig = _ReportingComponentDetailConfigLst[i];
                var ExpressionValid = true;
                if (_ReportingComponentDetailConfig.DynamicFormExpression != null) {
                    ExpressionValid = _oEvalExpression.Evaluate(_ReportingComponentDetailConfig.DynamicFormExpression);
                }
                if (ExpressionValid) {
                    GetDisplayFormat(_ReportingComponentDetailConfig, DisplayFrameId);

                    GetExportFormat(_ReportingComponentDetailConfig, DisplayFrameId);
                }
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
        _CreateHTMLPage.lCurrentPageConfig = myInstance.CurrentPageSubComponent.ReportFilterParamConfig;
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

    var GetDisplayFormat = function (ReportingComponentDetailConfig, DisplayFrameId) {
        var _ReportingDataViewDisplayFormatConfigLst = ReportingComponentDetailConfig.ReportingDataViewDisplayFormatConfigLst;
        if (_ReportingDataViewDisplayFormatConfigLst != undefined && _ReportingDataViewDisplayFormatConfigLst != null) {
            var _DisplayFormatComponent = new DisplayFormatComponent();
            _DisplayFormatComponent.ClearHtml(DisplayFrameId);
            if (_ReportingDataViewDisplayFormatConfigLst.length > 0) {
                var expressionAnyValid = false;
                for (var i = 0; i < _ReportingDataViewDisplayFormatConfigLst.length; i++) {
                    var _ReportingDataViewDisplayFormatConfig = _ReportingDataViewDisplayFormatConfigLst[i];
                    var ExpressionValid = true;
                    if (_ReportingDataViewDisplayFormatConfig.DynamicFormExpression != null) {
                        ExpressionValid = _oEvalExpression.Evaluate(_ReportingDataViewDisplayFormatConfig.DynamicFormExpression);
                    }
                    if (ExpressionValid) {
                        expressionAnyValid = true;
                        var _DisplayFormatConfigLst = _ReportingDataViewDisplayFormatConfig.DisplayFormatConfigLst;
                        if (_DisplayFormatConfigLst != undefined && _DisplayFormatConfigLst != null) {
                            _DisplayFormatComponent.lDisplayFormatConfigLst = _DisplayFormatConfigLst;
                            _DisplayFormatComponent.DisplayFrameId = DisplayFrameId;
                            _DisplayFormatComponent.FilterParamControlConfig = myInstance.CurrentPageSubComponent.ReportFilterParamConfig;
                            _DisplayFormatComponent.Load();
                        }
                    }
                }
                if (!expressionAnyValid)
                    ShowMessage('Feature not supported.', 3);
            }
        }
    }

    var GetExportFormat = function (ReportingComponentDetailConfig, DisplayFrameId) {
        var _ReportingExportFormatConfigLst = ReportingComponentDetailConfig.ReportingExportFormatConfigLst;
        if (_ReportingExportFormatConfigLst != undefined && _ReportingExportFormatConfigLst != null && _ReportingExportFormatConfigLst.length > 0) {
            var _ExportFormatComponent = new ExportFormatComponent();
            _ExportFormatComponent.PDFExportControlId = myInstance.PDFExportControlId;
            _ExportFormatComponent.ExcelExportControlId = myInstance.ExcelExportControlId;
            _ExportFormatComponent.ClearHtml(_ExportFormatComponent.PDFExportControlId);
            _ExportFormatComponent.ClearHtml(_ExportFormatComponent.ExcelExportControlId);
            _ExportFormatComponent.Hide(_ExportFormatComponent.PDFExportControlId);
            _ExportFormatComponent.Hide(_ExportFormatComponent.ExcelExportControlId);
            for (var i = 0; i < _ReportingExportFormatConfigLst.length; i++) {
                var _ReportingExportFormatConfig = _ReportingExportFormatConfigLst[i];
                var ExpressionValid = true;
                if (_ReportingExportFormatConfig.DynamicFormExpression != null) {
                    ExpressionValid = _oEvalExpression.Evaluate(_ReportingExportFormatConfig.DynamicFormExpression);
                }
                if (ExpressionValid) {
                    var _ExportFormatConfigLst = _ReportingExportFormatConfig.ExportFormatConfigLst;
                    if (_ExportFormatConfigLst != undefined && _ExportFormatConfigLst != null) {
                        _ExportFormatComponent.lExportFormatConfigLst = _ExportFormatConfigLst;
                        _ExportFormatComponent.FilterParamControlConfig = myInstance.CurrentPageSubComponent.ReportFilterParamConfig;
                        _ExportFormatComponent.Load();
                    }
                }
            }
        }
    }
}

function CustomAttributeGroup_Summary_SingleSeriesWidget() {
    this.CurrentDisplayFormatConfig = null;
    this.ControlId = '';
    this.FilterParamControlConfig = null;
    var CustomAttributeGroupInfoLst = null;
    var CustomAttributeGroupWiseScoreResult = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var myInstance = this;
    this.LoadingDivId = '';

    this.Load = function () {
        CustomAttributeGroupInfoLst = myInstance.CurrentDisplayFormatConfig.CustomAttributeGroupInfoLst;
        var innerhtml = '';
        if (CustomAttributeGroupInfoLst != undefined && CustomAttributeGroupInfoLst != null && CustomAttributeGroupInfoLst.length > 0) {
            CustomAttributeGroupWiseScoreResult = myInstance.GetData(GetParamToLoadData(CustomAttributeGroupInfoLst));

            if (CustomAttributeGroupWiseScoreResult == null || CustomAttributeGroupWiseScoreResult == undefined) {
                CustomAttributeGroupWiseScoreResult = [];
            }
            for (var itr = 0; itr < CustomAttributeGroupInfoLst.length; itr++) {
                var CustomAttributeGroupInfo = CustomAttributeGroupInfoLst[itr];
                var FilteredResult = CustomAttributeGroupWiseScoreResult.filter(OneViewArrayFilter(myInstance.CurrentDisplayFormatConfig.XAxisLabelKey, CustomAttributeGroupInfo.GroupName));
                BackgrouudColor = CustomAttributeGroupInfo.BackgroundColor;
                if (FilteredResult != null && FilteredResult != undefined && FilteredResult.length > 0) {
                    xAxisValue = FilteredResult[0].xAxisValue;
                    yAxisValue = FilteredResult[0].yAxisValue;
                }
                else {
                    xAxisValue = CustomAttributeGroupInfo.GroupName;
                    yAxisValue = 0;
                }
                innerhtml += myInstance.GetHtml();
            }
        }
        myInstance.SetHtml(innerhtml);
    }

    this.GetHtml = function () {
        var innerhtml = '<div class="col-sm-3">' +
                              '<div id="g_' + xAxisValue.replace(' ', '') + '" class="gauge"></div>' +
                              '<div class="gauge-txt text-center padding-5"><strong>' + xAxisValue + '</strong></div>' +
                            '</div>';
        return innerhtml;
    }

    this.SetHtml = function (Html) {
        if (myInstance.ControlId != undefined && myInstance.ControlId != null) {
            var Control = document.getElementById(myInstance.ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
                Control.innerHTML = Html;
            }
        }
    }

    this.Init = function () {
        myInstance.InitializeJustGaugeWidget();
    }

    this.InitializeJustGaugeWidget = function () {
        var oDashBoardSmartWidgetLoad = new DashBoardSmartWidgetLoad();
        CustomAttributeGroupInfoLst = myInstance.CurrentDisplayFormatConfig.CustomAttributeGroupInfoLst;
        if (CustomAttributeGroupInfoLst != undefined && CustomAttributeGroupInfoLst != null && CustomAttributeGroupInfoLst.length > 0) {
            for (var itr = 0; itr < CustomAttributeGroupInfoLst.length; itr++) {
                var FilteredResult = CustomAttributeGroupWiseScoreResult.filter(OneViewArrayFilter(myInstance.CurrentDisplayFormatConfig.XAxisLabelKey, CustomAttributeGroupInfoLst[itr].GroupName));
                var oFilteredResult = null;
                if (FilteredResult != null && FilteredResult != undefined && FilteredResult.length > 0)
                    oFilteredResult = FilteredResult[0];
                var options = {
                    id: ('g_' + CustomAttributeGroupInfoLst[itr].GroupName.replace(' ', '')),
                    value: (oFilteredResult != null && oFilteredResult != undefined && oFilteredResult[myInstance.CurrentDisplayFormatConfig.YAxisLabelKey] != null
                        && oFilteredResult[myInstance.CurrentDisplayFormatConfig.YAxisLabelKey] != undefined &&
                        oFilteredResult[myInstance.CurrentDisplayFormatConfig.YAxisLabelKey] != '' ? oFilteredResult[myInstance.CurrentDisplayFormatConfig.YAxisLabelKey] : 0),
                    min: 0,
                    max: 100,
                    symbol: '%',
                    pointer: true,
                    gaugeWidthScale: 0.6,
                    customSectors: [{
                        color: '#ff0000',
                        lo: 0,
                        hi: 75
                    }, {
                        color: '#FFC200',
                        lo: 75,
                        hi: 85
                    }, {
                        color: '#00ff00',
                        lo: 85,
                        hi: 100
                    }],
                    counter: true
                };
                oDashBoardSmartWidgetLoad.onLoadJustGaugeWidget(options);
            }
            removeLoadingPan('widget-content-' + myInstance.ControlId.split('-')[myInstance.ControlId.split('-').length - 1]);
        }
    }

    this.GetData = function (param) {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl(myInstance.CurrentDisplayFormatConfig.ServiceKeyName);
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = false;
        myAjaxobj.parameter = param;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var result = myAjaxobj.execute();
        if (result != undefined && result != null) {
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
        return result;
    }

    var GetParamToLoadData = function (CustomAttributeGroupInfoLst) {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param ["CustomAttributeGroupInfoLst"] = CustomAttributeGroupInfoLst;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }
}

function CustomAttributeGroup_DateWiseSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var CustomAttributeGroupInfoLst = null;
    this.ControlId = '';
    var ChartControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        ChartControlId = 'Chart_' + myInstance.ControlId;
        var Html = myInstance.GetChartDiv();
        myInstance.SetHtml(myInstance.ControlId, Html);
        var oCustomAttributeGroupInfoLst = myInstance.CurrentDisplayFormatConfig.CustomAttributeGroupInfoLst;
        var innerhtml = '';
        if (oCustomAttributeGroupInfoLst != undefined && oCustomAttributeGroupInfoLst != null && oCustomAttributeGroupInfoLst.length > 0) {
            CustomAttributeGroupInfoLst = oCustomAttributeGroupInfoLst;
            myInstance.PlotChart();
        }
    }

    this.GetChartDiv = function () {
        var Html = '<div id = "' + ChartControlId + '" class = "chart has-legend chartclass"></div>';
        return Html;
    }

    this.SetHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = Html;
            }
        }
    }

    this.PlotChart = function () {
        var lineChart = $("#" + ChartControlId);
        var _OneViewPlotChartComponent = new OneViewPlotChartComponent();
        var ChartType = myInstance.CurrentDisplayFormatConfig.ChartType.toLowerCase();
        ChartType = ChartType != undefined && ChartType != null ? (ChartType + '-stringwise') : '';
        _OneViewPlotChartComponent.ChartType = ChartType;
        _OneViewPlotChartComponent.LodingDivId = "widget-content-" + myInstance.ControlId.split('-')[myInstance.ControlId.split('-').length - 1];
        //_OneViewPlotChartComponent.FilterControlId = ["daterange1", "ddl_Template1"];
        _OneViewPlotChartComponent.BaseFilterParam = GetParamToLoadData();
        _OneViewPlotChartComponent.IsSingleSeries = false;
        _OneViewPlotChartComponent.MultiSeriesConfig = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        _OneViewPlotChartComponent.Url = GetRelativeUrl(myInstance.CurrentDisplayFormatConfig.ServiceKeyName);

        _OneViewPlotChartComponent.MultiSeriesConfig['SeriesCount'] = 0;
        _OneViewPlotChartComponent.MultiSeriesConfig['SeriesType'] = [];
        _OneViewPlotChartComponent.MultiSeriesConfig['xAxisValueKey'] = [];
        _OneViewPlotChartComponent.MultiSeriesConfig['yAxisValueKey'] = [];
        _OneViewPlotChartComponent.MultiSeriesConfig['yAxisLegents'] = [];
        _OneViewPlotChartComponent.MultiSeriesConfig['Colors'] = [];
        if (myInstance.CurrentDisplayFormatConfig.XAxisLegent != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLegent != '')
            _OneViewPlotChartComponent.MultiSeriesConfig['xAxisLabelText'] = myInstance.CurrentDisplayFormatConfig.XAxisLegent;
        else
            _OneViewPlotChartComponent.MultiSeriesConfig['xAxisLabelText'] = 'Date';
        if (myInstance.CurrentDisplayFormatConfig.YAxisLegent != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLegent != '')
            _OneViewPlotChartComponent.MultiSeriesConfig['yAxisLabelText'] = myInstance.CurrentDisplayFormatConfig.YAxisLegent;
        else
            _OneViewPlotChartComponent.MultiSeriesConfig['yAxisLabelText'] = 'Score';
        for (var itr = 0; itr < CustomAttributeGroupInfoLst.length; itr++) {
            _OneViewPlotChartComponent.MultiSeriesConfig['SeriesCount'] = itr + 1;
            _OneViewPlotChartComponent.MultiSeriesConfig['SeriesType'].push(myInstance.CurrentDisplayFormatConfig.ChartType);
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                _OneViewPlotChartComponent.MultiSeriesConfig['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                _OneViewPlotChartComponent.MultiSeriesConfig['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            _OneViewPlotChartComponent.MultiSeriesConfig['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(CustomAttributeGroupInfoLst[itr].DisplayNamekey));
            var ColorCss = CustomAttributeGroupInfoLst[itr].ColorCSS;
            _OneViewPlotChartComponent.MultiSeriesConfig['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                CustomAttributeGroupInfoLst[itr].ColorCode);
        }
        _OneViewPlotChartComponent["WidgetUtilitiesConfig"] = null;
        var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
        if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
            var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
            if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                _OneViewPlotChartComponent["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
        }
        _OneViewPlotChartComponent["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
        _OneViewPlotChartComponent["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
        _OneViewPlotChartComponent["SummaryInfoLst"] = CustomAttributeGroupInfoLst;
        _OneViewPlotChartComponent.PlotChart(lineChart);
    }

    var GetParamToLoadData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomAttributeGroupInfoLst"] = CustomAttributeGroupInfoLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }
}

function CustomAttributeGroup_DataComparisonSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var CustomAttributeGroupInfoLst = null;
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        ChartControlId = 'Chart_' + myInstance.ControlId;
        var Html = myInstance.GetChartDiv();
        myInstance.SetHtml(myInstance.ControlId, Html);

        var oCustomAttributeGroupInfoLst = myInstance.CurrentDisplayFormatConfig.CustomAttributeGroupInfoLst;
        var oWidgetDataComparisonConfigLst = myInstance.CurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        var innerhtml = '';
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            if (oCustomAttributeGroupInfoLst != undefined && oCustomAttributeGroupInfoLst != null && oCustomAttributeGroupInfoLst.length > 0) {
                CustomAttributeGroupInfoLst = oCustomAttributeGroupInfoLst;
            }
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            myInstance.PlotChart();
        }
    }

    this.GetChartDiv = function () {
        var Html = '<div id = "' + ChartControlId + '" class = "chart has-legend chartclass"></div>';
        return Html;
    }

    this.SetHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = Html;
            }
        }
    }

    this.PlotChart = function () {
        var barChart = $("#" + ChartControlId);
        var oCustomAttributeGroupDataComparisonSummaryChart = new OneViewPlotChartComponent();
        var ChartType = myInstance.CurrentDisplayFormatConfig.ChartType.toLowerCase();
        ChartType = ChartType != undefined && ChartType != null ? (ChartType + '-stringwise') : '';
        oCustomAttributeGroupDataComparisonSummaryChart.ChartType = ChartType;
        //oCustomAttributeGroupDataComparisonSummaryChart.LodingDivId = myInstance.ControlId;
        oCustomAttributeGroupDataComparisonSummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        oCustomAttributeGroupDataComparisonSummaryChart.BaseFilterParam = GetParamToLoadChartData();
        oCustomAttributeGroupDataComparisonSummaryChart.IsSingleSeries = false;
        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        oCustomAttributeGroupDataComparisonSummaryChart.Url = GetRelativeUrl("/Home/GetCustomAttributeGroupDetailSummay");

        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesCount'] = 0;
        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesType'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['xAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisLegents'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesCount'] = itr + 1;
            oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesType'].push(myInstance.CurrentDisplayFormatConfig.ChartType.toLowerCase());
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oCustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        oCustomAttributeGroupDataComparisonSummaryChart["WidgetUtilitiesConfig"] = null;
        var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
        if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
            var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
            if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                oCustomAttributeGroupDataComparisonSummaryChart["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
        }
        oCustomAttributeGroupDataComparisonSummaryChart["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
        oCustomAttributeGroupDataComparisonSummaryChart["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
        oCustomAttributeGroupDataComparisonSummaryChart["SummaryInfoLst"] = CustomAttributeGroupInfoLst;
        oCustomAttributeGroupDataComparisonSummaryChart["WidgetDataComparisonConfigList"] = WidgetDataComparisonConfigLst;
        oCustomAttributeGroupDataComparisonSummaryChart.PlotChart(barChart);

        barChart.bind("plotclick", function (event, pos, item) {
            if (item) {
                var target = LoadingImage();
                var delay = 1;
                setTimeout(function () {
                    myInstance.LoadDrilDownWidget(oCustomAttributeGroupDataComparisonSummaryChart, item);
                    DisplayFormatLoadFirst = false;
                    RemoveLoadingImage(target);
                    //  $('#myDrilldownDetail').modal('show');
                    $('#myDrilldownDetail').modal('open');
                    if (CustomAttributeGroupInfoLst != undefined && CustomAttributeGroupInfoLst != null && CustomAttributeGroupInfoLst.length > 0) {
                        try {
                            var currentSelectedGroup = CustomAttributeGroupInfoLst[item.dataIndex];
                            if (currentSelectedGroup != null && currentSelectedGroup != undefined)
                                $('#myDrilldownDetailModalHeader').html(currentSelectedGroup.DisplayNamekey);
                        }
                        catch (ex) {
                            $('#myDrilldownDetailModalHeader').html('Drill Down View');
                        }
                    }
                }, delay);
            }
        });
    }

    this.LoadDrilDownWidget = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        DrilDownGridLoad(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
    }

    var DrilDownGridLoad = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var GridDataUrl = GetRelativeUrl("/Home/GetCustomAttributeGroupDrillDownDetail/");
        var GridConfigUrl = GetRelativeUrl("/Home/GetGridConfigForCustomAttributeGroupDrillDownDetail/");
        var param = GetParamToLoadGridData(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
        if (DisplayFormatLoadFirst) {
            LoadGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", null, param);
        }
        else {
            var oTable = $('#datatable_DrilldownDetail').DataTable();
            oTable.fnClearTable(true);
            LoadDcGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", param);
            oTable.fnDestroy(false);
        }
        DrilDownGridInit(GridDataUrl, GridConfigUrl, 'datatable_DrilldownDetail');
    }

    var DrilDownGridInit = function (GridDataUrl, GridConfigUrl, lControlId) {
        var oCustomeAttributeGroupDrillDownGridInit = new CustomeAttributeGroupDrillDownGridInit();
        oCustomeAttributeGroupDrillDownGridInit.GridConfigUrl = GridConfigUrl;
        oCustomeAttributeGroupDrillDownGridInit.GridDataUrl = GridDataUrl;
        oCustomeAttributeGroupDrillDownGridInit.lControlId = lControlId;
        oCustomeAttributeGroupDrillDownGridInit.execute();
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomAttributeGroupInfoLst"] = CustomAttributeGroupInfoLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var GetParamToLoadGridData = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var parameterToLoad = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            parameterToLoad = _LoadControlData.GetParamFromControlConfig();
        }
        if (parameterToLoad == undefined || parameterToLoad == null)
            parameterToLoad = {};
        parameterToLoad = GetDashboardCommonFilterParam(parameterToLoad);
        parameterToLoad["CustomAttributeGroupInfoLst"] = CustomAttributeGroupInfoLst;
        var paramArray = [];
        parameterToLoad['DataIndex'] = chartItem.dataIndex;
        if (CustomAttributeGroupDataComparisonSummaryChart != undefined && CustomAttributeGroupDataComparisonSummaryChart != null &&
            !CustomAttributeGroupDataComparisonSummaryChart.IsXAxisMultiSeries && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != undefined &&
            CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != null && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"].length > 0)
            parameterToLoad['SeriesKey'] = CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"][chartItem.seriesIndex];
        paramArray.push(parameterToLoad);
        paramArray.push(JSON.stringify(parameterToLoad));
        return paramArray;
    }
}

function NCRuleGroupWise_DataComparisonSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var CustomAttributeGroupInfoLst = null;
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var objChart = objFactory.GetChart(myInstance.CurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;

        var oNCRuleInfoLst = myInstance.CurrentDisplayFormatConfig.NCRuleInfoLst;
        var oWidgetDataComparisonConfigLst = myInstance.CurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            if (oNCRuleInfoLst != undefined && oNCRuleInfoLst != null && oNCRuleInfoLst.length > 0) {
                CustomAttributeGroupInfoLst = oNCRuleInfoLst;
            }
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig = myInstance.PlotChart();
            objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
            var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                    objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
            }
            objChart.ChartConfig["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
            objChart.ChartConfig["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
            objChart.ChartConfig["SummaryInfoLst"] = CustomAttributeGroupInfoLst;
            objChart.ChartConfig["WidgetDataComparisonConfigList"] = oWidgetDataComparisonConfigLst;
        }
        objChart.Load();
        //var barChart = $("#" + ChartControlId);
        //barChart.bind("plotclick", function (event, pos, item) {
        //    if (item) {
        //        var target = LoadingImage();
        //        var delay = 1;
        //        setTimeout(function () {
        //            myInstance.LoadDrilDownWidget(oCustomAttributeGroupDataComparisonSummaryChart, item);
        //            DisplayFormatLoadFirst = false;
        //            RemoveLoadingImage(target);
        //            $('#myDrilldownDetail').modal('show');
        //            if (CustomAttributeGroupInfoLst != undefined && CustomAttributeGroupInfoLst != null && CustomAttributeGroupInfoLst.length > 0) {
        //                try {
        //                    var currentSelectedGroup = CustomAttributeGroupInfoLst[item.dataIndex];
        //                    if (currentSelectedGroup != null && currentSelectedGroup != undefined)
        //                        $('#myDrilldownDetailModalHeader').html(currentSelectedGroup.DisplayNamekey);
        //                }
        //                catch (ex) {
        //                    $('#myDrilldownDetailModalHeader').html('Drill Down View');
        //                }
        //            }
        //        }, delay);
        //    }
        //});
    }

    this.PlotChart = function () {
        var oCustomAttributeGroupDataComparisonSummaryChart = {};
        oCustomAttributeGroupDataComparisonSummaryChart["ChartType"] = '';
        oCustomAttributeGroupDataComparisonSummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        if (myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
            oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        else
            oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oCustomAttributeGroupDataComparisonSummaryChart["IsSingleSeries"] = false;
        oCustomAttributeGroupDataComparisonSummaryChart["xAxisDimension"] = "NCRuleGroupSeries";
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"] = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        oCustomAttributeGroupDataComparisonSummaryChart["Url"] = GetRelativeUrl("/Home/GetNCRuleWiseSummary");

        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesCount'] = 0;
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesType'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['xAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisLegents'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesCount'] = itr + 1;
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        return oCustomAttributeGroupDataComparisonSummaryChart;
    }

    this.LoadDrilDownWidget = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        DrilDownGridLoad(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
    }

    var DrilDownGridLoad = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var GridDataUrl = GetRelativeUrl("/Home/GetCustomAttributeGroupDrillDownDetail/");
        var GridConfigUrl = GetRelativeUrl("/Home/GetGridConfigForCustomAttributeGroupDrillDownDetail/");
        var param = GetParamToLoadGridData(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
        if (DisplayFormatLoadFirst) {
            LoadGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", null, param);
        }
        else {
            var oTable = $('#datatable_DrilldownDetail').DataTable();
            oTable.fnClearTable(true);
            LoadDcGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", param);
            oTable.fnDestroy(false);
        }
        DrilDownGridInit(GridDataUrl, GridConfigUrl, 'datatable_DrilldownDetail');
    }

    var DrilDownGridInit = function (GridDataUrl, GridConfigUrl, lControlId) {
        var oCustomeAttributeGroupDrillDownGridInit = new CustomeAttributeGroupDrillDownGridInit();
        oCustomeAttributeGroupDrillDownGridInit.GridConfigUrl = GridConfigUrl;
        oCustomeAttributeGroupDrillDownGridInit.GridDataUrl = GridDataUrl;
        oCustomeAttributeGroupDrillDownGridInit.lControlId = lControlId;
        oCustomeAttributeGroupDrillDownGridInit.execute();
    }

    var GetParamToLoadChartDataCommon = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["NCRuleInfoLst"] = CustomAttributeGroupInfoLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["NCRuleInfoLst"] = CustomAttributeGroupInfoLst;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }

    var GetParamToLoadGridData = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var parameterToLoad = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            parameterToLoad = _LoadControlData.GetParamFromControlConfig();
        }
        if (parameterToLoad == undefined || parameterToLoad == null)
            parameterToLoad = {};
        parameterToLoad = GetDashboardCommonFilterParam(parameterToLoad);
        parameterToLoad["NCRuleInfoLst"] = CustomAttributeGroupInfoLst;
        var paramArray = [];
        parameterToLoad['DataIndex'] = chartItem.dataIndex;
        if (CustomAttributeGroupDataComparisonSummaryChart != undefined && CustomAttributeGroupDataComparisonSummaryChart != null &&
            !CustomAttributeGroupDataComparisonSummaryChart.IsXAxisMultiSeries && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != undefined &&
            CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != null && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"].length > 0)
            parameterToLoad['SeriesKey'] = CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"][chartItem.seriesIndex];
        paramArray.push(parameterToLoad);
        paramArray.push(JSON.stringify(parameterToLoad));
        return paramArray;
    }
}

function AttributeWise_DataComparisonSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var CustomAttributeGroupInfoLst = null;
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var lCurrentDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        var objChart = objFactory.GetChart(myInstance.CurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;

        var oAttributeSummaryInfoLst = myInstance.CurrentDisplayFormatConfig.AttributeSummaryInfoLst;
        var oWidgetDataComparisonConfigLst = myInstance.CurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            if (oAttributeSummaryInfoLst != undefined && oAttributeSummaryInfoLst != null && oAttributeSummaryInfoLst.length > 0) {
                CustomAttributeGroupInfoLst = oAttributeSummaryInfoLst;
            }
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig = myInstance.PlotChart();
            objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
            var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                    objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
            }
            objChart.ChartConfig["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
            objChart.ChartConfig["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
            objChart.ChartConfig["SummaryInfoLst"] = oAttributeSummaryInfoLst;
            objChart.ChartConfig["WidgetDataComparisonConfigList"] = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig["ColorInfoDct"] = myInstance.CurrentDisplayFormatConfig.ColorInfoDct;
        }
        objChart.Load();

        if ((myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" || myInstance.CurrentDisplayFormatConfig.ChartType == "ListViewBox" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie") && lCurrentDisplayFormatConfig.DrillDownEnableStatus != undefined && lCurrentDisplayFormatConfig.DrillDownEnableStatus != null) {
            var _GetDrilDownDetails = new GetDrilDownDetails();
            _GetDrilDownDetails.CustomGroupInfoLst = oAttributeSummaryInfoLst;
            _GetDrilDownDetails.CurrentDisplayFormatConfig = lCurrentDisplayFormatConfig;
            _GetDrilDownDetails.DrillDownDisplayFormatConfig = lCurrentDisplayFormatConfig.DrillDownDisplayFormatConfig;

            if (myInstance.FilterParamControlConfig != null && DashboardCommonFilterparamConfig != null) {

                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                _GetDrilDownDetails.DashboardCommonFilterparamConfig = DashboardCommonFilterparamConfig;

            }
            else if (myInstance.FilterParamControlConfig != null)
                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
            else
                _GetDrilDownDetails.FilterParamControlConfig = DashboardCommonFilterparamConfig;
            _GetDrilDownDetails.ChartConfig = objChart.ChartConfig;
            _GetDrilDownDetails.DisplayFrameId = "DrillDownViewContent";
            $('#Chart_' + myInstance.ControlId).bind("plotclick", _GetDrilDownDetails.ClickEvent);
        }
    }

    this.PlotChart = function () {
        var oCustomAttributeGroupDataComparisonSummaryChart = {};
        oCustomAttributeGroupDataComparisonSummaryChart["ChartType"] = '';
        oCustomAttributeGroupDataComparisonSummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        //oCustomAttributeGroupDataComparisonSummaryChart["LodingDivId"] = ('Chart_' + myInstance.ControlId);
        if (myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
            oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        else
            oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        //if (myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
        //    oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        //else
        //    oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oCustomAttributeGroupDataComparisonSummaryChart["IsSingleSeries"] = false;
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"] = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        if (myInstance.CurrentDisplayFormatConfig.ServiceKeyName != undefined && myInstance.CurrentDisplayFormatConfig.ServiceKeyName != null)
            oCustomAttributeGroupDataComparisonSummaryChart["Url"] = GetRelativeUrl(myInstance.CurrentDisplayFormatConfig.ServiceKeyName);
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null)
            oCustomAttributeGroupDataComparisonSummaryChart["Url"] = GetRelativeUrl(myInstance.CurrentDisplayFormatConfig.DataSourceConfig.ServiceKeyName);

        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesCount'] = 0;
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesType'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['xAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisLegents'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesCount'] = itr + 1;
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        return oCustomAttributeGroupDataComparisonSummaryChart;
    }

    this.LoadDrilDownWidget = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        DrilDownGridLoad(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
    }

    var DrilDownGridLoad = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var GridDataUrl = GetRelativeUrl("/Home/GetCustomAttributeGroupDrillDownDetail/");
        var GridConfigUrl = GetRelativeUrl("/Home/GetGridConfigForCustomAttributeGroupDrillDownDetail/");
        var param = GetParamToLoadGridData(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
        if (DisplayFormatLoadFirst) {
            LoadGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", null, param);
        }
        else {
            var oTable = $('#datatable_DrilldownDetail').DataTable();
            oTable.fnClearTable(true);
            LoadDcGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", param);
            oTable.fnDestroy(false);
        }
        DrilDownGridInit(GridDataUrl, GridConfigUrl, 'datatable_DrilldownDetail');
    }

    var DrilDownGridInit = function (GridDataUrl, GridConfigUrl, lControlId) {
        var oCustomeAttributeGroupDrillDownGridInit = new CustomeAttributeGroupDrillDownGridInit();
        oCustomeAttributeGroupDrillDownGridInit.GridConfigUrl = GridConfigUrl;
        oCustomeAttributeGroupDrillDownGridInit.GridDataUrl = GridDataUrl;
        oCustomeAttributeGroupDrillDownGridInit.lControlId = lControlId;
        oCustomeAttributeGroupDrillDownGridInit.execute();
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined) {
            param["PageSize"] = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.PageSize;
            param["OrderBy"] = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.OrderBy;
        }
        param["WidgetDataComparisonConfigLst"] = WidgetDataComparisonConfigLst;
        param["CustomGroupInfoLst"] = CustomAttributeGroupInfoLst;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }

    var GetParamToLoadChartDataCommon = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomGroupInfoLst"] = CustomAttributeGroupInfoLst;
        param["WidgetDataComparisonConfigLst"] = WidgetDataComparisonConfigLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var GetParamToLoadGridData = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var parameterToLoad = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            parameterToLoad = _LoadControlData.GetParamFromControlConfig();
        }
        if (parameterToLoad == undefined || parameterToLoad == null)
            parameterToLoad = {};
        parameterToLoad = GetDashboardCommonFilterParam(parameterToLoad);
        parameterToLoad["AttributeSummaryInfoLst"] = CustomAttributeGroupInfoLst;
        var paramArray = [];
        parameterToLoad['DataIndex'] = chartItem.dataIndex;
        if (CustomAttributeGroupDataComparisonSummaryChart != undefined && CustomAttributeGroupDataComparisonSummaryChart != null &&
            !CustomAttributeGroupDataComparisonSummaryChart.IsXAxisMultiSeries && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != undefined &&
            CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != null && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"].length > 0)
            parameterToLoad['SeriesKey'] = CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"][chartItem.seriesIndex];
        paramArray.push(parameterToLoad);
        paramArray.push(JSON.stringify(parameterToLoad));
        return paramArray;
    }
}

function TemplateWise_DataComparisonSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var objChart = objFactory.GetChart(myInstance.CurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;

        var oWidgetDataComparisonConfigLst = myInstance.CurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig = myInstance.PlotChart();
            objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
            var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                    objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
            }
        }
        objChart.Load();
    }

    this.PlotChart = function () {
        var oCustomAttributeGroupDataComparisonSummaryChart = {};
        oCustomAttributeGroupDataComparisonSummaryChart["ChartType"] = '';
        oCustomAttributeGroupDataComparisonSummaryChart["LodingDivId"] = ('Chart_' + myInstance.ControlId);
        oCustomAttributeGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oCustomAttributeGroupDataComparisonSummaryChart["IsSingleSeries"] = false;
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"] = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        oCustomAttributeGroupDataComparisonSummaryChart["Url"] = GetRelativeUrl("/Home/GetTemplateWiseDataComparison");

        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesCount'] = 0;
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesType'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['xAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisValueKey'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisLegents'] = [];
        oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['SeriesCount'] = itr + 1;
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oCustomAttributeGroupDataComparisonSummaryChart["MultiSeriesConfig"]['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        return oCustomAttributeGroupDataComparisonSummaryChart;
    }

    this.LoadDrilDownWidget = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        DrilDownGridLoad(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
    }

    var DrilDownGridLoad = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var GridDataUrl = GetRelativeUrl("/Home/GetCustomAttributeGroupDrillDownDetail/");
        var GridConfigUrl = GetRelativeUrl("/Home/GetGridConfigForCustomAttributeGroupDrillDownDetail/");
        var param = GetParamToLoadGridData(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
        if (DisplayFormatLoadFirst) {
            LoadGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", null, param);
        }
        else {
            var oTable = $('#datatable_DrilldownDetail').DataTable();
            oTable.fnClearTable(true);
            LoadDcGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", param);
            oTable.fnDestroy(false);
        }
        DrilDownGridInit(GridDataUrl, GridConfigUrl, 'datatable_DrilldownDetail');
    }

    var DrilDownGridInit = function (GridDataUrl, GridConfigUrl, lControlId) {
        var oCustomeAttributeGroupDrillDownGridInit = new CustomeAttributeGroupDrillDownGridInit();
        oCustomeAttributeGroupDrillDownGridInit.GridConfigUrl = GridConfigUrl;
        oCustomeAttributeGroupDrillDownGridInit.GridDataUrl = GridDataUrl;
        oCustomeAttributeGroupDrillDownGridInit.lControlId = lControlId;
        oCustomeAttributeGroupDrillDownGridInit.execute();
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }

    var GetParamToLoadGridData = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var parameterToLoad = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            parameterToLoad = _LoadControlData.GetParamFromControlConfig();
        }
        if (parameterToLoad == undefined || parameterToLoad == null)
            parameterToLoad = {};
        parameterToLoad = GetDashboardCommonFilterParam(parameterToLoad);
        var paramArray = [];
        parameterToLoad['DataIndex'] = chartItem.dataIndex;
        if (CustomAttributeGroupDataComparisonSummaryChart != undefined && CustomAttributeGroupDataComparisonSummaryChart != null &&
            !CustomAttributeGroupDataComparisonSummaryChart.IsXAxisMultiSeries && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != undefined &&
            CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != null && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"].length > 0)
            parameterToLoad['SeriesKey'] = CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"][chartItem.seriesIndex];
        paramArray.push(parameterToLoad);
        paramArray.push(JSON.stringify(parameterToLoad));
        return paramArray;
    }
}

function CustomTemplateGroup_DataComparisonSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var CustomTemplateGroupInfoLst = null;
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var lCurrentDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        var objChart = objFactory.GetChart(myInstance.CurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;
        ChartControlId = 'Chart_' + myInstance.ControlId;

        var oCustomTemplateGroupInfoLst = myInstance.CurrentDisplayFormatConfig.CustomTemplateGroupInfoLst;
        var oWidgetDataComparisonConfigLst = myInstance.CurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            if (oCustomTemplateGroupInfoLst != undefined && oCustomTemplateGroupInfoLst != null && oCustomTemplateGroupInfoLst.length > 0) {
                CustomTemplateGroupInfoLst = oCustomTemplateGroupInfoLst;
            }
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig = myInstance.PlotChart();
            objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
            var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                    objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
            }
            objChart.ChartConfig["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
            objChart.ChartConfig["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
            objChart.ChartConfig["SummaryInfoLst"] = CustomTemplateGroupInfoLst;
            objChart.ChartConfig["WidgetDataComparisonConfigList"] = oWidgetDataComparisonConfigLst;
        }
        objChart.Load();

        if ((myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
           myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
           myInstance.CurrentDisplayFormatConfig.ChartType == "Pie") && lCurrentDisplayFormatConfig.DrillDownEnableStatus != undefined && lCurrentDisplayFormatConfig.DrillDownEnableStatus != null) {
            var _GetDrilDownDetails = new GetDrilDownDetails();
            _GetDrilDownDetails.CustomGroupInfoLst = CustomTemplateGroupInfoLst;
            _GetDrilDownDetails.CurrentDisplayFormatConfig = lCurrentDisplayFormatConfig;
            _GetDrilDownDetails.DrillDownDisplayFormatConfig = lCurrentDisplayFormatConfig.DrillDownDisplayFormatConfig;

          
            if (myInstance.FilterParamControlConfig != null && DashboardCommonFilterparamConfig != null)
            {

                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                _GetDrilDownDetails.DashboardCommonFilterparamConfig = DashboardCommonFilterparamConfig;
                
            }
            else if (myInstance.FilterParamControlConfig != null)
                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
            else
                _GetDrilDownDetails.FilterParamControlConfig = DashboardCommonFilterparamConfig;
            _GetDrilDownDetails.ChartConfig = objChart.ChartConfig;
            _GetDrilDownDetails.DisplayFrameId = "DrillDownViewContent";
            $('#Chart_' + myInstance.ControlId).bind("plotclick", _GetDrilDownDetails.ClickEvent);
        }
    }

    this.PlotChart = function () {
        var oCustomTemplateGroupDataComparisonSummaryChart = new OneViewPlotChartComponent();
        oCustomTemplateGroupDataComparisonSummaryChart.ChartType = '';
        //oCustomTemplateGroupDataComparisonSummaryChart["LodingDivId"] = ('Chart_' + myInstance.ControlId);
        oCustomTemplateGroupDataComparisonSummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        if (myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
            oCustomTemplateGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        else
            oCustomTemplateGroupDataComparisonSummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oCustomTemplateGroupDataComparisonSummaryChart.IsSingleSeries = false;
        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        oCustomTemplateGroupDataComparisonSummaryChart.Url = GetRelativeUrl("/Home/GetCustomTemplateGroupWiseDataComparison");

        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesCount'] = 0;
        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesType'] = [];
        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['xAxisValueKey'] = [];
        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisValueKey'] = [];
        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisLegents'] = [];
        oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesCount'] = itr + 1;
            oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['SeriesType'].push(myInstance.CurrentDisplayFormatConfig.ChartType.toLowerCase());
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oCustomTemplateGroupDataComparisonSummaryChart.MultiSeriesConfig['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        return oCustomTemplateGroupDataComparisonSummaryChart;
    }

    this.LoadDrilDownWidget = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        DrilDownGridLoad(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
    }

    var DrilDownGridLoad = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var GridDataUrl = GetRelativeUrl("/Home/GetCustomAttributeGroupDrillDownDetail/");
        var GridConfigUrl = GetRelativeUrl("/Home/GetGridConfigForCustomAttributeGroupDrillDownDetail/");
        var param = GetParamToLoadGridData(CustomAttributeGroupDataComparisonSummaryChart, chartItem);
        if (DisplayFormatLoadFirst) {
            LoadGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", null, param);
        }
        else {
            var oTable = $('#datatable_DrilldownDetail').DataTable();
            oTable.fnClearTable(true);
            LoadDcGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", param);
            oTable.fnDestroy(false);
        }
        DrilDownGridInit(GridDataUrl, GridConfigUrl, 'datatable_DrilldownDetail');
    }

    var DrilDownGridInit = function (GridDataUrl, GridConfigUrl, lControlId) {
        var oCustomeAttributeGroupDrillDownGridInit = new CustomeAttributeGroupDrillDownGridInit();
        oCustomeAttributeGroupDrillDownGridInit.GridConfigUrl = GridConfigUrl;
        oCustomeAttributeGroupDrillDownGridInit.GridDataUrl = GridDataUrl;
        oCustomeAttributeGroupDrillDownGridInit.lControlId = lControlId;
        oCustomeAttributeGroupDrillDownGridInit.execute();
    }

    var GetParamToLoadChartDataCommon = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomTemplateGroupInfoLst"] = CustomTemplateGroupInfoLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomTemplateGroupInfoLst"] = CustomTemplateGroupInfoLst;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }

    var GetParamToLoadGridData = function (CustomAttributeGroupDataComparisonSummaryChart, chartItem) {
        var parameterToLoad = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            parameterToLoad = _LoadControlData.GetParamFromControlConfig();
        }
        if (parameterToLoad == undefined || parameterToLoad == null)
            parameterToLoad = {};
        parameterToLoad = GetDashboardCommonFilterParam(parameterToLoad);
        parameterToLoad["CustomTemplateGroupInfoLst"] = CustomTemplateGroupInfoLst;
        var paramArray = [];
        parameterToLoad['DataIndex'] = chartItem.dataIndex;
        if (CustomAttributeGroupDataComparisonSummaryChart != undefined && CustomAttributeGroupDataComparisonSummaryChart != null &&
            !CustomAttributeGroupDataComparisonSummaryChart.IsXAxisMultiSeries && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != undefined &&
            CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"] != null && CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"].length > 0)
            parameterToLoad['SeriesKey'] = CustomAttributeGroupDataComparisonSummaryChart.MultiSeriesConfig["yAxisValueKey"][chartItem.seriesIndex];
        paramArray.push(parameterToLoad);
        paramArray.push(JSON.stringify(parameterToLoad));
        return paramArray;
    }
}

function NCRuleGroup_DateWiseComparisonSummary_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var NCRuleGroupInfoLst = null;
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var lCurrentDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        var objChart = objFactory.GetChart(lCurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;

        var oNCRuleInfoLst = lCurrentDisplayFormatConfig.NCRuleInfoLst;
        var oWidgetDataComparisonConfigLst = lCurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            if (oNCRuleInfoLst != undefined && oNCRuleInfoLst != null && oNCRuleInfoLst.length > 0) {
                NCRuleGroupInfoLst = oNCRuleInfoLst;
            }
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig = myInstance.PlotChart();
            objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
            var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                    objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
            }
            objChart.ChartConfig["CurrentDisplayFormatConfig"] = lCurrentDisplayFormatConfig;
            objChart.ChartConfig["WidgetDataComparisonConfigList"] = oWidgetDataComparisonConfigLst;
        }
        objChart.Load();

        if (lCurrentDisplayFormatConfig.DrillDownEnableStatus != undefined && lCurrentDisplayFormatConfig.DrillDownEnableStatus != null) {
            var _GetDrilDownDetails = new GetDrilDownDetails();
            _GetDrilDownDetails.CustomGroupInfoLst = NCRuleGroupInfoLst;
            _GetDrilDownDetails.CurrentDisplayFormatConfig = lCurrentDisplayFormatConfig;
            _GetDrilDownDetails.DrillDownDisplayFormatConfig = lCurrentDisplayFormatConfig.DrillDownDisplayFormatConfig;
            if (myInstance.FilterParamControlConfig != null && DashboardCommonFilterparamConfig != null) {

                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                _GetDrilDownDetails.DashboardCommonFilterparamConfig = DashboardCommonFilterparamConfig;

            }
            else if (myInstance.FilterParamControlConfig != null)
                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
            else
                _GetDrilDownDetails.FilterParamControlConfig = DashboardCommonFilterparamConfig;
            _GetDrilDownDetails.ChartConfig = objChart.ChartConfig;
            _GetDrilDownDetails.DisplayFrameId = "DrillDownViewContent";
            $('#Chart_' + myInstance.ControlId).bind("plotclick", _GetDrilDownDetails.ClickEvent);
        }
        //if (lCurrentDisplayFormatConfig.IsDetailViewEnabled != undefined && lCurrentDisplayFormatConfig.IsDetailViewEnabled != null &&
        //    lCurrentDisplayFormatConfig.IsDetailViewEnabled) {
        //    if (lCurrentDisplayFormatConfig.DetailViewConfig != undefined && lCurrentDisplayFormatConfig.DetailViewConfig != null) {
        //        myInstance.LoadDetailViewPart(lCurrentDisplayFormatConfig.DetailViewConfig);
        //    }
        //}
    }

    this.GetChartDiv = function () {
        var Html = '<div id = "' + ChartControlId + '" class = "chart has-legend chartclass"></div>';
        return Html;
    }

    this.PlotChart = function () {
        var oNCRuleGroupDateWiseDataCompareSummaryChart = {};
        oNCRuleGroupDateWiseDataCompareSummaryChart["ChartType"] = '';
        oNCRuleGroupDateWiseDataCompareSummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        if (myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
            oNCRuleGroupDateWiseDataCompareSummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        else
            oNCRuleGroupDateWiseDataCompareSummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oNCRuleGroupDateWiseDataCompareSummaryChart["IsSingleSeries"] = false;
        oNCRuleGroupDateWiseDataCompareSummaryChart["xAxisDimension"] = "DateSeries";
        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"] = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        oNCRuleGroupDateWiseDataCompareSummaryChart["Url"] = GetRelativeUrl("/Home/GetNCRuleGroupDateWiseSummary");

        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['SeriesCount'] = 0;
        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['SeriesType'] = [];
        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['xAxisValueKey'] = [];
        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['yAxisValueKey'] = [];
        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['yAxisLegents'] = [];
        oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['SeriesCount'] = itr + 1;
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oNCRuleGroupDateWiseDataCompareSummaryChart["MultiSeriesConfig"]['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        return oNCRuleGroupDateWiseDataCompareSummaryChart;
    }

    var GetParamToLoadChartDataCommon = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomGroupInfoLst"] = NCRuleGroupInfoLst;
        param["WidgetDataComparisonConfigLst"] = WidgetDataComparisonConfigLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CustomGroupInfoLst"] = NCRuleGroupInfoLst;
        param["WidgetDataComparisonConfigLst"] = WidgetDataComparisonConfigLst;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }
}

function DCPlaceWiseSummaryDisplay() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var xAxisValue = null;
    var yAxisValue = null;
    var BackgrouudColor = '';
    var SummaryInfoLst = null;
    var WidgetDataComparisonConfigLst = null;
    var DisplayFormatLoadFirst = true;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var lCurrentDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        var objChart = objFactory.GetChart(lCurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;
        objChart.DashboardCommonFilter = DashboardCommonFilterparamConfig;

        var oSummaryInfoLst = lCurrentDisplayFormatConfig.SummaryInfoLst;
        var oWidgetDataComparisonConfigLst = lCurrentDisplayFormatConfig.WidgetDataComparisonConfigList;
        if (oWidgetDataComparisonConfigLst != undefined && oWidgetDataComparisonConfigLst != null && oWidgetDataComparisonConfigLst.length > 0) {
            if (oSummaryInfoLst != undefined && oSummaryInfoLst != null && oSummaryInfoLst.length > 0) {
                SummaryInfoLst = oSummaryInfoLst;
            }
            WidgetDataComparisonConfigLst = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig = myInstance.PlotChart();
            objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
            var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                    objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
            }
            objChart.ChartConfig["CurrentDisplayFormatConfig"] = lCurrentDisplayFormatConfig;
            objChart.ChartConfig["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
            if (oSummaryInfoLst != null && oSummaryInfoLst != undefined && oSummaryInfoLst.length > 0) {
                var oSummaryInfo = oSummaryInfoLst[0];
                if (oSummaryInfo.Type == "DCPlaceWiseSummaryInfo")
                    objChart.ChartConfig["xAxisDimension"] = "DCPlace";
            }
            objChart.ChartConfig["SummaryInfoLst"] = oSummaryInfoLst;
            objChart.ChartConfig["WidgetDataComparisonConfigList"] = oWidgetDataComparisonConfigLst;
            objChart.ChartConfig["ColorInfoDct"] = myInstance.CurrentDisplayFormatConfig.ColorInfoDct;
        }
        objChart.Load();

        if ((myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie" || myInstance.CurrentDisplayFormatConfig.ChartType == "EasyPie") && lCurrentDisplayFormatConfig.DrillDownEnableStatus != undefined && lCurrentDisplayFormatConfig.DrillDownEnableStatus != null) {
            var _GetDrilDownDetails = new GetDrilDownDetails();
            _GetDrilDownDetails.CustomGroupInfoLst = oSummaryInfoLst;
            _GetDrilDownDetails.CurrentDisplayFormatConfig = lCurrentDisplayFormatConfig;
            _GetDrilDownDetails.DrillDownDisplayFormatConfig = lCurrentDisplayFormatConfig.DrillDownDisplayFormatConfig;

            if (myInstance.FilterParamControlConfig != null && DashboardCommonFilterparamConfig != null) {

                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                _GetDrilDownDetails.DashboardCommonFilterparamConfig = DashboardCommonFilterparamConfig;

            }
            else if (myInstance.FilterParamControlConfig != null)
                _GetDrilDownDetails.FilterParamControlConfig = myInstance.FilterParamControlConfig;
            else
                _GetDrilDownDetails.FilterParamControlConfig = DashboardCommonFilterparamConfig;

            _GetDrilDownDetails.ChartConfig = objChart.ChartConfig;
            _GetDrilDownDetails.DisplayFrameId = "DrillDownViewContent";
            $('#Chart_' + myInstance.ControlId).bind("plotclick", _GetDrilDownDetails.ClickEvent);
        }
    }

    this.GetChartDiv = function () {
        var Html = '<div id = "' + ChartControlId + '" class = "chart has-legend chartclass"></div>';
        return Html;
    }

    this.PlotChart = function () {
        var oDCPlaceWiseSummarySummaryChart = {};
        oDCPlaceWiseSummarySummaryChart["ChartType"] = '';
        //oDCPlaceWiseSummarySummaryChart["LodingDivId"] = myInstance.ControlId;
        oDCPlaceWiseSummarySummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        if (myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
            oDCPlaceWiseSummarySummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        else
            oDCPlaceWiseSummarySummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oDCPlaceWiseSummarySummaryChart["IsSingleSeries"] = myInstance.CurrentDisplayFormatConfig.IsSingleSeriesWidget;
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"] = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null)
            oDCPlaceWiseSummarySummaryChart["Url"] = GetRelativeUrl(myInstance.CurrentDisplayFormatConfig.DataSourceConfig.ServiceKeyName);
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['SeriesCount'] = 0;
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['SeriesType'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['xAxisValueKey'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisValueKey'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisLegents'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['Colors'] = [];
        for (var itr = 0; itr < WidgetDataComparisonConfigLst.length; itr++) {
            oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['SeriesCount'] = itr + 1;
            if (myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr] != null)
                oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.XAxisLabelKeyLst[itr]);
            if (myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != undefined && myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr] != null)
                oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisValueKey'].push(myInstance.CurrentDisplayFormatConfig.YAxisLabelKeyLst[itr]);
            oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(WidgetDataComparisonConfigLst[itr].DisplayNameKey));
            var ColorCss = WidgetDataComparisonConfigLst[itr].ColorCSS;
            oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                WidgetDataComparisonConfigLst[itr].ColorCode);
        }
        return oDCPlaceWiseSummarySummaryChart;
    }

    var GetParamToLoadChartDataCommon = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = getLoadParamFromDataSourceConfig(param);
        param = GetDashboardCommonFilterParam(param);
        param["CustomGroupInfoLst"] = SummaryInfoLst;
        param["WidgetDataComparisonConfigLst"] = WidgetDataComparisonConfigLst;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var getLoadParamFromDataSourceConfig = function (params) {
        if (params == null || params == undefined)
            params = {};
        if (myInstance.CurrentDisplayFormatConfig["DataSourceConfig"] != undefined && myInstance.CurrentDisplayFormatConfig["DataSourceConfig"] != null) {
            if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig.LoadParms != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig.LoadParms != null) {
                for (var param in myInstance.CurrentDisplayFormatConfig.DataSourceConfig.LoadParms) {
                    var paramValue = '';
                    try {
                        paramValue = eval(myInstance.CurrentDisplayFormatConfig.DataSourceConfig.LoadParms[param]);
                    }
                    catch (ex) {
                        console.log('param not correct');
                    }
                    if (paramValue != undefined)
                        params[param] = paramValue;
                }
            }
        }
        return params;
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = getLoadParamFromDataSourceConfig(param);
        param = GetDashboardCommonFilterParam(param);
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined) {
            param["PageSize"] = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.PageSize;
            param["OrderBy"] = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.OrderBy;
        }
        param["CustomGroupInfoLst"] = SummaryInfoLst;
        param["WidgetDataComparisonConfigLst"] = WidgetDataComparisonConfigLst;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }
}

function Generic_MultiSeriesWidget() {
    var myInstance = this;
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    var ChartControlId = '';
    this.ControlId = '';
    this.LoadingDivId = '';

    this.Load = function () {
        var lCurrentDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        var objFactory = new Factory();
        var objChart = objFactory.GetChart(lCurrentDisplayFormatConfig.ChartType);
        objChart.ControlId = myInstance.ControlId;

        objChart.ChartConfig = myInstance.PlotChart();
        objChart.ChartConfig["WidgetUtilitiesConfig"] = null;
        var parentElement = FindParentElement(document.getElementById(myInstance.ControlId), '.widget-body');
        if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
            var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
            if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '')
                objChart.ChartConfig["WidgetUtilitiesConfig"] = JSON.parse(WidgetContentMetaData).WidgetUtilitiesConfigProp;
        }
        objChart.ChartConfig["CurrentDisplayFormatConfig"] = lCurrentDisplayFormatConfig;
        objChart.ChartConfig["FilterParamControlConfig"] = myInstance.FilterParamControlConfig;
        objChart.ChartConfig["IsXAxisValueWiseColorInfo"] = myInstance.CurrentDisplayFormatConfig.IsXAxisValueWiseColorInfo;
        objChart.ChartConfig["AxixValueWiseColorInfoDct"] = myInstance.CurrentDisplayFormatConfig.AxixValueWiseColorInfoDct;
        objChart.ChartConfig["ColorInfoDct"] = myInstance.CurrentDisplayFormatConfig.ColorInfoDct;
        objChart.Load();
    }

    this.GetChartDiv = function () {
        var Html = '<div id = "' + ChartControlId + '" class = "chart has-legend chartclass"></div>';
        return Html;
    }

    this.PlotChart = function () {
        var oDCPlaceWiseSummarySummaryChart = {};
        oDCPlaceWiseSummarySummaryChart["ChartType"] = '';
        oDCPlaceWiseSummarySummaryChart["LodingDivId"] = myInstance.ControlId.replace("widget-body-", "widget-content-");
        if (myInstance.CurrentDisplayFormatConfig.ChartType == "Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Line" || myInstance.CurrentDisplayFormatConfig.ChartType == "Multi-Bar" ||
            myInstance.CurrentDisplayFormatConfig.ChartType == "Pie")
            oDCPlaceWiseSummarySummaryChart["BaseFilterParam"] = GetParamToLoadChartDataCommon();
        else
            oDCPlaceWiseSummarySummaryChart["BaseFilterParam"] = GetParamToLoadChartData();
        oDCPlaceWiseSummarySummaryChart["IsSingleSeries"] = false;
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"] = {
            IsXAxisMultiSeries: false, xAxisLegents: []
        };
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null)
            oDCPlaceWiseSummarySummaryChart["Url"] = GetRelativeUrl(myInstance.CurrentDisplayFormatConfig.DataSourceConfig.ServiceKeyName);
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['SeriesCount'] = 0;
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['SeriesType'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['xAxisValueKey'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisValueKey'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisLegents'] = [];
        oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['Colors'] = [];
        var YAxisConfigLst = myInstance.CurrentDisplayFormatConfig.YAxisConfigLst;
        if (YAxisConfigLst != null && YAxisConfigLst != undefined && YAxisConfigLst.length > 0) {
            for (var itr = 0; itr < YAxisConfigLst.length; itr++) {
                oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['SeriesCount'] = itr + 1;
                oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push("xAxisValue");
                if (YAxisConfigLst[itr].PropertyName != null && YAxisConfigLst[itr].PropertyName != undefined && YAxisConfigLst[itr].PropertyName != '')
                    oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisValueKey'].push(YAxisConfigLst[itr].PropertyName);
                if (YAxisConfigLst[itr].LegendDisplayNameKey != null && YAxisConfigLst[itr].PropertyName != undefined && YAxisConfigLst[itr].LegendDisplayNameKey != '')
                    oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['yAxisLegents'].push(_GetGlobalization.GetGlobalizationValue(YAxisConfigLst[itr].LegendDisplayNameKey));
                var ColorCss = YAxisConfigLst[itr].ColorCSS;
                oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['Colors'].push(ColorCss != undefined && ColorCss != null && ColorCss != '' ? ColorCss :
                    YAxisConfigLst[itr].ColorCode);
            }
        }
        else {
            oDCPlaceWiseSummarySummaryChart["MultiSeriesConfig"]['xAxisValueKey'].push("xAxisValue");
        }
        return oDCPlaceWiseSummarySummaryChart;
    }

    var GetParamToLoadChartDataCommon = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        param["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
        var paramArray = [];
        for (var item in param) {
            paramArray.push({ ControlId: '', ParamName: item, Value: param[item] });
        }
        return paramArray;
    }

    var GetParamToLoadChartData = function () {
        var param = null;
        if (myInstance.FilterParamControlConfig != null && myInstance.FilterParamControlConfig != undefined) {
            var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
            param = _LoadControlData.GetParamFromControlConfig();
        }
        if (param == undefined || param == null)
            param = {};
        param = GetDashboardCommonFilterParam(param);
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined) {
            param["PageSize"] = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.PageSize;
            param["OrderBy"] = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.OrderBy;
        }
        param["CurrentDisplayFormatConfig"] = myInstance.CurrentDisplayFormatConfig;
        param = JSON.stringify({ request: JSON.stringify(param) });
        return param;
    }
}



function GetDrilDownDetails() {
    var myInstance = this;
    this.DrillDownDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    this.DashboardCommonFilterparamConfig = null;
    this.CustomGroupInfoLst = null;
    this.ChartConfig = null;
    this.CurrentDisplayFormatConfig = null;
    this.DisplayFrameId = "";
    var CurrentDrillDownDisplayFormatConfig = null;
    var domelement = null;
    var selectedXAxisName = '';
    var selectedXAxisId = 0;

    this.ClickEvent = function (event, pos, item) {
        if (item) {
            var target = LoadingImage();
            var delay = 1;
            setTimeout(function () {
              //  var table = $('#example2').DataTable();
                //var table =  $('#example2').DataTable({
                //    responsive: true,

                //});
                //table.destroy();
                $('#example2').DataTable().destroy();
                var data = [];
                var DrillDownEnableStatus = myInstance.CurrentDisplayFormatConfig.DrillDownEnableStatus;
                if (DrillDownEnableStatus != undefined && DrillDownEnableStatus != null) {
                    var SummaryTypeName = '';
                    if (myInstance.ChartConfig != undefined && myInstance.ChartConfig != null && !myInstance.ChartConfig.IsXAxisMultiSeries &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != undefined && myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != null &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"].length > 0) {
                        SummaryTypeName = myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"][item.seriesIndex];
                        if (DrillDownEnableStatus[SummaryTypeName] != undefined && DrillDownEnableStatus[SummaryTypeName] != null && DrillDownEnableStatus[SummaryTypeName]
                            && myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null) {
                            CurrentDrillDownDisplayFormatConfig = myInstance.DrillDownDisplayFormatConfig[SummaryTypeName];
                            myInstance.Load(item);
                            //$('#myDrilldownDetailModalHeader').html('');
                            //if (myInstance.CustomGroupInfoLst != undefined && myInstance.CustomGroupInfoLst != null && myInstance.CustomGroupInfoLst.length > 0) {
                            //try {
                            //    if (item.series.xaxis.ticks != undefined && item.series.xaxis.ticks != null) {
                            //        var filterTick = item.series.xaxis.ticks.filter(OneViewArrayFilter("v", item.dataIndex));
                            //        if (filterTick != undefined && filterTick != null && filterTick.length > 0)
                            //            $('#myDrilldownDetailModalHeader').html(filterTick[0].label);
                            //    }
                            //}
                            //catch (ex) {
                            //    $('#myDrilldownDetailModalHeader').html('Drill Down View');
                            //}
                            //}

                            //var oTableSetting = $("#" + CurrentDrillDownDisplayFormatConfig.ControlId).DataTable().fnSettings();
                            //if (oTableSetting.aoData.length != 0) {
                            //    $('#myDrilldownDetail').modal('show');
                            //}
                        }
                    }
                }
               
               

              //  data.push(["1", "1", "1", "1", "1", "1", "1"]);

                $('#example2').DataTable({
                   //data:data,
                    deferRender: true
                });

                 $("#myDrilldownDetail").modal('open');
              //  $('#myDrilldownDetail').show();
                RemoveLoadingImage(target);
            }, delay);
        }
    }

    this.MultiColorBarClickEvent = function (event, pos, item) {
        if (item) {
            var target = LoadingImage();
            var delay = 1;
            setTimeout(function () {
                $('#example2').DataTable().destroy();
                item.dataIndex = item.seriesIndex;
                var DrillDownEnableStatus = myInstance.CurrentDisplayFormatConfig.DrillDownEnableStatus;
                if (DrillDownEnableStatus != undefined && DrillDownEnableStatus != null) {
                    var SummaryTypeName = '';
                    if (myInstance.ChartConfig != undefined && myInstance.ChartConfig != null && !myInstance.ChartConfig.IsXAxisMultiSeries &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != undefined && myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != null &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"].length > 0) {
                        SummaryTypeName = myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"][0];
                        if (DrillDownEnableStatus[SummaryTypeName] != undefined && DrillDownEnableStatus[SummaryTypeName] != null && DrillDownEnableStatus[SummaryTypeName]
                            && myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null) {
                            CurrentDrillDownDisplayFormatConfig = myInstance.DrillDownDisplayFormatConfig[SummaryTypeName];
                            myInstance.Load(item);
                            $('#myDrilldownDetailModalHeader').html('');
                            //if (myInstance.CustomGroupInfoLst != undefined && myInstance.CustomGroupInfoLst != null && myInstance.CustomGroupInfoLst.length > 0) {
                            try {
                                if (item.series.xaxis.ticks != undefined && item.series.xaxis.ticks != null) {
                                    var filterTick = item.series.xaxis.ticks.filter(OneViewArrayFilter("v", item.dataIndex));
                                    if (filterTick != undefined && filterTick != null && filterTick.length > 0)
                                        $('#myDrilldownDetailModalHeader').html(filterTick[0].label);
                                }
                            }
                            catch (ex) {
                                $('#myDrilldownDetailModalHeader').html('Drill Down View');
                            }
                            //}
                            $('#example2').DataTable({
                                //data:data,
                                deferRender: true
                            });

                            //var oTableSetting = $("#" + CurrentDrillDownDisplayFormatConfig.ControlId).DataTable().fnSettings();
                            //if (oTableSetting.aoData.length != 0) {
                            $("#myDrilldownDetail").modal('open');

                               // $('#myDrilldownDetail').show();
                           // }
                        }
                    }
                }
                RemoveLoadingImage(target);
            }, delay);
        }
    }

    this.ClickWithOutParam = function () {
        var target = LoadingImage();
        var delay = 1;
        domelement = this;
        setTimeout(function () {
            $('#example2').DataTable().destroy();
            selectedXAxisName = domelement.getAttribute('xAxisValue');
            if (selectedXAxisName == undefined || selectedXAxisName == null)
                selectedXAxisName = '';
            selectedXAxisId = domelement.getAttribute('xAxisId');
            if (selectedXAxisId == undefined || selectedXAxisId == null)
                selectedXAxisId = 0;
            var DrillDownEnableStatus = myInstance.CurrentDisplayFormatConfig.DrillDownEnableStatus;
            if (DrillDownEnableStatus != undefined && DrillDownEnableStatus != null) {
                /* TODO: For EKFC Release we enabled like this, need to remove. */
                if (selectedXAxisName == "PlannedCount" || selectedXAxisName == "InCompletedCount" || selectedXAxisName == "MissedCount" ||
                    selectedXAxisName == "CompletedCount" || selectedXAxisName == "NPCount") {
                    for (var item in DrillDownEnableStatus) {
                        if (typeof (DrillDownEnableStatus[item]) != 'function' && item == selectedXAxisName) {
                            SummaryTypeName = item;
                            if (DrillDownEnableStatus[SummaryTypeName] != undefined && DrillDownEnableStatus[SummaryTypeName] != null && DrillDownEnableStatus[SummaryTypeName]
                                && myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null) {
                                CurrentDrillDownDisplayFormatConfig = myInstance.DrillDownDisplayFormatConfig[SummaryTypeName];
                                myInstance.Load();
                                $('#myDrilldownDetailModalHeader').html('');
                                //if (myInstance.CustomGroupInfoLst != undefined && myInstance.CustomGroupInfoLst != null && myInstance.CustomGroupInfoLst.length > 0) {
                                try {
                                    if (selectedXAxisName != null && selectedXAxisName != undefined)
                                        $('#myDrilldownDetailModalHeader').html(selectedXAxisName);
                                    else
                                        $('#myDrilldownDetailModalHeader').html('Drill Down View');
                                }
                                catch (ex) {
                                    $('#myDrilldownDetailModalHeader').html('Drill Down View');
                                }
                                //}
                                $('#example2').DataTable({
                                    //data:data,
                                    deferRender: true
                                });

                                //var oTableSetting = $("#" + CurrentDrillDownDisplayFormatConfig.ControlId).DataTable().fnSettings();
                                //if (oTableSetting.aoData.length != 0) {
                                $("#myDrilldownDetail").modal('open');
                                    //$('#myDrilldownDetail').show();
                               // }
                            }
                        }
                    }
                }
                else {
                    var SummaryTypeName = '';
                    if (myInstance.ChartConfig != undefined && myInstance.ChartConfig != null && !myInstance.ChartConfig.IsXAxisMultiSeries &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != undefined && myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != null &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"].length > 0) {
                        for (var item in DrillDownEnableStatus) {
                            if (typeof (DrillDownEnableStatus[item]) != 'function') {
                                SummaryTypeName = item;
                                if (DrillDownEnableStatus[SummaryTypeName] != undefined && DrillDownEnableStatus[SummaryTypeName] != null && DrillDownEnableStatus[SummaryTypeName]
                                    && myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null) {
                                    CurrentDrillDownDisplayFormatConfig = myInstance.DrillDownDisplayFormatConfig[SummaryTypeName];
                                    myInstance.Load();
                                    $('#myDrilldownDetailModalHeader').html('');
                                    //if (myInstance.CustomGroupInfoLst != undefined && myInstance.CustomGroupInfoLst != null && myInstance.CustomGroupInfoLst.length > 0) {
                                    try {
                                        if (selectedXAxisName != null && selectedXAxisName != undefined)
                                            $('#myDrilldownDetailModalHeader').html(selectedXAxisName);
                                        else
                                            $('#myDrilldownDetailModalHeader').html('Drill Down View');
                                    }
                                    catch (ex) {
                                        $('#myDrilldownDetailModalHeader').html('Drill Down View');
                                    }
                                    //}
                                    $('#example2').DataTable({
                                        //data:data,
                                        deferRender: true
                                    });

                                    //var oTableSetting = $("#" + CurrentDrillDownDisplayFormatConfig.ControlId).DataTable().fnSettings();
                                    //if (oTableSetting.aoData.length != 0) {
                                    $("#myDrilldownDetail").modal('open');

                                        //$('#myDrilldownDetail').show();
                                    //}
                                }
                            }
                        }
                    }
                }
            }
            RemoveLoadingImage(target);
        }, delay);
    }

    this.JqueryGaugeClickEvent = function () {
        var target = LoadingImage();
        var delay = 1;
        domelement = this;
        setTimeout(function () {
            $('#example2').DataTable().destroy();
            selectedXAxisName = domelement.getAttribute('xAxisValue');
            if (selectedXAxisName == undefined || selectedXAxisName == null)
                selectedXAxisName = '';
            selectedXAxisId = domelement.getAttribute('xAxisId');
            if (selectedXAxisId == undefined || selectedXAxisId == null)
                selectedXAxisId = 0;
            var DrillDownEnableStatus = myInstance.CurrentDisplayFormatConfig.DrillDownEnableStatus;
            if (DrillDownEnableStatus != undefined && DrillDownEnableStatus != null) {
                var SummaryTypeName = '';
                for (var item in DrillDownEnableStatus) {
                    if (typeof (DrillDownEnableStatus[item]) != 'function') {
                        SummaryTypeName = item;
                        if (DrillDownEnableStatus[SummaryTypeName] != undefined && DrillDownEnableStatus[SummaryTypeName] != null && DrillDownEnableStatus[SummaryTypeName]
                            && myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null) {
                            CurrentDrillDownDisplayFormatConfig = myInstance.DrillDownDisplayFormatConfig[SummaryTypeName];
                            myInstance.Load();
                            $('#myDrilldownDetailModalHeader').html('');
                            //if (myInstance.CustomGroupInfoLst != undefined && myInstance.CustomGroupInfoLst != null && myInstance.CustomGroupInfoLst.length > 0) {
                            try {
                                if (selectedXAxisName != null && selectedXAxisName != undefined)
                                    $('#myDrilldownDetailModalHeader').html(selectedXAxisName);
                                else
                                    $('#myDrilldownDetailModalHeader').html('Drill Down View');
                            }
                            catch (ex) {
                                $('#myDrilldownDetailModalHeader').html('Drill Down View');
                            }
                            //}
                            $('#example2').DataTable({
                                //data:data,
                                deferRender: true
                            });

                            //var oTableSetting = $("#" + CurrentDrillDownDisplayFormatConfig.ControlId).DataTable().fnSettings();
                            //if (oTableSetting.aoData.length != 0) {
                            $("#myDrilldownDetail").modal('open');
                              //  $('#myDrilldownDetail').show();
                          //  }
                        }
                    }
                }
            }
            RemoveLoadingImage(target);
        }, delay);
    }

    this.PiePlotClickEvent = function (event, pos, item) {
        if (item) {
            var target = LoadingImage();
            var delay = 1;
            setTimeout(function () {
                $('#example2').DataTable().destroy();
                var DrillDownEnableStatus = myInstance.CurrentDisplayFormatConfig.DrillDownEnableStatus;
                if (DrillDownEnableStatus != undefined && DrillDownEnableStatus != null) {
                    var SummaryTypeName = '';
                    if (myInstance.ChartConfig != undefined && myInstance.ChartConfig != null && !myInstance.ChartConfig.IsXAxisMultiSeries &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != undefined && myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"] != null &&
                        myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"].length > 0) {
                        if (myInstance.ChartConfig.IsSingleSeries)
                            SummaryTypeName = myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"][item.seriesIndex];
                        else
                            SummaryTypeName = myInstance.ChartConfig.MultiSeriesConfig["yAxisValueKey"][item.dataIndex];
                        if (DrillDownEnableStatus[SummaryTypeName] != undefined && DrillDownEnableStatus[SummaryTypeName] != null && DrillDownEnableStatus[SummaryTypeName]
                            && myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null) {
                            CurrentDrillDownDisplayFormatConfig = myInstance.DrillDownDisplayFormatConfig[SummaryTypeName];
                            myInstance.Load(item);
                            $('#myDrilldownDetailModalHeader').html('');
                            //if (myInstance.CustomGroupInfoLst != undefined && myInstance.CustomGroupInfoLst != null && myInstance.CustomGroupInfoLst.length > 0) {
                                try {
                                    var currentSelectedGroup = item.series.label;
                                    if (currentSelectedGroup != null && currentSelectedGroup != undefined && currentSelectedGroup != '')
                                        $('#myDrilldownDetailModalHeader').html(currentSelectedGroup);
                                    else
                                        $('#myDrilldownDetailModalHeader').html('Drill Down View');
                                }
                                catch (ex) {
                                    $('#myDrilldownDetailModalHeader').html('Drill Down View');
                                }
                            //}

                                $('#example2').DataTable({
                                    //data:data,
                                    deferRender: true
                                });

                            //var oTableSetting = $("#" + CurrentDrillDownDisplayFormatConfig.ControlId).DataTable().fnSettings();
                            //if (oTableSetting.aoData.length != 0) {
                                $("#myDrilldownDetail").modal('open');

                               // $('#myDrilldownDetail').show();
                           // }
                        }
                    }
                }
                RemoveLoadingImage(target);
            }, delay);
        }
    }

    this.Load = function (chartItem) {
        if (myInstance.DrillDownDisplayFormatConfig != undefined && myInstance.DrillDownDisplayFormatConfig != null)
            DrilDownGridLoad(chartItem);
    }

    var DrilDownGridLoad = function (chartItem) {
        var param = GetParamToLoadGridData(chartItem);
        var currentDisplayFormat = CurrentDrillDownDisplayFormatConfig;
        currentDisplayFormat.ControlId = "datatable_DrilldownDetail";

        var _DisplayFormatComponent = new DisplayFormatComponent();
        _DisplayFormatComponent.ClearHtml(myInstance.DisplayFrameId);
        var _DisplayFormatConfigLst = [];
        _DisplayFormatConfigLst.push(currentDisplayFormat);
        if (_DisplayFormatConfigLst != undefined && _DisplayFormatConfigLst != null) {
            _DisplayFormatComponent.lDisplayFormatConfigLst = _DisplayFormatConfigLst;
            _DisplayFormatComponent.DisplayFrameId = "DrillDownViewContent";
            _DisplayFormatComponent.FilterParamControlConfig = myInstance.FilterParamControlConfig;
            _DisplayFormatComponent.ParamToLoadGridData = { request : JSON.stringify(param) };
            _DisplayFormatComponent.Load();
        }

        //var GridDataUrl = GetRelativeUrl("/Home/GetCustomAttributeGroupDrillDownDetail/");
        //var GridConfigUrl = GetRelativeUrl("/Home/GetGridConfigForCustomAttributeGroupDrillDownDetail/");
        //if (DisplayFormatLoadFirst) {
        //    LoadGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", null, param);
        //}
        //else {
        //    var oTable = $('#datatable_DrilldownDetail').DataTable();
        //    oTable.fnClearTable(true);
        //    LoadDcGridData(GridConfigUrl, GridDataUrl, null, "datatable_DrilldownDetail", "", param);
        //    oTable.fnDestroy(false);
        //}
        //DrilDownGridInit(GridDataUrl, GridConfigUrl, 'datatable_DrilldownDetail');
    }

    var GetParamToLoadGridData = function (chartItem) {
        var _ChartConfig = myInstance.ChartConfig;
        var _LoadControlData = new LoadControlData(myInstance.FilterParamControlConfig);
        var parameterToLoad = _LoadControlData.GetParamFromControlConfig();

        if (DashboardCommonFilterparamConfig !=null) {
            var _CommonFilterLoadControlData = new LoadControlData(DashboardCommonFilterparamConfig);
            var CommonFilterparameterToLoad = _CommonFilterLoadControlData.GetParamFromControlConfig();
            for (var key in CommonFilterparameterToLoad) {
                var value = CommonFilterparameterToLoad[key];
                parameterToLoad[key] = CommonFilterparameterToLoad[key]
            }
        }
        if (parameterToLoad == undefined || parameterToLoad == null)
            parameterToLoad = {};
        parameterToLoad["CustomGroupInfoLst"] = myInstance.CustomGroupInfoLst;
        if (chartItem != undefined && chartItem != null) {
            parameterToLoad['DataIndex'] = chartItem.dataIndex;
            if (chartItem.series.xaxis.ticks != undefined && chartItem.series.xaxis.ticks != null) {
                var filterTick = chartItem.series.xaxis.ticks.filter(OneViewArrayFilter("v", chartItem.dataIndex));
                if (filterTick != undefined && filterTick != null && filterTick.length > 0)
                    parameterToLoad["xAxisLableName"] = filterTick[0].label;
            }
            else
                parameterToLoad["xAxisLableName"] = chartItem.series.label;
            if (_ChartConfig != undefined && _ChartConfig != null &&
                !_ChartConfig.IsXAxisMultiSeries && _ChartConfig.MultiSeriesConfig["yAxisValueKey"] != undefined &&
                _ChartConfig.MultiSeriesConfig["yAxisValueKey"] != null && _ChartConfig.MultiSeriesConfig["yAxisValueKey"].length > 0)
                parameterToLoad['SeriesKey'] = _ChartConfig.MultiSeriesConfig["yAxisValueKey"][chartItem.seriesIndex];
            var outputResult = chartItem.series["outputResult"];
            if (outputResult != undefined && outputResult != null && outputResult.length > 0) {
                var odata = outputResult[chartItem.dataIndex];
                if (odata != undefined && odata != null) {
                    selectedXAxisId = odata["xAxisId"];
                }
            }
            parameterToLoad["xAxisLableId"] = selectedXAxisId;
        }
        else {
            parameterToLoad["xAxisLableName"] = selectedXAxisName;
            parameterToLoad["xAxisLableId"] = selectedXAxisId;
        }
        if (myInstance.ChartConfig["xAxisDimension"] != undefined && myInstance.ChartConfig["xAxisDimension"] != null)
            parameterToLoad["xAxisDimension"] = myInstance.ChartConfig["xAxisDimension"];
        var DataSourceConfig = CurrentDrillDownDisplayFormatConfig.DataSourceConfig;
        if (DataSourceConfig != undefined && DataSourceConfig != null && DataSourceConfig.PageSize != undefined && DataSourceConfig.PageSize != null &&
            DataSourceConfig.PageSize > 0 && DataSourceConfig.IsPaginationNeeded) {
            parameterToLoad["PageSize"] = DataSourceConfig.PageSize;
            parameterToLoad["CurrentPage"] = 1;
        }
        return parameterToLoad;
    }
}

function GetDetailViewForWidget() {
    this.ParentControlId = '';
    this.GridControlId = '';
    this.DetailViewConfig = null;
    var myInstance = this;

    this.Load = function (Result) {
        try {
            var Html = GetHtml();

            var control = document.getElementById(myInstance.ParentControlId);
            var parentControl = $(control);
            parentControl.find('.widget-body-toolbar').remove();
            if ($("#" + myInstance.GridControlId) != null && $("#" + myInstance.GridControlId) != undefined && $("#" + myInstance.GridControlId).length > 0) {
                $("#" + myInstance.GridControlId).DataTable().fnDestroy(true);
            }
            var _AppendOrSetHtml = new AppendOrSetHtml();
            _AppendOrSetHtml.ControlId = myInstance.ParentControlId;
            _AppendOrSetHtml.Html = Html;
            _AppendOrSetHtml.AppendToHtml();

            var _GetGridDisplay = new GetGridDisplay();
            _GetGridDisplay.lGridDisplayFormatConfig = GetDetailViewGridColumnConfig(Result);
            _GetGridDisplay.PaginatedEnabled = false;

            Result = NormalizeResult(Result);
            window.localStorage.setItem("DetailViewResult", JSON.stringify(Result));

            _GetGridDisplay.Load();
            _GetGridDisplay.Init();
        }
        catch (ex) {

        }
    }

    var NormalizeResult = function (Result) {
        var finalResult = [];
        var DetailViewObject = {};
        for (var itr = 0; itr < Result.length; itr++) {
            var evaluatedValue = 0;
            var expressionValue = myInstance.DetailViewConfig.ExpressionToEvaluate;
            for (var Key in myInstance.DetailViewConfig.KeysToEvaluate) {
                if (expressionValue.indexOf(myInstance.DetailViewConfig.KeysToEvaluate[Key]) >= 0) {
                    expressionValue = expressionValue.replace(myInstance.DetailViewConfig.KeysToEvaluate[Key], Result[itr].yAxisValue[myInstance.DetailViewConfig.KeysToEvaluate[Key]]);
                }
            }
            try {
                evaluatedValue = eval(expressionValue);
            }
            catch (ex) {
                evaluatedValue = 0;
                console.log("expression wrong : " + expressionValue);
            }
            DetailViewObject['Column_' + Result[itr].xAxisValue] = isNaN(evaluatedValue) ? 0 : (Math.round(evaluatedValue * 100) / 100);
        }
        finalResult.push(DetailViewObject);
        return finalResult;
    }

    var GetDetailViewGridColumnConfig = function (Result) {
        var GridViewConfig = {
            "_t": "GridFormatDisplayConfig",
            "Type": "GridFormatDisplayConfig",
            "ColumnConfigList": [],
            "HeaderName": null,
            "ControlId": myInstance.GridControlId,
            "RowCreatedEventHandler": null,
            "CellCreatedEventHandler": null,
            "IsGroupColumnContain": false,
            "HeaderRowSpan": 0,
            "DataSourceConfig": {
                "_t": "StaticDataSourceConfig",
                "Type": "StaticDataSourceConfig",
                "JavaScriptSessionKey": "DetailViewResult"
            },
            "GridExtraUtilities": "<'dt-wrapper't><'dt-row dt-bottom-row'>",
            "Position": null
        };
        GridViewConfig.ColumnConfigList = [];
        if (Result != undefined && Result != null && Result.length > 0) {
            for (var itr = 0; itr < Result.length; itr++) {
                GridViewConfig.ColumnConfigList.push({
                    "IsGroupColumn": false,
                    "ColumnDisplayName": Result[itr].xAxisValue,
                    "ColumnFieldName": ('Column_' + Result[itr].xAxisValue),
                    "DataDisplayPropertyName": null,
                    "ColumnDisplayExpression": null,
                    "FinalJavaScriptColumnDisplayExpression": "myInstance.GetValueBasedOnPropertyName(RowData, ['Column_" + Result[itr].xAxisValue + "']) + ' %'",
                    "ColumnWidth": "5%",
                    "ColumnType": 0,
                    "IsVisible": true,
                    "IsSortable": false,
                    "IsColumnDefaultVisible": true,
                    "ColumnControlClickEvent": null,
                    "SubColumnConfig": null,
                    "ColumnTypeName": "TextColumn"
                });
            }
        }
        else {
            GridViewConfig.ColumnConfigList.push({
                "IsGroupColumn": false,
                "ColumnDisplayName": "No Columns",
                "ColumnFieldName": "",
                "DataDisplayPropertyName": null,
                "ColumnDisplayExpression": null,
                "FinalJavaScriptColumnDisplayExpression": "",
                "ColumnWidth": "5%",
                "ColumnType": 0,
                "IsVisible": true,
                "IsSortable": false,
                "IsColumnDefaultVisible": true,
                "ColumnControlClickEvent": null,
                "SubColumnConfig": null,
                "ColumnTypeName": "TextColumn"
            });
        }
        return GridViewConfig;
    }

    var GetHtml = function () {
        myInstance.GridControlId = 'DetailView_' + myInstance.ParentControlId;
        var Html = '<div><div class="widget-body-toolbar"></div><table id="' + myInstance.GridControlId + '" class="table" width="100%"></table></div>';
        return Html;
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
            var LoclModel = CurrentReportingComponentConfig.ReportFilterParamConfig;
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
                        ShowMessage("IN-WN-REP-002 :: Report Generating", 3);

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
            window.location.href = GetParentFolderOfApplication() + "/Login/Index";
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
                if(responseObj.IsAnyException)
                    ShowMessage(responseObj.ExceptionMessage, 4);
                else if (responseObj.IsSuccess && responseObj.ExceptionMessage != '')
                    ShowMessage(responseObj.ExceptionMessage, 1);
                else if (responseObj.IsSuccess)
                    ShowMessage("Success.", 1);
                else if (responseObj.constructor == Array && responseObj.length == 4 && responseObj[3]) {
                    ShowMessage("Report Downloaded Successfully.", 1);
                    ajax_download(GetRelativeUrl("/Home/ExportDataCapture/"), { 'param1': JSON.stringify(responseObj) });
                }
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
    //        window.location.href = GetParentFolderOfApplication() + "/Login/Index";
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