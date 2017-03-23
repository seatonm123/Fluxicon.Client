(function(){
  'use strict';

  angular
    .module('fluxicon')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['$http', '$stateParams', '$state'];

    function HomeController($http, $stateParams, $state){
      const vm = this;

      vm.$onInit = function(){
        vm.showLoginSignup = true;
        vm.showMenu = false;
        vm.showForm = false;
      };

    }

})();
