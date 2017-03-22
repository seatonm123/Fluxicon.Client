(function(){
  'use strict';

  angular
    .module('fluxicon')
    .controller('ProgressionController', ProgressionController);

    ProgressionController.$inject = ['$http', '$stateParams', '$state'];

    function ProgressionController($http, $stateParams, $state){
      const vm = this;


      vm.$onInit = function(){
        var frenchArray = [];
        var spanishArray = [];
        var germanArray = [];
        var latinArray = [];
        var italianArray = [];

        $http.get('http://localhost:2500/progress/' + localStorage.getItem('currentUser'))
          .then(function(response){
            for(var i = 0; i < response.data.length; i++){
              if(response.data[i].language == "French"){
                frenchArray.push(response.data[i].percentage_correct);
              }
            var frenchNum = 0;
            for(var j = 0; j < frenchArray.length; j++){
              frenchNum += frenchArray[j];
            }
              if(response.data[i].language == "Spanish"){
                spanishArray.push(response.data[i].percentage_correct);
              }
            var spanishNum = 0;
            for(var x = 0; x < spanishArray.length; x++){
              spanishNum += spanishArray[x];
            }
              if(response.data[i].language == "German"){
                germanArray.push(response.data[i].percentage_correct);
              }
            var germanNum = 0;
            for(var y = 0; y < germanArray.length; y++){
              germanNum += germanArray[y];
            }
              if(response.data[i].language == "Latin"){
                latinArray.push(response.data[i].percentage_correct);
              }
            var latinNum = 0;
            for(var s = 0; s < latinArray.length; s++){
              latinNum += latinArray[s];
            }
              if(response.data[i].language == "Italian"){
                italianArray.push(response.data[i].percentage_correct);
              }
            var italianNum = 0;
            for(var m = 0; m < italianArray.length; m++){
              italianNum += italianArray[m];
            }
            vm.frenchAverage = frenchNum / frenchArray.length - 1;
            vm.spanishAverage = spanishNum / spanishArray.length - 1;
            vm.germanAverage = germanNum / germanArray.length - 1;
            vm.latinAverage = latinNum / latinArray.length - 1;
            vm.italianAverage = italianNum / italianArray.length - 1;
            }
          });

        var canvas = d3.select('#outer-container').append('svg')
                      .attr('width', 1000)
                      .attr('height', 700);

        var lineCanvas = d3.select('#second-container').append('svg')
                          .attr('width', 1000)
                          .attr('height', 500);

        var langArray = ['French', 'Spanish', 'German', 'Latin', 'Italian'];


        d3.json('http://localhost:2500/progress/' + localStorage.getItem('currentUser'), function(data){
          var frenchArray = [];
          var frenchPercentages = [];
          var spanishArray = [];
          var spanishPercentages = [];
          var germanArray = [];
          var germanPercentages = [];
          var latinArray = [];
          var latinPercentages = [];
          var italianArray = [];
          var italianPercentages = [];
          var avgPercentages = [];

            for(var i = 0; i < data.length; i++){
              if(data[i].language == "French"){
                frenchArray.push(data[i]);
                frenchPercentages.push(data[i].percentage_correct);
              } else if (data[i].language == "Spanish"){
                spanishArray.push(data[i]);
                spanishPercentages.push(data[i].percentage_correct);
              } else if (data[i].language == "German"){
                germanArray.push(data[i]);
                germanPercentages.push(data[i].percentage_correct);
              } else if (data[i].language == "Latin"){
                latinArray.push(data[i]);
                latinPercentages.push(data[i].percentage_correct);
              } else if (data[i].language == "Italian"){
                italianArray.push(data[i]);
                italianPercentages.push(data[i].percentage_correct);
              }
            }

        avgPercentages.push(d3.mean(frenchPercentages), d3.mean(spanishPercentages), d3.mean(germanPercentages), d3.mean(latinPercentages), d3.mean(italianPercentages));
        console.log(avgPercentages);
        var color = d3.scaleOrdinal()
                    .range(['yellow', 'green', 'blue', 'purple', 'red']);
        var arcGroup = canvas.append('g')
                    .attr('transform', 'translate(520, 300)');




        var fR = 100;
        var sR = 140;
        var gR = 180;
        var lR = 220;
        var iR = 260;
        var p = Math.PI * 2;
        //
        //
        var fArc = d3.arc()
                  .innerRadius(fR-40)
                  .outerRadius(fR)
                  .startAngle(0)
                  .endAngle(- p + ( d3.mean(frenchPercentages)/6.28));
        var sArc = d3.arc()
                    .innerRadius(sR - 40)
                    .outerRadius(sR)
                    .startAngle(0)
                    .endAngle(- p + (d3.mean(spanishPercentages) / 6.8));
        var gArc = d3.arc()
                    .innerRadius(gR - 40)
                    .outerRadius(gR)
                    .startAngle(0)
                    .endAngle(p - (d3.mean(germanPercentages) / 6.28));
        var lArc = d3.arc()
                    .innerRadius(lR - 40)
                    .outerRadius(lR)
                    .startAngle(0)
                    .endAngle(-p + (d3.mean(latinPercentages) / 6.28));
        var iArc = d3.arc()
                    .innerRadius(iR - 40)
                    .outerRadius(iR)
                    .startAngle(0)
                    .endAngle(-p + (d3.mean(italianPercentages) / 6.28));
        var endArc = d3.arc()
                    .innerRadius(260)
                    .outerRadius(280)
                    .startAngle(0)
                    .endAngle(6.3);

        var circle = arcGroup.append('circle')
                      .attr('r', 260)
                      .attr('fill', 'grey');

        arcGroup.append('path')
              .attr('d', fArc)
              .attr('fill', 'yellow');
        arcGroup.append('path')
              .attr('d', sArc)
              .attr('fill', 'green');
        arcGroup.append('path')
              .attr('d', gArc)
              .attr('fill', 'blue');
        arcGroup.append('path')
              .attr('d', lArc)
              .attr('fill', 'purple');
        arcGroup.append('path')
              .attr('d', iArc)
              .attr('fill', 'red');
        arcGroup.append('path')
              .attr('d', endArc);

      var fLineData = [];
      var sLineData = [];
      var gLineData = [];
      var lLineData = [];
      var iLineData = [];
      var fX = 10;
      var sX = 10;
      var gX = 10;
      var iX = 10;
      var lX = 10;
        for(var t = 0; t < frenchPercentages.length; t++){
          fLineData.push({x:fX, y: frenchPercentages[t]});
          fX += 50;
        }
        for(var v = 0; v < spanishPercentages.length; v++){
          sLineData.push({x:sX, y: spanishPercentages[v]});
          sX += 50;
        }
        for(var o = 0; o < germanPercentages.length; o++){
          gLineData.push({x:gX, y: germanPercentages[o]});
          gX += 50;
        }
        for(var n = 0; n < latinPercentages.length; n++){
          lLineData.push({x:lX, y: latinPercentages[n]});
          lX += 50;
        }
        for(var q = 0; q < italianPercentages.length; q++){
          iLineData.push({x:iX, y: italianPercentages[q]});
          iX += 50;
        }


      var fGroup = lineCanvas.append('g')
                    .attr('transform', 'translate(200, 200)');
      var sGroup = lineCanvas.append('g')
                    .attr('transform', 'translate(200, 200)');

      var gGroup = lineCanvas.append('g')
                    .attr('transform', 'translate(200, 200)');

      var lGroup = lineCanvas.append('g')
                    .attr('transform', 'translate(200, 200)');
      var iGroup = lineCanvas.append('g')
                    .attr('transform', 'translate(200, 200)');

      var fLine = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});
      var sLine = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});
      var gLine = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});
      var lLine = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});
      var iLine = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});

    lGroup.selectAll('path')
            .data([lLineData])
            .enter()
            .append('path')
            .attr('d', lLine)
            .attr('fill', 'none')
            .attr('stroke', 'purple')
            .attr('stroke-width', 4);


     gGroup.selectAll('path')
            .data([gLineData])
            .enter()
            .append('path')
            .attr('d', gLine)
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 4);

      sGroup.selectAll('path')
            .data([sLineData])
            .enter()
            .append('path')
            .attr('d', sLine)
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', 4);

      fGroup.selectAll('path')
            .data([fLineData])
            .enter()
            .append('path')
            .attr('d', fLine)
            .attr('fill', 'none')
            .attr('stroke', 'yellow')
            .attr('stroke-width', 4);

      iGroup.selectAll('path')
            .data([iLineData])
            .enter()
            .append('path')
            .attr('d', iLine)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 4);

      });

      vm.arcShow = function(){
        vm.showArc = true;
        vm.showLine = false;
      };
      vm.lineShow = function(){
        console.log('Why aint this workin');
        vm.showLine = true;
        vm.showArc = false;
      };

    };
  }

})();
