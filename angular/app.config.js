(function(){
  'use strict';

  angular.module('fluxicon').config(config);


  function config($stateProvider, $urlRouterProvider, $locationProvider){

    $locationProvider.html5Mode(true);
    console.log('here');
    $stateProvider
      .state({
        name: 'login',
        url: '/',
        component: 'login'
      })
      
      .state({
        name: 'home',
        url: '/home',
        component: 'home'
      })

      .state({
        name: 'flux',
        url: '/flux',
        component: 'flux'
      })

      .state({
        name: 'training',
        url: '/training',
        component: 'training'
      })

      .state({
        name: 'progression',
        url: '/progression',
        component: 'progression'
      });

  }

})();
