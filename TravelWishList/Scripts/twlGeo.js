
//Setup geonames calls 
var twlGeo = (function ($) {
    var my = {};

    my.defaultData = {
        userName: 'demo',
        lang: 'en'
    };
    my.defaultCountryCode = 'US';
    my.defaultLanguage = 'en';
    my.geoNamesApiServer = 'api.geonames.org';
    my.geoNamesProtocol = 'http';

    my.getGeoNames = function (method, data, callback) {
        var deferred = $.Deferred();

        $.ajax({
            url: my.geoNamesProtocol + '://' + my.geoNamesApiServer + '/' + method + 'JSON',
            dataType: 'jsonp',
            data: $.extend({}, my.defaultData, data),
            success: function (data) {
                deferred.resolve(data);
                if (!!callback) callback(data);
            },
            error: function (xhr, textStatus) {
                deferred.reject(xhr, textStatus);
                alert('MEH! geonames server returned: ' + textStatus);
            }
        });
        return deferred.promise();
    }

    function formatDate(date) {
        var dateQs = '';
        if (date) {
            dateQs = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }
        return dateQs;
    }

    //Should extend for more information like weather etc.. 
    var methods = {
        cities: { params: ['north', 'south', 'east', 'west', 'lang'] },
        countryCode: { params: ['lat', 'lng', 'type', 'lang', 'radius'] },
        countryInfo: { params: ['country', 'lang'] },
        findNearby: { params: ['lat', 'lng', 'featureClass', 'featureCode', 'radius', 'style', 'maxRows'] },
        findNearbyPlacename: { params: ['lat', 'lng', 'radius', 'style'] },
        get: { params: ['geonameId', 'lang', 'style'] },
        gtopo30: { params: ['lat', 'lng'] },
        wikipediaBoundingBox: { params: ['north', 'south', 'east', 'west', 'lang', 'maxRows'] },
        wikipediaSearch: { params: ['q', 'title', 'lang', 'maxRows'] }
    };

    return my;
}(jQuery));

//Country Select sort and return
(function ($) {
    $.fn.twlCountrySelect = function (options) {
        var el = this;
        $.when(twlGeo.getGeoNames('countryInfo'))
         .then(function (data) {
             var sortedNames = data.geonames;
             if (data.geonames.sort) {
                 sortedNames = data.geonames.sort(function (a, b) {
                     return a.countryName.localeCompare(b.countryName);
                 });
             }
             sortedNames.unshift({ countryCode: '', countryName: '' });
             var html = $.map(sortedNames, function (c) {

                 return '<option value="' + c.countryCode + '">' + c.countryName + '</option>';
             });
             el.html(html);
             if (options && options.callback) options.callback(sortedNames);
         });
    };


    //Location Select, sort and return 
    $.fn.twlLocationSelect = function (options) {

        var el = this;
        var north = options.northInput;
        var south = options.southInput;
        var east = options.eastInput;
        var west = options.westInput;

        $.when(twlGeo.getGeoNames('cities', { north: north, south: south, east: east, west: west }))
        .then(function (data) {
            var sortedNames = data.geonames;
            if (data.geonames.sort) {
                sortedNames = data.geonames.sort(function (a, b) {
                    return a.countrycode.localeCompare(b.name);
                });
            }
            sortedNames.unshift({ countrycode: '', name: '' });
            var html = $.map(sortedNames, function (c) {
                return '<option value=' + c.lat + "|" + c.lng + '>' + c.name + '</option>';
            });
            el.html(html);
            if (options && options.callback) options.callback(sortedNames);
            document.getElementById("citiesPanel").style.display = "block"
        });
    };

})(jQuery);