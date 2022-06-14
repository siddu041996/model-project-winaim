var UpdateNotificationBar_timerID = "";
var IncreaseTimer = 0;
var MaxCountToResetTimer = 5;
var ltimmer = 5 * 1000;
var NotificationDetailsResponce = null;

function Start_UpdateNotificationBarTimer() {
    if (UpdateNotificationBar_timerID == "") {
        UpdateNotificationBar_timerID = setInterval(function () {
            if (IncreaseTimer >= MaxCountToResetTimer) {
                IncreaseTimer = 0;
                ltimmer += ltimmer;
                clearInterval(UpdateNotificationBar_timerID);
                UpdateNotificationBar_timerID = "";
                Start_UpdateNotificationBarTimer();
            }
            else
                IncreaseTimer += 1;
            UpdateNotificationBar();
        }, ltimmer);
    }
}

function Clear_UpdateNotificationBarTimer() {
    ltimmer = 5 * 1000;
    IncreaseTimer = 0;
    clearInterval(UpdateNotificationBar_timerID);
    UpdateNotificationBar_timerID = "";
    Start_UpdateNotificationBarTimer();
}

function UpdateNotificationBar() {
    try {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl("/NotificationView/GetTopNotificationDetailsByLoginUser/");
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = true;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var param = {};
        param["PageSize"] = "5";
        param["IsDesc"] = "false";
        param["PageNumber"] = "1";

        myAjaxobj.parameter = JSON.stringify({ request: JSON.stringify(param) });

        var callBackparm = {
            success: UpdateNotificationBar_SuccessCallBack,
            error: UpdateNotificationBar_ErrorCallBack,
            sender: this
        }
        myAjaxobj.execute(callBackparm);
    } catch (e) {
        console.log('UpdateNotificationBar, Exception : ' + JSON.stringify(e));
    }
}

function UpdateNotificationBar_SuccessCallBack(currentObj, response) {
    $('#Notification_Badge').html(0);
    $('#NotificationArea').html('');
    Start_UpdateNotificationBarTimer();
    if (response != undefined && response != null) {
        var finalHtml = '';
        var Href = '';
        var AsyncCallStatusCount = 0;
        response = response.OVNPortalNotificationResponseDetailsDTOLst;
        if (response != null && response != undefined && response.length > 0) {
            NotificationDetailsResponce = response;
            var NotDeliverdNotificationDetailsLst = response.filter(OneViewArrayFilter("IsDelivered", false));
            if (NotDeliverdNotificationDetailsLst != undefined && NotDeliverdNotificationDetailsLst != null && NotDeliverdNotificationDetailsLst.length > 0)
                $('#Notification_Badge').html(NotDeliverdNotificationDetailsLst.length);
            for (var itr = 0; itr < response.length; itr++) {
                var Href = '';
                var oresponse = response[itr];
                /* TODO : To Update Latest Notification Generation Status, need to dicuss and redo the coding. */
                if (itr == 0 && oresponse.IsDelivered ==false)
                    UpdateLatestNotificationGenerationStatus(oresponse);
                finalHtml += '<li>' +
                    '<span class="padding-10 unread"><em class="badge padding-5 no-border-radius bg-color-purple txt-color-white pull-left margin-right-5">' +
                            '<i class="fa fa-table fa-fw fa-2x"></i>' +
                        '</em> <span>';

                if (oresponse.Subject != undefined && oresponse.Subject != null && oresponse.Subject != '') {
                    finalHtml += oresponse.Subject + ' <br>';
                }
                if (oresponse.SystemNotificationDisplayInfoType == undefined || oresponse.SystemNotificationDisplayInfoType == null) {
                    if (oresponse.Message != null && oresponse.Message != undefined && oresponse.Message != '')
                        finalHtml += 'Status : <strong>' + (oresponse.Message != undefined && oresponse.Message != null && oresponse.Message != '' ? oresponse.Message : "") + '</strong>';
                    if (oresponse.OVNNotficationAttachmentDTOLst != undefined && oresponse.OVNNotficationAttachmentDTOLst != null && oresponse.OVNNotficationAttachmentDTOLst.length > 0) {
                        finalHtml += '<a class="btn btn-xs btn-primary margin-top-5 pull-right" href = "' + oresponse.OVNNotficationAttachmentDTOLst[0].AttachmentPath +
                            '" target = "_blank">Download</a></span></span></li>';
                    }
                    AsyncCallStatusCount += 1;
                }
                else {

                }
            }
            //if (AsyncCallStatusCount == response.length)
              //  Clear_UpdateNotificationBarTimer();
        }
      //  else
         //   Clear_UpdateNotificationBarTimer();
        $('#NotificationArea').html(finalHtml);
    }
  //  else
      //  Clear_UpdateNotificationBarTimer();
    var countBadge = $('#activity > .badge');

    if (parseInt(countBadge.text()) > 0) {
        countBadge.addClass("bg-color-red bounceIn animated")
    }
    var $this = $("#activity");

    if ($this.next('.ajax-dropdown').is(':visible')) {
        UpdateDeliveredStatus();
    }
}

function UpdateNotificationBar_ErrorCallBack(sender, Request, textStatus, errorThrown) {
    $('#Notification_Badge').html(0);
    $('#NotificationArea').html('');
  //  Clear_UpdateNotificationBarTimer();
    console.log('UpdateNotificationBar, Exception : ' + textStatus);
}

var LastPortalPoolNotification = '';
var IsFirstNotificationAfterExport = true;

function UpdateLatestNotificationGenerationStatus(oresponse) {
    try {

        // if (IsFirstNotificationAfterExport == true && (LastPortalPoolNotificationId == '' || oresponse.Id != LastPortalPoolNotificationId)) {
        if (IsFirstNotificationAfterExport == true && (oresponse.Id != LastPortalPoolNotification.Id)) {
            //UpdateLatestNotificationBar(oresponse);
            // LastPortalPoolNotificationId = oresponse.Id;
            IsFirstNotificationAfterExport = false;
        }
        else {
            document.getElementById('AsyncReportGenStatus').innerHTML = '';
        }

        if (IsFirstNotificationAfterExport == false) {
            LastPortalPoolNotification = oresponse;
            UpdateLatestNotificationBar(oresponse);
        }
    }
    catch (e) {
        console.log('UpdateAsyncReportGenerationStatus Exception' + JSON.stringify(e));
    }
}


function AsyncReportGenLink_onClick()
{
    if (LastPortalPoolNotification.OVNNotficationAttachmentDTOLst != undefined && LastPortalPoolNotification.OVNNotficationAttachmentDTOLst != null && LastPortalPoolNotification.OVNNotficationAttachmentDTOLst.length > 0) {
        UpdateDeliveredStatusByNotificationPoolId(LastPortalPoolNotification.Id);
        $(document.getElementById('AsyncReportGenLink')).addClass('hide');
   }
}

function UpdateLatestNotificationBar(oresponse)
{
    var oAsyncReportGenLink = document.getElementById('AsyncReportGenLink');
    if (oAsyncReportGenLink != undefined && oAsyncReportGenLink != null) {
        if (oresponse.Message != undefined && oresponse.Message != null && oresponse.Message != '') {
            $(oAsyncReportGenLink).removeClass('hide');
            if (oresponse.OVNNotficationAttachmentDTOLst != undefined && oresponse.OVNNotficationAttachmentDTOLst != null && oresponse.OVNNotficationAttachmentDTOLst.length > 0) {
                oAsyncReportGenLink.setAttribute('href', oresponse.OVNNotficationAttachmentDTOLst[0].AttachmentPath);
            }
            else
                oAsyncReportGenLink.setAttribute('href', 'javascript:void(0);');
            document.getElementById('AsyncReportGenStatus').innerHTML = oresponse.Message;
        }
    }
    else
        console.log('AsyncReportGenLink is undefined.');

}

function ShowNotification(e, $this) {
    UpdateDeliveredStatus();
    e.preventDefault();
}

function UpdateDeliveredStatus() {
    try {
        var NotDeliverdNotificationDetailsLst = [];
        if (NotificationDetailsResponce != null && NotificationDetailsResponce != undefined && NotificationDetailsResponce.length > 0)
            NotDeliverdNotificationDetailsLst = NotificationDetailsResponce.filter(OneViewArrayFilter("IsDelivered", false));
        if (NotDeliverdNotificationDetailsLst != undefined && NotDeliverdNotificationDetailsLst != null && NotDeliverdNotificationDetailsLst.length > 0) {
            var myAjaxobj = new WiNAiMAjax();
            myAjaxobj.url = GetRelativeUrl("/NotificationView/UpdateDeliveredStatus/");
            myAjaxobj.webMethod = "post";
            myAjaxobj.async = true;
            myAjaxobj.contentType = 'application/json; charset=utf-8';
            myAjaxobj.dataType = 'json';
            var param = {};
            param["Ids"] = OneViewArrayGetFieldValues(NotDeliverdNotificationDetailsLst, "Id");

            myAjaxobj.parameter = JSON.stringify({ request: JSON.stringify(param) });

            var callBackparm = {
                success: UpdateDeliveredStatus_SuccessCallBack,
                error: UpdateDeliveredStatus_ErrorCallBack,
                sender: this
            }
            myAjaxobj.execute(callBackparm);
        }
        else {
            ShowNotificationBar();
        }
    } catch (e) {
        console.log('UpdateNotificationBar, Exception : ' + JSON.stringify(e));
    }
}

function UpdateDeliveredStatusByNotificationPoolId(NotificationPoolId) {
    try {
        var myAjaxobj = new WiNAiMAjax();
        myAjaxobj.url = GetRelativeUrl("/NotificationView/UpdateDeliveredStatus/");
        myAjaxobj.webMethod = "post";
        myAjaxobj.async = true;
        myAjaxobj.contentType = 'application/json; charset=utf-8';
        myAjaxobj.dataType = 'json';
        var param = {};
        param["Ids"] = [NotificationPoolId];

        myAjaxobj.parameter = JSON.stringify({ request: JSON.stringify(param) });

        var callBackparm = {
            success: function (currentObj, response)
            {
                //alert(JSON.stringify(response));
            },
            error: function (sender, Request, textStatus, errorThrown)
            {
               // alert(JSON.stringify(errorThrown));
            },
            sender: this
        }
        myAjaxobj.execute(callBackparm);
    } catch (e) {
        alert(JSON.stringify(e));
        console.log('UpdateNotificationBar, Exception : ' + JSON.stringify(e));
    }
}

function UpdateDeliveredStatus_SuccessCallBack(currentObj, response) {
    if (response != undefined && response != null && response != '') {
        var responseObj = null;
        if (typeof (response) == 'object')
            responseObj = response;
        else if (typeof (response) == 'string')
            responseObj = JSON.parse(response);
        if (responseObj != null && !responseObj.isAnyException && responseObj.isSucess) {
            ShowNotificationBar();
        }
    }
}

function ShowNotificationBar() {
    var $this = $("#activity");
    if ($this.find('.badge').hasClass('bg-color-red')) {
        $this.find('.badge').removeClassPrefix('bg-color-');
        $this.find('.badge').text("0");
        // console.log("Ajax call for activity")
    }

    if (!$this.next('.ajax-dropdown').is(':visible')) {
        $this.next('.ajax-dropdown').fadeIn(150);
        $this.addClass('active');
    }

    var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
}

function UpdateDeliveredStatus_ErrorCallBack(sender, Request, textStatus, errorThrown) {
    console.log(errorThrown);
}