function GetRange(Percentage) {
    var result = '';
    if (Percentage >= 95)
        result = 'A+';
    else if (Percentage >= 90 && Percentage < 95)
        result = 'A';
    else if (Percentage >= 75 && Percentage < 90)
        result = 'B';
    else if (Percentage >= 60 && Percentage < 75)
        result = 'C';
    else if (Percentage >= 45 && Percentage < 60)
        result = 'D';
    else if (Percentage < 45)
        result = 'E';
    return result;
}

function AuditDetailsWidgetComponent(WidgetId) {
    this.Load = function (Url) {
        try {
            var ResponseLst = GetData(Url);

            var Html = GetHtml(ResponseLst);
            var owidget = document.getElementById(WidgetId);
            if (owidget != null && Html != "") {
                owidget.innerHTML = Html;
            }
            else if (owidget != null) {
                $(owidget).html('<div class="norecordsfound" style="width:50%;">No records available</div>')
            }
            var _EasyPieChart = new EasyPieChart();
            $('div[name="easyPieElement"]').each(function () {
                _EasyPieChart.InitByDom(this);
            });
        }
        catch (Excep) {
            throw Excep;
        }
    }

    var GetData = function (Url) {

        try {
            var Result = new Array();

            var _winaimAjax = new WiNAiMAjax();
            _winaimAjax.url = GetRelativeUrl(Url);
            _winaimAjax.webMethod = "post";
            _winaimAjax.async = false;
            _winaimAjax.contentType = 'application/json; charset=utf-8';
            _winaimAjax.dataType = 'json';
            var args = {
                success: function (sender, response) {

                    if (response.IsAnyExpection == false && response.ResponceLst != null) {
                        Result = response.ResponceLst;
                    }
                },
                error: function (sender, Request, textStatus, errorThrown) {
                    console.log(errorThrown);
                },
                sender: this
            };
            _winaimAjax.execute(args);

            return Result;
        }
        catch (Excep) {
            throw Excep;
        }
    }

    var GetHtml = function (ResponseLst) {

        try {
            var Html = '';

            for (var i = 0; i < ResponseLst.length; i++) {
                Html += GetRowHtml(ResponseLst[i]);
            }

            return Html;
        }
        catch (Excep) {
            throw Excep;
        }
    }

    var GetRowHtml = function (Response) {
        try {
            var pieColorCode = 'color : #FF0000;';
            if (Response.Percentage <= 75) {
                pieColorCode = 'color : #FF0000;';
            }
            else if (Response.Percentage > 75 && Response.Percentage <= 90) {
                pieColorCode = 'color : #FFBF00;';
            }
            else if (Response.Percentage > 90) {
                pieColorCode = 'color : #008000;';
            }
            var Html = '<div style="display: -webkit-box; margin-top: 5px">' +
                    '<div class="desktopview">' +
                        '<div>' +
                    '<div class="" style = "text-align: center;"><div id="" name = "item_easyPie" xAxisId = "' +
                        Response.DcPlaceId + '" xAxisValue = "' + Response.DcPlaceName + '"><div id="" name = "easyPieElement" class="easy-pie-chart easyPieChart" style = "' +
                        pieColorCode + 'font-size: 16px;" data-percent="101" data-pie-size="85">' + Response.Percentage +
                        '</div></div></div>' +
                               '</div>' +
                           ' <div>' +
                               ' <p style="color: #5a5b5e; font-family: arial; font-size: 14px;"><font color="#cc3f1b"><b>' + Response.DcPlaceName + '</b></font></p>' +
                               ' <p style="color: #717270; font-family: arial; font-size: 12.5px;"><b>Date of audit - ' + Response.DcStartDate.split(" ")[0] + '</b></p>' +
                               ' <p style="font-family: arial; font-size: 12.5px; color: #7f8484;"><b>Audited by - </b><font color="#20a7d8"><b>' + Response.DcUserName + '</b></font> </p>' +
                            '</div> ' +
                            '<div style="display:flex;text-align:center;">';
            if (Response.DCLastUpdatedAnswerDetailList[17] != null) {
                Html += '<div style="width:33% ; padding-bottom:10px;">' +
                '<p style="color: #bfc1c1; font-family: arial; font-size: 12.5px;"><b>Critical</b></p>' +
               ' <p style="font-family: arial; font-size: 14px;"><font color="#83c607"> <b>' + Response.DCLastUpdatedAnswerDetailList[17].Percentage + '%</b></font></p>' +
                '<p style="background-color: red; border-radius: 5px; padding: 4px; width: 17px; height: 50px; font-size: 6.5pt; font-style: normal; font-family: Century Gothic; display: inline"><font color="white"><b> ' + Response.DCLastUpdatedAnswerDetailList[17].NCCount + ' VIOLATIONS </b></font></p>' +
            ' </div>';
            }
            if (Response.DCLastUpdatedAnswerDetailList[54] != null) {
                Html += '<div style="width:33% ; padding-bottom:10px;">' +
                               ' <p style="color: #bfc1c1; font-family: arial; font-size: 12.5px;"><b>Major</b></p>' +
                               ' <p style="font-family: arial; font-size: 14px;"><font color="#83c607"> <b>' + Response.DCLastUpdatedAnswerDetailList[54].Percentage + '%</b></font></p>' +
                               ' <p style="background-color: red; border-radius: 5px; padding: 4px; width: 17px; height: 50px; font-size: 6.5pt; font-style: normal; font-family: Century Gothic; display: inline"><font color="white"><b>  ' + Response.DCLastUpdatedAnswerDetailList[54].NCCount + ' VIOLATIONS </b></font></p>' +
                          '  </div>';
            }
            if (Response.DCLastUpdatedAnswerDetailList[96] != null) {
                Html += '<div style="width:33% ; padding-bottom:10px;">' +
                               ' <p style="color: #bfc1c1; font-family: arial; font-size: 12.5px;"><b>General</b></p>' +
                               ' <p style="font-family: arial; font-size: 14px;"><font color="#83c607"> <b>' + Response.DCLastUpdatedAnswerDetailList[96].Percentage + '%</b></font></p>' +
                               ' <p style="background-color: red; border-radius: 5px; padding: 4px; width: 17px; height: 50px; font-size: 6.5pt; font-style: normal; font-family: Century Gothic; display: inline"><font color="white"><b> ' + Response.DCLastUpdatedAnswerDetailList[96].NCCount + ' VIOLATIONS </b></font></p>' +
            ' </div>';
            }
            Html += '  </div>' +
          ' <div>' +
          ' <p style="font-size: 8pt; font-style: normal; font-family: verdana;padding-top:40px; width: 100%; line-height: 12px; border-radius: 4px;"><font color="#858985"> <b>RANGE - </b></font><font color="#83c607"><b> ' + Response.DcRating + ' </b></font></p>' +
            ' </div>' +
                       ' </div>' + '</div> ' +
                       '<div class="text-center blue-grey lighten-5" style="width: 100%; height: 2px;">' + '</div>';

            Html += '<div style="display: -webkit-box; margin-top: 5px;">' +
                        '<div class="mobileview">' +
                           '<div>' +
                    '<div class="" style = "text-align: center;"><div id="" name = "item_easyPie" xAxisId = "' +
                        Response.DcPlaceId + '" xAxisValue = "' + Response.DcPlaceName + '"><div id="" name = "easyPieElement" class="easy-pie-chart easyPieChart" style = "' +
                        pieColorCode + 'font-size: 16px;" data-percent="101" data-pie-size="85">' + Response.Percentage +
                        '</div></div></div>' +
                               '</div>' + '<div>' +
                              '  <p style="text-align:initial;color: #5a5b5e; font-family: arial; font-size: 14px;"><font color="#cc3f1b"><b>' + Response.DcPlaceName + '</b></font></p>' +
                              '  <p style="text-align:initial;color: #717270; font-family: arial; font-size: 12.5px;"><b>' + Response.DcStartDate.split(" ")[0] + '</b></p>' +
                               ' <p style="height:2px;text-align:initial;font-family: arial; font-size: 12.5px; color: #7f8484;"><font color="#20a7d8"><b>' + Response.DcUserName + '</b></font></p>' +
                            '</div>' +
                            '<div style="text-align:center;">' +
                            '<p style="padding-top: 33px;font-size: 8pt; font-style: normal; font-family: verdana; width: 100%;  border-radius: 4px;"><font color="#858985"> <b>RANGE - </b></font><font color="#83c607"><b> ' + Response.DcRating + '  </b></font></p>' +
                            '</div>' +
                                '<div  style="text-align:-webkit-auto;">';
            if (Response.DCLastUpdatedAnswerDetailList[17] != null) {
                Html += '<p style="font-family: arial; font-size: 14px;"><font color="#83c607"> <b>' + Response.DCLastUpdatedAnswerDetailList[17].Percentage + '%</b>&ensp;<b>-</b>&ensp;</font><a style="color: #bfc1c1; font-family: arial; font-size: 12.5px;"><b>Critical</b>&ensp;&ensp;<b> /</b>&ensp;<a><a style="background-color: red; border-radius: 5px; padding: 4px; width: 100%; font-size: 6.5pt; font-style: normal; font-family: Century Gothic;"><font color="white"><b>' + Response.DCLastUpdatedAnswerDetailList[17].NCCount + ' VIOLATIONS </b></font></a></p>';
            }
            if (Response.DCLastUpdatedAnswerDetailList[54] != null) {
                Html += ' <p style="font-family: arial; font-size: 14px;"><font color="#83c607"> <b>' + Response.DCLastUpdatedAnswerDetailList[54].Percentage + '%</b>&ensp;<b>-</b>&ensp;</font><a style="color: #bfc1c1; font-family: arial; font-size: 12.5px;"><b>Major</b>&ensp;&ensp;&ensp;<b> / </b>&ensp;<a><a style="background-color: red; border-radius: 5px; padding: 4px; width: 100%; font-size: 6.5pt; font-style: normal; font-family: Century Gothic;"><font color="white"><b> ' + Response.DCLastUpdatedAnswerDetailList[54].NCCount + ' VIOLATIONS </b></font></a></p>';
            }
            if (Response.DCLastUpdatedAnswerDetailList[96] != null) {
                Html += '<p style="font-family: arial; font-size: 14px;"><font color="#83c607"> <b>' + Response.DCLastUpdatedAnswerDetailList[96].Percentage + '%</b>&ensp;<b>-</b>&ensp;</font><a style="color: #bfc1c1; font-family: arial; font-size: 12.5px;"><b>General</b>&ensp;<b> / </b>&ensp;<a><a style="background-color: red; border-radius: 5px; padding: 4px; width: 100%; font-size: 6.5pt; font-style: normal; font-family: Century Gothic;"><font color="white"><b> ' + Response.DCLastUpdatedAnswerDetailList[96].NCCount + ' VIOLATIONS </b></font></a></p>';
            }
            Html += '</div>' +
            ' </div>' +
            ' </div>';

            return Html;
        }
        catch (Excep) {
            throw Excep;
        }
    }
}