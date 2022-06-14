/* Added by Devaraj S 
* 1. For All Coustom UI jobs Events. */

function LoadCustomAttributeGroup_Summary_SingleSeriesWidget(ControlConfig) {
    this.execute = function () {
        var ControlId = ControlConfig.ClientID;
        var domElement = document.getElementById(ControlId);
        if (domElement != undefined && domElement != null) {
            var parentElement = FindParentElement(domElement, '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                    WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                    var oFactory = new Factory();
                    var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
    }
}

function LoadCustomAttributeGroup_DateWiseSummary_MultiSeriesWidget(ControlConfig) {
    this.execute = function () {
        var ControlId = ControlConfig.ClientID;
        var domElement = document.getElementById(ControlId);
        if (domElement != undefined && domElement != null) {
            var parentElement = FindParentElement(domElement, '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                    WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                    var oFactory = new Factory();
                    var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
    }
}

function LoadCustomAttributeGroup_DataComparisonSummary_MultiSeriesWidget(ControlConfig) {
    this.execute = function () {
        var ControlId = ControlConfig.ClientID;
        var domElement = document.getElementById(ControlId);
        if (domElement != undefined && domElement != null) {
            var parentElement = FindParentElement(domElement, '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                    WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                    var oFactory = new Factory();
                    var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                    loadingPan(ContentSectionId.replace("widget-body-", "widget-content-"));
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
    }
}

function LoadNCRuleGroupWise_DataComparisonSummary_MultiSeriesWidget(ControlConfig) {
    this.execute = function () {
        var ControlId = ControlConfig.ClientID;
        var domElement = document.getElementById(ControlId);
        if (domElement != undefined && domElement != null) {
            var parentElement = FindParentElement(domElement, '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                    WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                    var oFactory = new Factory();
                    var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                    loadingPan(ContentSectionId.replace("widget-body-", "widget-content-"));
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
    }
}

function LoadAttributeWise_DataComparisonSummary_MultiSeriesWidget(ControlConfig) {
    this.execute = function () {
        var ControlId = ControlConfig.ClientID;
        var domElement = document.getElementById(ControlId);
        if (domElement != undefined && domElement != null) {
            var parentElement = FindParentElement(domElement, '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                    WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                    var oFactory = new Factory();
                    var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                    loadingPan(ContentSectionId.replace("widget-body-", "widget-content-"));
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
    }
}

function LoadNCRuleGroup_DateSeriesWidget(ControlConfig) {
    this.execute = function () {
        var ControlId = ControlConfig.ClientID;
        var domElement = document.getElementById(ControlId);
        if (domElement != undefined && domElement != null) {
            var parentElement = FindParentElement(domElement, '.widget-body');
            if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                    WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                    var oFactory = new Factory();
                    var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                    loadingPan(ContentSectionId.replace("widget-body-", "widget-content-"));
                    var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                    oGetWidgetContent.ContentSectionId = ContentSectionId;
                    oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                    oGetWidgetContent.Load();
                }
            }
        }
        else
        {
            domElement = document.getElementById('group_' + ControlId);
            if (domElement != undefined && domElement != null) {
                var parentElement = FindParentElement(domElement, '.widget-body');
                if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
                    var WidgetContentMetaData = parentElement.attr('WidgetContentMetaData');
                    if (WidgetContentMetaData != null && WidgetContentMetaData != null && WidgetContentMetaData != '') {
                        WidgetContentMetaData = JSON.parse(WidgetContentMetaData);
                        var oFactory = new Factory();
                        var ContentSectionId = (parentElement.length > 0 ? parentElement[0].id : '');
                        loadingPan(ContentSectionId.replace("widget-body-", "widget-content-"));
                        var oGetWidgetContent = oFactory.GetWidgetContent(WidgetContentMetaData.DashboardWidgetConfig.Type);
                        oGetWidgetContent.ContentSectionId = ContentSectionId;
                        oGetWidgetContent.WidgetContentMetaData = WidgetContentMetaData.DashboardWidgetConfig;
                        oGetWidgetContent.Load();
                    }
                }
            }
        }
    }
}

function LoadExportFormatByFilterRefresh() {
    this.execute = function () {
        if (CurrentReportingComponentConfig != null) {
            var _ReportingComponentDetailConfigLst = CurrentReportingComponentConfig.ReportingComponentDetailConfigLst;
            if (_ReportingComponentDetailConfigLst != undefined && _ReportingComponentDetailConfigLst != null) {
                for (var i = 0; i < _ReportingComponentDetailConfigLst.length; i++) {
                    var _ReportingComponentDetailConfig = _ReportingComponentDetailConfigLst[i];
                    var ExpressionValid = true;
                    if (_ReportingComponentDetailConfig.DynamicFormExpression != null) {
                        ExpressionValid = _oEvalExpression.Evaluate(_ReportingComponentDetailConfig.DynamicFormExpression);
                    }
                    if (ExpressionValid) {
                        GetExportFormatDetails(_ReportingComponentDetailConfig);
                    }
                }
            }
        }
    }

    var GetExportFormatDetails = function (ReportingComponentDetailConfig) {
        var _ReportingExportFormatConfigLst = ReportingComponentDetailConfig.ReportingExportFormatConfigLst;
        if (_ReportingExportFormatConfigLst != undefined && _ReportingExportFormatConfigLst != null && _ReportingExportFormatConfigLst.length > 0) {
            var _ExportFormatComponent = new ExportFormatComponent();
            _ExportFormatComponent.PDFExportControlId = 'PDFExport';
            _ExportFormatComponent.ExcelExportControlId = 'ExcelExport';
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
                        _ExportFormatComponent.FilterParamControlConfig = CurrentReportingComponentConfig.ReportFilterParamConfig;
                        _ExportFormatComponent.LoadExportOptions();
                    }
                }
            }
        }
    }
}

function LoadExportFormatByApprovalPageFilterRefresh() {
    this.execute = function () {
        if (CurrentApprovalPageComponentConfig != null) {
            var _ApprovalPageComponentDetailConfigLst = CurrentApprovalPageComponentConfig.ApprovalPageComponentDetailConfigLst;
            if (_ApprovalPageComponentDetailConfigLst != undefined && _ApprovalPageComponentDetailConfigLst != null) {
                for (var i = 0; i < _ApprovalPageComponentDetailConfigLst.length; i++) {
                    var _ApprovalPageComponentDetailConfig = _ApprovalPageComponentDetailConfigLst[i];
                    var ExpressionValid = true;
                    if (_ApprovalPageComponentDetailConfig.DynamicFormExpression != null) {
                        ExpressionValid = _oEvalExpression.Evaluate(_ApprovalPageComponentDetailConfig.DynamicFormExpression);
                    }
                    if (ExpressionValid) {
                        GetExportFormatDetails(_ApprovalPageComponentDetailConfig);
                    }
                }
            }
        }
    }

    var GetExportFormatDetails = function (ApprovalPageComponentDetailConfig) {
        var _ApprovalPageExportFormatConfigLst = ApprovalPageComponentDetailConfig.ApprovalPageExportFormatConfigLst;
        if (_ApprovalPageExportFormatConfigLst != undefined && _ApprovalPageExportFormatConfigLst != null && _ApprovalPageExportFormatConfigLst.length > 0) {
            var _ExportFormatComponent = new ExportFormatComponent();
            _ExportFormatComponent.PDFExportControlId = 'PDFExport';
            _ExportFormatComponent.ExcelExportControlId = 'ExcelExport';
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
                        _ExportFormatComponent.FilterParamControlConfig = CurrentApprovalPageComponentConfig.ReportFilterParamConfig;
                        _ExportFormatComponent.LoadExportOptions();
                    }
                }
            }
        }
    }
}

function FindParentElement(ChildElement, ParentKey) {
    var outputElement = null;
    var parentElement = $(ChildElement).parent();
    if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
        var Parent = parentElement.find(ParentKey);
        if (Parent != undefined && Parent != null && Parent.length > 0)
            outputElement = Parent;
        else if (Parent == null || Parent == undefined)
            outputElement = null;
        else
            outputElement = FindParentElement(parentElement[0], ParentKey);
    }
    return outputElement;
}

function FindImmediateParentElement(ChildElement, ParentKey) {
    var outputElement = null;
    var parentElement = $(ChildElement).parent(ParentKey);
    if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
        //var Parent = parentElement.find(ParentKey);
        outputElement = parentElement;
    }
    else {
        parentElement = $(ChildElement).parent();
        if (parentElement != undefined && parentElement != null && parentElement.length > 0)
            outputElement = FindImmediateParentElement(parentElement[0], ParentKey);
        else if (parentElement == null || parentElement == undefined)
            outputElement = null;
    }
    return outputElement;
}

function FindclosestParentElement(ChildElement, ParentKey) {
    var outputElement = null;
    //var parentElement = $(ChildElement).parent();
    //if (parentElement != undefined && parentElement != null && parentElement.length > 0) {
    var Parent = $(ChildElement).closest(ParentKey);
    if (Parent != undefined && Parent != null && Parent.length > 0)
        outputElement = Parent;
    else if (Parent == null || Parent == undefined)
        outputElement = null;
    //else
    //    outputElement = FindParentElement(parentElement[0], ParentKey);
    //}
    return outputElement;
}