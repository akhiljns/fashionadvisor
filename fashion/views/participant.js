var app = angular.module('myValidateApp', []);
app.controller('validateCtrl', function($scope) {

   $scope.submitForm = function(isValid) {
   if (isValid) {
     alert('form has been submitted and the participant has been enrolled');
   }
};
});
