﻿

//to set the call back
//ex: this.error = function(XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
//ex: this.success = function(xml) { alert(xml); }
//ex:LoadAjax(this.success, this.error);

function WiNAiMAjax() {

    this.url;
    this.webMethod = "post";
    this.parameter = "{}";
    this.async = false;
    //this.timeout = 20000, //20 secs of timeout
    this.contentType = "application/json; charset=utf-8";
    this.dataType = "html";
    this.SourceObj = "";
    this.headers = "";

    this.execute = function (args) {

        var ServiceId = window.localStorage.getItem('ServiceId');
        if (this.headers == "" || this.headers == undefined) {
            if (this.async == false || (args != null && args.success != null && args.error != null && args.success != "" && args.error != "")) {
                var result = "";
                $.ajax({
                    type: this.webMethod,
                    async: this.async,
                    //timeout: this.timeout,
                    url: this.url,
                    data: this.parameter,
                    contentType: this.contentType,
                  ///  headers: this.headers,
                    dataType: this.dataType,
                    success: function (msg) {
                        if (msg == "Session Failure") {
                            window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                            return false;
                        }

                        if (args != null && args.success != null && args.success != "") {
                            args.success(args.sender, msg)
                        }
                        result = msg;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (navigator != undefined && navigator != null && navigator.onLine) {
                            if ($(".SmallBox").length > 0) {
                                $(".SmallBox").remove();
                            }
                            $.smallBox({
                                title: 'ajax errorThrown  :' + errorThrown,
                                sound: false,
                                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-warning bounce animated",
                                timeout: 4000
                            });
                            if (args != null && args.error != null && args.error != "") {
                                args.error(args.sender, XMLHttpRequest, textStatus, errorThrown);
                            }
                        }
                        else {
                            ShowMessage("IN-ER-ALP-001 :: Please Check Your Internet Connectivity", 4);
                            return false;
                        }
                    },
                    complete: function () {

                        if (args != null && args.complete != null && args.complete != "" && navigator.onLine) {
                            args.complete(args.sender);
                        }
                    }
                });

                return result;
            }
        }
        else if (this.async == false || (args != null && args.success != null && args.error != null && args.success != "" && args.error != "")) {
                var result = "";
                $.ajax({
                    type: this.webMethod,
                    async:this.async,
                    //timeout: this.timeout,
                    url: this.url,
                    data: this.parameter,
                    contentType: this.contentType,
                    headers: this.headers,
                    dataType: this.dataType,
                    headers: { "ServiceId": 36 },
                    success: function (msg) {
                        if (msg == "Session Failure") {
                            window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                            return false;
                        }

                        if (args != null && args.success != null && args.success != "") {
                            args.success(args.sender, msg)
                        }
                        result = msg;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (navigator != undefined && navigator != null && navigator.onLine) {
                            if ($(".SmallBox").length > 0) {
                                $(".SmallBox").remove();
                            }
                            $.smallBox({
                                title: 'ajax errorThrown  :' + errorThrown,
                                sound: false,
                                //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-warning bounce animated",
                                timeout: 4000
                            });
                            if (args != null && args.error != null && args.error != "") {
                                args.error(args.sender, XMLHttpRequest, textStatus, errorThrown);
                            }
                        }
                        else {
                            ShowMessage("IN-ER-ALP-001 :: Please Check Your Internet Connectivity", 4);
                            return false;
                        }
                    },
                    complete: function () {

                        if (args != null && args.complete != null && args.complete != "" && navigator.onLine) {
                            args.complete(args.sender);
                        }
                    }
                });

                return result;
        }
        else {
           // ShowMessage("Set Success and Error callback method", 4);
            //alert("Set Success and Error callback method");
            //ex: this.error = function(XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
            //ex: this.success = function(xml) { alert(xml); }
            //ex:LoadAjax(this.success, this.error);
        }
    }



}


function WiNAiMAjaxHar() {

    this.url;
    this.webMethod = "post";
    this.parameter = "{}";
    this.async = false;
    //this.timeout = 20000, //20 secs of timeout
    this.contentType = "application/json; charset=utf-8";
    this.dataType = "html";
    this.SourceObj = "";

    this.execute = function (args) {

        if (this.async == false || (args != null && args.success != null && args.error != null && args.success != "" && args.error != "")) {
            var result = "";
            $.ajax({

                type: this.webMethod,
                async: this.async,
                //timeout: this.timeout,
                url: this.url,
                data: this.parameter,
                contentType: this.contentType,
                dataType: this.dataType,
                success: function (msg) {
                    if (msg == "Session Failure") {
                        window.location.href = GetParentFolderOfApplication() + "/Login/LoginIndex";
                        return false;
                    }

                    if (args != null && args.success != null && args.success != "") {
                        args.success(args.sender, msg)
                    }
                    result = msg;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (navigator != undefined && navigator != null && navigator.onLine) {
                        if ($(".SmallBox").length > 0) {
                            $(".SmallBox").remove();
                        }
                        $.smallBox({
                            title: 'ajax errorThrown  :' + errorThrown,
                            sound: false,
                            //content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                            color: "#C46A69",
                            iconSmall: "fa fa-warning bounce animated",
                            timeout: 4000
                        });
                        if (args != null && args.error != null && args.error != "") {
                            args.error(args.sender, XMLHttpRequest, textStatus, errorThrown);
                        }
                    }
                    else {
                        ShowMessage("IN-ER-ALP-001 :: Please Check Your Internet Connectivity", 4);
                        return false;
                    }
                },
                complete: function () {

                    if (args != null && args.complete != null && args.complete != "" && navigator.onLine) {
                        args.complete(args.sender);
                    }
                }
            });

            return result;
        }
        else {
            ShowMessage("Set Success and Error callback method", 4);
            //alert("Set Success and Error callback method");
            //ex: this.error = function(XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
            //ex: this.success = function(xml) { alert(xml); }
            //ex:LoadAjax(this.success, this.error);
        }
    }



}