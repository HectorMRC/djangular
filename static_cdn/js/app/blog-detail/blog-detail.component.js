'use strict';

angular.module('blogDetail').
    component('blogDetail', {
        templateUrl: '/api/templates/blog-detail.html',
        controller: function(Blog, $http, $location, $routeParams, $scope){
            Blog.get({"slug": $routeParams.slug, function(data){
                //console.log(data)
                $scope.post = data
            }})
            // Post.query(function(data){
            //   $scope.notFound = true
            //   
            //   $scope.comments = []
            //    angular.forEach(data, function(post){
            //         if (post.id == $routeParams.id){
            //           $scope.notFound = false
            //           $scope.post = post
            //           if (post.comments) {
            //             $scope.comments = post.comments
            // 
            //           }
            //           resetReply()
            //         }
            //   })
            // })



            $scope.deleteComment = function(comment) {
                $scope.$apply(
                    $scope.comments.splice(comment, 1)
                )
                // someResource.$delete()
            }


            $scope.addReply = function() {
                console.log($scope.reply)
                $scope.comments.push($scope.reply)
                // $scope.post.comments.push("abc")
                resetReply()
            }

            function resetReply(){
              $scope.reply = {
                          "id": $scope.comments.length + 1,
                          "text": "",
              }
            }

            if ($scope.notFound) {
                console.log("Not found")
                // change location
                $location.path("/")
            }




    }
});