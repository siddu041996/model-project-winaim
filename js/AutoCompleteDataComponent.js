var MaxAutoCompleteCount = 50;

function AddAutoCompleteData(obj) {
    var ControlId = obj.id
    if (typeof (Storage) !== "undefined") {
        var inputval = document.getElementById(ControlId).value;
        if (window.localStorage[ControlId]) {
            //step 1 :duplicate checking
            if (window.localStorage[ControlId].indexOf(inputval) == -1) {
                var value = window.localStorage[ControlId];
                // total autoComplete data
                var totalAutoCompleteData = value.split(',').length + 1;
                //Check the totalAutoCompleteData greater than maxAutoCompleteValue
                if (totalAutoCompleteData > MaxAutoCompleteCount) {
                    var StringToRemove = value.split(',')[0] + ",";
                    value = value.replace(StringToRemove, "");
                    window.localStorage[ControlId] = value + "," + inputval;
                }
                else {
                    window.localStorage[ControlId] = window.localStorage[ControlId] + "," + inputval;
                }
            }
        }
        else {
            window.localStorage[ControlId] = inputval;
        }
        loadAutoComplete(obj);
    }
}

function loadAutoComplete(obj) {
    var ControlId = obj.id
    if (typeof (Storage) !== "undefined") {
        if (window.localStorage[ControlId]) {
            var AutoCompleteDataArray = []
            var AutoCompleteData = window.localStorage[ControlId];
            AutoCompleteData = AutoCompleteData.split(',');
            for (var i = 0; i < AutoCompleteData.length; i++) {
                AutoCompleteDataArray.push({ label: AutoCompleteData[i] });
            }
            $("#" + ControlId).autocomplete(
             {
                 source: AutoCompleteDataArray
             });
        }
        if ($('.ui-autocomplete') != undefined && $('.ui-autocomplete') != null && $('.ui-autocomplete').length > 0) {
            var uiautocomplete = $('.ui-autocomplete');
            for (var itr = 0; itr < uiautocomplete.length; itr++) {
                $('.ui-autocomplete')[itr].style.zIndex = '99999';
            }
        }
    }
}