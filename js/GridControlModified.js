if (this.JSON && !this.JSON.parseWithDate) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
    var reISO1 = /^(\d{2})-(\d{2})-(\d{4})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

    JSON.parseWithDate = function (json) {
        /// <summary>  
        /// parses a JSON string and turns ISO or MSAJAX date strings  
        /// into native JS date objects  
        /// </summary>      
        /// <param name="json" type="var">json with dates to parse</param>          
        /// </param>  
        /// <returns type="value, array or object" />  
        try {
            var res = JSON.parse(json,
            function (key, value) {
                if (typeof value === 'string') {
                    var a = reISO.exec(value);
                    if (a)
                        return new Date(Date.UTC(+a[1], +a[2] - 1,
                                                 +a[3], +a[4], +a[5], +a[6]));
                    a = reMsAjax.exec(value);
                    if (a) {
                        var b = a[1].split(/[-+,.]/);
                        return new Date(b[0] ? +b[0] : 0 - +b[1]);
                    }
                }
                return value;
            });
            return res;
        } catch (e) {
            // orignal error thrown has no error message so rethrow with message  
            throw new Error("JSON content could not be parsed");
            return null;
        }
    };
    JSON.dateStringToDate = function (dtString) {
        /// <summary>  
        /// Converts a JSON ISO or MSAJAX string into a date object  
        /// </summary>      
        /// <param name="" type="var">Date String</param>  
        /// <returns type="date or null if invalid" />   
        var a = reISO1.exec(dtString);
        if (a)
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3],
                                     +a[4], +a[5], +a[6]));
        a = reMsAjax.exec(dtString);
        if (a) {
            var b = a[1].split(/[-,.]/);
            return new Date(+b[0]);
        }
        return null;
    };
    JSON.stringifyWcf = function (json) {
        /// <summary>  
        /// Wcf specific stringify that encodes dates in the  
        /// a WCF compatible format ("/Date(9991231231)/")  
        /// Note: this format works ONLY with WCF.   
        ///       ASMX can use ISO dates as of .NET 3.5 SP1  
        /// </summary>  
        /// <param name="key" type="var">property name</param>  
        /// <param name="value" type="var">value of the property</param>           
        return JSON.stringify(json, function (key, value) {
            if (typeof value == "string") {
                var a = reISO.exec(value);
                if (a) {
                    var val = '/Date(' +
                              new Date(Date.UTC(+a[1], +a[2] - 1,
                                       +a[3], +a[4],
                                       +a[5], +a[6])).getTime() + ')/';
                    this[key] = val;
                    return val;
                }
            }
            return value;
        })
    };
    JSON.stringToDate = function (dtSting) {
        var reggie1 = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/;
        var reggie = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec(dtSting);
        var dateObject = null;
        if (dateArray == null) {
            dateArray = reggie1.exec(dtSting);
            dateObject = new Date(
                (+dateArray[3]),
                (+dateArray[2]) - 1, // Careful, month starts at 0!
                (+dateArray[1]),
                (+dateArray[4]),
                (+dateArray[5]),
                0,0
            );
        }
        else {
            dateObject = new Date(
                   (+dateArray[3]),
                   (+dateArray[2]) - 1, // Careful, month starts at 0!
                   (+dateArray[1]),
                   (+dateArray[4]),
                   (+dateArray[5]),
                   (+dateArray[6]),0
               );
        }
        return dateObject;
    };
    //-- Code is copled with "dd-MM-yyyy HH:mm:ss"
    JSON.stringToFormatedDate = function (dtstring) {
        var dateSplit = dtstring.split(' ');
        var oDate = dateSplit[0].split('-');
        var oTime = dateSplit[1].split(':');
        var OutPut = new Date(oDate[2], (parseInt(oDate[1]) - 1), oDate[0], oTime[0], oTime[1], oTime[2]);
        return OutPut;
    };
}

var MetaData = [];
var TotalDc = 0;
var maxApprovalLevel = 0;
var rowSpan = 2;
var NCOBSDetails;

function GetGridDisplay() {
    var myInstance = this;
    this.lGridDisplayFormatConfig = null;
    this.DataUrl = '';
    this.Reload = false;
    this.PaginatedEnabled = true;
    this.ParamToLoadGridData = null;
    this.ContentId = '';
    var oGridControl = new GridControl();

    this.Load = function () {
        if (myInstance.lGridDisplayFormatConfig != undefined && myInstance.lGridDisplayFormatConfig != null) {
            oGridControl.TableName = myInstance.lGridDisplayFormatConfig.ControlId;
            /* TODO: need to remove code duplication. */
            var Async = myInstance.lGridDisplayFormatConfig.IsAsync;
            if (Async) {
                var GridDataSourceConfig = myInstance.lGridDisplayFormatConfig.DataSourceConfig;
                if (GridDataSourceConfig != undefined && GridDataSourceConfig != null) {
                    RowHtml = myInstance.CreateDataRows(GridDataSourceConfig, true);
                }
            }
            else {
                var GridColumConfig = myInstance.lGridDisplayFormatConfig.ColumnConfigList;
                if (GridColumConfig != undefined && GridColumConfig != null && GridColumConfig.length > 0) {
                    if (myInstance.lGridDisplayFormatConfig.HeaderRowSpan != 0)
                        rowSpan = myInstance.lGridDisplayFormatConfig.HeaderRowSpan;
                    else
                        rowSpan = 2;
                    MetaData = [];
                    var ColumnsHtml = myInstance.CreateGridColumn(GridColumConfig);
                    var RowHtml = '';

                    var GridDataSourceConfig = myInstance.lGridDisplayFormatConfig.DataSourceConfig;
                    if (GridDataSourceConfig != undefined && GridDataSourceConfig != null) {
                        RowHtml = myInstance.CreateDataRows(GridDataSourceConfig, false);
                    }

                    document.getElementById(myInstance.lGridDisplayFormatConfig.ControlId).innerHTML = "";
                    $(document.getElementById(myInstance.lGridDisplayFormatConfig.ControlId)).html(ColumnsHtml + '<tbody>' + RowHtml + '</tbody>');
                }
            }
        }
    }

    var DataBind = function (sender, response) {
        try {
            if (response == "Session Failure") {
                window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                response = [];
                return false;
            }
            //result = JSON.parse(response.d);
            if (typeof (response) == 'string') {
                ShowMessage('Error in current opertaion.', 4);
                response = [];
            }
            else if (typeof (response) == 'object') {
                if (response.length > 1) {
                    TotalDc = response[1];
                    response = response[0];
                }
                else if (response.length > 0)
                    response = response[0];
                else
                    response = response;
            }
            else
                response = null;
        }
        catch (ex) {
            response = null;
        }
        if (response != null) {
            var GridColumConfig = myInstance.lGridDisplayFormatConfig.ColumnConfigList;
            if (GridColumConfig != undefined && GridColumConfig != null && GridColumConfig.length > 0) {
                if (myInstance.lGridDisplayFormatConfig.HeaderRowSpan != 0)
                    rowSpan = myInstance.lGridDisplayFormatConfig.HeaderRowSpan;
                else
                    rowSpan = 2;
                MetaData = [];
                var ColumnsHtml = myInstance.CreateGridColumn(GridColumConfig);
                var RowHtml = '';
                RowHtml = oGridControl.LoadGrid(response, new Array(), MetaData, "", myInstance.lGridDisplayFormatConfig.ControlId);

                document.getElementById(myInstance.lGridDisplayFormatConfig.ControlId).innerHTML = "";
                $(document.getElementById(myInstance.lGridDisplayFormatConfig.ControlId)).html(ColumnsHtml + '<tbody>' + RowHtml + '</tbody>');

                myInstance.Init();
            }
        }
    }

    var ErrorFn = function (sender, Request, textStatus, errorThrown) {
        ShowMessage(errorThrown, 4);
        if (myInstance.ContentId != undefined && myInstance.ContentId != null && myInstance.ContentId != '')
            removeLoadingPan('widget-content-' + myInstance.ContentId.split('-')[myInstance.ContentId.split('-').length - 1]);
    }

    this.Init = function () {
        if (myInstance.PaginatedEnabled) {
            var oDefaultGridInit = new DefaultPaginatedReportGridInit();
            oDefaultGridInit.lControlId = myInstance.lGridDisplayFormatConfig.ControlId;
            oDefaultGridInit.DataSourceConfig = myInstance.lGridDisplayFormatConfig.DataSourceConfig;
            oDefaultGridInit.RowClickEvent = myInstance.lGridDisplayFormatConfig.RowCreatedEventHandler;
            oDefaultGridInit.oModel = null;
            oDefaultGridInit.ParameterToLoadGrid = myInstance.ParamToLoadGridData;
            var GridColumConfig = myInstance.lGridDisplayFormatConfig.ColumnConfigList;
            if (GridColumConfig != undefined && GridColumConfig != null && GridColumConfig.length > 0) {
                oDefaultGridInit.GridConfigUrl = '';
            }
            oDefaultGridInit.GridDataUrl = myInstance.lGridDisplayFormatConfig.DataSourceConfig.ServiceKeyName;
            oDefaultGridInit.GridDisplayFormatConfig = myInstance.lGridDisplayFormatConfig;
            if (myInstance.lGridDisplayFormatConfig.GridExtraUtilities != undefined && myInstance.lGridDisplayFormatConfig.GridExtraUtilities != null &&
                myInstance.lGridDisplayFormatConfig.GridExtraUtilities != '')
                oDefaultGridInit.sDom = myInstance.lGridDisplayFormatConfig.GridExtraUtilities;
            oDefaultGridInit.execute();
        }
        else {
            var oDefaultGridInit = new DefaultGridInit();
            oDefaultGridInit.lControlId = myInstance.lGridDisplayFormatConfig.ControlId;
            oDefaultGridInit.DataSourceConfig = myInstance.lGridDisplayFormatConfig.DataSourceConfig;
            oDefaultGridInit.RowClickEvent = myInstance.lGridDisplayFormatConfig.RowCreatedEventHandler;
            oDefaultGridInit.oModel = null;
            var GridColumConfig = myInstance.lGridDisplayFormatConfig.ColumnConfigList;
            if (GridColumConfig != undefined && GridColumConfig != null && GridColumConfig.length > 0) {
                oDefaultGridInit.GridConfigUrl = '';
            }
            oDefaultGridInit.GridDataUrl = myInstance.lGridDisplayFormatConfig.DataSourceConfig.ServiceKeyName;
            if (myInstance.lGridDisplayFormatConfig.GridExtraUtilities != undefined && myInstance.lGridDisplayFormatConfig.GridExtraUtilities != null &&
                myInstance.lGridDisplayFormatConfig.GridExtraUtilities != '')
                oDefaultGridInit.sDom = myInstance.lGridDisplayFormatConfig.GridExtraUtilities;
            oDefaultGridInit.execute();
        }
    }

    this.CreateGridColumn = function (GridColumConfig) {
        var Row = '';
        myInstance.GenerateMetaDataColumn(GridColumConfig, false);
        oGridControl.TableName = myInstance.lGridDisplayFormatConfig.ControlId;
        Row = oGridControl.LoadHeaderRow(MetaData, myInstance.lGridDisplayFormatConfig.ControlId);
        return Row;
    }

    this.GenerateMetaDataColumn = function (GridColumConfig, IsSubColumns) {
        CreateMetaDataColumn(GridColumConfig, IsSubColumns);
    }

    this.CreateDataRows = function (GridDataSourceConfig, async) {
        var RowLst = '';
        if (GridDataSourceConfig != undefined && GridDataSourceConfig != null) {
            if (!async) {
                if (GridDataSourceConfig.Type == "StaticDataSourceConfig") {
                    var _StaticDataSourceConfig = new StaticDataSourceConfig();
                    _StaticDataSourceConfig.DynamicFormDataSourceConfig = GridDataSourceConfig;
                    GridResultData = _StaticDataSourceConfig.Load();
                }
                else {
                    var parameterToLoadData = null;
                    if (myInstance.ParamToLoadGridData != undefined && myInstance.ParamToLoadGridData != null)
                        parameterToLoadData = myInstance.ParamToLoadGridData;
                    else
                        parameterToLoadData = myInstance.GetParamToLoadData(GridDataSourceConfig);
                    GridResultData = myInstance.GetDataToLoadGrid(GridDataSourceConfig.ServiceKeyName, JSON.stringify(parameterToLoadData));
                }
                RowLst = oGridControl.LoadGrid(GridResultData, new Array(), MetaData, "", myInstance.lGridDisplayFormatConfig.ControlId);
            }
            else {
                var parameterToLoadData = null;
                if (myInstance.ParamToLoadGridData != undefined && myInstance.ParamToLoadGridData != null)
                    parameterToLoadData = myInstance.ParamToLoadGridData;
                else
                    parameterToLoadData = myInstance.GetParamToLoadData(GridDataSourceConfig);
                var args = {
                    success: DataBind,
                    error: ErrorFn,
                    sender: this
                };
                GridResultData = myInstance.GetDataToLoadGridAsync(GridDataSourceConfig.ServiceKeyName, JSON.stringify(parameterToLoadData), args);
            }
        }
        return RowLst;
    }

    this.GetParamToLoadData = function (GridDataSourceConfig) {
        var parameterToLoadData = {};
        if (GridDataSourceConfig != undefined && GridDataSourceConfig != null) {
            parameterToLoadData["ServiceName"] = GridDataSourceConfig.ServiceKeyName;
            parameterToLoadData["PageSize"] = GridDataSourceConfig.PageSize;
            parameterToLoadData["OrderBy"] = GridDataSourceConfig.OrderBy;
            parameterToLoadData["CurrentPage"] = 1;
            if (GridDataSourceConfig.LoadParms != undefined && GridDataSourceConfig.LoadParms != null) {
                for (var param in GridDataSourceConfig.LoadParms) {
                    var paramValue = '';
                    try {
                        paramValue = eval(GridDataSourceConfig.LoadParms[param]);
                    }
                    catch (ex) {
                        console.log('param not correct');
                    }
                    if (paramValue != undefined)
                        parameterToLoadData[param] = paramValue;
                }
            }
            try {
                parameterToLoadData["Ids"] = JSON.stringify(selected);
            }
            catch (ex) {
                console.log('selected variable undefined');
            }
            parameterToLoadData = { request: JSON.stringify(parameterToLoadData) };
        }
        return parameterToLoadData;
    }

    this.GetDataToLoadGrid = function (DataUrl, parameterToLoadData) {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl(DataUrl);
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = false;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        myAjaxobj.parameter = parameterToLoadData;
        var result = myAjaxobj.execute();
        if (result != undefined && result != null && result != '') {
            try {
                if (result == "Session Failure") {
                    window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                    result = [];
                    return false;
                }
                //result = JSON.parse(response.d);
                if (typeof (result) == 'string') {
                    ShowMessage('Error in current opertaion.', 4);
                    result = [];
                }
                else if (typeof (result) == 'object') {
                    if (result.length > 1) {
                        TotalDc = result[1];
                        result = result[0];
                    }
                    else if (result.length > 0)
                        result = result[0];
                    else
                        result = result;
                }
                else
                    return null;
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

    this.GetDataToLoadGridAsync = function (DataUrl, parameterToLoadData, args) {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl(DataUrl);
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = true;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        myAjaxobj.parameter = parameterToLoadData;
        var result = myAjaxobj.execute(args);
        if (result != undefined && result != null && result != '') {
            try {
                if (result == "Session Failure") {
                    window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                    result = [];
                    return false;
                }
                //result = JSON.parse(response.d);
                if (typeof (result) == 'string') {
                    ShowMessage('Error in current opertaion.', 4);
                    result = [];
                }
                else if (typeof (result) == 'object') {
                    if (result.length > 1) {
                        TotalDc = result[1];
                        result = result[0];
                    }
                    else if (result.length > 0)
                        result = result[0];
                    else
                        result = result;
                }
                else
                    return null;
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

function LoadGridData(Url, DataUrl, Model, TableName, DefaultOrderColumn, table, params) {
    MetaData = [];
    var result;
    if (params == null || params == undefined)
        params = GetGridLoadParameters(Url, Model);
    var PageParam = [];
    var parameterToLoadData = null;
    if (params.length > 0 && params.length > 1)
    {
        PageParam = params[0];
        parameterToLoadData = params[1];
    }

    if (typeof (Url) == 'string') {
        result = GetGridConfig(Url, parameterToLoadData);
        if (result.RowSpan != 0)
            rowSpan = result.RowSpan;
        else
            rowSpan = 2;
        result = result.ColumnConfigList;
    }
    else {
        if (Model.ControlGroupConfigLst[0].ControlConfigDict["MasterGrid"] != undefined)
            result = Model.ControlGroupConfigLst[0].ControlConfigDict["MasterGrid"].ColumnConfigList;
    }

    var oGridControl = new GridControl();
    if (TableName != undefined && TableName != null)
        oGridControl.TableName = TableName;
    var RowLst;
    var Row;

    if (result.length != 0) {
        CreateMetaDataColumn(result, false);
        Row = oGridControl.LoadHeaderRow(MetaData, TableName);
    }
    else {
        Row = '<thead><tr><th>No Columns</th></tr></thead>';
    }

    if (typeof (Model) == 'string') {
        if (Model != "" && Model != "Planning") {
            var lModel = JSON.parse(Model);
            if (lModel.length > 0) {
                parameterToLoadData = { request: JSON.stringify({ Id: lModel[1] }) };
                parameterToLoadData = JSON.stringify(parameterToLoadData);
            }
        }
        else if (Model == "Planning") {
            parameterToLoadData = JSON.stringify(PageParam);
            parameterToLoadData = { request: parameterToLoadData, PageSize: 10, CurrentPage: 1, SortColumnName: DefaultOrderColumn, SortType: "OrderBy", DATType: Model.DATType };
            parameterToLoadData = JSON.stringify(parameterToLoadData);
        }
    }
    else {
        parameterToLoadData = JSON.stringify(PageParam);
        parameterToLoadData = { request: parameterToLoadData, PageSize: 10, CurrentPage: 1, SortColumnName: DefaultOrderColumn, SortType: "OrderBy", DATType: Model.DATType };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
    }

    //oGridControl.RegisterRowClickEvent("GridFacade", "RowClick");
    if (DataUrl != "") {
        GridResultData = GetDataSource(DataUrl, parameterToLoadData);
        RowLst = oGridControl.LoadGrid(GridResultData, new Array(), MetaData, "", TableName);
    }
    else {
        GridResultData = [];
        RowLst = oGridControl.LoadGrid(DataUrl, new Array(), MetaData, "", TableName);
    }
    if (table == null || table == undefined) {
        document.getElementById(TableName).innerHTML = "";
        $(document.getElementById(TableName)).html(Row + '<tbody>' + RowLst + '</tbody>');
    }
    else {
        table.innerHTML = "";
        $(table).html(Row + '<tbody>' + RowLst + '</tbody>');
    }
}

function GetGridLoadParameters(Url, Model)
{
    var _DynamicPage = null;
    var PageParam = [];
    var parameterToLoadData = null;
    if (typeof (Model) == 'string') {
        if (Model != "" && Model != "Planning") {
            var lModel = JSON.parse(Model);
            if (lModel.length > 0) {
                parameterToLoadData = { request: JSON.stringify({ Param: lModel[0], TemplateId: lModel[2] }) };
                parameterToLoadData = JSON.stringify(parameterToLoadData);
            }
        }
        else {
            if (typeof (Url) == 'string') {
                parameterToLoadData = JSON.stringify(PageParam);
                parameterToLoadData = { param1: Url.substring(Url.lastIndexOf("/") + 1, Url.length), request: parameterToLoadData };
                parameterToLoadData = JSON.stringify(parameterToLoadData);
            }
        }
    }
    else {
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

        if (typeof (Url) == 'string') {
            parameterToLoadData = JSON.stringify(PageParam);
            parameterToLoadData = { param1: Url.substring(Url.lastIndexOf("/") + 1, Url.length), request: parameterToLoadData };
            parameterToLoadData = JSON.stringify(parameterToLoadData);
        }
    }
    return [PageParam, parameterToLoadData];
}

function getGridLoadParameters(ControlGroupConfigLst) {
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

function LoadDcGridData(Url, DataUrl, Model, TableName, DefaultOrderColumn, params) {
    MetaData = [];
    var oGridControl = new GridControl();

    if (params == null || params == undefined)
        params = GetGridLoadParameters(Url, Model);
    var PageParam = [];
    var parameterToLoadData = null;
    if (params.length > 0 && params.length > 1) {
        PageParam = params[0];
        parameterToLoadData = params[1];
    }

    if (typeof (Url) == 'string') {
        result = GetGridConfig(Url, parameterToLoadData);
        if (result.RowSpan != 0)
            rowSpan = result.RowSpan;
        else
            rowSpan = 2;
        result = result.ColumnConfigList;
    }
    else {
        if (Model.ControlGroupConfigLst[0].ControlConfigDict["MasterGrid"] != undefined)
            result = Model.ControlGroupConfigLst[0].ControlConfigDict["MasterGrid"].ColumnConfigList;
    }

    if (typeof (Model) == 'string') {
        if (Model != "" && Model != "Planning") {
            var lModel = JSON.parse(Model);
            if (lModel.length > 0) {
                parameterToLoadData = { request: JSON.stringify({ Id: lModel[1] }) };
                parameterToLoadData = JSON.stringify(parameterToLoadData);
            }
        }
        else if (Model == "Planning") {
            parameterToLoadData = JSON.stringify(PageParam);
            parameterToLoadData = { request: parameterToLoadData, PageSize: 10, CurrentPage: 1, SortColumnName: DefaultOrderColumn, SortType: "OrderBy", DATType: Model.DATType };
            parameterToLoadData = JSON.stringify(parameterToLoadData);
        }
    }
    else {
        parameterToLoadData = JSON.stringify(PageParam);
        parameterToLoadData = { request: parameterToLoadData, PageSize: 10, CurrentPage: 1, SortColumnName: DefaultOrderColumn, SortType: "OrderBy", DATType: Model.DATType };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
    }

    var oGridControl = new GridControl();
    if (TableName != undefined && TableName != null)
        oGridControl.TableName = TableName;
    var RowLst;
    var Row;
    var oTableSetting = $("#" + TableName).DataTable().fnSettings();

    if (result.length != 0) {
        CreateMetaDataColumn(result, false);
        oTableSetting.aoColumns.remove(0, oTableSetting.aoColumns.length - 1);
        Row = oGridControl.LoadHeaderRow(MetaData, TableName);
    }
    else {
        oTableSetting.aoColumns.remove(0, oTableSetting.aoColumns.length - 1);
        Row = '<tr><th>No Columns</th></tr>';
    }

    //oGridControl.RegisterRowClickEvent("GridFacade", "RowClick");
    oTableSetting.aoData.remove(0, oTableSetting.aoData.length - 1);
    if (DataUrl != "") {
        GridResultData = GetDataSource(DataUrl, parameterToLoadData);
        RowLst = oGridControl.LoadGrid(GridResultData, new Array(), MetaData, "", TableName);
    }
    else {
        GridResultData = [];
        RowLst = oGridControl.LoadGrid(DataUrl, new Array(), MetaData, "", TableName);
    }
    //RowLst = oGridControl.LoadGrid(GetDataSource(DataUrl, parameterToLoadData), new Array(), MetaData, "", TableName);
    var thead = document.createElement("thead");
    thead.innerHTML = Row;
    oTableSetting.nTHead = thead;
    //$(oTableSetting.nTable).children('thead').remove();
    //oTableSetting.nTable.appendChild(oTableSetting.nTHead);
}

function LoadTableGrid(Url, DataUrl, Model, TableName, DefaultOrderColumn, table) {
    MetaData = [];
    var result;

    var _DynamicPage = new DynamicPage(Model);
    var PageParam = [];
    var GridLoadParameters = [];
    var parameterToLoadData = null;
    var DATType = "0";
    if (Model != "") {
        if (Model.ControlConfigDict != undefined) {
            for (var item in Model.ControlConfigDict) {
                if (Model.ControlConfigDict[item].ControlTypeName != "Label")
                    GridLoadParameters.push(Model.ControlConfigDict[item].ClientID)
            }
        }
        else if (Model.ControlConfigDict == undefined) {
            GridLoadParameters = getGridLoadParameters(Model.ControlGroupConfigLst);
        }
        //for (var item in Model.ControlConfigDict) {
        //    if (Model.ControlConfigDict[item].ControlTypeName != "Label")
        //        GridLoadParameters.push(Model.ControlConfigDict[item].ClientID)
        //}
    }
    if (typeof (Url) == 'string') {
        var PageParam = _DynamicPage.GetLoadParameterList(GridLoadParameters);
        var parameterToLoadData = JSON.stringify(PageParam);
        parameterToLoadData = { param1: Url.substring(Url.lastIndexOf("/") + 1, Url.length), request: parameterToLoadData };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
    }
    if (parameterToLoadData != undefined && parameterToLoadData != null) {
        parameterToLoadData = JSON.parse(parameterToLoadData);
        if (parameterToLoadData.request != undefined && parameterToLoadData.request != null) {
            var ddlTempName = document.getElementById("ddlTempName");
            var ddlPlaceName = document.getElementById("ddlPlaceName");
            var ddl_ObservationType = document.getElementById("ddl_ObservationType");
            var DatFromDate = document.getElementById("DatFromDate");
            if (ddlTempName != undefined && ddlTempName != null)
                PageParam["ddlTempName"] = ddlTempName.value;
            if (ddlPlaceName != undefined && ddlPlaceName != null)
                PageParam["ddlPlaceName"] = ddlPlaceName.value;
            if (ddl_ObservationType != undefined && ddl_ObservationType != null)
                PageParam["ddl_ObservationType"] = ddl_ObservationType.value;
            if (DatFromDate != undefined && DatFromDate != null)
                PageParam["DatFromDate"] = DatFromDate.getElementsByTagName("span")[0].innerHTML;
            parameterToLoadData.request = JSON.stringify(PageParam);
            parameterToLoadData = JSON.stringify(parameterToLoadData);
        }
    }
    if (typeof (Url) == 'string') {
        result = GetGridConfig(Url, parameterToLoadData);
        if (result.RowSpan != 0)
            rowSpan = result.RowSpan;
        else
            rowSpan = 2;
        result = result.ColumnConfigList;
    }
    else {
        if (Url.ControlGroupConfigLst[0].ControlConfigDict["MasterGrid"] != undefined)
            result = Url.ControlGroupConfigLst[0].ControlConfigDict["MasterGrid"].ColumnConfigList;
        var params = GetGridLoadParameters(Url, Url);
        if (params.length > 0 && params.length > 1) {
            PageParam = params[0];
            parameterToLoadData = params[1];
        }
        DATType = Url.DATType;
    }

    var oGridControl = new GridControl();
    if (TableName != undefined && TableName != null)
        oGridControl.TableName = TableName;
    var RowLst;
    var Row;

    if (result.length != 0) {
        CreateMetaDataColumn(result, false);
        Row = oGridControl.LoadTableHeader(MetaData, TableName);
    }
    else
        return false;

    parameterToLoadData = JSON.stringify(PageParam);
    parameterToLoadData = { request: parameterToLoadData, PageSize: 0, CurrentPage: 0, SortColumnName: DefaultOrderColumn, SortType: "OrderBy", DATType: DATType };
    parameterToLoadData = JSON.stringify(parameterToLoadData);

    //oGridControl.RegisterRowClickEvent("GridFacade", "RowClick");
    if (DataUrl != "")
        RowLst = oGridControl.LoadTableData(GetDataSource(DataUrl, parameterToLoadData), new Array(), MetaData, "", TableName);
    else
        RowLst = oGridControl.LoadTableData(DataUrl, new Array(), MetaData, "", TableName);

    table.innerHTML = "";
    table.innerHTML = Row + '<tbody>' + RowLst + '</tbody>';
}

function CreateMetaDataColumn(result, IsSubColumns) {
    var SubColumns = [];
    var SubColumn = [];
    if (result != undefined && result!= null && result.length != 0) {
        for (var i = 0; i < result.length; i++) {
            SubColumn = [];
            if (result[i].IsGroupColumn == false && (result[i].SubColumnConfig == null ? 0 : result[i].SubColumnConfig.length) == 0) {
                var column = {
                    "DisplayName": result[i].ColumnDisplayName, "FieldName": result[i].ColumnFieldName, "Visible": result[i].IsVisible,
                    "VisibleInExport": result[i].IsVisibleInExport, "Width": result[i].ColumnWidth, "DataDisplayPropertyName": result[i].DataDisplayPropertyName,
                    "ColumnType": result[i].ColumnType, "ColumnTypeName": result[i].ColumnTypeName, "Sortable": result[i].IsSortable,
                    "ColumnDefaultVisible": result[i].IsColumnDefaultVisible, "Expression": result[i].FinalJavaScriptColumnDisplayExpression,
                    "CellClickEventHandler": result[i].CellClickEventHandler, "ColumnConfig": result[i]
                    /* "ControlId": result[i].ControlId, */
                };
                if (IsSubColumns)
                    SubColumns.push(column)
                else
                    MetaData.push(column);
            }
            else if (result[i].IsGroupColumn == false && result[i].SubColumnConfig.length != 0) {
                SubColumn = CreateMetaDataColumn(result[i].SubColumnConfig, true)
                var column = {
                    "DisplayName": result[i].ColumnDisplayName, "FieldName": result[i].ColumnFieldName, "Visible": result[i].IsVisible,
                    "VisibleInExport": result[i].IsVisibleInExport, "Width": result[i].ColumnWidth, "SubColumns": SubColumn, "IsGroupColumn": result[i].IsGroupColumn,
                    "ColumnType": result[i].ColumnType, "ColumnTypeName": result[i].ColumnTypeName, "Sortable": result[i].IsSortable,
                    "ColumnDefaultVisible": result[i].IsColumnDefaultVisible, "Expression": result[i].FinalJavaScriptColumnDisplayExpression,
                    "DataDisplayPropertyName": result[i].DataDisplayPropertyName, "CellClickEventHandler": result[i].CellClickEventHandler, "ColumnConfig": result[i]
                };
                if (IsSubColumns)
                    SubColumns.push(column)
                else
                    MetaData.push(column);
            }
            else if (result[i].IsGroupColumn == true) {
                SubColumn = CreateMetaDataColumn(result[i].SubColumnConfig, true)
                var column = {
                    "DisplayName": result[i].ColumnDisplayName, "FieldName": result[i].ColumnFieldName, "Visible": result[i].IsVisible,
                    "VisibleInExport": result[i].IsVisibleInExport, "Width": result[i].ColumnWidth, "SubColumns": SubColumn, "IsGroupColumn": result[i].IsGroupColumn,
                    "ColumnType": result[i].ColumnType, "ColumnTypeName": result[i].ColumnTypeName, "Sortable": result[i].IsSortable,
                    "ColumnDefaultVisible": result[i].IsColumnDefaultVisible, "Expression": result[i].FinalJavaScriptColumnDisplayExpression,
                    "DataDisplayPropertyName": result[i].DataDisplayPropertyName, "CellClickEventHandler": result[i].CellClickEventHandler, "ColumnConfig": result[i]
                };
                if (IsSubColumns)
                    SubColumns.push(column)
                else
                    MetaData.push(column);
            }
        }
    }
    return SubColumns;
}

function GridFacade() {
    this.RowClick = function (DcId) {
        alert(DcId);
    }
}

function GetDataSource(Url, Parameters) {
    //var Length = document.getElementById('txtLength').value;
    var result = [];
    //var obj = { PlaceId: $("#ddl_Palce").val(), TemplateId: $("#ddl_Template").val() };
    var obj1 = [];
    $.ajax({
        url: Url,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: Parameters,
        async: false,
        success: function (response) {
            if (response == "Session Failure") {
                window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                result = [];
                return false;
            }
            //result = JSON.parse(response.d);
            if (response.length > 1) {
                result = response[0];
                TotalDc = response[1];
            }
            else if (response.length > 0)
                result = response[0];
            else
                result = response;
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
        }
    });
    return result;
}

function GetGridConfig(Url, Parameters) {
    //var Length = document.getElementById('txtLength').value;
    var result = [];
    //var obj = { PlaceId: $("#ddl_Palce").val(), TemplateId: $("#ddl_Template").val() };
    var obj1 = [];
    $.ajax({
        url: Url,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: Parameters,
        async: false,
        success: function (response) {
            if (response == "Session Failure") {
                window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                result = [];
                return false;
            }
            result = response;
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
        }
    });
    return result;
}

function GridControl() {

    var ClassName = "";
    var MethodName = "";
    this.TableName = "";
    var myInstance = this;

    this.LoadResponsiveData = function ($scope, GridMetaData) {

        $scope.ResponsiveData = [];

        for (var i = 0; i < GridMetaData.length; i++) {
            if (GridMetaData[i].SubColumns != undefined) {
                var SubColumns = GridMetaData[i].SubColumns;
                for (var j = 0; j < SubColumns.length; j++) {
                    if (SubColumns[j].Visible == true) {
                        $scope.ResponsiveData.push({ "DisplayName": SubColumns[j].DisplayName, "FieldName": SubColumns[j].FieldName, "GroupName": GridMetaData[i].FieldName, visible: true, selected: "selected" });
                    }
                }
            }
            else {
                if (GridMetaData[i].Visible == true) {
                    $scope.ResponsiveData.push({ "DisplayName": GridMetaData[i].DisplayName, "FieldName": GridMetaData[i].FieldName, visible: true, selected: "selected" });
                }
            }
        }
    }

    this.ResponsiveFieldChangedOld = function ($scope, ResponsiveColumn) {

        if (ResponsiveColumn.GroupName != undefined) {
            for (var i = 0; i < $scope.ResponsiveData.length; i++) {
                var IsSelected = false;
                if (ResponsiveColumn.GroupName == $scope.ResponsiveData[i].GroupName) {
                    //alert($scope.ResponsiveData[i].FieldName + "," + $scope.ResponsiveData[i].selected);
                    if ($scope.ResponsiveData[i].selected == "selected" || $scope.ResponsiveData[i].selected == true) {
                        IsSelected = true;
                    }
                }
            }
        }

        var ResponsiveField = document.getElementsByName(ResponsiveColumn.FieldName);

        if (ResponsiveColumn.selected == false) {
            ShowColumn(ResponsiveField);
        }
        else {
            HideColumn(ResponsiveField);
        }


    }

    this.ResponsiveFieldChanged = function ($scope, ResponsiveColumn) {

        var ResponsiveField = document.getElementsByName(ResponsiveColumn.FieldName);

        if (ResponsiveColumn.GroupName != undefined) {

            var IsSelectedGroupLength = 0;
            var IsUnSelectedGroupLength = 0;

            for (var i = 0; i < $scope.ResponsiveData.length; i++) {

                if (ResponsiveColumn.GroupName == $scope.ResponsiveData[i].GroupName) {

                    if ($scope.ResponsiveData[i].selected == "selected" || $scope.ResponsiveData[i].selected == true) {
                        IsSelectedGroupLength += 1;
                    }
                    else {
                        IsUnSelectedGroupLength += 1;
                    }
                }
            }

            if (ResponsiveColumn.selected == false) {
                if (IsSelectedGroupLength == 0) {
                    var ResponsiveGroup = document.getElementsByName(ResponsiveColumn.GroupName);
                    ShowColumn(ResponsiveGroup);
                }
                ShowColumn(ResponsiveField);
            }
            else {
                if (IsSelectedGroupLength > 0) {
                    var ResponsiveGroup = document.getElementsByName(ResponsiveColumn.GroupName);
                    HideColumn(ResponsiveGroup);
                }
                HideColumn(ResponsiveField);
            }
        }
        else {
            if (ResponsiveColumn.selected == false) {

                ShowColumn(ResponsiveField);
            }
            else {
                HideColumn(ResponsiveField);
            }
        }
    }

    this.ShowColumn = function (ResponsiveField) {
        for (var i = 0; i < ResponsiveField.length; i++) {
            ResponsiveField[i].className = ResponsiveField[i].className + " hide";
        }
    }

    this.HideColumn = function (ResponsiveField) {
        for (var i = 0; i < ResponsiveField.length; i++) {
            var reg = new RegExp('(\\s|^)hide(\\s|$)');
            ResponsiveField[i].className = ResponsiveField[i].className.replace(reg, ' ');
        }
    }

    this.RegisterRowClickEvent = function (Name1, Name2) {
        ClassName = Name1;
        MethodName = Name2;
    }

    this.LoadHeaderRow = function (GridMetaData, TableName) {
        var Row = "";

        var Row_Start = '<thead><tr>';
        var RowContent = '';
        var lSubColumns = [];

        RowContent = GetHeaderRowContent(GridMetaData, RowContent, lSubColumns, false, TableName, 0);

        var Row_End = '</tr></thead>';
        Row = Row_Start + RowContent + Row_End;

        return Row;
    }

    var GetHeaderRowContent = function (GridMetaData, RowContent, lSubColumns, SubColumn, TableName, jCount) {
        var GroupColumn = false;
        var ColSpan = null;

        for (var i = 0; i < GridMetaData.length; i++) {
            if (GridMetaData[i].IsGroupColumn) {
                GroupColumn = true;
                break;
            }
        }
        var oTableSetting;
        if ($("#" + TableName).dataTable != undefined && $("#" + TableName).length > 0) {
            if ($("#" + TableName)[0].tHead != null && $("#" + TableName).dataTable.settings.length > 0)
                oTableSetting = $("#" + TableName).DataTable().fnSettings();
        }
        var j = jCount;
        for (var k = 0; k < GridMetaData.length; k++) {
            if (GridMetaData[k].Visible != undefined) {
                if (GridMetaData[k].Visible == true) {
                    if (GridMetaData[k].IsGroupColumn != true) {
                        ColumnContent = myInstance.GetColmn(GridMetaData[k], TableName);
                        if (oTableSetting != undefined) {
                            var nth = document.createElement('th');
                            if (GridMetaData[k].ColumnTypeName == "CheckboxColumn") {
                                nth.innerHTML = '<input type="checkbox" name="checkbox-inline" id="selectall"/><label for="selectall"></label>'; //<label class="checkbox"><input type="checkbox" name="checkbox-inline" id="selectall"/><i></i></label>
                                nth.style.textAlign = "center";
                            }
                            else
                                nth.innerHTML = ColumnContent;
                            if (GridMetaData[k].Width != "Auto")
                                nth.width = GridMetaData[k].Width;
                            oTableSetting.aoColumns[j].nTh = nth;
                            oTableSetting.aoColumns[j].sTitle = GridMetaData[k].FieldName;
                            j = j + 1;
                        }
                    }
                    if (GridMetaData[k].IsGroupColumn) {
                        if (GridMetaData[k].IsGroupColumn == true) {
                            for (var i = 0; i < GridMetaData[k].SubColumns.length; i++) {
                                lSubColumns.push(GridMetaData[k].SubColumns[i]);
                            }
                            var Count = CreateTableSettColumn(GridMetaData[k].SubColumns, oTableSetting, j, TableName);
                            ColSpan = Count - j;
                            j = Count;
                        }
                    }
                    var Column = myInstance.GetColumn(k, GridMetaData[k], GroupColumn, ColSpan);
                    RowContent += Column;
                }
                else {
                    var Column = myInstance.GetColumn(k, GridMetaData[k], GroupColumn);
                    RowContent += Column;
                    ColumnContent = myInstance.GetColmn(GridMetaData[k], TableName);
                    if (oTableSetting != undefined) {
                        var nth = document.createElement('th');
                        nth.innerHTML = ColumnContent;
                        if (GridMetaData[k].Width != "Auto")
                            nth.width = GridMetaData[k].Width;
                        oTableSetting.aoColumns[j].nTh = nth;
                        oTableSetting.aoColumns[j].sTitle = GridMetaData[k].DisplayName;
                        j = j + 1;
                    }
                }
            }
        }

        if (lSubColumns.length > 0) {
            RowContent += '</tr><tr>';
            var lSubColumnsInner = [];
            RowContent = GetSubColumnRowContent(lSubColumns, RowContent, lSubColumnsInner, rowSpan);
        }
        return RowContent;
    }

    var GetSubColumnRowContent = function (GridMetaData, RowContent, lSubColumns, paramRowSpan) {
        var GroupColumn = false;

        for (var i = 0; i < GridMetaData.length; i++) {
            if (GridMetaData[i].IsGroupColumn) {
                GroupColumn = true;
                break;
            }
        }
        for (var k = 0; k < GridMetaData.length; k++) {
            if (GridMetaData[k].Visible != undefined) {
                if (GridMetaData[k].Visible == true) {
                    if (GridMetaData[k].IsGroupColumn != undefined) {
                        if (GridMetaData[k].IsGroupColumn) {
                            var Column = myInstance.GetColumn(k, GridMetaData[k], GroupColumn);
                            RowContent += Column;
                            for (var i = 0; i < GridMetaData[k].SubColumns.length; i++) {
                                lSubColumns.push(GridMetaData[k].SubColumns[i]);
                            }
                        }
                        else {
                            var Column = myInstance.GetSubColumn(k, GridMetaData[k], paramRowSpan);
                            RowContent += Column;
                        }
                    }
                    else {
                        var Column = myInstance.GetSubColumn(k, GridMetaData[k], paramRowSpan);
                        RowContent += Column;
                    }
                }
                else {
                    var Column = myInstance.GetColumn(k, GridMetaData[k], GroupColumn);
                    RowContent += Column;
                }
            }
        }

        if (lSubColumns.length > 0) {
            RowContent += '</tr><tr>';
            var lSubColumnsInner = [];
            paramRowSpan = paramRowSpan - 1;
            RowContent = GetSubColumnRowContent(lSubColumns, RowContent, lSubColumnsInner, paramRowSpan);
        }
        return RowContent;
    }

    var CreateTableSettColumn = function (SubColumns, oTableSetting, j, TableName) {
        for (var i = 0; i < SubColumns.length; i++) {
            if (SubColumns[i].IsGroupColumn)
                j = CreateTableSettColumn(SubColumns[i].SubColumns, oTableSetting, j, TableName);
            else {
                if (oTableSetting != undefined) {
                    ColumnContent = myInstance.GetSubColmn(SubColumns[i], TableName);
                    var nth = document.createElement('th');
                    nth.innerHTML = ColumnContent;
                    if (SubColumns[i].Width != "Auto")
                        nth.width = SubColumns[i].Width;
                    oTableSetting.aoColumns[j].nTh = nth;
                    oTableSetting.aoColumns[j].sTitle = SubColumns[i].DisplayName;
                }
                j = j + 1;
            }
        }
        return j;
    }

    this.LoadTableHeader = function (GridMetaData, TableName) {

        var Row = "";

        var Row_Start = '<thead><tr>';
        var RowContent = '';
        var lSubColumns = [];
        var GroupColumn = false;
        var j = 0;

        for (var i = 0; i < GridMetaData.length; i++) {
            if (GridMetaData[i].IsGroupColumn)
                GroupColumn = true;
        }

        for (var k = 0; k < GridMetaData.length; k++) {
            if (GridMetaData[k].Visible != undefined) {
                if (GridMetaData[k].Visible == true && GridMetaData[k].VisibleInExport == true && GridMetaData[k].ColumnTypeName != "CheckboxColumn") {
                    var Column = this.GetColumn(k, GridMetaData[k], GroupColumn);
                    RowContent += Column;
                    if (GridMetaData[k].IsGroupColumn != true) {
                        ColumnContent = this.GetColmn(GridMetaData[k], TableName);
                    }
                    if (GridMetaData[k].IsGroupColumn) {
                        if (GridMetaData[k].IsGroupColumn == true) {
                            for (var i = 0; i < GridMetaData[k].SubColumns.length; i++) {
                                lSubColumns.push(GridMetaData[k].SubColumns[i]);
                                ColumnContent = this.GetSubColmn(GridMetaData[k].SubColumns[i], TableName);
                            }
                        }
                    }
                }
            }
        }
        if (lSubColumns.length > 0)
            RowContent += '</tr><tr>';

        for (var i = 0; i < lSubColumns.length; i++) {
            if (lSubColumns[i].Visible == true && lSubColumns[i].VisibleInExport == true) {
                var Column = this.GetSubColumn(i, lSubColumns[i]);
                RowContent += Column;
            }
        }
        var Row_End = '</tr></thead>';
        Row = Row_Start + RowContent + Row_End;

        return Row;
    }

    this.GetSubColmn = function (ColumnObj, TableName) {
        var ColumnContent = ColumnObj.DisplayName;

        if ($("#" + TableName).dataTable != undefined && $("#" + TableName).length > 0) {
            if ($("#" + TableName)[0].tHead != null && $("#" + TableName).dataTable.settings.length > 0) {
                var oTable = $("#" + TableName).DataTable();
                var oTableSetting = $("#" + TableName).DataTable().fnSettings();
                oTable._fnAddColumn(oTableSetting, ColumnObj.FieldName);
            }
        }
        return ColumnContent;
    }

    // <div class="col"><span>Temp</span></div>
    this.GetColmn = function (ColumnObj, TableName) {
        if (ColumnObj.IsGroupColumn != true) {
            var ColumnContent = ColumnObj.DisplayName;
        }

        if ($("#" + TableName).dataTable != undefined && $("#" + TableName).length > 0) {
            if ($("#" + TableName)[0].tHead != null && $("#" + TableName).dataTable.settings.length > 0) {
                var oTable = $("#" + TableName).DataTable();
                var oTableSetting = $("#" + TableName).DataTable().fnSettings();
                oTable._fnAddColumn(oTableSetting, ColumnObj.FieldName);
            }
        }
        return ColumnContent;
    }

    // <div class="col"><span>Temp</span></div>
    this.GetSubColumn = function (ColumnIndex, ColumnObj, paramRowSpan) {
        var oRowSpan = FindRowSpan(ColumnObj.SubColumns, paramRowSpan);
        var Columnstart = '<th ColumnIndex = ' + ColumnIndex + ' id="' + ColumnObj.FieldName + '" ' + (oRowSpan != undefined && oRowSpan != null ? ('rowspan = "' + oRowSpan + '"') : '') + '>';
        if (ColumnObj.Width != 'Auto')
            Columnstart = '<th ColumnIndex = ' + ColumnIndex + ' id="' + ColumnObj.FieldName + '" width="' + ColumnObj.Width + '" ' + (oRowSpan != undefined && oRowSpan != null ? ('rowspan = "' + oRowSpan + '"') : '') + '>';
        var ColumnContent = ColumnObj.DisplayName;
        var ColumnEnd = '</th>';
        var Column = Columnstart + ColumnContent + ColumnEnd;

        return Column;
    }

    var FindRowSpan = function (subColumns, paramRowSpan) {
        var oRowSpan = 1;
        var testVar = 0;
        if (subColumns != undefined && subColumns != null && subColumns.length > 0) {
            for (var itr = 0; itr < subColumns.length; itr++) {
                if (subColumns[itr].IsGroupColumn == true)
                    oRowSpan = FindRowSpan(subColumns[itr].SubColumns);
                else {
                    if (testVar != 1) {
                        oRowSpan = oRowSpan + 1;
                        testVar = testVar + 1;
                    }
                }
            }
        }
        return (paramRowSpan - oRowSpan);
    }

    // <div class="col"><span>Temp</span></div>
    this.GetColumn = function (ColumnIndex, ColumnObj, GroupColumn, ColSpan) {
        if (ColumnObj.IsGroupColumn == true) {
            var Columnstart = '<th ColumnIndex = ' + ColumnIndex + ' id="' + ColumnObj.FieldName + '" colspan = "' + (ColSpan != undefined && ColSpan != null ? ColSpan : ColumnObj.SubColumns.length) + '">';
            if (ColumnObj.Width != 'Auto')
                Columnstart = '<th ColumnIndex = ' + ColumnIndex + ' id="' + ColumnObj.FieldName + '" width="' + ColumnObj.Width + '" colspan = "' + (ColSpan != undefined && ColSpan != null ? ColSpan : ColumnObj.SubColumns.length) + '">';
            var ColumnContent = ColumnObj.DisplayName;
            var ColumnEnd = '</th>';
        }
        else {
            var rowspanStr = '';
            var widthStr = '';
            var hideClass = '';
            var style = '';
            if (GroupColumn)
                rowspanStr = 'rowspan="' + rowSpan + '" ';
            if (ColumnObj.Width != 'Auto') {
                widthStr = 'width="' + ColumnObj.Width + '" ';
            }
            if (!ColumnObj.Visible)
                hideClass = 'class = "hide" ';
            if (ColumnObj.ColumnTypeName == "CheckboxColumn" && ColumnObj.ColumnConfig.IsSelectAllRequired) {
                ColumnContent = '<input type="checkbox" name="checkbox-inline" id="selectall" onclick = "' + ColumnObj.ColumnConfig.SelectAllCheckBoxClickEvent + '(this, \'' + myInstance.TableName + '\')"/><label for="selectall"></label>';
                style = 'style = "text-align : center"';
            }
            else
                ColumnContent = ColumnObj.DisplayName;
            var ColumnEnd = '</th>';
        }

        var Column = '<th ColumnIndex = ' + ColumnIndex + ' id="' + ColumnObj.FieldName + '" ' + hideClass + rowspanStr + widthStr + style + '>' + ColumnContent + ColumnEnd;

        return Column;
    }

    //<div class="col col-20 text-center" ></div>
    this.GetStyle = function (ColumnObj) {

        var StyleHtml = 'col';
        if (ColumnObj.Width != "Auto")
            StyleHtml = StyleHtml + " col-" + ColumnObj.Width; //class="col"
        if (ColumnObj.TextAlign != undefined)
            StyleHtml = StyleHtml + " text-" + ColumnObj.TextAlign;
        return StyleHtml;
    }

    this.GetColumnGroup = function (ColumnObj) {


        //<div class="col col-20">
        var Column_start = '<div class="' + GetStyle(ColumnObj) + '" name="' + ColumnObj.FieldName + '">';

        //<div class="row"> 
        //   <div class="col"><span>Cooking</span></div>
        //</div>
        var ColumnGroupHeader = '<div class="row"><div class="col"><span>' + ColumnObj.DisplayName + '</span></div></div>';

        // <div class="row grouped">
        var ColumnSubGroup_Start = '<div class="row grouped">';


        //<div class="col"><span>Temp</span></div>
        //<div class="col"><span>Time</span></div>
        //<div class="col"><span>By(#ERP)</span></div>
        var ColumnGroupContent = "";
        for (var i = 0; i < ColumnObj.SubColumns.length; i++) {
            ColumnGroupContent += GetColumn(i, ColumnObj.SubColumns[i]);
        }

        var ColumnSubGroup_End = '</div>';
        var Column_End = '</div>';

        var CompleteGroupColumn = Column_start + ColumnGroupHeader + ColumnSubGroup_Start + ColumnGroupContent + ColumnSubGroup_End + Column_End;

        return CompleteGroupColumn;
    }

    this.LoadGrid = function (DataSource, GraphSearchElement, HeaderMetaData, DefaultExp, TableName) {
        var RowLst = "";
        if (DataSource != null && DataSource != undefined && DataSource.length != 0) {

            var NormalizedData;

            if (GraphSearchElement.length != 0) {
                NormalizedData = Filter(GraphSearchElement, Normalize(DataSource), DefaultExp);
            }
            else {
                NormalizedData = DataSource;
            }

            //alert(JSON.stringify(NormalizedData));
            if (myInstance.TableName.toLowerCase() == "datatable_ncdetail" || NCOBSDetails) {
                if (NormalizedData != undefined && NormalizedData != null && NormalizedData.length > 0) {
                    for (var i = 0; i < NormalizedData.length; i++) {
                        if (NormalizedData[i]["DCNCDTOLst"] != undefined && NormalizedData[i]["DCNCDTOLst"] != null) {
                            var DCNCLst = NormalizedData[i]["DCNCDTOLst"];
                            for (var k = 0; k < DCNCLst.length; k++) {
                                if (NormalizedData[i]["DCApprovedUserDetailsList"] != undefined && NormalizedData[i]["DCApprovedUserDetailsList"] != null && NormalizedData[i]["DCApprovedUserDetailsList"].length > 0) {
                                    DCNCLst[k]["DCApprovedUserDetailsList"] = NormalizedData[i]["DCApprovedUserDetailsList"];
                                }
                                var row = this.GetDataRow(DCNCLst[k], HeaderMetaData, TableName, k);
                                RowLst = RowLst + row;
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < NormalizedData.length; i++) {
                    var row = this.GetDataRow(NormalizedData[i], HeaderMetaData, TableName, i);
                    RowLst = RowLst + row;
                }
            }
        }
        else {
            RowLst = "";
        }
        return RowLst;
    }

    this.LoadTableData = function (DataSource, GraphSearchElement, HeaderMetaData, DefaultExp, TableName) {
        var RowLst = "";
        if (DataSource.length != 0) {

            var NormalizedData;

            if (GraphSearchElement.length != 0) {
                NormalizedData = Filter(GraphSearchElement, Normalize(DataSource), DefaultExp);
            }
            else {
                NormalizedData = DataSource;
            }

            //alert(JSON.stringify(NormalizedData));
            for (var i = 0; i < NormalizedData.length; i++) {

                var row = this.GetTableRow(NormalizedData[i], HeaderMetaData, TableName);
                RowLst = RowLst + row;
            }
        }
        else {
            RowLst = "";
        }
        return RowLst;
    }

    this.NormalizeFunction = function (result) {
        var Finaloutput = [];
        var i = 0;
        while (i < result.length) {
            Finaloutput.push(JSON.stringify(result[i]));
            i = i + 1;
        }
        return Finaloutput;
    }

    this.GetDataRow = function (RowDataObject, HeaderMetaData, TableName, RowIndex) {

        //var Row_Start = '<div class="row">';

        var Data = [];
        var Row_Start = '';
        
        if (RowDataObject.DataCaptureId != undefined)
            Row_Start = '<tr id="' + RowDataObject.DataCaptureId + '" rowIndex = ' + RowIndex + '>';
        else
            Row_Start = '<tr rowIndex = ' + (RowIndex != undefined && RowIndex != null ? RowIndex : 0) + '>';

        var RowContent = '';

        for (var i = 0; i < HeaderMetaData.length; i++) {
            RowContent = this.GetDataColumn(RowContent, HeaderMetaData[i], RowDataObject);
            this.GetDataClmn(RowContent, HeaderMetaData[i], RowDataObject, Data);
        }

        Row_End = "</tr>";
        var row = Row_Start + RowContent + Row_End;

        if ($("#" + TableName).dataTable != undefined && $("#" + TableName).length > 0) {
            if ($("#" + TableName)[0].tHead != null && $("#" + TableName).dataTable.settings.length > 0) {
                var oTable = $("#" + TableName).DataTable();
                var oTableSetting = $("#" + TableName).DataTable().fnSettings();
                var irow = oTable.fnAddData(Data, false);
            }
        }

        return row;
    }

    this.GetTableRow = function (RowDataObject, HeaderMetaData, TableName) {

        //var Row_Start = '<div class="row">';

        var Data = [];
        var Row_Start = '<tr id="' + RowDataObject.DataCaptureId + '">';

        var RowContent = '';

        for (var i = 0; i < HeaderMetaData.length; i++) {
            if (HeaderMetaData[i].Visible && HeaderMetaData[i].VisibleInExport && HeaderMetaData[i].ColumnTypeName != "CheckboxColumn") {
                RowContent = this.GetDataColumn(RowContent, HeaderMetaData[i], RowDataObject);
                this.GetDataClmn(RowContent, HeaderMetaData[i], RowDataObject, Data);
            }
        }

        Row_End = "</tr>";
        var row = Row_Start + RowContent + Row_End;

        return row;
    }

    //<div class="col col-20"><span>Chick BR 120 GM Iranian Roast</span></div>
    this.GetDataClmn = function (html, HeaderMetaData, RowData, Data) {
        if (HeaderMetaData.SubDataFields != undefined) {
            var IsSubfieldAdded = false;
            html = html + '<tr>';

            for (var i = 0; i < HeaderMetaData.SubDataFields.length; i++) {

                var ColumnValue = this.GetColumnValue(HeaderMetaData.SubDataFields[i], RowData);

                var DisplayName = HeaderMetaData.SubDataFields[i].DisplayName;
                if (DisplayName != '' && ColumnValue != '') {
                    html = html + '<td style="color:red">' + ColumnValue + '</td>';
                    IsSubfieldAdded = true;
                }
                else if (IsSubfieldAdded == true && ColumnValue != '') {
                    html = html + '<td>' + ColumnValue + '</td>';
                }
                else if (ColumnValue != '') {
                    html = html + '<td>' + ColumnValue + '</td>';
                }

            }
            html = html + '</tr>';
        }
        else if (HeaderMetaData.IsGroupColumn && HeaderMetaData.SubColumns != undefined) {
            for (var i = 0; i < HeaderMetaData.SubColumns.length; i++) {
                this.GetDataClmn(html, HeaderMetaData.SubColumns[i], RowData, Data);
            }
        }
        else if ((HeaderMetaData.ColumnTypeName).toString().toLowerCase() == 'emailcolumn') {
            var divOutterHtml = "";
            var aTag = document.createElement("a");
            aTag.setAttribute("href", "javascript:void(0);");
            aTag.setAttribute("class", "btn btn-default details-control emailcolumn");
            aTag.innerHTML = HeaderMetaData.DisplayName;
            aTag.id = HeaderMetaData.FieldName;
            divOutterHtml = aTag.outerHTML;
            Data.push(divOutterHtml);
        }
        else {
            var ColumnValue = this.GetColumnValue(HeaderMetaData, RowData);

            if (HeaderMetaData.OneViewStyle == 'checkmark') {
                if (ColumnValue == '1')
                    html = html + '<div class="' + GetStyle(HeaderMetaData) + '" name="' + HeaderMetaData.FieldName + '"><span>Y</span></div>';
                else
                    html = html + '<div class="' + GetStyle(HeaderMetaData) + '" name="' + HeaderMetaData.FieldName + '"></div>';
            }
            else if (HeaderMetaData.FieldName == '' && HeaderMetaData.ColumnTypeName == 'CheckboxColumn') {
                Data.push('<input type="checkbox" name="checkbox-inline" id="Chk_' + RowData.DataCaptureId + '" /><label for = "Chk_' + RowData.DataCaptureId + '"></label>');
            }
            else if (HeaderMetaData.FieldName != '' && HeaderMetaData.ColumnTypeName == 'CheckboxColumn') {
                Data.push('<input type="checkbox" name="checkbox-inline" id="Chk_' + RowData[HeaderMetaData.FieldName] + '" /><label for = "Chk_' + RowData[HeaderMetaData.FieldName] + '"></label>');
                //html = html + '<td align="center"><input type="checkbox" name="checkbox-inline" id="Chk_' + RowData[HeaderMetaData.FieldName] + '" /></td>';
            }
            else if (HeaderMetaData.ColumnTypeName == 'FollowUpButtonColumn') {
                var divOutterHtml = "";
                if (RowData.IsManualAllocated && RowData.ActionStatus != "Completed") {
                    var aTag = document.createElement('a');
                    aTag.setAttribute("href", "javascript:void(0);");
                    aTag.setAttribute("class", "btn btn-default");
                    aTag.innerHTML = HeaderMetaData.DisplayName;
                    divOutterHtml = aTag.outerHTML;
                }
                Data.push(divOutterHtml);
            }
            else if (HeaderMetaData.ColumnTypeName == 'ButtonColumn') {
                var divOutterHtml = "";
                var ColumnValue = myInstance.GetColumnValue(HeaderMetaData, RowData);
                if (ColumnValue == true) {
                    var aTag = document.createElement('a');
                    aTag.setAttribute("href", "javascript:void(0);");
                    aTag.setAttribute("class", "btn btn-default");
                    aTag.setAttribute("currentRow", JSON.stringify(RowData));
                    aTag.innerHTML = HeaderMetaData.DisplayName;
                    if (HeaderMetaData.CellClickEventHandler != undefined && HeaderMetaData.CellClickEventHandler != null && HeaderMetaData.CellClickEventHandler != '')
                        aTag.setAttribute("onclick", (HeaderMetaData.CellClickEventHandler + "(this, '" + myInstance.TableName + "')"));
                    divOutterHtml = aTag.outerHTML;
                }
                Data.push(divOutterHtml);
            }
            else if (HeaderMetaData.ColumnTypeName == 'SubRowColumn') {
                var divOutterHtml = "";
                var IsActionAvailable = false;
                if (RowData.ActionCount != null && RowData.ActionCount != undefined && RowData.ActionCount > 0)
                    IsActionAvailable = true;
                //for (var DCLastUpdatedAnswerDetail in RowData.DCLastUpdatedAnswerDetailList) {
                //    var NCDetailsLst = RowData.DCLastUpdatedAnswerDetailList[DCLastUpdatedAnswerDetail].NCDetailsLst;
                //    if (NCDetailsLst != undefined && NCDetailsLst != null && NCDetailsLst.length > 0) {
                //        IsActionAvailable = true;
                //        break;
                //    }
                //}
                if (IsActionAvailable) {
                    var aTag = document.createElement("a");
                    aTag.setAttribute("href", "javascript:void(0);");
                    aTag.setAttribute("class", "btn btn-default details-control action");
                    aTag.innerHTML = HeaderMetaData.DisplayName;
                    aTag.id = HeaderMetaData.FieldName;
                    divOutterHtml = aTag.outerHTML;
                }
                Data.push(divOutterHtml);
            }
            else if (HeaderMetaData.ColumnTypeName == 'Check')
                Data.push(ColumnValue == undefined || ColumnValue == null ? "" : (ColumnValue == 0 ? "" : "Y"));
            else
                Data.push((ColumnValue == undefined || ColumnValue == null ? "" : ColumnValue));
        }
        return html;
    }

    //<div class="col col-20"><span>Chick BR 120 GM Iranian Roast</span></div>
    this.GetDataColumn = function (html, HeaderMetaData, RowData) {

        //<div class="col text-center prebc">
        //   					<div>11:00</div>
        //   					<div>12:00</div>
        //   				</div>
        if (HeaderMetaData.SubDataFields != undefined) {

            var IsSubfieldAdded = false;
            // html = html + '<div class="col text-center prebc" name="' + HeaderMetaData.FieldName + '">';
            html = html + '<tr>';

            for (var i = 0; i < HeaderMetaData.SubDataFields.length; i++) {

                var ColumnValue = this.GetColumnValue(HeaderMetaData.SubDataFields[i], RowData);

                var DisplayName = HeaderMetaData.SubDataFields[i].DisplayName;
                if (DisplayName != '' && ColumnValue != '') {
                    //html = html + '<div><span>' + DisplayName + '</span>' + ColumnValue + '</div>';
                    html = html + '<td style="color:red">' + ColumnValue + '</td>';
                    IsSubfieldAdded = true;
                }
                else if (IsSubfieldAdded == true && ColumnValue != '') {
                    html = html + '<td>' + ColumnValue + '</td>';
                }
                else if (ColumnValue != '') {
                    html = html + '<td>' + ColumnValue + '</td>';
                }

            }
            html = html + '</tr>';
        }
        else if (HeaderMetaData.IsGroupColumn && HeaderMetaData.SubColumns != undefined) {
            //html = html + '<div class="' + GetStyle(HeaderMetaData) + '" name="' + HeaderMetaData.FieldName + '"><div class="row grouped">';
            // html = html + '<td>';
            for (var i = 0; i < HeaderMetaData.SubColumns.length; i++) {
                html = this.GetDataColumn(html, HeaderMetaData.SubColumns[i], RowData);
            }
            // html = html + '</td>';
        }
        else if (HeaderMetaData.ColumnTypeName != undefined && HeaderMetaData.ColumnTypeName != null && (HeaderMetaData.ColumnTypeName).toString().toLowerCase() == 'emailcolumn') {
            var divOutterHtml = "";
            var aTag = document.createElement("a");
            aTag.setAttribute("href", "javascript:void(0);");
            aTag.setAttribute("class", "btn btn-default details-control emailcolumn");
            aTag.innerHTML = HeaderMetaData.DisplayName;
            aTag.id = HeaderMetaData.FieldName;
            divOutterHtml = aTag.outerHTML;
            html = html + '<td class="center">' + divOutterHtml + '</td>';
        }
        else {
            //<div class="col text-center"><span>05</span></div>
            var ColumnValue = this.GetColumnValue(HeaderMetaData, RowData);

            if (HeaderMetaData.OneViewStyle == 'checkmark') {
                if (ColumnValue == '1')
                    html = html + '<div class="' + GetStyle(HeaderMetaData) + '" name="' + HeaderMetaData.FieldName + '"><span>Y</span></div>';
                else
                    html = html + '<div class="' + GetStyle(HeaderMetaData) + '" name="' + HeaderMetaData.FieldName + '"></div>';

                //while enable icon,500 row near 700KB diffrent we notice and icon loading took  time
                //
                //if (ColumnValue == 'true')
                //     html = html + '<div class="' + GetStyle(HeaderMetaData) + '"><span><i class="icon ion-checkmark"></i></span></div>';
                //else
                //    html = html + '<div class="' + GetStyle(HeaderMetaData) + '"></div>';
            }
            else if (HeaderMetaData.FieldName == '' && HeaderMetaData.ColumnTypeName == 'CheckboxColumn' && HeaderMetaData.ColumnConfig.IdPropertyName != ''
                && HeaderMetaData.ColumnConfig.IdPropertyName != null && HeaderMetaData.ColumnConfig.IdPropertyName != undefined) {
                var CellClickEventHandler = '';
                if (HeaderMetaData.CellClickEventHandler != undefined && HeaderMetaData.CellClickEventHandler != null && HeaderMetaData.CellClickEventHandler != '')
                    CellClickEventHandler = 'onclick = "new ' + HeaderMetaData.CellClickEventHandler + '().execute()"';
                html = html + '<td align="center"><input type="checkbox" name="checkbox-inline" id="Chk_' + RowData[HeaderMetaData.ColumnConfig.IdPropertyName] + '" ' + CellClickEventHandler +
                    ' /><label for = "Chk_' + RowData[HeaderMetaData.ColumnConfig.IdPropertyName] + '"></label></td>';
            }
            else if (HeaderMetaData.FieldName == '' && HeaderMetaData.ColumnTypeName == 'CheckboxColumn') {
                var CellClickEventHandler = '';
                if (HeaderMetaData.CellClickEventHandler != undefined && HeaderMetaData.CellClickEventHandler != null && HeaderMetaData.CellClickEventHandler != '')
                    CellClickEventHandler = 'onclick = "new ' + HeaderMetaData.CellClickEventHandler + '().execute()"';
                html = html + '<td align="center"><input type="checkbox" name="checkbox-inline" id="Chk_' + RowData.DataCaptureId + '" ' + CellClickEventHandler +
                    ' /><label for = "Chk_' + RowData.DataCaptureId + '"></label></td>';
            }
            else if (HeaderMetaData.FieldName != '' && HeaderMetaData.ColumnTypeName == 'CheckboxColumn') {
                var CellClickEventHandler = '';
                if (HeaderMetaData.CellClickEventHandler != undefined && HeaderMetaData.CellClickEventHandler != null && HeaderMetaData.CellClickEventHandler != '')
                    CellClickEventHandler = 'onclick = "new ' + HeaderMetaData.CellClickEventHandler + '().execute()"';
                html = html + '<td align="center"><input type="checkbox" name="checkbox-inline" id="Chk_' + RowData[HeaderMetaData.FieldName] + '" ' + CellClickEventHandler +
                    ' /><label for = "Chk_' + RowData[HeaderMetaData.FieldName] + '"></label></td>';
            }
            else if (HeaderMetaData.ColumnTypeName == 'FollowUpButtonColumn') {
                var divOutterHtml = "";
                if (RowData.IsManualAllocated && RowData.ActionStatus != "Completed") {
                    var aTag = document.createElement('a');
                    aTag.setAttribute("href", "javascript:void(0);");
                    aTag.setAttribute("class", "btn btn-default");
                    aTag.innerHTML = HeaderMetaData.DisplayName;
                    divOutterHtml = aTag.outerHTML;
                }
                html = html + '<td align="center">' + divOutterHtml + '</td>';
            }
            else if (HeaderMetaData.ColumnTypeName == 'ButtonColumn') {
                var divOutterHtml = "";
                var ColumnValue = myInstance.GetColumnValue(HeaderMetaData, RowData);
                if (ColumnValue == true) {
                    var innerHtml = '';
                    var aTag = document.createElement('a');
                    aTag.setAttribute("href", "javascript:void(0);");
                    aTag.setAttribute("class", "btn-floating btn-medium waves-effect waves-light");
                    aTag.setAttribute("currentRow", JSON.stringify(RowData));
                    if (HeaderMetaData.ColumnConfig.IsToolTipRequired != null && HeaderMetaData.ColumnConfig.IsToolTipRequired != undefined && HeaderMetaData.ColumnConfig.IsToolTipRequired) {
                        aTag.setAttribute("data-tooltip", HeaderMetaData.ColumnConfig.ToolTip);
                        aTag.setAttribute("data-position", "top");
                        aTag.setAttribute("data-delay", "50");
                    }
                    if (HeaderMetaData.ColumnConfig.ButtonControlStyle != undefined && HeaderMetaData.ColumnConfig.ButtonControlStyle != null)
                        aTag.setAttribute("class", HeaderMetaData.ColumnConfig.ButtonControlStyle.Styleclass);
                    if (HeaderMetaData.ColumnConfig.IsIconNeeded && HeaderMetaData.ColumnConfig.IconClass != '') {
                        innerHtml = '<i class="' + HeaderMetaData.ColumnConfig.IconClass + '"></i>';
                    }
                    aTag.innerHTML = innerHtml + '<span>' + HeaderMetaData.ColumnConfig.ButtonDisplayName + '</span>';
                    if (HeaderMetaData.CellClickEventHandler != undefined && HeaderMetaData.CellClickEventHandler != null && HeaderMetaData.CellClickEventHandler != '')
                        aTag.setAttribute("onclick", (HeaderMetaData.CellClickEventHandler + "(this, '" + myInstance.TableName + "', event)"));
                    divOutterHtml = aTag.outerHTML;
                }
                
                //html = html + '<td align="center" ' + (HeaderMetaData.Width != "Auto" ? 'width="' + HeaderMetaData.Width + '"' : "") + ' class = "no-padding"><nav class="z-depth-0 transparent row-but-opt"><div class="nav-wrapper template"><div class="row no-margin no-padding"><div class="col transparent no-margin no-padding">' + divOutterHtml + '</div></div></div></nav></td>';
                html = html + '<td align="center" ' + (HeaderMetaData.Width != "Auto" ? 'width="' + HeaderMetaData.Width + '"' : "") + ' class = "no-padding">' + divOutterHtml + '</td>';
            }
            else if (HeaderMetaData.ColumnTypeName == 'SubRowColumn') {
                var divOutterHtml = "";
                var IsActionAvailable = false;
                if (RowData.ActionCount != null && RowData.ActionCount != undefined && RowData.ActionCount > 0)
                    IsActionAvailable = true;
                //for (var DCLastUpdatedAnswerDetail in RowData.DCLastUpdatedAnswerDetailList) {
                //    var NCDetailsLst = RowData.DCLastUpdatedAnswerDetailList[DCLastUpdatedAnswerDetail].NCDetailsLst;
                //    if (NCDetailsLst != undefined && NCDetailsLst != null && NCDetailsLst.length > 0) {
                //        IsActionAvailable = true;
                //        break;
                //    }
                //}
                if (IsActionAvailable) {
                    var aTag = document.createElement("a");
                    aTag.setAttribute("href", "javascript:void(0);");
                    aTag.setAttribute("class", "btn btn-default details-control action");
                    aTag.innerHTML = HeaderMetaData.DisplayName;
                    aTag.id = HeaderMetaData.FieldName;
                    divOutterHtml = aTag.outerHTML;
                }
                html = html + '<td class="center">' + divOutterHtml + '</td>';
            }
            else if (HeaderMetaData.ColumnTypeName == 'Check')
                html = html + '<td id = "' + HeaderMetaData.FieldName + '">' + (ColumnValue == undefined || ColumnValue == null ? "" : (ColumnValue == 0 ? "" : "Y")) + '</td>';
            else {
                var styleclass = '';
                var tooltipHtml = '';
                if (HeaderMetaData.ColumnConfig.ColumnStyle != null && HeaderMetaData.ColumnConfig.ColumnStyle != undefined && HeaderMetaData.ColumnConfig.ColumnStyle.Styleclass != '') {
                    styleclass = HeaderMetaData.ColumnConfig.ColumnStyle.Styleclass;
                    if (HeaderMetaData.ColumnConfig.ColumnStyle.Styleclass.toLowerCase() == "breakcontentstyle" && ColumnValue != undefined && ColumnValue != null && ColumnValue != '') {
                        styleclass += ' tooltipped';
                        tooltipHtml = 'data-tooltip="' + (ColumnValue == undefined || ColumnValue == null ? "" : ColumnValue) + '" data-position="top" data-delay="50"';
                    }
                }
                if (!HeaderMetaData.Visible)
                    styleclass += ' hide';
                html = html + '<td ' + tooltipHtml + ' id = "' + HeaderMetaData.FieldName + '" ' +
                    (HeaderMetaData.Width != "Auto" ? 'width="' + HeaderMetaData.Width + '"' : "") + 'class="' + styleclass + '"' + '>' + (ColumnValue == undefined || ColumnValue == null ? "" : ColumnValue) + '</td>';
            }
        }
        return html;
    }

    var GetButtonControlDom = function (HeaderMetaData, RowData) {
        var aTag = null;
        if (HeaderMetaData.ColumnTypeName == 'ButtonColumn') {
            var ColumnValue = myInstance.GetColumnValue(HeaderMetaData, RowData);
            aTag = document.createElement('a');
            aTag.setAttribute("href", "javascript:void(0);");
            aTag.setAttribute("class", "btn btn-default");
            aTag.setAttribute("CurrentRow", JSON.stringify(RowData));
            aTag.innerHTML = HeaderMetaData.DisplayName;
            var span = document.createElement('span');
            span.setAttribute("class", "badge bg-color-red txt-color-white");
            span.innerHTML = ColumnValue;
            aTag.appendChild(span);
            if (HeaderMetaData.CellClickEventHandler != undefined && HeaderMetaData.CellClickEventHandler != null && HeaderMetaData.CellClickEventHandler != '')
                aTag.setAttribute("onclick", (HeaderMetaData.CellClickEventHandler + "(this, '" + myInstance.TableName + "')"));
        }
        return aTag;
    }

    this.GetColumnValue = function (HeaderMetaData, RowData) {

        var Answer = '';
        if (RowData.ApprovalUserLst != undefined && RowData[HeaderMetaData.FieldName] == undefined) {
            for (var usercnt = 1; usercnt <= RowData.ApprovalUserLst.length; usercnt++) {
                if (RowData.ApprovalUserLst[usercnt - 1][HeaderMetaData.FieldName.replace(usercnt, '')] != undefined)
                    Answer = RowData.ApprovalUserLst[usercnt - 1][HeaderMetaData.FieldName.replace(usercnt, '')];
                else if (HeaderMetaData.FieldName == 'ApprovalLevelCount')
                    Answer = Answer == '' ? 0 + 1 : parseInt(Answer) + 1;
            }
        }
        else if (RowData[HeaderMetaData.FieldName] != undefined && typeof (RowData[HeaderMetaData.FieldName]) == "object") {
            if (HeaderMetaData.IsGroupColumn == false && HeaderMetaData.SubColumns != undefined && HeaderMetaData.SubColumns != null
                && HeaderMetaData.SubColumns.length > 0) {
                for (var itr = 0; itr < HeaderMetaData.SubColumns.length; itr++) {
                    var oSubColumn = HeaderMetaData.SubColumns[itr];
                    if (oSubColumn.Visible) {
                        for (var usercnt = 0; usercnt < RowData[HeaderMetaData.FieldName].length; usercnt++) {
                            if (RowData[HeaderMetaData.FieldName][usercnt][oSubColumn.FieldName] != undefined)
                                Answer = (Answer == '' ? '' : (Answer + ', ')) + RowData[HeaderMetaData.FieldName][usercnt][oSubColumn.FieldName];
                        }
                    }
                }
            }
        }
        else if ((RowData.ImmediateParentNodeDict != undefined && RowData[HeaderMetaData.FieldName] === undefined) && (HeaderMetaData.FieldName.toLowerCase() == "parentnodeid" || HeaderMetaData.FieldName.toLowerCase() == "parentnodename")) {
            for (var ImmediateParent in RowData.ImmediateParentNodeDict) {
                var _ImmediateParentNode = RowData.ImmediateParentNodeDict[ImmediateParent];
                if (HeaderMetaData.FieldName.toLowerCase() == "parentnodeid") {
                    if (Answer == '')
                        Answer = ImmediateParent;
                    else
                        Answer = Answer + "|" + ImmediateParent;
                }
                else if (HeaderMetaData.FieldName.toLowerCase() == "parentnodename") {
                    if (Answer == '')
                        Answer = _ImmediateParentNode;
                    else
                        Answer = Answer + " | " + _ImmediateParentNode;
                }
            }
        }
        else if (HeaderMetaData.FieldName != undefined && HeaderMetaData.FieldName != null && HeaderMetaData.FieldName.toLowerCase() == 'sampletypename') {
            if (RowData.TemplateId == 1369)
                Answer = "Food";
            else if (RowData.TemplateId == 1529)
                Answer = "Water";
            else if (RowData.TemplateId == 1655)
                Answer = "Ice";
            else if (RowData.TemplateId == 1778)
                Answer = "Air";
            else if (RowData.TemplateId == 1808)
                Answer = "Hand Swab";
            else if (RowData.TemplateId == 1837)
                Answer = "Equipment Swab";
            else if (RowData.TemplateId == 1875)
                Answer = "Linen";
            else if (RowData.TemplateId == 1917)
                Answer = "Allergen";
        }
        else if (RowData._DCSchedularProfileRequestDTOLst != undefined && RowData._DCSchedularProfileRequestDTOLst != null && RowData._DCSchedularProfileRequestDTOLst.length > 0 && RowData[HeaderMetaData.FieldName] === undefined) {
            for (var Schedule = 0; Schedule < RowData._DCSchedularProfileRequestDTOLst.length; Schedule++) {
                var _Schedule = RowData._DCSchedularProfileRequestDTOLst[Schedule];
                if (HeaderMetaData.ColumnTypeName.toLowerCase() == 'datecolumn') {
                    if (_Schedule[HeaderMetaData.FieldName] != null) {
                        if (Answer == '')
                            Answer = moment(JSON.parseWithDate(JSON.stringify(_Schedule[HeaderMetaData.FieldName]))).format('D-MM-YYYY H:mm:ss');
                        else
                            Answer = Answer + "|" + moment(JSON.parseWithDate(JSON.stringify(_Schedule[HeaderMetaData.FieldName]))).format('D-MM-YYYY H:mm:ss');
                    }
                }
                else {
                    if (Answer == '')
                        Answer = _Schedule[HeaderMetaData.FieldName];
                    else
                        Answer = Answer + "|" + _Schedule[HeaderMetaData.FieldName];
                }
            }
        }
        else if (RowData.ParetNodeDict != undefined && RowData[HeaderMetaData.FieldName] == undefined) {
            for (var ParetNode in RowData.ParetNodeDict) {
                if (HeaderMetaData.AttributeNodeId != null && HeaderMetaData.AttributeNodeId != undefined)
                {
                    if (ParetNode == HeaderMetaData.AttributeNodeId.toString()) {
                        var _ParentNodeDict = RowData.ParetNodeDict[ParetNode];
                        for (var _ParentNode in _ParentNodeDict) {
                            var _otherparentnode = _ParentNodeDict[_ParentNode];
                            if (HeaderMetaData.FieldName.toLowerCase().indexOf("parentnodeid") > -1) {
                                if (Answer == '')
                                    Answer = _ParentNode;
                                else
                                    Answer = Answer + "|" + _ParentNode;
                            }
                            else if (HeaderMetaData.FieldName.toLowerCase().indexOf("parentnodename") > -1) {
                                if (Answer == '')
                                    Answer = _otherparentnode;
                                else
                                    Answer = Answer + " | " + _otherparentnode;
                            }
                        }
                    }
                }
                //
                else if (HeaderMetaData.ColumnTypeName.toLowerCase() != 'checkcolumn') {
                    if (HeaderMetaData.Expression != undefined && HeaderMetaData.Expression != null && HeaderMetaData.Expression != '') {
                        if (RowData[HeaderMetaData.DataDisplayPropertyName] != undefined && typeof (RowData[HeaderMetaData.DataDisplayPropertyName]) == "object") {
                            var DataDisplayObject = RowData[HeaderMetaData.DataDisplayPropertyName];
                            try {
                                Answer = eval(HeaderMetaData.Expression);
                            }
                            catch (ex) {
                                Answer = '';
                                console.log('evaluation failed.')
                            }
                        }
                        else {
                            try {
                                Answer = eval(HeaderMetaData.Expression);
                            }
                            catch (ex) {
                                Answer = '';
                                console.log('evaluation failed.')
                            }
                        }
                    }
                    else {
                        if (HeaderMetaData.DataDisplayPropertyName != undefined && HeaderMetaData.DataDisplayPropertyName != null && HeaderMetaData.DataDisplayPropertyName != '')
                            Answer = RowData[HeaderMetaData.DataDisplayPropertyName];
                        else if (HeaderMetaData.FieldName != undefined && HeaderMetaData.FieldName != null && HeaderMetaData.FieldName != '')
                            Answer = RowData[HeaderMetaData.FieldName];
                    }
                }
                //
            }
        }
        else if (RowData.AuditTrailList != undefined && RowData[HeaderMetaData.FieldName] == undefined) {
            for (var AuditTrail = 0; AuditTrail < RowData.AuditTrailList.length; AuditTrail++) {
                var _AuditTrail = RowData.AuditTrailList[AuditTrail];
                if (Answer == '')
                    Answer = _AuditTrail.TableName + " - " + _AuditTrail.DBOperation + " - " + _AuditTrail.RowNumber;
                else
                    Answer = Answer + "|" + _AuditTrail.TableName + " - " + _AuditTrail.DBOperation + " - " + _AuditTrail.RowNumber;
            }
        }
        else if (HeaderMetaData.FieldName.toLowerCase() == 'usercomments') {
            if (RowData.DCApprovedUserDetailsList != undefined && RowData.DCApprovedUserDetailsList != null) {
                for (var usercnt in RowData.DCApprovedUserDetailsList) {
                    if (Answer == '') {
                        Answer = RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserName;
                        if (Answer == undefined || Answer == null || Answer == '')
                            Answer = RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments;
                        else {
                            Answer = Answer + (RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments == undefined || RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments == null ||
                                RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments == '' ? '' : (' - ' + RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments));
                        }
                    }
                    else {
                        var userdetail = '';
                        userdetail = RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserName;
                        if (userdetail == undefined || userdetail == null || userdetail == '')
                            userdetail = RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments;
                        else {
                            userdetail = userdetail + (RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments == undefined || RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments == null ||
                                RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments == '' ? '' : (' - ' + RowData.DCApprovedUserDetailsList[usercnt].ApprovedUserComments));
                        }
                        if (userdetail != undefined && userdetail != null && userdetail != '')
                            Answer = Answer + " | " + userdetail;
                    }
                }
            }
        }
        else if (HeaderMetaData.FieldName.toLowerCase() == 'username' && RowData.DcUserName != undefined) {
            Answer = RowData.DcUserName;
        }
        else if (HeaderMetaData.FieldName.toLowerCase() == 'ncorobercationcheck') {
            if (RowData.DCNCDTO != undefined && RowData.DCNCDTO != null && RowData.DCNCDTO.length > 0) {
                if (RowData.DCNCDTO[0].IsNc)
                    Answer = '1';
                else if (RowData.DCNCDTO[0].IsObservation)
                    Answer = '2';
                else
                    Answer = '3';
            }
        }
        else if (HeaderMetaData.FieldName.toLowerCase() == 'placename' && RowData.DcPlaceName != undefined) {
            Answer = RowData.DcPlaceName;
        }
        else if (HeaderMetaData.FieldName.toLowerCase() == 'templatename' && RowData.DcTemplateName != undefined) {
            Answer = RowData.DcTemplateName;
        }
        //else if (HeaderMetaData.FieldName.toLowerCase() == 'createdate') {
        //    Answer = JSON.parseWithDate(JSON.stringify(RowData.Date.format('dd-MM-yyyy hh:mm:SS')));
        //}
            //else if (HeaderMetaData.FieldName.toLowerCase() == 'actioncount' && RowData["ActionCount"] == undefined && RowData.DCLastUpdatedAnswerDetailList != null && RowData.DCLastUpdatedAnswerDetailList != undefined) {
            //    var AnswerNo = '';
            //    var ActionCount = 0;
            //    for (var DCLastUpdatedAnswerDetail in RowData.DCLastUpdatedAnswerDetailList) {
            //        AnswerNo = RowData.DCLastUpdatedAnswerDetailList[DCLastUpdatedAnswerDetail].Answer;
            //        if (AnswerNo == '2' || AnswerNo == '3')
            //            ActionCount += 1;
            //    }
            //    Answer = ActionCount.toString();
            //}
        else if (HeaderMetaData.SubColumns != undefined && !HeaderMetaData.IsGroupColumn && HeaderMetaData.ColumnTypeName.toLowerCase() == 'mergecolumn') {
            for (var usercnt in HeaderMetaData.SubColumns) {
                if (HeaderMetaData.SubColumns[usercnt].FieldName != undefined && HeaderMetaData.SubColumns[usercnt].AttributeNodeId > 0 && HeaderMetaData.SubColumns[usercnt].AttributeNodeId != undefined) {
                    if (Answer == '') {
                        if (RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId] != undefined && RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].AnswerValue == '' && RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].Answer != "")
                            Answer = HeaderMetaData.SubColumns[usercnt].DisplayName + " : " + RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].Answer;
                        else if (RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId] != undefined && RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].AnswerValue != '')
                            Answer = HeaderMetaData.SubColumns[usercnt].DisplayName + " : " + RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].AnswerValue;
                    }
                    else {
                        if (RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId] != undefined && RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].AnswerValue == '' && RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].Answer != "")
                            Answer = Answer + "<br />" + (HeaderMetaData.SubColumns[usercnt].DisplayName + " : " + RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].Answer);
                        else if (RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId] != undefined && RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].AnswerValue != '')
                            Answer = Answer + "<br />" + (HeaderMetaData.SubColumns[usercnt].DisplayName + " : " + RowData.DCLastUpdatedAnswerDetailList[HeaderMetaData.SubColumns[usercnt].AttributeNodeId].AnswerValue);
                    }
                }
                else if (HeaderMetaData.SubColumns[usercnt].FieldName != undefined) {
                    if (Answer == '')
                        Answer = (RowData[HeaderMetaData.SubColumns[usercnt].FieldName] != undefined && RowData[HeaderMetaData.SubColumns[usercnt].FieldName] != null &&
                            RowData[HeaderMetaData.SubColumns[usercnt].FieldName] != '' ? (HeaderMetaData.SubColumns[usercnt].DisplayName + " : " + RowData[HeaderMetaData.SubColumns[usercnt].FieldName]) : "");
                    else
                        Answer = Answer + (RowData[HeaderMetaData.SubColumns[usercnt].FieldName] != undefined && RowData[HeaderMetaData.SubColumns[usercnt].FieldName] != null &&
                            RowData[HeaderMetaData.SubColumns[usercnt].FieldName] != '' ? ("\n" + HeaderMetaData.SubColumns[usercnt].DisplayName + " : " + RowData[HeaderMetaData.SubColumns[usercnt].FieldName]) : "");
                }
            }
        }
        else if (HeaderMetaData.SubColumns != undefined && !HeaderMetaData.IsGroupColumn) {
            for (var usercnt in HeaderMetaData.SubColumns) {
                if (typeof (HeaderMetaData.SubColumns[usercnt]) != 'function') {
                    if (Answer == '') {
                        Answer = myInstance.GetColumnValue(HeaderMetaData.SubColumns[usercnt], RowData);
                    }
                    else {
                        var propertyValue = myInstance.GetColumnValue(HeaderMetaData.SubColumns[usercnt], RowData);
                        Answer = Answer + (propertyValue != undefined && propertyValue != null && propertyValue != '' ? (" | " + propertyValue) : "");
                    }
                }
            }
        }
        else if (HeaderMetaData.ColumnTypeName.toLowerCase() == 'datetimecolumn') {
            if (RowData[HeaderMetaData.FieldName] != null)
                Answer = moment(JSON.parseWithDate(JSON.stringify(RowData[HeaderMetaData.FieldName]))).format('DD-MM-YYYY H:mm:ss');// JSON.parseWithDate(JSON.stringify(RowData[HeaderMetaData.FieldName])).toLocaleString();
        }
        else if (HeaderMetaData.ColumnTypeName.toLowerCase() == 'datecolumn') {
            if (RowData[HeaderMetaData.FieldName] != null)
                Answer = moment(JSON.parseWithDate(JSON.stringify(RowData[HeaderMetaData.FieldName]))).format('DD-MM-YYYY H:mm:ss');// JSON.parseWithDate(JSON.stringify(RowData[HeaderMetaData.FieldName])).format('dd-MM-yyyy hh:mm:SS');
        }
        else if (HeaderMetaData.ColumnTypeName.toLowerCase() == 'imagedisplaycolumn') {
            if (RowData.MultiMediaSubElementShiftLst != undefined && RowData.MultiMediaSubElementShiftLst != null) {
                for (var itr = 0; itr < RowData.MultiMediaSubElementShiftLst.length; itr++) {
                    var url = '';
                    var Id = '';
                    if (Answer != '' && Answer != undefined && Answer != null) {
                        url = RowData.MultiMediaSubElementShiftLst[itr].Url;
                        Id = RowData.MultiMediaSubElementShiftLst[itr].id;
                        if (url != '' && url != undefined && url != null && Id != undefined && Id != null && Id > 0)
                            Answer = Answer + "|" + (Id + "$sp$" + url);
                    }
                    else {
                        url = RowData.MultiMediaSubElementShiftLst[itr].Url;
                        Id = RowData.MultiMediaSubElementShiftLst[itr].id;
                        if (url != '' && url != undefined && url != null && Id != undefined && Id != null && Id > 0)
                            Answer = Id + "$sp$" + url;
                    }
                }
            }
        }
        else if (HeaderMetaData.ColumnTypeName.toLowerCase() == 'buttoncolumn' && (HeaderMetaData.Expression == undefined || HeaderMetaData.Expression == null || HeaderMetaData.Expression == "")
            && (HeaderMetaData.DataDisplayPropertyName == undefined || HeaderMetaData.DataDisplayPropertyName == null || HeaderMetaData.DataDisplayPropertyName == "")) {
            Answer = true;
        }
        else if (HeaderMetaData.ColumnTypeName.toLowerCase() != 'checkcolumn') {
            if (HeaderMetaData.Expression != undefined && HeaderMetaData.Expression != null && HeaderMetaData.Expression != '') {
                if (RowData[HeaderMetaData.DataDisplayPropertyName] != undefined && typeof (RowData[HeaderMetaData.DataDisplayPropertyName]) == "object") {
                    var DataDisplayObject = RowData[HeaderMetaData.DataDisplayPropertyName];
                    try {
                        Answer = eval(HeaderMetaData.Expression);
                    }
                    catch (ex) {
                        Answer = '';
                        console.log('evaluation failed.')
                    }
                }
                else {
                    try {
                        Answer = eval(HeaderMetaData.Expression);
                    }
                    catch (ex) {
                        Answer = '';
                        console.log('evaluation failed.')
                    }
                }
            }
            else {
                if (HeaderMetaData.DataDisplayPropertyName != undefined && HeaderMetaData.DataDisplayPropertyName != null && HeaderMetaData.DataDisplayPropertyName != '')
                    Answer = RowData[HeaderMetaData.DataDisplayPropertyName];
                else if (HeaderMetaData.FieldName != undefined && HeaderMetaData.FieldName != null && HeaderMetaData.FieldName != '')
                    Answer = RowData[HeaderMetaData.FieldName];
            }
        }
        return Answer;
    }

    this.GetValueForTimeColumn = function (DataDisplayObject, AttributeId, ColumnName) {
        var attributeObject = DataDisplayObject[AttributeId];
        var Answer = '';
        if (ColumnName != undefined && ColumnName != null && ColumnName != '') {
            Answer = attributeObject[ColumnName];
            if (Answer != null && typeof (Answer) == 'string')
                Answer = Answer.split(' ')[1];
            else
                Answer = moment(JSON.parseWithDate(JSON.stringify(Answer))).format('H:mm');
        }
        else {
            if (attributeObject != null && attributeObject != undefined) {
                if (attributeObject.AnswerValue != undefined && attributeObject.AnswerValue != null && attributeObject.AnswerValue != '')
                    Answer = attributeObject.AnswerValue;
                else
                    Answer = attributeObject.Answer;
                if (Answer != null && typeof (Answer) == 'string')
                    Answer = Answer.split(' ')[1];
                else
                    Answer = moment(JSON.parseWithDate(JSON.stringify(Answer))).format('H:mm');
            }
        }
        return Answer;
    }

    this.GetValueForDateTimeColumn = function (DataDisplayObject, ColumnName) {
        var Answer = '';
        if (ColumnName != undefined && ColumnName != null && ColumnName != '') {
            Answer = DataDisplayObject[ColumnName];
            if (Answer != null && Answer != undefined && Answer != '')
                Answer = moment(JSON.parseWithDate(JSON.stringify(Answer))).format('DD-MM-YYYY H:mm:ss');
        }
        return Answer;
    }

    this.GetValueBasedOnPropertyName = function (RowData, PropertyNameLst) {
        var Answer = '';
        for (var jtr = 0; jtr < PropertyNameLst.length; jtr++) {
            var currentSelectedValue = RowData[PropertyNameLst[jtr]];
            if (Answer == '') {
                Answer = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
            }
            else
                Answer = Answer + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (" | " + currentSelectedValue) : '');
        }
        return (Answer != undefined && Answer!= null ? Answer : '');
    }

    this.GetValueBasedOnPropertyName_inventory = function (RowData, PropertyName) {
        var Answer = '';
        for (var jtr = 0; jtr < PropertyName.length; jtr++) {
            var currentSelectedValue = RowData[PropertyName[jtr]];
            if (Answer == '') {
                Answer = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
            }
            else
                Answer = Answer + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (" | " + currentSelectedValue) : '');
        }
        return (Answer != undefined && Answer != null ? Answer : '');
    }

    this.GetValueBasedOnAttributeIdWithOutNCCheck = function (DataDisplayObject, AttributeId, ColumnName) {
        var attributeObject = DataDisplayObject[AttributeId];
        var Answer = '';
        if (ColumnName != undefined && ColumnName != null && ColumnName != '') {
            Answer = attributeObject[ColumnName];
        }
        else {
            if (attributeObject != null && attributeObject != undefined) {
                if (attributeObject.IsMulti != undefined && attributeObject.IsMulti != null && attributeObject.IsMulti.toLowerCase() == "true") {
                    var LastUpdatedResultAnswerLst = attributeObject.DcLastUpdatedResultAnswerLst;
                    if (LastUpdatedResultAnswerLst != null && LastUpdatedResultAnswerLst != undefined && LastUpdatedResultAnswerLst.length > 0) {
                        for (var itr = 0; itr < LastUpdatedResultAnswerLst.length; itr++) {
                            if (Answer != '' && Answer != null) {
                                if (LastUpdatedResultAnswerLst[itr].AnswerValue != undefined && LastUpdatedResultAnswerLst[itr].AnswerValue != null && LastUpdatedResultAnswerLst[itr].AnswerValue != '')
                                    Answer = Answer + " | " + LastUpdatedResultAnswerLst[itr].AnswerValue;
                                else if (LastUpdatedResultAnswerLst[itr].Answer != undefined && LastUpdatedResultAnswerLst[itr].Answer != null && LastUpdatedResultAnswerLst[itr].Answer != '')
                                    Answer = Answer + " | " + LastUpdatedResultAnswerLst[itr].Answer;
                            }
                            else {
                                if (LastUpdatedResultAnswerLst[itr].AnswerValue != undefined && LastUpdatedResultAnswerLst[itr].AnswerValue != null && LastUpdatedResultAnswerLst[itr].AnswerValue != '')
                                    Answer = LastUpdatedResultAnswerLst[itr].AnswerValue;
                                else if (LastUpdatedResultAnswerLst[itr].Answer != undefined && LastUpdatedResultAnswerLst[itr].Answer != null && LastUpdatedResultAnswerLst[itr].Answer != '')
                                    Answer = LastUpdatedResultAnswerLst[itr].Answer;
                            }
                        }
                    }
                }
                else {
                    if (attributeObject.AnswerValue != undefined && attributeObject.AnswerValue != null && attributeObject.AnswerValue != '')
                        Answer = attributeObject.AnswerValue;
                    else
                        Answer = attributeObject.Answer;
                }
            }
        }
        return Answer;
    }

    this.GetParentInfoBasedOnParentTypeId = function (DataDisplayObject, ParentTypeId, ColumnName) {
        var attributeObject = DataDisplayObject[ParentTypeId];
        var Answer = '';

        if (Answer == undefined || Answer == null || Answer == '') {
            if (ColumnName != undefined && ColumnName != null && ColumnName != '') {
                if (attributeObject != undefined && attributeObject != null && attributeObject.constructor == Object && ColumnName != undefined && ColumnName != null && ColumnName.toLowerCase() == "key") {
                    for (var item in attributeObject) {
                        if (typeof (attributeObject[item]) != 'function') {
                            var userdetail = '';
                            if (Answer != undefined && Answer != '' && Answer != null)
                                Answer = Answer + " | ";
                            var currentSelectedValue = item;
                            if (userdetail == '')
                                userdetail = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
                            else
                                userdetail = userdetail + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (", " + currentSelectedValue) : '');
                            Answer = Answer + userdetail;
                        }
                    }
                }
                else if (attributeObject != undefined && attributeObject != null && attributeObject.constructor == Object && ColumnName != undefined && ColumnName != null && ColumnName.toLowerCase() == "value") {
                    for (var item in attributeObject) {
                        if (typeof (attributeObject[item]) != 'function') {
                            var userdetail = '';
                            if (Answer != undefined && Answer != '' && Answer != null)
                                Answer = Answer + " | ";
                            var currentSelectedValue = attributeObject[item];
                            if (userdetail == '')
                                userdetail = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
                            else
                                userdetail = userdetail + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (", " + currentSelectedValue) : '');
                            Answer = Answer + userdetail;
                        }
                    }
                }
            }
        }

        else if (ColumnName != undefined && ColumnName != null && ColumnName != '') {
            Answer = attributeObject[ColumnName];

        }
        else {
            if (attributeObject != null && attributeObject != undefined) {
                if (attributeObject.IsMulti != undefined && attributeObject.IsMulti != null && attributeObject.IsMulti.toLowerCase() == "true") {
                    var LastUpdatedResultAnswerLst = attributeObject.DcLastUpdatedResultAnswerLst;
                    if (LastUpdatedResultAnswerLst != null && LastUpdatedResultAnswerLst != undefined && LastUpdatedResultAnswerLst.length > 0) {
                        for (var itr = 0; itr < LastUpdatedResultAnswerLst.length; itr++) {
                            if (Answer != '' && Answer != null) {
                                if (LastUpdatedResultAnswerLst[itr].AnswerValue != undefined && LastUpdatedResultAnswerLst[itr].AnswerValue != null && LastUpdatedResultAnswerLst[itr].AnswerValue != '')
                                    Answer = Answer + " | " + LastUpdatedResultAnswerLst[itr].AnswerValue;
                                else if (LastUpdatedResultAnswerLst[itr].Answer != undefined && LastUpdatedResultAnswerLst[itr].Answer != null && LastUpdatedResultAnswerLst[itr].Answer != '')
                                    Answer = Answer + " | " + LastUpdatedResultAnswerLst[itr].Answer;
                            }
                            else {
                                if (LastUpdatedResultAnswerLst[itr].AnswerValue != undefined && LastUpdatedResultAnswerLst[itr].AnswerValue != null && LastUpdatedResultAnswerLst[itr].AnswerValue != '')
                                    Answer = LastUpdatedResultAnswerLst[itr].AnswerValue;
                                else if (LastUpdatedResultAnswerLst[itr].Answer != undefined && LastUpdatedResultAnswerLst[itr].Answer != null && LastUpdatedResultAnswerLst[itr].Answer != '')
                                    Answer = LastUpdatedResultAnswerLst[itr].Answer;
                            }
                        }
                    }
                }
                else {
                    if (attributeObject.AnswerValue != undefined && attributeObject.AnswerValue != null && attributeObject.AnswerValue != '')
                        Answer = attributeObject.AnswerValue;
                    else
                        Answer = attributeObject.Answer;
                }
            }
        }
        return Answer;
    }

    this.GetValueBasedOnAttributeIdWithNCCheck = function (DataDisplayObject, AttributeId, ColumnName) {
        var attributeObject = DataDisplayObject[AttributeId];
        var Answer = '';
        if (ColumnName != undefined && ColumnName != null && ColumnName != '') {
            Answer = attributeObject[ColumnName];
        }
        else {
            if (attributeObject != null && attributeObject != undefined) {
                if (attributeObject.IsMulti != undefined && attributeObject.IsMulti != null && attributeObject.IsMulti.toLowerCase() == "true") {
                    var LastUpdatedResultAnswerLst = attributeObject.DcLastUpdatedResultAnswerLst;
                    if (LastUpdatedResultAnswerLst != null && LastUpdatedResultAnswerLst != undefined && LastUpdatedResultAnswerLst.length > 0) {
                        for (var itr = 0; itr < LastUpdatedResultAnswerLst.length; itr++) {
                            if (Answer != '' && Answer != null) {
                                if (LastUpdatedResultAnswerLst[itr].AnswerValue != undefined && LastUpdatedResultAnswerLst[itr].AnswerValue != null && LastUpdatedResultAnswerLst[itr].AnswerValue != '')
                                    Answer = Answer + " | " + LastUpdatedResultAnswerLst[itr].AnswerValue;
                                else if (LastUpdatedResultAnswerLst[itr].Answer != undefined && LastUpdatedResultAnswerLst[itr].Answer != null && LastUpdatedResultAnswerLst[itr].Answer != '')
                                    Answer = Answer + " | " + LastUpdatedResultAnswerLst[itr].Answer;
                            }
                            else {
                                if (LastUpdatedResultAnswerLst[itr].AnswerValue != undefined && LastUpdatedResultAnswerLst[itr].AnswerValue != null && LastUpdatedResultAnswerLst[itr].AnswerValue != '')
                                    Answer = LastUpdatedResultAnswerLst[itr].AnswerValue;
                                else if (LastUpdatedResultAnswerLst[itr].Answer != undefined && LastUpdatedResultAnswerLst[itr].Answer != null && LastUpdatedResultAnswerLst[itr].Answer != '')
                                    Answer = LastUpdatedResultAnswerLst[itr].Answer;
                            }
                        }
                    }
                }
                else {
                    if (attributeObject.AnswerValue != undefined && attributeObject.AnswerValue != null && attributeObject.AnswerValue != '')
                        Answer = attributeObject.AnswerValue;
                    else
                        Answer = attributeObject.Answer;
                }
            }
        }
        if (Answer != undefined && Answer != null && Answer != '' && DataDisplayObject[AttributeId].NCDetailsLst != undefined && DataDisplayObject[AttributeId].NCDetailsLst != null &&
            DataDisplayObject[AttributeId].NCDetailsLst.length > 0 && DataDisplayObject[AttributeId].NCDetailsLst != undefined && AttributeId) {
            var NCCheck = false;
            for (var itr = 0; itr < DataDisplayObject[AttributeId].NCDetailsLst.length; itr++) {
                if (DataDisplayObject[AttributeId].NCDetailsLst[itr].AttributeId == AttributeId && DataDisplayObject[AttributeId].NCDetailsLst[itr].IsNc)
                    NCCheck = true;
            }
            if (NCCheck)
                Answer = '<div class="nc">' + Answer + '</div>';
        }
        return Answer;
    }

    /* DataDisplayObject : Which object need to use,
       PropertyNameLst : list of property name need to use in the value.ex:) ["Name", "ChildType"] or ["Name"]
    */
    this.GetCommaSeperatedValue = function (DataDisplayObject, PropertyNameLst, IsPropertyAsItem) {
        var Answer = '';
        if (DataDisplayObject != undefined && DataDisplayObject != null && DataDisplayObject.constructor == Array)/* Object type as a Array */ {
            if (DataDisplayObject != undefined && DataDisplayObject != null && DataDisplayObject.length > 0 && PropertyNameLst != undefined && PropertyNameLst != null && PropertyNameLst.length > 0) {
                for (var itr = 0; itr < DataDisplayObject.length; itr++) {
                    var userdetail = '';
                    if (Answer != undefined && Answer != '' && Answer != null)
                        Answer = Answer + " | ";
                    for (var jtr = 0; jtr < PropertyNameLst.length; jtr++) {
                        var currentSelectedValue = DataDisplayObject[itr][PropertyNameLst[jtr]];
                        if (userdetail == '')
                            userdetail = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
                        else
                            userdetail = userdetail + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (", " + currentSelectedValue) : '');
                    }
                    Answer = Answer + userdetail;
                }
            }
        }
        else if (DataDisplayObject != undefined && DataDisplayObject != null && DataDisplayObject.constructor == Object)/* Object type as a Dictionary */ {
            if (DataDisplayObject != undefined && DataDisplayObject != null && (PropertyNameLst == undefined || PropertyNameLst == null || PropertyNameLst.length == 0)) {
                for (var item in DataDisplayObject) {
                    if (typeof (DataDisplayObject[item]) != 'function') {
                        var userdetail = '';
                        if (Answer != undefined && Answer != '' && Answer != null)
                            Answer = Answer + " | ";
                        Answer = Answer + DataDisplayObject[item];
                    }
                }
            }
            else if (DataDisplayObject != undefined && DataDisplayObject != null && PropertyNameLst != undefined && PropertyNameLst != null && PropertyNameLst.length > 0) {
                for (var item in DataDisplayObject) {
                    if (typeof (DataDisplayObject[item]) != 'function') {
                        var userdetail = '';
                        if (Answer != undefined && Answer != '' && Answer != null)
                            Answer = Answer + " | ";
                        for (var jtr = 0; jtr < PropertyNameLst.length; jtr++) {
                            var currentSelectedValue = '';
                            if (IsPropertyAsItem)
                                currentSelectedValue = DataDisplayObject[PropertyNameLst[jtr]];
                            else
                                currentSelectedValue = DataDisplayObject[item][PropertyNameLst[jtr]];
                            if (userdetail == '')
                                userdetail = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
                            else
                                userdetail = userdetail + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (", " + currentSelectedValue) : '');
                        }
                        Answer = Answer + userdetail;
                    }
                }
            }
        }
        return Answer;
    }

    this.GetCommaSeperatedValueWithLabel = function (DataDisplayObject, PropertyNameLst) {
        var Answer = '';
        if (DataDisplayObject != undefined && DataDisplayObject != null && DataDisplayObject.length > 0 && PropertyNameLst != undefined && PropertyNameLst != null && PropertyNameLst.length > 0) {
            for (var itr = 0; itr < DataDisplayObject.length; itr++) {
                var userdetail = '';
                if (Answer != undefined && Answer != '' && Answer != null)
                    Answer = Answer + " | ";
                for (var jtr = 0; jtr < PropertyNameLst.length; jtr++) {
                    var currentSelectedValue = DataDisplayObject[itr][PropertyNameLst[jtr].PropertyName];
                    if (PropertyNameLst[jtr].TypeOfProperty == "Date") {
                        currentSelectedValue = moment(JSON.parseWithDate(JSON.stringify(currentSelectedValue))).format('DD-MM-YYYY');
                    }
                    if (userdetail == '')
                        userdetail = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (PropertyNameLst[jtr].PropertyLabel + ' : ' + currentSelectedValue) : '');
                    else
                        userdetail = userdetail + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (", " + (PropertyNameLst[jtr].PropertyLabel + ' : ' + currentSelectedValue)) : '');
                }
                Answer = Answer + userdetail;
            }
        }
        return Answer;
    }

    this.GetConcatenateValues = function (PropertyNameLst) {
        var Answer = '';
        if (PropertyNameLst != undefined && PropertyNameLst != null && PropertyNameLst.length > 0) {
            for (var jtr = 0; jtr < PropertyNameLst.length; jtr++) {
                if (Answer == '')
                    Answer = PropertyNameLst[jtr];
                else {
                    var propertyValue = PropertyNameLst[jtr];
                    Answer = Answer + (propertyValue != undefined && propertyValue != null && propertyValue != '' ? (" | " + propertyValue) : "");
                }
            }
        }
        return Answer;
    }

    this.Filter = function (GraphElements, DataSource, DefaultExp) {

        //   var oGraphElements = GraphElements;
        //for (var dcIndex = 0; dcIndex < DataSource.length; dcIndex++) {
        var dcIndex = 0;
        while (true) {
            var _GraphElements = clone(GraphElements);

            var SearchItem = GetValue(DataSource[dcIndex]);
            var Isthere = IsValueThere_advance(DataSource[dcIndex], _GraphElements, DefaultExp);

            if (Isthere != true) {
                DataSource.remove(dcIndex);
            }
            else {
                dcIndex = dcIndex + 1;
            }

            if (dcIndex >= DataSource.length) {
                break;
            }

            //var DefaultExp = [{ 'AttributeNodeId': 10, 'ControlId': 'AddlAirlineControlId', Value: 'Ek 506' }];
            //var Isthere = IsValueThere_advance(DataSource[dcIndex], GraphElements, DefaultExp);                                    
        }

        return DataSource;
    }

    this.IsValueThere_advance = function (DataSourceItem, SearchKeyArray, DefaultExp) {

        var SearchItem = [];
        var IsExist = false;
        var TotalMatchedindex = 0;
        var totalKeyToSearch = SearchKeyArray.length;

        if (DefaultExp != undefined)
            IsExist = IsDefaultExpMatched(DataSourceItem.AttributeAnswers, DefaultExp);

        if ((DefaultExp == undefined) || (DefaultExp != undefined && IsExist == true)) {
            for (AttrNodeId in DataSourceItem.AttributeAnswers) {

                var AttrAnswerObj = DataSourceItem.AttributeAnswers[AttrNodeId];
                TotalMatchedindex = TotalMatchedindex + TotalGraphSearchMatchCount(AttrAnswerObj, SearchKeyArray);

                if (TotalMatchedindex >= totalKeyToSearch) {
                    return true;
                }
            }
            return IsExist;
        }
        else {
            return IsExist;
        }
    }

    this.IsDefaultExpMatched = function (DataSourceItem, DefaultExp) {
        var IsExist = false;
        for (expItr in DefaultExp) {

            //TODO:KeyIterate making probs,need to find permant solution
            if (typeof (DefaultExp[expItr]) == "function")
                break;

            var oDefaultExp = DefaultExp[expItr];
            if (DataSourceItem[oDefaultExp.AttributeNodeId] != undefined && DataSourceItem[oDefaultExp.AttributeNodeId][oDefaultExp.ControlId] != undefined) {
                var Answer = DataSourceItem[oDefaultExp.AttributeNodeId][oDefaultExp.ControlId].LastUpdatedResult.Answer;
                if (Answer == oDefaultExp.Value)
                    IsExist = true;
            }
            else {
                IsExist = false;
                return IsExist;
            }
        }
        return IsExist;
    }

    this.TotalGraphSearchMatchCount = function (AttrAnswerObj, SearchKeyArray) {

        var TotalMatchedindex = 0;
        var totalKeyToSearch = SearchKeyArray.length;

        for (ControlId in AttrAnswerObj) {

            var Answer;
            if (AttrAnswerObj[ControlId].LastUpdatedResult.AnswerValue == '') {
                Answer = AttrAnswerObj[ControlId].LastUpdatedResult.Answer;
            }
            else {
                Answer = AttrAnswerObj[ControlId].LastUpdatedResult.AnswerValue;
            }

            if (IsMathch(Answer, SearchKeyArray))
                TotalMatchedindex = TotalMatchedindex + 1;

            if (TotalMatchedindex == totalKeyToSearch)
                return TotalMatchedindex;
        }
        return TotalMatchedindex;
    }

    this.IsMathch = function (Answer, SearchKeyArray) {

        var IsMatched = false;
        for (var i = 0; i < SearchKeyArray.length; i++) {

            var s1 = Answer.toLowerCase();
            var s2 = SearchKeyArray[i].toLowerCase();
            //alert("s1 : " + s1 + ", s2 : : " + s2);
            if (s1.indexOf(s2) != -1) {
                SearchKeyArray.remove(i);
                IsMatched = true;
                break;
            }

            //var patt = new RegExp(Answer, 'i');
            //alert(Answer.search(patt));
            //if (Answer.search(patt) != -1) {
            //    SearchKeyArray.remove(i);
            //    IsMatched = true;
            //    break;
            //}
        }
        //alert("IsMatched : " + IsMatched);
        return IsMatched;
    }

    this.GetValue = function (DataSourceItem) {
        var SearchItem = [];
        for (AttrNodeId in DataSourceItem.AttributeAnswers) {
            var AttrAnswerObj = DataSourceItem.AttributeAnswers[AttrNodeId];
            for (ControlId in AttrAnswerObj) {
                var ControlAnswerObj = AttrAnswerObj[ControlId].LastUpdatedResult;
                SearchItem.push(ControlAnswerObj.Answer);
            }
        }
        return SearchItem;
    }

    this.GetValueBasedOnPropertyNameAndtheAttributeId_Inventory = function (DataDisplayObject, PropertyNameLst, AttributeId) {
        var Answer = '';
        if (DataDisplayObject != undefined && DataDisplayObject != null && DataDisplayObject.constructor == Array) {
            if (DataDisplayObject != undefined && DataDisplayObject != null && DataDisplayObject.length > 0 && PropertyNameLst != undefined && PropertyNameLst != null && PropertyNameLst.length > 0) {
                for (var itr = 0; itr < DataDisplayObject.length; itr++) {
                    for (var jtr = 0; jtr < PropertyNameLst.length; jtr++) {
                        if (DataDisplayObject[itr]["AttributeId"] == AttributeId)
                        {
                            var currentSelectedValue = DataDisplayObject[itr][PropertyNameLst[jtr]];
                            if (Answer == '') {
                                Answer = (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? currentSelectedValue : '');
                            }
                            else
                                Answer = Answer + (currentSelectedValue != undefined && currentSelectedValue != null && currentSelectedValue !== '' ? (" | " + currentSelectedValue) : '');
                        }
                    }

                }
            }
        }
        return (Answer != undefined && Answer != null ? Answer : '');
    }
   
}

function SelectALLCheckBoxClickEvent(currObj, ControlId) {
    var gridControl = $("#" + ControlId + " tbody");
    if (currObj.checked == true) {
        if (gridControl != undefined && gridControl != null) {
            var rows = gridControl[0].rows;
            for (var itr = 0; itr < rows.length; itr++) {
                var rowIndex = rows[itr].getAttribute("rowIndex");
                var IdColumn = rows[itr].childNodes['0'];
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
                    $(rows[itr]).addClass('row-selected');
                    if (selected.indexOf(Id) == -1 && Id != undefined && Id != null && Id != '')
                        selected.push(Id);
                    if ($("Chk_" + Id) != undefined && $("Chk_" + Id) != null && $("Chk_" + Id).context.getElementById("Chk_" + Id) != null)
                        $("Chk_" + Id).context.getElementById("Chk_" + Id).checked = true;
                }
            }
        }
    }
    else {
        if (gridControl != undefined && gridControl != null) {
            var rows = gridControl[0].rows;
            for (var itr = 0; itr < rows.length; itr++) {
                var rowIndex = rows[itr].getAttribute("rowIndex");
                var IdColumn = rows[itr].childNodes['0'];
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
                    $(rows[itr]).removeClass('row-selected');
                    var index = selected.indexOf(Id);
                    if (index != -1)
                        selected.splice(index, 1);
                    if ($("Chk_" + Id).context.getElementById("Chk_" + Id) != null)
                        $("Chk_" + Id).context.getElementById("Chk_" + Id).checked = false;
                }
            }
        }
    }
}

Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

/* Pending Approval Grid */

function LoadPendingAppGridData(Url, DataUrl, Model, TableName, divId) {
    MetaData = [];
    var result;
    var parameterToLoadData;
    var IsGroupColumnContain;

    if (Model == "DashBoard") {
        var templateValue = (document.getElementById("ddl_Template").value != null && document.getElementById("ddl_Template").value != undefined && document.getElementById("ddl_Template").value != '' ? document.getElementById("ddl_Template").value : 0);
        var PlaceValue = (document.getElementById("ddl_Place").value != null && document.getElementById("ddl_Place").value != undefined && document.getElementById("ddl_Place").value != '' ? document.getElementById("ddl_Place").value : 0);
        var PlaceDimension = (document.getElementById("ddl_PlaceDimension").value != null && document.getElementById("ddl_PlaceDimension").value != undefined && document.getElementById("ddl_PlaceDimension").value != '' ? document.getElementById("ddl_PlaceDimension").value : 0);
        parameterToLoadData = {
            Param: "DashBoard", Date: document.getElementById("daterange3").getElementsByTagName("span")[0].innerHTML, Template: templateValue,
            Place: PlaceValue, PlaceDimension: PlaceDimension
        };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        parameterToLoadData = { request: parameterToLoadData, PageSize: 5, CurrentPage: 1, SortColumnName: "", SortType: "OrderBy" };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        IsGroupColumnContain = false;
    }
    else if (Model != null) {
        var _DynamicPage = new DynamicPage(Model);
        var GridLoadParameters = [];
        for (var item in Model.ControlConfigDict) {
            if (Model.ControlConfigDict[item].ControlTypeName != "Label")
                GridLoadParameters.push(Model.ControlConfigDict[item].ClientID)
        }
        parameterToLoadData = _DynamicPage.GetLoadParameterList(GridLoadParameters);
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        parameterToLoadData = { request: parameterToLoadData, PageSize: 5, CurrentPage: 1, SortColumnName: "", SortType: "OrderBy" };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        IsGroupColumnContain = true;
    }

    $.ajax({
        url: Url,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: parameterToLoadData,
        async: true,
        success: function (response) {
            //result = JSON.parse(response.d);
            result = response;
            result = result.ColumnConfigList;

            CreateMetaDataColumn(result, false);

            var oGridControl = new GridControl();
            var Row;
            Row = oGridControl.LoadHeaderRow(MetaData, TableName);

            //oGridControl.RegisterRowClickEvent("GridFacade", "RowClick");
            //if (Model == "DashBoard") {
            GetPAPPDataSource(Url, DataUrl, parameterToLoadData, TableName, Row, divId);
            //}
            //else {
            //    RowLst = oGridControl.LoadGrid(GetDataSource(DataUrl, parameterToLoadData), new Array(), MetaData, "", TableName);
            //    document.getElementById(TableName).innerHTML = "";
            //    document.getElementById(TableName).innerHTML = Row + '<tbody>' + RowLst + '</tbody>';
            //}
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
        }
    });
}

function LoadDcPendingAppGridData(Url, DataUrl, Model, TableName, divId) {
    MetaData = [];
    var result;
    var parameterToLoadData;
    var IsGroupColumnContain;

    if (Model == "DashBoard") {
        var templateValue = (document.getElementById("ddl_Template").value != null && document.getElementById("ddl_Template").value != undefined && document.getElementById("ddl_Template").value != '' ? document.getElementById("ddl_Template").value : 0);
        var PlaceValue = (document.getElementById("ddl_Place").value != null && document.getElementById("ddl_Place").value != undefined && document.getElementById("ddl_Place").value != '' ? document.getElementById("ddl_Place").value : 0);
        var PlaceDimension = (document.getElementById("ddl_PlaceDimension").value != null && document.getElementById("ddl_PlaceDimension").value != undefined && document.getElementById("ddl_PlaceDimension").value != '' ? document.getElementById("ddl_PlaceDimension").value : 0);
        parameterToLoadData = {
            Param: "DashBoard", Date: document.getElementById("daterange3").getElementsByTagName("span")[0].innerHTML, Template: templateValue,
            Place: PlaceValue, PlaceDimension: PlaceDimension
        };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        parameterToLoadData = { request: parameterToLoadData, PageSize: 5, CurrentPage: 1, SortColumnName: "", SortType: "OrderBy" };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        IsGroupColumnContain = false;
    }
    else if (Model != null) {
        var _DynamicPage = new DynamicPage(Model);
        var GridLoadParameters = [];
        for (var item in Model.ControlConfigDict) {
            if (Model.ControlConfigDict[item].ControlTypeName != "Label")
                GridLoadParameters.push(Model.ControlConfigDict[item].ClientID)
        }
        parameterToLoadData = _DynamicPage.GetLoadParameterList(GridLoadParameters);
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        parameterToLoadData = { request: parameterToLoadData, PageSize: 5, CurrentPage: 1, SortColumnName: "", SortType: "OrderBy" };
        parameterToLoadData = JSON.stringify(parameterToLoadData);
        IsGroupColumnContain = true;
    }

    $.ajax({
        url: Url,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: parameterToLoadData,
        async: true,
        success: function (response) {
            //result = JSON.parse(response.d);
            result = response;
            result = result.ColumnConfigList;

            GetPAPPDcDataSource(Url, DataUrl, parameterToLoadData, TableName, result, divId);
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
        }
    });
}

function GetPAPPDataSource(GridConfigUrl, GridDataUrl, Parameters, TableName, Row, divId) {
    //var Length = document.getElementById('txtLength').value;
    var result;
    //var obj = { PlaceId: $("#ddl_Palce").val(), TemplateId: $("#ddl_Template").val() };
    var obj1 = [];
    $.ajax({
        url: GridDataUrl,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: Parameters,
        async: true,
        success: function (response) {
            if (response == "Session Failure") {
                window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                result = [];
                return false;
            }
            //result = JSON.parse(response.d);
            if (response.length > 1) {
                result = response[0];
                TotalDc = response[1];
            }
            else if (response.length > 0)
                result = response[0];
            else
                result = response;
            var oGridControl = new GridControl();
            var RowLst;
            RowLst = oGridControl.LoadGrid(result, new Array(), MetaData, "DashBoard", TableName);
            document.getElementById(TableName).innerHTML = "";
            var tableinnerhtml = Row + '<tbody>' + RowLst + '</tbody>';
            $(document.getElementById(TableName)).html(tableinnerhtml);

            var oGridTableInitialize = new GridTableInitialize();
            oGridTableInitialize.DashBoardApprovalGridInit(GridConfigUrl, GridDataUrl, "DashBoard");
            removeLoadingPan(divId);
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
            removeLoadingPan(divId);
        }
    });
    return result;
}

function GetPAPPDcDataSource(GridConfigUrl, GridDataUrl, Parameters, TableName, gridColumn, divId) {
    //var Length = document.getElementById('txtLength').value;
    var result;
    //var obj = { PlaceId: $("#ddl_Palce").val(), TemplateId: $("#ddl_Template").val() };
    var obj1 = [];
    $.ajax({
        url: GridDataUrl,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: Parameters,
        async: true,
        success: function (response) {
            if (response == "Session Failure") {
                window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                result = [];
                return false;
            }
            //result = JSON.parse(response.d);
            if (response.length > 1) {
                result = response[0];
                TotalDc = response[1];
            }
            else if (response.length > 0)
                result = response[0];
            else
                result = response;
            var oTable = $('#dt_basic').DataTable();
            oTable.fnClearTable(true);
            var oTableSetting = oTable.fnSettings();

            CreateMetaDataColumn(gridColumn, false);
            var oGridControl = new GridControl();
            if (TableName != undefined && TableName != null)
                oGridControl.TableName = TableName;
            var Row;
            oTableSetting.aoColumns.remove(0, oTableSetting.aoColumns.length - 1)
            Row = oGridControl.LoadHeaderRow(MetaData, TableName);

            var RowLst;
            oTableSetting.aoData.remove(0, oTableSetting.aoData.length - 1);
            RowLst = oGridControl.LoadGrid(result, new Array(), MetaData, "DashBoard", TableName);
            var thead = document.createElement("thead");
            thead.innerHTML = Row;
            oTableSetting.nTHead = thead;

            oTable.fnDestroy(false);
            var oGridTableInitialize = new GridTableInitialize();
            oGridTableInitialize.DashBoardApprovalGridInit(GridConfigUrl, GridDataUrl, "DashBoard");
            removeLoadingPan(divId);
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
            removeLoadingPan(divId);
        }
    });
    return result;
}

function GetPAPPDataCaptureDataSource(GridConfigUrl, GridDataUrl, Parameters) {
    //var Length = document.getElementById('txtLength').value;
    var result;
    //var obj = { PlaceId: $("#ddl_Palce").val(), TemplateId: $("#ddl_Template").val() };
    var obj1 = [];
    $.ajax({
        url: GridDataUrl,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        data: Parameters,
        async: false,
        success: function (response) {
            if (response == "Session Failure") {
                window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                result = [];
                return false;
            }
            //result = JSON.parse(response.d);
            if (response.length > 1) {
                result = response[0];
                TotalDc = response[1];
            }
            else if (response.length > 0)
                result = response[0];
            else
                result = response;
        },
        error: function (result) {
            if ($(".SmallBox").length > 0) {
                $(".SmallBox").remove();
            }
            $.smallBox({
                title: "AjaxError.",
                sound: false,
                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                color: "#C46A69",
                iconSmall: "fa fa-warning bounce animated",
                timeout: 4000
            });
        }
    });
    return result;
}