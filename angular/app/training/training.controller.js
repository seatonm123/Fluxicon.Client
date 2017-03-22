(function(){
  'use strict';

  angular
    .module('fluxicon')
    .controller('TrainingController', TrainingController);

    TrainingController.$inject = ['$http', '$stateParams', '$state'];

    function TrainingController($http, $stateParams, $state){
      const vm = this;

      vm.$onInit = function(){
        vm.showFlux = false;
        vm.showSetup = true;
        vm.showScore = false;
        console.log('At least this works.');
      };

      vm.wordArray = [];
      var thisOne = "";
      var thatOne = "";
      var guesses = 0;
      vm.counter = 0;
      vm.totalPoints = 0;
      vm.hadThree = false;

      vm.startFlux = function(){
        vm.showFlux = true;
        vm.showSetup = false;
        vm.showProgress = true;
        var thisPhrase = getPhrase();
        toPost();
      };

      function getPhrase(){
          vm.thisLanguage = vm.configureLanguage(vm.language);
          let thisDiff = vm.difficulty.toString().trim();
          let queryString = '';
          if(thisDiff == 'Very Easy'){
            queryString = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=100&maxCorpusCount=500&minDictionaryCount=7&maxDictionaryCount=20&minLength=3&maxLength=4&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
          } else if(thisDiff == 'Easy'){
            queryString = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=100&maxCorpusCount=500&minDictionaryCount=7&maxDictionaryCount=20&minLength=4&maxLength=6&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
          } else if(thisDiff == 'Normal'){
            queryString = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=100&maxCorpusCount=500&minDictionaryCount=7&maxDictionaryCount=20&minLength=6&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
          } else if(thisDiff == 'Hard'){
            queryString = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=100&maxCorpusCount=500&minDictionaryCount=7&maxDictionaryCount=20&minLength=8&maxLength=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
          } else if(thisDiff == 'Very Hard'){
            queryString = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=100&maxCorpusCount=500&minDictionaryCount=7&maxDictionaryCount=20&minLength=10&maxLength=20&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
          }
          $http.get(queryString).then(function(response){
             vm.myPhrase = response.data.word;
             console.log(vm.myPhrase);
            $http.get('https://translation.googleapis.com/language/translate/v2?key=AIzaSyBApbjktvbol-fvZXCJISFwbNNjDXY2N5k&source=en&target=' + vm.thisLanguage + '&q=' + vm.myPhrase)
              .then(function(response){
                vm.activePhrase = response.data.data.translations[0].translatedText;
              });
          });
      }

      vm.configureLanguage = function(lang){
        let thisLang = lang.toString().trim();
        let inputLang = "";
          switch(thisLang){
            case "French":
              inputLang = "fr";
              break;
            case "Spanish":
              inputLang = "es";
              break;
            case "German":
              inputLang = "de";
              break;
            case "Latin":
              inputLang = "la";
              break;
            case "Italian":
              inputLang = "it";
          }
          return inputLang;
      };

      vm.makeGuess = function(){
        vm.counter += 1;
        vm.finalLength = vm.counter * 10;
        vm.showFlux = false;
        vm.showResults = true;
        vm.noAnswer = true;
        vm.hintActivated = false;
        if(vm.yourGuess == vm.myPhrase){
          vm.rightAnswer = true;
          vm.totalPoints += 1;
          vm.rightWrong = "Correct!";
        } else {
          vm.rightAnswer = false;
          vm.wrongAnswer = true;
          vm.rightWrong = "Wrong!";
        }
      };

      vm.nextPhrase = function(){
        guesses = 0;
        vm.hadThree = false;
        vm.noAnswer = false;
        if(vm.counter < 10){
          vm.showResults = false;
          vm.showFlux = true;
          vm.yourGuess = "";
          getPhrase();
        } else{
          wrapup();
        }
      };

      function wrapup(){
        assessMastery();
        vm.showFinal = true;
        vm.showFlux = false;
        vm. showSetup = false;
        vm.showResults = false;
        vm.showProgress = true;
      }

      function assessMastery(){
        if (vm.totalPoints >= 9){
          vm.mastery = "masterfully";
        } else if (vm.totalPoints >= 8){
          vm.mastery = "extremely well";
        } else if (vm.totalPoints >= 7){
          vm.mastery = "really well";
        } else if (vm.totalPoints >= 6){
          vm.mastery = "proficiently";
        } else if (vm.totalPoints >= 5){
          vm.mastery = "adequately";
        } else {
          vm.mastery = "like a fish knows how to fly. Keep practicing";
        }
      }

      vm.getHint = function(){
        console.log(guesses);
        $http.get('http://words.bighugelabs.com/api/2/69aad68502ca757410fbfa5d73e96888/' + vm.myPhrase + '/json')
          .then(function(response){
            console.log(response.data);
            if (guesses < 3){
            vm.hintActivated = true;
            if(response.data.hasOwnProperty('adjective')){
                if(guesses === 0){
                  vm.thisHint = response.data.adjective.syn[0];
              } else if (guesses == 1){
                  vm.thisHint = response.data.adjective.syn[1];
              } else if (guesses == 2){
                  vm.thisHint = response.data.adjective.syn[2];
              }
              guesses += 1;
            } else if(response.data.hasOwnProperty('noun')){
                if(guesses === 0){
                  vm.thisHint = response.data.noun.syn[0];
                } else if (guesses == 1){
                  vm.thisHint = response.data.noun.syn[1];
                } else if (guesses == 2){
                  vm.thisHint = response.data.noun.syn[2];
                }
                guesses += 1;
            } else if(response.data.hasOwnProperty('verb')){
                if(guesses === 0){
                  vm.thisHint = response.data.verb.syn[0];
              } else if (guesses == 1){
                  vm.thisHint = response.data.verb.syn[1];
              } else if (guesses == 2){
                  vm.thisHint = response.data.verb.syn[2];
            } else if(response.data.hasOwnProperty('adverb')){
                if(guesses === 0){
                  vm.thisHint = response.data.adverb.syn[0];
              } else if (guesses == 1){
                  vm.thisHint = response.data.adverb.syn[1];
              } else if (guesses == 2){
                  vm.thisHint = response.data.adverb.syn[2];
                }
            }
            guesses += 1;
          }
        } else {
          vm.thisHint = "Out of hints!"
          vm.hadThree = true;
        }
          });
      };

      function toPost(){
        var thisGame = {
          method: 'POST',
          url: 'http://localhost:2500/games',
          data: {
            language: vm.language.toString().trim(),
            points_to_win: 7,
            points_for_win: 2,
            points_for_loss: 2,
            mode: "Training",
            difficulty: null
          }
        };
          $http(thisGame).then(function(response){
            localStorage.setItem('thisGame', response.data[0].id);
          });
        }

        vm.submitScore = function(){
          console.log('posting progress');

          var progressPost = {
            method: 'POST',
            url: 'http://localhost:2500/progress',
            data: {
              user_id: localStorage.getItem('currentUser'),
              language: vm.language.toString().trim(),
              mode: "Single",
              game_number: 0,
              percentage_correct: vm.totalPoints * 10
          }
        };
        console.log(progressPost);
          $http(progressPost).then(function(response){
            console.log(response);
          });
        };

  }

})();
