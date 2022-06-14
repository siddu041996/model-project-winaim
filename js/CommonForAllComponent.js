/* Added By Devaraj S on 05-01-2016 1013
    Description : Common Methods and Class plan to add in this file, becuase avoiding duplicate code and reusability. */

function DisplayFormatComponent() {
    var myInstance = this;
    this.lDisplayFormatConfigLst = null;
    this.FilterParamControlConfig = null;
    this.DisplayFrameId = '';
    this.ParamToLoadGridData = null;
    var TypeOfDisplayFormat = '';

    this.Load = function () {
        var _oFactory = new Factory();
        if (myInstance.lDisplayFormatConfigLst != undefined && myInstance.lDisplayFormatConfigLst != null) {
            var MultipleDisplayFrameHTML = null;
            if (myInstance.lDisplayFormatConfigLst.length > 1) {
                MultipleDisplayFrameHTML = GetMultipleDisplayFrame();
                var _AppendOrSetHtml = new AppendOrSetHtml();
                _AppendOrSetHtml.ControlId = myInstance.DisplayFrameId;
                _AppendOrSetHtml.Html = MultipleDisplayFrameHTML;
                _AppendOrSetHtml.AppendHtml();
            }
            for (var i = 0; i < myInstance.lDisplayFormatConfigLst.length; i++) {
                var _displayFrameId = myInstance.DisplayFrameId;
                if (myInstance.lDisplayFormatConfigLst.length > 1)
                    _displayFrameId = myInstance.DisplayFrameId + "_item" + (i + 1);
                else
                    _displayFrameId = myInstance.DisplayFrameId;
                var CurrentDisplayFormat = myInstance.lDisplayFormatConfigLst[i];
                var GetDisplayFormat = _oFactory.GetDisplayFormatContent(CurrentDisplayFormat.Type);
                GetDisplayFormat.CurrentDisplayFormatConfig = CurrentDisplayFormat;
                GetDisplayFormat.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                GetDisplayFormat.ControlId = _displayFrameId;
                GetDisplayFormat.ParamToLoadGridData = myInstance.ParamToLoadGridData;
                var PaginatedEnabled = true;
                if (CurrentDisplayFormat.DataSourceConfig != undefined && CurrentDisplayFormat.DataSourceConfig != null && !CurrentDisplayFormat.DataSourceConfig.IsPaginationNeeded)
                    PaginatedEnabled = false;
                if (GetDisplayFormat.Load != undefined && GetDisplayFormat.Load != null) {
                    var Html = GetDisplayFormat.Load();
                    if (Html != undefined) {
                        var _AppendOrSetHtml = new AppendOrSetHtml();
                        _AppendOrSetHtml.ControlId = _displayFrameId;
                        _AppendOrSetHtml.Html = Html;
                        _AppendOrSetHtml.AppendHtml();
                    }
                }

                if (GetDisplayFormat.Init != undefined && GetDisplayFormat.Init != null) {
                    GetDisplayFormat.Init(PaginatedEnabled);
                }
            }
        }
    }

    var GetMultipleDisplayFrame = function () {
        var Html = '<div class="row">';
        var colSpanLen = Math.round(12 / myInstance.lDisplayFormatConfigLst.length)
        for (var i = 0; i < myInstance.lDisplayFormatConfigLst.length; i++) {
            Html += '<div class="col s' + colSpanLen + '" id = "' + myInstance.DisplayFrameId + "_item" + (i + 1) + '"></div>';
        }
        Html += "</div>";
        return Html;
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

function DisplayFormatComponentForActionTrackingPage() {
    var myInstance = this;
    this.lDisplayFormatConfigLst = null;
    this.FilterParamControlConfig = null;
    this.DisplayFrameId = '';
    this.ParamToLoadGridData = null;
    var TypeOfDisplayFormat = '';

    this.Load = function () {
        var _oFactory = new Factory();
        if (myInstance.lDisplayFormatConfigLst != undefined && myInstance.lDisplayFormatConfigLst != null) {
            var MultipleDisplayFrameHTML = null;
            if (myInstance.lDisplayFormatConfigLst.length > 1) {
                MultipleDisplayFrameHTML = GetMultipleDisplayFrame();
                var _AppendOrSetHtml = new AppendOrSetHtml();
                _AppendOrSetHtml.ControlId = myInstance.DisplayFrameId;
                _AppendOrSetHtml.Html = MultipleDisplayFrameHTML;
                _AppendOrSetHtml.AppendHtml();
            }
            for (var i = 0; i < myInstance.lDisplayFormatConfigLst.length; i++) {
                var _displayFrameId = myInstance.DisplayFrameId;
                if (myInstance.lDisplayFormatConfigLst.length > 1)
                    _displayFrameId = myInstance.DisplayFrameId + "_item" + (i + 1);
                else
                    _displayFrameId = myInstance.DisplayFrameId;
                var CurrentDisplayFormat = myInstance.lDisplayFormatConfigLst[i];
                var GetDisplayFormat = _oFactory.GetDisplayFormatContent("ActionTracking_GridFormatDisplayConfig");
                GetDisplayFormat.CurrentDisplayFormatConfig = CurrentDisplayFormat;
                GetDisplayFormat.FilterParamControlConfig = myInstance.FilterParamControlConfig;
                GetDisplayFormat.ControlId = _displayFrameId;
                GetDisplayFormat.ParamToLoadGridData = myInstance.ParamToLoadGridData;
                var PaginatedEnabled = true;
                if (CurrentDisplayFormat.DataSourceConfig != undefined && CurrentDisplayFormat.DataSourceConfig != null && !CurrentDisplayFormat.DataSourceConfig.IsPaginationNeeded)
                    PaginatedEnabled = false;
                if (GetDisplayFormat.Load != undefined && GetDisplayFormat.Load != null) {
                    var Html = GetDisplayFormat.Load();
                    //if (Html != undefined) {
                    //    var _AppendOrSetHtml = new AppendOrSetHtml();
                    //    _AppendOrSetHtml.ControlId = _displayFrameId;
                    //    _AppendOrSetHtml.Html = Html;
                    //    _AppendOrSetHtml.AppendHtml();
                    //}
                }

                if (GetDisplayFormat.Init != undefined && GetDisplayFormat.Init != null) {
                    GetDisplayFormat.Init(PaginatedEnabled);
                }
            }
        }
    }

    var GetMultipleDisplayFrame = function () {
        var Html = '<div class="row">';
        var colSpanLen = Math.round(12 / myInstance.lDisplayFormatConfigLst.length)
        for (var i = 0; i < myInstance.lDisplayFormatConfigLst.length; i++) {
            Html += '<div class="col s' + colSpanLen + '" id = "' + myInstance.DisplayFrameId + "_item" + (i + 1) + '"></div>';
        }
        Html += "</div>";
        return Html;
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





function GridFormatDisplayComponentForActionTrackingPage() {
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

        var RowHtml = myInstance.CreateDataRows(GridConfig.DataSourceConfig, GridConfig.IsAsync);

        RowHtml = Headerhtml + '<tbody>' + RowHtml + '</tbody>';
        var PaginationBarHtml = GetPaginationBarHtml();
        PaginationBarHtml = '<div id="ContentPagination" class="con-right-footer blue-grey lighten-4">' + PaginationBarHtml + '</div>';

        var table = $('#ActionTrackingPage').DataTable();

        $('#ActionTrackingPage').on('page.dt', function () {
            $("#" + "ActionTrackingPage" + ' .tooltipped').tooltip({ delay: 50 });
        });

        $('#ActionTrackingPage').on('draw.dt', function () {
            $("#" + "ActionTrackingPage" + ' .tooltipped').tooltip({ delay: 50 });
        });

        table.destroy();

       
        $('#ActionTrackingPage').html(RowHtml);

        $('#ActionTrackingPage').DataTable({
            "order": [[2, "desc"]],
            "columnDefs": [
                 {
                     "targets": [3, -1],
                     "orderable": false,
                     "searchable": false
                 }],
            deferRender: true
        });

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
        RegisterRowClickEvent("ActionTrackingPage");
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
            jobEvent.ControlId = "ActionTrackingPage";
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
        $("#" + "ActionTrackingPage").find("tbody").html('');
        $("#" + "ActionTrackingPage").find("tbody").html(Html);
        RegisterRowClickEvent("ActionTrackingPage");
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

    this.ClearHtml = function (ControlId) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
            }
        }
    }
}

function ExportFormatComponent() {
    var myInstance = this;
    this.lExportFormatConfigLst = null;
    this.FilterParamControlConfig = null;
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';
    var TypeOfDisplayFormat = '';

    this.Load = function () {
        if (myInstance.lExportFormatConfigLst != undefined && myInstance.lExportFormatConfigLst != null) {
            myInstance.LoadExportOptions();
        }
    }

    this.LoadExportOptions = function () {
        var _oFactory = new Factory();
        for (var i = 0; i < myInstance.lExportFormatConfigLst.length; i++) {
            var CurrentExportFormat = myInstance.lExportFormatConfigLst[i];
            var GetExportFormat = _oFactory.GetExportFormatContent(CurrentExportFormat.Type);
            GetExportFormat.CurrentExportFormatConfig = CurrentExportFormat;
            GetExportFormat.FilterParamControlConfig = myInstance.FilterParamControlConfig;
            GetExportFormat.PDFExportControlId = myInstance.PDFExportControlId;
            GetExportFormat.ExcelExportControlId = myInstance.ExcelExportControlId;
            if (GetExportFormat.Load != undefined && GetExportFormat.Load != null)
                GetExportFormat.Load();

            if (GetExportFormat.Init != undefined && GetExportFormat.Init != null)
                GetExportFormat.Init();
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

    this.Hide = function (ControlId) {
        if (ControlId != undefined && ControlId != null) {
            var Control = $("[data-activates='" + ControlId + "']");
            if (Control != undefined && Control != null && Control.length > 0) {
                Control.addClass('hide');
            }
        }
    }

    this.Show = function (ControlId) {
        if (ControlId != undefined && ControlId != null) {
            var Control = $("[data-activates='" + ControlId + "']");
            if (Control != undefined && Control != null && Control.length > 0) {
                Control.removeClass('hide');
            }
        }
    }
}

function GetNotificationFormat() {
    var myInstance = this;
    this.Load = function () {

    }
}

function ChartFormatDisplayComponent() {
    var myInstance = this;
    this.ControlId = '';
    this.CurrentDisplayFormatConfig = null;

    this.Load = function () {

    }

    this.GetHtml = function () {

    }

    this.SetHtml = function () {

    }

    this.Init = function () {

    }
}

function GridFormatDisplayComponentForDashBoard() {
    var myInstance = this;
    this.ControlId = '';
    this.CurrentDisplayFormatConfig = null;
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
        _GetGridDisplay.ContentId = myInstance.ControlId;
        _GetGridDisplay.Load();

        if (!myInstance.CurrentDisplayFormatConfig.IsAsync)
            _GetGridDisplay.Init();
    }
}

function RDLCExportFormatComponent() {
    var myInstance = this;
    this.CurrentExportFormatConfig = null;
    this.FilterParamControlConfig = null;
    this.PDFExportControlId = '';
    this.ExcelExportControlId = '';

    this.Load = function () {
        var Html = myInstance.GetHtml();

        var ControlId = '';
        if (myInstance.CurrentExportFormatConfig.ExportType == 1) /* PDF */
            ControlId = myInstance.PDFExportControlId;
        else if (myInstance.CurrentExportFormatConfig.ExportType == 2 || myInstance.CurrentExportFormatConfig.ExportType == 4) /* Excel */
            ControlId = myInstance.ExcelExportControlId;
        if (Html != undefined && Html != null && Html != '') {
            var oExportFormatComponent = new ExportFormatComponent();
            oExportFormatComponent.Show(ControlId);
        }
        else {
            var oExportFormatComponent = new ExportFormatComponent();
            oExportFormatComponent.Hide(ControlId);
        }
        myInstance.AppendHtml(ControlId, Html);
        $('#' + myInstance.CurrentExportFormatConfig.UniqueKey).attr('ExportFormatConfig', JSON.stringify(myInstance.CurrentExportFormatConfig));
    }

    this.GetHtml = function () {
        var ExportType = '';
        if (myInstance.CurrentExportFormatConfig.ExportType == 1) /* PDF */
            ExportType = myInstance.PDFExportControlId;
        else if (myInstance.CurrentExportFormatConfig.ExportType == 2) /* Excel */
            ExportType = myInstance.ExcelExportControlId;
        var ExportFormatHtml = '';
        ExportFormatHtml += '<li>';
        var ConfigStr = JSON.stringify(myInstance.CurrentExportFormatConfig);
        ExportFormatHtml += '<a id = "' + myInstance.CurrentExportFormatConfig.UniqueKey + '" ExportType = "' + myInstance.CurrentExportFormatConfig.ExportType + '" onclick = "new DownloadReportFile().GetFile(this)">' +
            _GetGlobalization.GetGlobalizationValue(myInstance.CurrentExportFormatConfig.DisplayNameKey) + '</a>';
        ExportFormatHtml += '</li>';
        return ExportFormatHtml;
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

    this.AppendHtml = function (ControlId, Html) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML += Html;
            }
        }
    }

    this.Init = function () {

    }
}

function CustomHTMLPage() {
    var myInstance = this;
    this.PageContentId = '';
    this.lPageFrameId = '';
    this.lDisplayFrameId = '';
    this.lAdvanceFilterFrameId = '';
    this.CurrentPageSubComponent = null;

    this.Load = function () {
        if (myInstance.CurrentPageSubComponent.CodeUrl != null && myInstance.CurrentPageSubComponent.CodeUrl != "") {

            var _oWiNAiMAjax = new WiNAiMAjax();
            _oWiNAiMAjax.url = GetRelativeUrl(myInstance.CurrentPageSubComponent.CodeUrl + "?" + new Date().toString());
            _oWiNAiMAjax.webMethod = "GET";

            var callBackparm = {
                success: function (response, message) {
                    if (message != "") {
                        var oScript = document.createElement("script");
                        var oScriptText = document.createTextNode(message);
                        oScript.appendChild(oScriptText);
                        document.body.appendChild(oScript);
                    }
                },
                error: function (sender, Request, textStatus, errorThrown) {
                },
                sender: this
            }
            _oWiNAiMAjax.execute(callBackparm);
        }

        if (myInstance.CurrentPageSubComponent.HtmlUrl != null && myInstance.CurrentPageSubComponent.HtmlUrl != "") {

            var _oWiNAiMAjax = new WiNAiMAjax();
            _oWiNAiMAjax.url = GetRelativeUrl(myInstance.CurrentPageSubComponent.HtmlUrl);
            _oWiNAiMAjax.webMethod = "GET";

            var callBackparm = {
                success: function (response, message) {
                    if (message != "") {
                        $("#" + myInstance.PageContentId).html(message);
                    }
                },
                error: function (sender, Request, textStatus, errorThrown) {
                    console.error(errorThrown);
                },
                sender: this
            }

            _oWiNAiMAjax.execute(callBackparm);
        }
    }
}


function GridFormatDisplayComponentForMasterPage() {
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

        var RowHtml = myInstance.CreateDataRows(GridConfig.DataSourceConfig, GridConfig.IsAsync);

        RowHtml = Headerhtml + '<tbody>' + RowHtml + '</tbody>';
        var PaginationBarHtml = GetPaginationBarHtml();
        PaginationBarHtml = '<div id="ContentPagination" class="con-right-footer blue-grey lighten-4">' + PaginationBarHtml + '</div>';

        var table = $('#Masterpage').DataTable();

      

        table.destroy();


        $('#Masterpage').html(RowHtml);

        $('#Masterpage').DataTable({
            "aLengthMenu": [[25, 50, 75, -1], [25, 50, 75, "All"]],
            "iDisplayLength": 25,
            deferRender: true
        });

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
        RegisterRowClickEvent("Masterpage");
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
            jobEvent.ControlId = "Masterpage";
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
        $("#" + "Masterpage").find("tbody").html('');
        $("#" + "Masterpage").find("tbody").html(Html);
        RegisterRowClickEvent("Masterpage");
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

    this.ClearHtml = function (ControlId) {
        if (ControlId != undefined && ControlId != null) {
            var Control = document.getElementById(ControlId);
            if (Control != undefined && Control != null) {
                Control.innerHTML = '';
            }
        }
    }
}
