var DashboardComponentConfig = null;
var WidgetContentMetaDataLst = null;
var oPageContentFrameId = '';
var oTabHeaderId = '';
var oTabFilterParamId = '';
var oWidgetGroupContentId = '';
var DashboardCommonFiltersCOnfig = null;

function DBCFrameWork() {
    var myInstance = this;
    this.UrlToGetDashboardConfig = '/Home/GetDashBoardConfig';
    this.PageFrameId = '';
    this.TabHeaderId = '';
    this.TabFilterParamId = '';
    this.PageCommonFilterFrameId = '';
    this.PageCommonFilterFrameContentId = '';
    this.WidgetGroupRowId = '';

    this.Load = function () {
        oPageContentFrameId = myInstance.PageFrameId;
        oTabHeaderId = myInstance.TabHeaderId;
        oTabFilterParamId = myInstance.TabFilterParamId;
        oWidgetGroupContentId = myInstance.WidgetGroupRowId;
        /* 1. Using Component Id getting the Dashboard Component Meta Data. */
        if (DashboardComponentConfig == undefined || DashboardComponentConfig == null || DashboardComponentConfig == "")
            DashboardComponentConfig = GetDashboardConfig();
        if (DashboardComponentConfig != undefined && DashboardComponentConfig != null && DashboardComponentConfig != "") {
            myInstance.LoadDashBoardCommonFilter();

            var DashboardTabConfigLst = DashboardComponentConfig.DashboardTabConfigLst;
            /* If ReportingComponentConfig its one then no need to show the tab row. */
            if (DashboardTabConfigLst == null || DashboardTabConfigLst == undefined || (DashboardTabConfigLst != null && DashboardTabConfigLst != undefined && DashboardTabConfigLst.length > 0
                && DashboardTabConfigLst.length == 1)) {
                $("#" + myInstance.TabHeaderId).addClass('hide');
                $("#" + myInstance.PageFrameId).css("top", "0px");
            }
            else
                $("#" + myInstance.TabHeaderId).removeClass('hide');
            if (DashboardTabConfigLst != undefined && DashboardTabConfigLst != null && DashboardTabConfigLst.length > 0) {
                myInstance.CreateDashBoardPageTabHeader();

                var CurrentDashboardTabConfig = DashboardTabConfigLst[0];
                myInstance.CreateDashBoardPageTabContent(CurrentDashboardTabConfig);

                var _WidgetConfig = new WidgetConfig();
                _WidgetConfig.ListOfWidgets = CurrentDashboardTabConfig.WidgetConfigLst;
                _WidgetConfig.TabLayoutConfigDict = CurrentDashboardTabConfig.TabLayoutConfigDict;
                _WidgetConfig.WidgetGroupId = myInstance.WidgetGroupRowId;
              
                _WidgetConfig.Load();
            }
        }
        else {
            ShowMessage('Dashboard component not found!', 4);
        }
    }

    this.LoadDashBoardCommonFilter = function () {
        var CommonFilterParmeterConfig = DashboardComponentConfig.CommonFilterParmeterConfig;
        if (CommonFilterParmeterConfig != undefined && CommonFilterParmeterConfig != null) {
            var oCommonFilterParmeterConfig = new CreateHTMLPage();
            oCommonFilterParmeterConfig.lCurrentPageConfig = CommonFilterParmeterConfig;
            var FrameHtml = oCommonFilterParmeterConfig.Load();
            DashboardCommonFiltersCOnfig = DashboardComponentConfig.CommonFilterParmeterConfig;
            oCommonFilterParmeterConfig.SetHtml(myInstance.PageCommonFilterFrameContentId, FrameHtml);

            oCommonFilterParmeterConfig.Initialize(CommonFilterParmeterConfig.Type);
            $(myInstance.PageCommonFilterFrameId).removeClass('hide');
        }
        else {
            $('#' + myInstance.PageCommonFilterFrameId).addClass('hide');
        }
    }

    this.CreateDashBoardPageTabHeader = function () {
        var _CreateTabHtml = new CreateTabHtml();
        _CreateTabHtml.TabConfigLst = DashboardComponentConfig.DashboardTabConfigLst;
        _CreateTabHtml.WidgetGroupRowId = myInstance.WidgetGroupRowId;
        _CreateTabHtml.CreateHeaderFrameForPage(myInstance.TabHeaderId);
    }
    
    this.CreateDashBoardPageTabContent = function (CurrentDashboardTabConfig) {
        var FrameHtml = '';
        var _CreateHTMLPageFilter = new CreateHTMLPage();
        _CreateHTMLPageFilter.SetHtml(myInstance.TabFilterParamId, FrameHtml);
        if (CurrentDashboardTabConfig.CommonFilterParmeterConfig != null && CurrentDashboardTabConfig.CommonFilterParmeterConfig != undefined) {
            $("#" + myInstance.TabFilterParamId).removeClass("hide");
            _CreateHTMLPageFilter.lCurrentPageConfig = CurrentDashboardTabConfig.CommonFilterParmeterConfig;
            FrameHtml += _CreateHTMLPageFilter.Load();

            _CreateHTMLPageFilter.SetHtml(myInstance.TabFilterParamId, FrameHtml);

            _CreateHTMLPageFilter.Initialize(CurrentDashboardTabConfig.CommonFilterParmeterConfig.Type);
        }
        else
            $("#" + myInstance.TabFilterParamId).addClass("hide");
    }

    var GetDashboardConfig = function () {
        var result = null;
        var _OneViewAjax = new WiNAiMAjax();
        _OneViewAjax.url = myInstance.UrlToGetDashboardConfig;
        _OneViewAjax.webMethod = "post";
        _OneViewAjax.async = false;
        _OneViewAjax.contentType = 'application/json; charset=utf-8';
        _OneViewAjax.dataType = 'json';
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

function WidgetConfig() {
    var myInstance = this;
    this.TabLayoutConfigDict = null;
    this.ListOfWidgets = null;
    var CurrentWidget = null;
    this.WidgetGroupId = '';
    var WidgetContentMetaData = null;
    var WidgetClass = '';

    this.Load = function () {
        var Html = myInstance.GetHtml();
        myInstance.SetHtml(myInstance.WidgetGroupId, Html);

        myInstance.LoadContent();

        if ($("#" + oPageContentFrameId) != null && $("#" + oPageContentFrameId) != undefined && $("#" + oPageContentFrameId).length > 0) {
            $("#" + oPageContentFrameId).niceScroll({ cursorcolor: "#00F", horizrailenabled: false });
            $("#" + oPageContentFrameId).getNiceScroll().resize();
        }
    }

    this.GetHtml = function () {
        var Html = '<div id="widget-grid" class="template">';
        if (myInstance.TabLayoutConfigDict != undefined && myInstance.TabLayoutConfigDict != null) {
            var WidgetStart = 0;
            var WidgetEnd = 0;
            for (var TabLayoutConfig in myInstance.TabLayoutConfigDict) {
                var currentTabLayoutConfig = myInstance.TabLayoutConfigDict[TabLayoutConfig];
                if (currentTabLayoutConfig != undefined && currentTabLayoutConfig != null) {
                    var widgetSize = Math.round(12 / currentTabLayoutConfig.NumberOfColumn);
                    WidgetClass = 'col s' + widgetSize;
                    WidgetStart = WidgetEnd;
                    WidgetEnd = WidgetStart + currentTabLayoutConfig.NumberOfColumn;
                    if (WidgetEnd > myInstance.ListOfWidgets.length)
                        WidgetEnd = myInstance.ListOfWidgets.length;
                    if (WidgetStart != WidgetEnd)
                        Html += '<div class="row responsive-md">';
                    for (var i = WidgetStart; i < WidgetEnd; i++) {
                        if (myInstance.ListOfWidgets[i] != undefined && myInstance.ListOfWidgets[i] != null) {
                            CurrentWidget = myInstance.ListOfWidgets[i];
                            Html += myInstance.GetFrame();
                        }
                    }
                    if (WidgetStart != WidgetEnd)
                        Html += '</div>';
                }
            }
        }
        else {
            Html += '<div class="row">';
            for (var i = 0; i < myInstance.ListOfWidgets.length; i++) {
                WidgetClass = 'col s12';
                CurrentWidget = myInstance.ListOfWidgets[i];
                Html += myInstance.GetFrame();
            }
            Html += '</div>';
        }
        Html += '</div>';
        return Html;
    }

    this.GetFrame = function () {
        var Html = '<article id = "article_' + CurrentWidget.WidgetControlId + '" class="' + WidgetClass + '"><div class="jarviswidget jarviswidget-color-blank"' +
            ' id="' + CurrentWidget.WidgetControlId + '"  data-widget-deletebutton="false" data-widget-colorbutton="false">';

        Html += myInstance.GetHeader();
        Html += myInstance.GetBody();

        Html += '</div></article>';
        return Html;
    }

    this.GetHeader = function () {
        var HeaderHtml = '<header><h2>' + _GetGlobalization.GetGlobalizationValue(CurrentWidget.WidgetHeaderNameKey) + ' </h2></header>';
        return HeaderHtml;
    }

    this.GetBody = function () {
        var WidgetBodyHtml = '<div id="widget-content-' + CurrentWidget.WidgetControlId + '"><div class="jarviswidget-editbox" id = "widget-body-filter-' +
            CurrentWidget.WidgetControlId + '"></div><div class="widget-body no-padding" id="widget-body-' + CurrentWidget.WidgetControlId + '"></div></div>';
        return WidgetBodyHtml;
    }

    this.LoadContent = function () {
        if (WidgetContentMetaDataLst == undefined || WidgetContentMetaDataLst == null || WidgetContentMetaDataLst == "" || WidgetContentMetaDataLst.length == 0)
            WidgetContentMetaDataLst = GetWidgetMasterMetaData();
        if (WidgetContentMetaDataLst != undefined && WidgetContentMetaDataLst != null && WidgetContentMetaDataLst.length > 0) {
            for (var i = 0; i < myInstance.ListOfWidgets.length; i++) {
                CurrentWidget = myInstance.ListOfWidgets[i];
                WidgetContentMetaData = WidgetContentMetaDataLst.filter(OneViewArrayFilter("WidgetId", CurrentWidget.WidgetId));
                if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '' && WidgetContentMetaData.length > 0) {
                    WidgetContentMetaData = WidgetContentMetaData[0];
                    myInstance.ApplyWidgetUtilities();

                   

                    window.localStorage.setItem('DefaultViewDataCount', 0);
                    window.localStorage.setItem('MaximizeViewDataCount', 0);
                    window.localStorage.setItem('IsMaximizeView', false);

                    var oFactory = new Factory();
                    var FilterParamSectionId = 'widget-body-filter-' + CurrentWidget.WidgetControlId;
                    var ContentSectionId = 'widget-body-' + CurrentWidget.WidgetControlId;
                    $('#' + ContentSectionId).attr('WidgetContentMetaData', JSON.stringify(WidgetContentMetaData));
                    loadingPan('widget-content-' + CurrentWidget.WidgetControlId);
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);

                    oGetWidgetContent.FilterParamSectionId = FilterParamSectionId;
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetControlId = CurrentWidget.WidgetControlId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
    }

    this.ApplyWidgetUtilities = function () {
        var oWidgetUtilitiesConfig = WidgetContentMetaData.WidgetUtilitiesConfigProp;
        if (oWidgetUtilitiesConfig != null && oWidgetUtilitiesConfig != undefined) {
            var widgetOption = getWidgetOptions();
            widgetOption.widgets = "#" + CurrentWidget.WidgetControlId;
            if (oWidgetUtilitiesConfig.IsCollapseOptionNeeded != undefined && oWidgetUtilitiesConfig.IsCollapseOptionNeeded != null) {
                widgetOption.toggleButton = oWidgetUtilitiesConfig.IsCollapseOptionNeeded;
                if (oWidgetUtilitiesConfig.CollapseButtonClickEvent != undefined && oWidgetUtilitiesConfig.CollapseButtonClickEvent != null &&
                    oWidgetUtilitiesConfig.CollapseButtonClickEvent != '') {
                    widgetOption.onToggle = window[oWidgetUtilitiesConfig.CollapseButtonClickEvent];
                }
            }
            if (oWidgetUtilitiesConfig.IsExportAvailable != undefined && oWidgetUtilitiesConfig.IsExportAvailable != null) {
                widgetOption.exportButton = oWidgetUtilitiesConfig.IsExportAvailable;
                if (oWidgetUtilitiesConfig.ExportButtonClickEvent != undefined && oWidgetUtilitiesConfig.ExportButtonClickEvent != null &&
                    oWidgetUtilitiesConfig.ExportButtonClickEvent != '') {
                    widgetOption.onExport = window[oWidgetUtilitiesConfig.ExportButtonClickEvent];
                }
            }
            if (oWidgetUtilitiesConfig.IsFilterAvailable != undefined && oWidgetUtilitiesConfig.IsFilterAvailable != null) {
                widgetOption.editButton = oWidgetUtilitiesConfig.IsFilterAvailable;
                if (oWidgetUtilitiesConfig.FilterButtonClickEvent != undefined && oWidgetUtilitiesConfig.FilterButtonClickEvent != null &&
                    oWidgetUtilitiesConfig.FilterButtonClickEvent != '') {
                    widgetOption.onEdit = window[oWidgetUtilitiesConfig.FilterButtonClickEvent];
                }
            }
            if (oWidgetUtilitiesConfig.IsMinimizeMaximizeOptionNeeded != undefined && oWidgetUtilitiesConfig.IsMinimizeMaximizeOptionNeeded != null) {
                widgetOption.fullscreenButton = oWidgetUtilitiesConfig.IsMinimizeMaximizeOptionNeeded;
                if (oWidgetUtilitiesConfig.MinimizeMaximizeButtonClickEvent != undefined && oWidgetUtilitiesConfig.MinimizeMaximizeButtonClickEvent != null &&
                    oWidgetUtilitiesConfig.MinimizeMaximizeButtonClickEvent != '') {
                    widgetOption.onFullscreen = window[oWidgetUtilitiesConfig.MinimizeMaximizeButtonClickEvent];
                }
            }
            myInstance.InitWidgets(widgetOption);
        }
    }

    this.InitWidgets = function (option) {
        $('#article_' + CurrentWidget.WidgetControlId).jarvisWidgets(option);
    }

    var getWidgetOptions = function () {
        return {
            grid: 'article',
            widgets: '.jarviswidget',
            localStorage: true,
            deleteSettingsKey: '#deletesettingskey-options',
            settingsKeyLabel: 'Reset settings?',
            deletePositionKey: '#deletepositionkey-options',
            positionKeyLabel: 'Reset position?',
            sortable: true,
            buttonsHidden: false,
            // toggle button
            toggleButton: true,
            toggleClass: 'mdi mdi-minus | mdi mdi-plus',
            toggleSpeed: 200,
            onToggle: function () {
            },
            // delete btn
            deleteButton: true,
            deleteClass: 'fa fa-times',
            deleteSpeed: 200,
            onDelete: function () {
            },
            // edit btn
            editButton: true,
            editPlaceholder: '.jarviswidget-editbox',
            editClass: 'mdi mdi-filter | mdi mdi-filter',
            editSpeed: 200,
            onEdit: function () {
            },
            // color button
            colorButton: true,
            // full screen
            fullscreenButton: true,
            fullscreenClass: 'mdi mdi-arrow-expand | mdi mdi-arrow-compress',
            fullscreenDiff: 3,
            onFullscreen: function () {
            },
            // custom btn
            customButton: false,
            customClass: 'folder-10 | next-10',
            customStart: function () {
                alert('Hello you, this is a custom button...')
            },
            customEnd: function () {
                alert('bye, till next time...')
            },
            // export btn
            exportButton: false,
            exportClass: 'mdi mdi-send | mdi mdi-send',
            exportSpeed: 200,
            onExport: null,
            // order
            buttonOrder: '%refresh% %export% %custom% %edit% %toggle% %fullscreen% %delete%',
            opacity: 1.0,
            dragHandle: '> header',
            placeholderClass: 'jarviswidget-placeholder',
            indicator: true,
            indicatorTime: 600,
            ajax: true,
            timestampPlaceholder: '.jarviswidget-timestamp',
            timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
            refreshButton: true,
            refreshButtonClass: 'mdi mdi-loading',
            labelError: 'Sorry but there was a error:',
            labelUpdated: 'Last Update:',
            labelRefresh: 'Refresh',
            labelDelete: 'Delete widget:',
            afterLoad: function () {
            },
            rtl: false, // best not to toggle this!
            onChange: function () {

            },
            onSave: function () {

            },
            ajaxnav: $.navAsAjax // declears how the localstorage should be saved
        };
    }

    var GetWidgetMasterMetaData = function () {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl("/Home/GetAllWidgets/");
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = false;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var result = myAjaxobj.execute();
        if (result != undefined && result != null && result != '') {
            try {
                result = result;
                if (typeof (result) == 'object')
                    result = result;
                else
                    result = null;
            }
            catch (ex) {
                result = null;
            }
        }
        else {
            result = null;
        }
        return result;
    }

    this.SetHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null && ControlId != '') {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
                Control.innerHTML = Html;
            }
        }
    }
}

function DefaultWidgetComponent() {
    this.WidgetContentMetaData = null;
    this.FilterParamSectionId = '';
    this.ContentSectionId = '';
    this.WidgetControlId = '';
    var myInstance = this;
    this.Load = function () {
        var _ORCFrameWork = new ORCFrameWork();
        _ORCFrameWork.ReportingComponentMetaData = myInstance.WidgetContentMetaData.OneViewReportingComponent;
        _ORCFrameWork.PageFrameId = myInstance.FilterParamSectionId;
        _ORCFrameWork.DisplayFrameId = myInstance.ContentSectionId;
        _ORCFrameWork.DashboardCommonFilterparam = DashboardCommonFiltersCOnfig;
        _ORCFrameWork.LoadPage();
    }

    this.LoadContent = function () {
        var oReportingComponentConfigLst = myInstance.WidgetContentMetaData.OneViewReportingComponent.ReportingComponentConfigLst;
        if (oReportingComponentConfigLst != undefined && oReportingComponentConfigLst != null && oReportingComponentConfigLst.length > 0) {
            var FrameHtml = '';
            /* From That list we going to order by based on Display Order but we have to get this field name from Meta Data. */
            oReportingComponentConfigLst = oReportingComponentConfigLst.sort(OneViewArraySorting('DisplayOrder', true, function (a) { return a; }));

            var _CreateReportPageFrame = new CreateReportPageFrame();
            _CreateReportPageFrame.ReportingComponentMetaData = myInstance.WidgetContentMetaData.OneViewReportingComponent;
            _CreateReportPageFrame.CurrentReportingComponent = oReportingComponentConfigLst[0];
            _CreateReportPageFrame.ContentFrameHtml(myInstance.ContentSectionId);
        }
    }

    this.SetHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null && ControlId != '') {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
                Control.innerHTML = Html;
            }
        }
    }
}

function CustomWidgetComponent() {
    this.WidgetContentMetaData = null;
    this.FilterParamSectionId = '';
    this.ContentSectionId = '';
    this.WidgetControlId = '';
    var myInstance = this;
    this.Load = function () {
        var Html = myInstance.GetHtml();
        removeLoadingPan('widget-content-' + myInstance.WidgetControlId);
    }

    this.GetHtml = function () {
        var _oWiNAiMAjax = new WiNAiMAjax();
        _oWiNAiMAjax.url = GetRelativeUrl(myInstance.WidgetContentMetaData.URL);
        _oWiNAiMAjax.webMethod = "GET";

        var callBackparm = {
            success: function (response, message) {
                if (message != "") {
                    $("#" + myInstance.ContentSectionId).html(message);
                }
            },
            error: function (sender, Request, textStatus, errorThrown) {
                console.error(errorThrown);
            },
            sender: this
        }

        _oWiNAiMAjax.execute(callBackparm);
    }

    this.SetHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null && ControlId != '') {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                $(Control).html('');
                $(Control).html(Html);
            }
        }
    }
}

/* TODO : As per the discussion with Harshil, Widget maximize code tuneup holded.
    Plan to implement when ever required. As of now there is no much issue performance wise, 
    once if we are facing performance issue then need to implement that code. */
function WidgetFullScreenModeClickEvent(tWidget) {
    var jarviswidget = tWidget.closest('.jarviswidget');
    var jarviswidgetContent = jarviswidget.find('.widget-body');
    if (jarviswidgetContent != undefined && jarviswidgetContent != null && jarviswidgetContent.length > 0) {
        var WidgetContentMetaData = jarviswidgetContent.attr('widgetcontentmetadata');
        if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '') {
            WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
            var FilterParamSectionId = 'widget-body-filter-' + jarviswidget[0].id;
            var ContentSectionId = 'widget-body-' + jarviswidget[0].id;
            loadingPan('widget-content-' + jarviswidget[0].id);

            var widgetUtilitiesConfig = WidgetContentMetaData.WidgetUtilitiesConfigProp;
            if (widgetUtilitiesConfig != undefined && widgetUtilitiesConfig != null) {
                window.localStorage.setItem('DefaultViewDataCount', widgetUtilitiesConfig.DefaultViewDataCount);
                window.localStorage.setItem('MaximizeViewDataCount', widgetUtilitiesConfig.MaximizeViewDataCount);
                if ($('#jarviswidget-fullscreen-mode').length)
                    window.localStorage.setItem('IsMaximizeView', true);
                else
                    window.localStorage.setItem('IsMaximizeView', false);
            }

            var oFactory = new Factory();
            var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
            oGetWidgetContent.FilterParamSectionId = FilterParamSectionId;
            oGetWidgetContent.ContentSectionId = ContentSectionId;
            oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
            oGetWidgetContent.Load();
        }
    }
}

function Flot_BarLineChart_WidgetFullScreen_ClickEvent(tWidget) {
    var jarviswidget = tWidget.closest('.jarviswidget');
    var jarviswidgetContent = jarviswidget.find('.widget-body');
    if (jarviswidgetContent != undefined && jarviswidgetContent != null && jarviswidgetContent.length > 0) {
        var WidgetContentMetaData = jarviswidgetContent.attr('widgetcontentmetadata');
        if (WidgetContentMetaData != undefined && WidgetContentMetaData != null && WidgetContentMetaData != '') {
            WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
            var FilterParamSectionId = 'widget-body-filter-' + jarviswidget[0].id;
            var ContentSectionId = 'widget-body-' + jarviswidget[0].id;
            loadingPan('widget-content-' + jarviswidget[0].id);

            var widgetUtilitiesConfig = WidgetContentMetaData.WidgetUtilitiesConfigProp;
            if (widgetUtilitiesConfig != undefined && widgetUtilitiesConfig != null) {
                var chartControl = $("#Chart_" + ContentSectionId);
                if (chartControl != undefined && chartControl != null && chartControl.length > 0) {
                    if (chartControl.data() != undefined && chartControl.data() != null) {
                        var contentPlot = chartControl.data().plot;
                        if (contentPlot != undefined && contentPlot != null) {
                            var dataLength = 0;
                            try {
                                dataLength = contentPlot.getOptions().resultLengh;
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                            contentPlot.getAxes().xaxis.options.min = 0;
                            if ($('#jarviswidget-fullscreen-mode').length) {
                                contentPlot.getAxes().xaxis.options.max = (widgetUtilitiesConfig.MaximizeViewDataCount <= dataLength ? widgetUtilitiesConfig.MaximizeViewDataCount : dataLength);
                            }
                            else
                                contentPlot.getAxes().xaxis.options.max = widgetUtilitiesConfig.DefaultViewDataCount;

                            contentPlot.setupGrid();
                            contentPlot.draw();
                        }
                    }
                }
                removeLoadingPan('widget-content-' + jarviswidget[0].id);
            }
        }
    }
}

function GetDashboardCommonFilterParam(params) {
    if (params == null || params == undefined)
        params = {};
    if (DashboardComponentConfig != null && DashboardComponentConfig != undefined && DashboardComponentConfig.CommonFilterParmeterConfig != null &&
        DashboardComponentConfig.CommonFilterParmeterConfig != undefined) {
        var _LoadControlData = new LoadControlData(DashboardComponentConfig.CommonFilterParmeterConfig);
        var filterparam = _LoadControlData.GetParamFromControlConfig();
        if (params == null || params == undefined || Object.keys(params).length == 0)
            params = filterparam;
        else {
            var keys = Object.keys(filterparam);
            for (var itr = 0; itr < keys.length; itr++) {
                params[keys[itr]] = filterparam[keys[itr]];
            }
        }
    }
    var currentTab = $("#" + oTabHeaderId).find('a.active');
    if (currentTab != null && currentTab != undefined && currentTab.length > 0) {
        var FilteredResult = DashboardComponentConfig.DashboardTabConfigLst.filter(OneViewArrayFilter("ControlId", currentTab[0].id));
        if (FilteredResult != undefined && FilteredResult != null && FilteredResult.length > 0) {
            var CurrentDashboardTabConfig = FilteredResult[0];

            if (CurrentDashboardTabConfig != null && CurrentDashboardTabConfig != undefined && CurrentDashboardTabConfig.CommonFilterParmeterConfig != null && CurrentDashboardTabConfig.CommonFilterParmeterConfig != undefined) {
                var _LoadControlData = new LoadControlData(CurrentDashboardTabConfig.CommonFilterParmeterConfig);
                var filterparam = _LoadControlData.GetParamFromControlConfig();
                if (params == null || params == undefined || Object.keys(params).length == 0)
                    params = filterparam;
                else {
                    var keys = Object.keys(filterparam);
                    for (var itr = 0; itr < keys.length; itr++) {
                        params[keys[itr]] = filterparam[keys[itr]];
                    }
                }
            }
        }
    }
    return params;
}

function LoadDashboardContentByTabCommonFilterParam(ControlConfig) {
    this.execute = function () {
        RemoveMessage();
        var target = LoadingImage();
        var delay = 1;
        currentTab = this;
        setTimeout(function () {
            var DashboardTabConfiglength = 0;
            if (DashboardComponentConfig.DashboardTabConfigLst != null && DashboardComponentConfig.DashboardTabConfigLst != undefined)
                DashboardTabConfiglength = DashboardComponentConfig.DashboardTabConfigLst.length;
            var ControlId = '';
            if (DashboardTabConfiglength > 1) {
                var currentTab = $("#" + oTabHeaderId).find('a.active');
                ControlId = currentTab[0].id;
            }
            var FilteredResult = null;
            if (ControlId != '') {
                FilteredResult = DashboardComponentConfig.DashboardTabConfigLst.filter(OneViewArrayFilter("ControlId", ControlId));
                if (FilteredResult != null && FilteredResult != undefined && FilteredResult.length > 0)
                    FilteredResult = FilteredResult[0];
            }
            else if (DashboardTabConfiglength == 1)
                FilteredResult = DashboardComponentConfig.DashboardTabConfigLst[0];
            if (FilteredResult != undefined && FilteredResult != null) {
                var CurrentDashboardTabConfig = FilteredResult;

                var _WidgetConfig = new WidgetConfig();
                _WidgetConfig.ListOfWidgets = CurrentDashboardTabConfig.WidgetConfigLst;
                _WidgetConfig.TabLayoutConfigDict = CurrentDashboardTabConfig.TabLayoutConfigDict;
                _WidgetConfig.WidgetGroupId = oWidgetGroupContentId;
                _WidgetConfig.Load();
            }
            RemoveLoadingImage(target);
        }, delay);
    }
}



function GridFormatDisplayComponent() {
    var myInstance = this;
    this.ControlId = '';
    this.CurrentDisplayFormatConfig = null;
    this.FilterParamControlConfig = null;
    this.ParamToLoadGridData = null;
    var CurrentPageNo = 1;
    var PageSize = 5;
    var iPageCount = 5;
    var PageStartCount = 1;
    var PageEndCount = PageSize;
    var settings = { _iDisplayStart: 0, _iDisplayLength: PageSize };
    var iCurrentPage = Math.ceil(settings._iDisplayStart / settings._iDisplayLength) + 1;

    this.Load = function () {
        var GridConfig = myInstance.CurrentDisplayFormatConfig;

        var Headerhtml = myInstance.CreateGridColumn(GridConfig.ColumnConfigList);

        //Headerhtml = '<div id="ContentHeader" class="con-right-head"> <nav class="z-depth-0">' +
        //        '<div class="nav-wrapper blue-grey-text text-darken-4">' +
        //            '<table class="responsive-table">' + Headerhtml + '</table></div></nav></div>';

        var RowHtml = myInstance.CreateDataRows(GridConfig.DataSourceConfig, GridConfig.IsAsync);

        //RowHtml = '<div id="ContentDetail" class="con-right-cont" style="top:0px;">' +
        //    '<table id = "' + GridConfig.ControlId + '" class="highlight responsive-table bordered">' + Headerhtml +
        //        '<tbody>' + RowHtml + '</tbody></table></div>';

        RowHtml=  Headerhtml + '<tbody>' + RowHtml + '</tbody>';

        var PaginationBarHtml = GetPaginationBarHtml();
        PaginationBarHtml = '<div id="ContentPagination" class="con-right-footer blue-grey lighten-4">' + PaginationBarHtml + '</div>';

        // return RowHtml + PaginationBarHtml;

        $('#example2').html(RowHtml);
        return RowHtml;
    }

    this.CreateGridColumn = function (ColumnConfigList) {
        MetaData = [];
        rowSpan = 2;
        TotalDc = 0;
        var _GetGridDisplay = new GetGridDisplay();
        _GetGridDisplay.lGridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        var PaginatedEnabled = true;
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null && !myInstance.CurrentDisplayFormatConfig.DataSourceConfig.IsPaginationNeeded)
            PaginatedEnabled = false;
        if (PaginatedEnabled != undefined && PaginatedEnabled != null)
            _GetGridDisplay.PaginatedEnabled = PaginatedEnabled;
        _GetGridDisplay.ParamToLoadGridData = myInstance.ParamToLoadGridData;
        var Html = _GetGridDisplay.CreateGridColumn(ColumnConfigList);
        return Html;
    }

    this.CreateDataRows = function (DataSourceConfig, Async) {
        var _GetGridDisplay = new GetGridDisplay();
        _GetGridDisplay.lGridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null) {
            _GetGridDisplay.IsPaginationNeeded = DataSourceConfig.IsPaginationNeeded;
            if (DataSourceConfig.IsPaginationNeeded)
                PageSize = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.PageSize
        }
        var ParamToLoadGridData = _GetGridDisplay.GetParamToLoadData(DataSourceConfig);
        if (ParamToLoadGridData != undefined && ParamToLoadGridData != null && ParamToLoadGridData["request"] != "") {
            ParamToLoadGridData["request"] = JSON.parse(ParamToLoadGridData["request"]);
            for (var item in myInstance.ParamToLoadGridData) {
                ParamToLoadGridData["request"][item] = myInstance.ParamToLoadGridData[item];
            }
        }
        else
            ParamToLoadGridData = myInstance.ParamToLoadGridData;
        _GetGridDisplay.ParamToLoadGridData = { request: JSON.stringify(ParamToLoadGridData["request"]) };
        var Html = _GetGridDisplay.CreateDataRows(DataSourceConfig, Async);
        return Html;
    }

    var GetPaginationBarHtml = function () {
        var Html = '<div class="left">' + (TotalDc != undefined && TotalDc != null && TotalDc > 0 ?
            ("Showing 1 to " + (TotalDc < PageSize ? TotalDc : PageSize) + " of " + TotalDc + " Records") : "Showing 0 to 0 of 0 Records") + '</div><div id="PageNumberLst" class="right"></div>';
        return Html;
    }

    this.GetParamToLoadData = function (DataSourceConfig) {
        var _GetGridDisplay = new GetGridDisplay();
        _GetGridDisplay.lGridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null) {
            _GetGridDisplay.IsPaginationNeeded = DataSourceConfig.IsPaginationNeeded;
            if (DataSourceConfig.IsPaginationNeeded)
                PageSize = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.PageSize
        }
        _GetGridDisplay.ParamToLoadGridData = myInstance.ParamToLoadGridData;
        var result = _GetGridDisplay.GetParamToLoadData(DataSourceConfig);
        return result;
    }

    this.Init = function () {
        RegisterRowClickEvent(myInstance.CurrentDisplayFormatConfig.ControlId);
        var DataSourceConfig = myInstance.CurrentDisplayFormatConfig.DataSourceConfig;
        if (DataSourceConfig != undefined && DataSourceConfig != null) {
            if (DataSourceConfig.IsPaginationNeeded) {
                PageSize = DataSourceConfig.PageSize
                settings._iDisplayLength = PageSize;
            }
        }
        RegisterPagination(settings);
        UpdatePageInfo(0, 0, "");
    }

    var RegisterRowClickEvent = function (ControlId) {
        var RowCreatedEventHandler = myInstance.CurrentDisplayFormatConfig.RowCreatedEventHandler;
        if (RowCreatedEventHandler != undefined && RowCreatedEventHandler != null && RowCreatedEventHandler.length > 0) {
            var jobEvent = new window[RowCreatedEventHandler[0]]();
            jobEvent.DataSourceConfig = myInstance.CurrentDisplayFormatConfig.DataSourceConfig;
            jobEvent.ControlId = myInstance.CurrentDisplayFormatConfig.ControlId;
            if (jobEvent != undefined && jobEvent != null)
                $("#" + ControlId + " tbody tr").click(jobEvent.execute)
        }
    }

    var RegisterPagination = function (oSets) {
        var loadParameter = myInstance.ParamToLoadGridData;

        var iPageCountHalf = Math.floor(iPageCount / 2);
        var iPages = Math.ceil(TotalDc / PageSize);
        var sList = "";
        var iStartButton, iEndButton, i, iLen;
        var oClasses = "";
        var anButtons, anStatic, nPaginateList, nNode;
        var an = $("#PageNumberLst");
        an.html('');

        /* Pages calculation */
        if (oSets._iDisplayLength === -1) {
            iStartButton = 1;
            iEndButton = 1;
            iCurrentPage = 1;
        }
        else if (iPages < iPageCount) {
            iStartButton = 1;
            iEndButton = iPages;
        }
        else if (iCurrentPage <= iPageCountHalf) {
            iStartButton = 1;
            iEndButton = iPageCount;
        }
        else if (iCurrentPage >= (iPages - iPageCountHalf)) {
            iStartButton = iPages - iPageCount + 1;
            iEndButton = iPages;
        }
        else {
            iStartButton = iCurrentPage - Math.ceil(iPageCount / 2) + 1;
            iEndButton = iStartButton + iPageCount - 1;
        }
        //var oPaging = oSets.oInstance.fnPagingInfo();
        //var oLang = oSets.oLanguage.oPaginate;
        var fnClickHandler = function (currObj, e, action) {
            if (!$(currObj).hasClass("disabled")) {
                var target = LoadingImage();
                setTimeout(function () {
                    if (action.toLowerCase() == "previous")
                        CurrentPageNo = iCurrentPage - 1;
                    else if (action.toLowerCase() == "next")
                        CurrentPageNo = iCurrentPage + 1;
                    else if (action.toLowerCase() == "first") {
                        CurrentPageNo = 1;
                        iEndButton = CurrentPageNo;
                    }
                    else if (action.toLowerCase() == "last") {
                        CurrentPageNo = iPages;
                        iEndButton = iPages;
                    }
                    var oGridControl = new GridControl();
                    var GridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
                    if (GridDisplayFormatConfig != null && GridDisplayFormatConfig != undefined && GridDisplayFormatConfig.DataSourceConfig != null) {
                        var oGetGridDisplay = new GetGridDisplay();
                        oGetGridDisplay.lGridDisplayFormatConfig = GridDisplayFormatConfig;
                        var pramToLoad = loadParameter;
                        if (pramToLoad == null) {
                            pramToLoad = oGetGridDisplay.GetParamToLoadData(GridDisplayFormatConfig.DataSourceConfig);
                            pramToLoad = JSON.parse(pramToLoad["request"]);
                        }
                        pramToLoad["PageSize"] = oSets._iDisplayLength;
                        pramToLoad["CurrentPage"] = CurrentPageNo;
                        pramToLoad["SortColumnName"] = null;
                        //pramToLoad["SortType"] = oSets.aaSorting[0][1] == "asc" ? "OrderBy" : "OrderByDescending";

                        iCurrentPage = CurrentPageNo;
                        UpdateContentDetail(GridDisplayFormatConfig.DataSourceConfig, myInstance.CurrentDisplayFormatConfig.IsAsync, pramToLoad);
                        UpdatePageInfo(iEndButton, iPages, action);
                        $("#" + GridDisplayFormatConfig.ControlId + ' .tooltipped').tooltip({ delay: 50 });
                    }
                    else {
                        $("#ContentDetail").html('');
                    }
                    RemoveLoadingImage(target);
                }, 50);
            }
        };

        /* Loop over each instance of the pager */
        for (i = 0, iLen = an.length ; i < iLen ; i++) {
            nNode = an[i];
            $('li', an[i]).remove();

            $(nNode).append(
                '<ul class="pagination no-margin">' +
                    '<li tabindex="0" class="waves-effect Firstbtn"><a><i class="mdi mdi-chevron-double-left"></i></a></li>' +
                    '<li tabindex="0" class="waves-effect Previousbtn"><a><i class="mdi mdi-chevron-left"></i></a></li>' +
                    //'<li><span></span><li>'+
                    '<li tabindex="0" class="waves-effect Nextbtn"><a><i class="mdi mdi-chevron-right"></i></a></li>' +
                    '<li tabindex="0" class="waves-effect Lastbtn"><a><i class="mdi mdi-chevron-double-right"></i></a></li>' +
                '</ul>'
            );
            var els = $('a', nNode);
            var nFirst = els[0],
                nPrev = els[1],
                nNext = els[2],
                nLast = els[3];

            $(nFirst).bind('click.DT', function (e) {
                nFirst.blur(); // Remove focus outline for mouse users
                fnClickHandler(this, e, "First");
            });
            $(nPrev).bind('click.DT', function (e) {
                nPrev.blur(); // Remove focus outline for mouse users
                fnClickHandler(this, e, "Previous");
            });
            $(nNext).bind('click.DT', function (e) {
                nNext.blur(); // Remove focus outline for mouse users
                fnClickHandler(this, e, "Next");
            });
            $(nLast).bind('click.DT', function (e) {
                nLast.blur(); // Remove focus outline for mouse users
                fnClickHandler(this, e, "Last");
            });

            ///* Build the dynamic list */
            for (var j = iStartButton ; j <= iEndButton ; j++) {
                sClass = (j == iCurrentPage) ? 'class="active"' : '';
                $('<li waves-effect ' + sClass + ' btnIndex = ' + j + '><a href="#">' + j + '</a></li>')
                    .insertBefore($('.Nextbtn,.Lastbtn', an[i])[0])
                    .bind('click', function (e) {
                        var target = LoadingImage();
                        e.preventDefault();
                        //oSets._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oSets._iDisplayLength;
                        CurrentPageNo = $('a', this).text();
                        if (CurrentPageNo != '')
                            CurrentPageNo = parseInt(CurrentPageNo);
                        setTimeout(function () {
                            var oGridControl = new GridControl();
                            var GridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
                            if (GridDisplayFormatConfig != null && GridDisplayFormatConfig != undefined && GridDisplayFormatConfig.DataSourceConfig != null) {
                                var oGetGridDisplay = new GetGridDisplay();
                                oGetGridDisplay.lGridDisplayFormatConfig = GridDisplayFormatConfig;
                                var pramToLoad = loadParameter;
                                if (pramToLoad == null) {
                                    pramToLoad = oGetGridDisplay.GetParamToLoadData(GridDisplayFormatConfig.DataSourceConfig);
                                    pramToLoad = JSON.parse(pramToLoad["request"]);
                                }
                                pramToLoad["PageSize"] = oSets._iDisplayLength;
                                pramToLoad["CurrentPage"] = CurrentPageNo;
                                pramToLoad["SortColumnName"] = null;
                                //pramToLoad["SortType"] = oSets.aaSorting[0][1] == "asc" ? "OrderBy" : "OrderByDescending";

                                iCurrentPage = CurrentPageNo;
                                UpdateContentDetail(GridDisplayFormatConfig.DataSourceConfig, myInstance.CurrentDisplayFormatConfig.IsAsync, pramToLoad);
                                UpdatePageInfo(iEndButton, iPages, "");
                                $("#" + GridDisplayFormatConfig.ControlId + ' .tooltipped').tooltip({ delay: 50 });
                            }
                            else {
                                $("#ContentDetail").html('');
                            }
                            RemoveLoadingImage(target);
                        }, 50);
                    });
            }
        }
    }

    var UpdateContentDetail = function (DataSourceConfig, Async, pramToLoad) {
        var _GetGridDisplay = new GetGridDisplay();
        _GetGridDisplay.lGridDisplayFormatConfig = myInstance.CurrentDisplayFormatConfig;
        if (myInstance.CurrentDisplayFormatConfig.DataSourceConfig != undefined && myInstance.CurrentDisplayFormatConfig.DataSourceConfig != null) {
            _GetGridDisplay.IsPaginationNeeded = DataSourceConfig.IsPaginationNeeded;
            if (DataSourceConfig.IsPaginationNeeded)
                PageSize = myInstance.CurrentDisplayFormatConfig.DataSourceConfig.PageSize
        }
        _GetGridDisplay.ParamToLoadGridData = { request: JSON.stringify(pramToLoad) };
        var Html = _GetGridDisplay.CreateDataRows(DataSourceConfig, Async);
        $("#" + myInstance.CurrentDisplayFormatConfig.ControlId).find("tbody").html('');
        $("#" + myInstance.CurrentDisplayFormatConfig.ControlId).find("tbody").html(Html);
        RegisterRowClickEvent(myInstance.CurrentDisplayFormatConfig.ControlId);
    }

    var UpdatePageInfo = function (iEndButton, iPages, Direction) {
        $("#PageNumberLst li").each(function () {
            $(this).removeClass("active");
        });
        $("#PageNumberLst li[btnIndex = " + CurrentPageNo + "]").addClass("active");
        if (CurrentPageNo == iEndButton) {
            settings._iDisplayStart = CurrentPageNo;
            RegisterPagination(settings);
        }
        else if ((iEndButton - CurrentPageNo) + 1 == iPageCount) {
            settings._iDisplayStart = CurrentPageNo;
            RegisterPagination(settings);
        }
        if (CurrentPageNo == 1 && TotalDc <= PageSize) {
            $("#PageNumberLst li.Nextbtn").addClass("disabled");
            $("#PageNumberLst li.Nextbtn a").addClass("disabled");
            $("#PageNumberLst li.Nextbtn").removeClass("waves-effect");
            $("#PageNumberLst li.Lastbtn").addClass("disabled");
            $("#PageNumberLst li.Lastbtn a").addClass("disabled");
            $("#PageNumberLst li.Lastbtn").removeClass("waves-effect");
            $("#PageNumberLst li.Firstbtn").addClass("disabled");
            $("#PageNumberLst li.Firstbtn a").addClass("disabled");
            $("#PageNumberLst li.Firstbtn").removeClass("waves-effect");
            $("#PageNumberLst li.Previousbtn").addClass("disabled");
            $("#PageNumberLst li.Previousbtn a").addClass("disabled");
            $("#PageNumberLst li.Previousbtn").removeClass("waves-effect");
        }
        else if (CurrentPageNo == iPages) {
            $("#PageNumberLst li.Nextbtn").addClass("disabled");
            $("#PageNumberLst li.Nextbtn a").addClass("disabled");
            $("#PageNumberLst li.Nextbtn").removeClass("waves-effect");
            $("#PageNumberLst li.Lastbtn").addClass("disabled");
            $("#PageNumberLst li.Lastbtn a").addClass("disabled");
            $("#PageNumberLst li.Lastbtn").removeClass("waves-effect");
            $("#PageNumberLst li.Firstbtn").removeClass("disabled");
            $("#PageNumberLst li.Firstbtn a").removeClass("disabled");
            $("#PageNumberLst li.Firstbtn").addClass("waves-effect");
            $("#PageNumberLst li.Previousbtn").removeClass("disabled");
            $("#PageNumberLst li.Previousbtn a").removeClass("disabled");
            $("#PageNumberLst li.Previousbtn").addClass("waves-effect");
        }
        else if (CurrentPageNo == 1) {
            $("#PageNumberLst li.Nextbtn").removeClass("disabled");
            $("#PageNumberLst li.Nextbtn a").removeClass("disabled");
            $("#PageNumberLst li.Nextbtn").addClass("waves-effect");
            $("#PageNumberLst li.Lastbtn").removeClass("disabled");
            $("#PageNumberLst li.Lastbtn a").removeClass("disabled");
            $("#PageNumberLst li.Lastbtn").addClass("waves-effect");
            $("#PageNumberLst li.Firstbtn").addClass("disabled");
            $("#PageNumberLst li.Firstbtn a").addClass("disabled");
            $("#PageNumberLst li.Firstbtn").removeClass("waves-effect");
            $("#PageNumberLst li.Previousbtn").addClass("disabled");
            $("#PageNumberLst li.Previousbtn a").addClass("disabled");
            $("#PageNumberLst li.Previousbtn").removeClass("waves-effect");
        }
        else if (CurrentPageNo < iPages && CurrentPageNo > 1) {
            $("#PageNumberLst li.Nextbtn").removeClass("disabled");
            $("#PageNumberLst li.Nextbtn a").removeClass("disabled");
            $("#PageNumberLst li.Nextbtn").addClass("waves-effect");
            $("#PageNumberLst li.Lastbtn").removeClass("disabled");
            $("#PageNumberLst li.Lastbtn a").removeClass("disabled");
            $("#PageNumberLst li.Lastbtn").addClass("waves-effect");
            $("#PageNumberLst li.Firstbtn").removeClass("disabled");
            $("#PageNumberLst li.Firstbtn a").removeClass("disabled");
            $("#PageNumberLst li.Firstbtn").addClass("waves-effect");
            $("#PageNumberLst li.Previousbtn").removeClass("disabled");
            $("#PageNumberLst li.Previousbtn a").removeClass("disabled");
            $("#PageNumberLst li.Previousbtn").addClass("waves-effect");
        }
        UpdateGridViewFooter(Direction, iPages);
    }

    var UpdateGridViewFooter = function (Direction, iPages) {
        var oGridViewFooter = $("#ContentPagination");
        var oPageEndCount = 0;
        if (oGridViewFooter != undefined && oGridViewFooter != null && oGridViewFooter.length > 0) {
            var oGridPageInfo = oGridViewFooter.find('.left');
            if (oGridPageInfo != undefined && oGridPageInfo != null && oGridPageInfo.length > 0) {
                if (Direction == "Next") {
                    if (CurrentPageNo <= iPages) {
                        PageStartCount = PageEndCount + 1;
                        PageEndCount = PageEndCount + PageSize;
                    }
                    else {
                        CurrentPageNo = iPages;
                    }
                    if (PageEndCount > TotalDc)
                        oPageEndCount = TotalDc;
                    else
                        oPageEndCount = PageEndCount;
                }
                else if (Direction == "Last") {
                    if (CurrentPageNo == iPages) {
                        PageStartCount = ((iPages - 1) * PageSize) + 1;
                        PageEndCount = iPages * PageSize;
                    }
                    if (PageEndCount > TotalDc)
                        oPageEndCount = TotalDc;
                    else
                        oPageEndCount = PageEndCount;
                }
                else if (Direction == "Previous") {
                    if (CurrentPageNo >= 1) {
                        PageStartCount = PageStartCount - PageSize;
                        PageEndCount = PageEndCount - PageSize;
                        oPageEndCount = PageEndCount;
                    }
                    else {
                        oPageEndCount = PageEndCount;
                        CurrentPageNo = 1;
                    }
                }
                else if (Direction == "First") {
                    CurrentPageNo = 1;
                    PageStartCount = 1;
                    PageEndCount = PageSize;
                    oPageEndCount = PageEndCount;
                }
                else {
                    if (TotalDc == 0) {
                        PageStartCount = 0;
                        PageEndCount = 0;
                        oPageEndCount = 0;
                    }
                    else {
                        PageStartCount = ((CurrentPageNo - 1) * PageSize) + 1;
                        if (CurrentPageNo == iPages)
                            PageEndCount = iPages * PageSize;
                        else if (CurrentPageNo == 1)
                            PageEndCount = PageSize;
                        else
                            PageEndCount = CurrentPageNo * PageSize;
                        if (PageEndCount > TotalDc)
                            oPageEndCount = TotalDc;
                        else
                            oPageEndCount = PageEndCount;
                    }
                }
                var GridInfoText = "Showing <b>" + PageStartCount + "</b> to <b>" + oPageEndCount + "</b> of <b>" + TotalDc + "</b> Records";
                oGridPageInfo.html(GridInfoText);
            }
        }
    }
}