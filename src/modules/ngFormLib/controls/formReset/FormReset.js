import angular from 'angular';

const mod = angular.module('ngFormLib.controls.formReset', []);

export default mod.name;


mod.directive('formReset', ['$parse', function($parse) {
  function resetFieldState(controlMap) {
    // Loops through the controlMap and reset's each field's state
    for (let item in controlMap) {
      if (controlMap.hasOwnProperty(item)) {
        let controlList = controlMap[item];

        for (let j = 0, jLen = controlList.length; j < jLen; j++) {
          controlList[j].controller.fieldState = '';
        }
      }
    }
  }

  return {
    restrict: 'A',
    require: '^form',
    link: function(scope, element, attr, controller) {
      let ngModelGet = $parse(attr.formReset);
      let ngModelSet = ngModelGet.assign;

      if (!ngModelSet) {
        throw Error('formReset requires an assignable scope-expression. "' + attr.formReset + '" is un-assignable.');
      }

      // Get a copy of the data as soon as the directive is created, which is after the scope/controller has been initialised (safe)
      let originalData = angular.copy(ngModelGet(scope));

      element.on('click', function() {
        if (typeof controller.setSubmitted === 'function') {
          controller.setSubmitted(false);
        }
        // Use a *copy* of the original data, as we don't want originalData to be modified by subsequent changes to the model by the form controls
        ngModelSet(scope, angular.copy(originalData));
        resetFieldState(controller._controls || {});
        controller.$setPristine();

        scope.$emit('event:FormReset');
        scope.$digest();
      });
    },
  };
}]);
