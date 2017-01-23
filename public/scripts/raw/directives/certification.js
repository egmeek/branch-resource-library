(function (root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory(root, require('angular'));
	} else if (typeof define === 'function' && define.amd) {
		define(['angular'], function (angular) {
			return (root.ngConfirm = factory(root, angular));
		});
	} else {
		root.ngConfirm = factory(root, root.angular);
	}
}(this, function (window, angular) {
	var module = angular.module('ngCertification', []);
  module.provider('certificationConfig', function() {
    return {
			$get: function(){
				return {}
			}
		};
  });

  module.factory('certification', ['$root$scope', function ($root$scope) {
		return {

		};
  }]);

  module.directive('certification', ['certificationConfig', '$resource', '$timeout', 'resultHandler', function (resultConfig, $resource, $timeout, resultHandler) {
    return {
			restrict: "E",
			replace: true,
			scope:{
        entity: "=",
        entityid: "=",
				user: "=",
        displaystar: "=?"
			},
      templateUrl: "/views/certification.html",
      controller: ['$scope', function($scope){
        var Certification = $resource("/api/certification/:certificationId", {certificationId: "@certificationId"});

        $scope.$watch('user', function(newVal, oldVal){
          if($scope.user && $scope.entityid){
            $scope.getCertification();
          }
        });

        $scope.$watch('entityid', function(newVal, oldVal){
          if($scope.user && $scope.entityid){
            $scope.getCertification();
          }
        });

        $scope.getCertification = function(){
          Certification.get({entityId: $scope.entityid, userid: $scope.user}, function(result){
            if(resultHandler.process(result)){
              if(result.data.length > 0) {
                $scope.myCertification = result.data[0] || {};
              }
            }
          });
        };
      }]
    }
  }]);

	return module;
}));
