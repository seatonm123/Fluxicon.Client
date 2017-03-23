(function(){
  'use strict';

  angular
    .module('fluxicon')
    .controller('FluxController', FluxController);

    FluxController.$inject = ['$http', '$stateParams', '$state'];

  function FluxController($http, $stateParams, $state){
    const vm = this;

    vm.$onInit = function(){
      vm.showFlux = false;
      vm.showSetup = true;
      vm.showScoreCorrect = false;
      vm.showScoreWrong = false;
      vm.showProgress = false;
      getPhraseArray();
    };

    var phraseArray = [];
    var translateArray = [];
    var queryStringArray = [];
    var toGuess = {};
    var guessContent = "";
    vm.currentScore = 0;
    vm.optimalScore = 0;
    vm.initialLength = 0;

    vm.startFlux = function(){
      let finalCategory = configureCategory(vm.category);
      let finalDifficulty = configureDifficulty(vm.difficulty);
      for(var i = 0; i < phraseArray.length; i++){
        if(phraseArray[i].category == finalCategory && phraseArray[i].difficulty == finalDifficulty){
          translateArray.push(phraseArray[i]);
          vm.optimalScore += phraseArray[i].points;
          vm.initialLength += 1;
        }
      }
      for(var j = 0; j < translateArray.length; j++){
        let finalLang = configureLanguage(vm.language);
        console.log(finalLang);
        let thisQuery = buildQuery(translateArray[j], finalLang);
        queryStringArray.push(thisQuery);
      }
      queryThatShiz(queryStringArray);
      toPost();
      vm.showProgress = true;

    };

  function queryThatShiz(stringArray){
    $http.get(stringArray[0])
      .then(function(response){
        vm.activePhrase = response.data.data.translations[0].translatedText;
      });
      vm.showFlux = true;
      vm.showSetup = false;
      vm.displayGuess = true;
      toGuess = translateArray[0];
      guessContent = toGuess.content;
      queryStringArray.shift();
      translateArray.shift();
    }

    function getPhraseArray(){
      $http.get('https://fluxicon.herokuapp.com/phrases')
        .then(function(response){
          for(var i = 0; i < response.data.length; i++){
            phraseArray.push(response.data[i]);
          }
        });
    }

  function configureCategory(category){
    let thisCategory = category.toString().trim();
    let inputCategory = "";
    switch (thisCategory){
      case "Famous Quotes":
        inputCategory = "quotes";
        break;
      case "Song Lyrics":
        inputCategory = "music";
        break;
      case "Movie Quotes":
        inputCategory = "film";
        break;
      case "Jokes":
        inputCategory = "jokes";
        break;
      case "Random Facts":
        inputCategory = "facts";
    }
    return inputCategory;
  }

  function configureDifficulty(difficulty){
    let thisDifficulty = difficulty.toString().trim();
    let inputDifficulty = "";
    switch (thisDifficulty){
      case "Very Easy":
        inputDifficulty = "1";
        break;
      case "Easy":
        inputDifficulty = "2";
        break;
      case "Normal":
        inputDifficulty = "3";
        break;
      case "Hard":
        inputDifficulty = "4";
        break;
      case "Very Hard":
        inputDifficulty = "5";
    }
    return inputDifficulty;
  }

  function configureLanguage(lang){
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
  }


  function buildQuery(obj, language){
    obj.content.replace(/\.$/, "");
    let newContent = obj.content.replace(/ /g, '%20');
    var queryString = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyBApbjktvbol-fvZXCJISFwbNNjDXY2N5k&source=en&target=' + language + '&q=' + newContent;
    return queryString;
  }

  vm.makeGuess = function(){
    var finalScore = 0;
    var score = 0;
    vm.wrongArray = [];
    var noSpaceAnswer = guessContent.split(' ');
    console.log(noSpaceAnswer);
    var noSpaceGuess = vm.yourGuess.split(' ');
    console.log(noSpaceGuess);
    for(var i = 0; i < noSpaceAnswer.length; i++){
      if(noSpaceAnswer[i] == noSpaceGuess[i] || noSpaceAnswer[i] == noSpaceGuess[i+1] || noSpaceAnswer[i] == noSpaceGuess[i-1]){
        score += 1;
      } else {
        vm.wrongArray.push(noSpaceAnswer[i]);
      }
    }
    finalScore = Math.ceil((score/noSpaceAnswer.length) * toGuess.points);
    vm.yourScore = "'" + guessContent + "' : " + toGuess.author;
    vm.thisScore = finalScore;
    vm.currentScore += finalScore;
    vm.showScore = true;
    vm.noAnswer = true;
    vm.showFlux = false;
  };

  vm.nextPhrase = function(){
    vm.wrongArray = [];
    if(queryStringArray.length > 0){
    vm.thisLength = queryStringArray.length;
    console.log(vm.thisLength);
    vm.yourGuess = "";
    vm.yourScore = "";
    queryThatShiz(queryStringArray);
    vm.showScore = false;
    vm.noAnswer = false;
    vm.finalLength = 100 - ((vm.thisLength / vm.initialLength) * 100);
    vm.displayGuess = true;
    } else {
      isFinal();
    }
  };

  function isFinal(){
      vm.endItAll = true;
      vm.showFlux = false;
      vm.showSetup = false;
      vm.showScore = false;
      vm.finalLength = 100;
      vm.showProgress = false;
      assessMastery();
      // putUser();
  }

  function assessMastery(){
    let finalPercentage = (vm.currentScore/vm.optimalScore) * 100;
    let yourMastery = ""
    if(finalPercentage <= 100 && finalPercentage > 90){
      yourMastery = "master";
    } else if (finalPercentage <= 90 && finalPercentage > 80){
      yourMastery = "guru";
    } else if (finalPercentage <= 80 && finalPercentage > 70){
      yourMastery = "scholar";
    } else if (finalPercentage <= 70 && finalPercentage > 60){
      yourMastery = "acolyte";
    } else if (finalPercentage <= 60 && finalPercentage > 50){
      yourMastery = "novice";
    } else {
      yourMastery = "beginner";
    }
    vm.mastery = yourMastery;
  }

  function toPost(){
    var thisGame = {
      method: 'POST',
      url: 'https://fluxicon.herokuapp.com/games',
      data: {
        language: vm.language.toString().trim(),
        points_to_win: vm.optimalScore,
        points_for_win: Math.floor(vm.optimalScore * 0.15),
        points_for_loss: Math.floor(vm.optimalScore * 0.05),
        mode: "Single",
        difficulty: configureDifficulty(vm.difficulty)
      }
    };
      $http(thisGame).then(function(response){
        localStorage.setItem('thisGame', response.data[0].id);
      });
    }

    vm.postProgress = function(){
      console.log('posting progress');

      var progressPost = {
        method: 'POST',
        url: 'https://fluxicon.herokuapp.com/progress',
        data: {
          user_id: localStorage.getItem('currentUser'),
          language: vm.language.toString().trim(),
          mode: "Single",
          game_number: 0,
          percentage_correct: Math.floor((vm.currentScore / vm.optimalScore) * 100)
      }
    };
    console.log(progressPost);
      $http(progressPost).then(function(response){
        console.log(response);
      });
    };

  //   function getUser(){
  //     $http.get('http://localhost:2500/users/user/' + localStorage.getItem('currentUser'))
  //     .then(function(response){
  //       vm.myPoints = response.data[0].points;
  //       console.log(response);
  //       console.log(vm.myPoints);
  //       vm.myLevel = getLevel(response.data[0].points, response.data[0].level);
  //     });
  //     putUser();
  //   }
  //   function putUser(){
  //       var thisPatch = {
  //         method: 'PATCH',
  //         url: 'http://localhost:2500/users/user/' + localStorage.getItem('currentUser'),
  //         data: {
  //           points: vm.myPoints + vm.currentScore,
  //           level: vm.myLevel
  //         }
  //       };
  //         $http(thisPatch).then(function(response){
  //           console.log(vm.myPoints);
  //           console.log(response);
  //           console.log(vm.currentScore);
  //         });
  // }
  //
  //   function getLevel(points, level){
  //     if(points < 75){
  //       level = 1;
  //     }else if (points >= 75 && points <= 149){
  //       level = 2;
  //     } else if(points >= 150 && points <= 249){
  //       level = 3;
  //     } else if(points >= 250 && points <= 399){
  //       level = 4;
  //     } else if (points >= 400 && points <= 599){
  //       level = 5;
  //     } else if(points >= 600 && points <=899){
  //       level = 6;
  //     } else if(points >=900 && points <= 1299){
  //       level = 7;
  //     } else if(points >= 1300 && points <= 1599){
  //       level = 8;
  //     } else if(points >= 1600 && points <= 1999){
  //       level = 9;
  //     } else if(points >= 2000){
  //       level = 10;
  //     }
  //     return level;
  //   }

}

})();
