(function(){

  angular
    .module('fluxicon')
    .controller('LoginController', LoginController)

    LoginController.$inject = ['$http', '$stateParams', '$state'];

    function LoginController($http, $stateParams, $state){
      const vm = this;

      vm.$onInit = function(){
        vm.showLoginSignup = true;
      };



      vm.showSignup = function(){
        vm.showForm = true;
        vm.showLogin = false;
      };

      vm.loginShow = function(){
        vm.showLogin = true;
        vm.showForm = false;
      };



      vm.signupSubmit = function(newUser){
        var signUser = {
          method: 'POST',
          url: 'http://localhost:2500/users',
          data: {user_name: vm.newUser.signupUsername,
                 email: vm.newUser.signupEmail,
                 password: vm.newUser.signupPassword,
                language_of_choice: vm.newUser.foreignLang}
        };
        $http(signUser).then(function(response){
          localStorage.setItem('currentUser', response.data[0]);
          vm.showLogin = false;
          vm.showForm = false;
          vm.showMenu = true;
          vm.showLoginSignup = false;
          $state.go('home');
        });
      };

      vm.loginSubmit = function(){
        console.log(vm.loginUsername);
        $http.get('http://localhost:2500/users/' + vm.loginUsername)
          .then(function(response){
            if(vm.loginPassword == response.data[0].password){
            localStorage.setItem('currentUser', response.data[0].id);
            vm.showLogin = false;
            vm.showForm = false;
            vm.showMenu = true;
            vm.showLoginSignup = false;
            $state.go('home');
          } else {
            alert('not a valid user');
            vm.loginUsername = "";
            vm.loginPassword = "";
          }
          });
      };

  }
})();
