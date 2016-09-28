(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItemsDirective);

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundList.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };

  return ddo;
}




NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrow = this;

  narrow.narrowItDown = function () {
    var promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

    promise.then(function (response) {
      console.log(response);
      narrow.found = response;
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  narrow.removeItem = function(index) {
    narrow.found.splice(index,1);
  }

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function(result) {
      var retarr = [];
      console.log(result);
      var foundItems = result.data.menu_items;
      for (var i = 0; i < foundItems.length; i++) {
        if(foundItems[i].description.toLowerCase().indexOf(searchTerm) != -1) {
          retarr.push(foundItems[i]);
        }
      }
      return retarr;
    });

    return response;
  };



}

})();
