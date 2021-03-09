'use strict';

angular.module('blogDetail').
    component('blogDetail', {
        //templateUrl: '/api/templates/blog-detail.html',
        template: "<ng-include src='getTemplateUrl()' />",
        controller: function(Comment, Post, $cookies, $http, $location, $routeParams, $scope){
            $scope.loading = true
            $scope.post = null
            $scope.pageError = false
            $scope.notFound = false

            var oldContent = ""
            $scope.editMode = false

            $scope.getTemplateUrl = function(){
                // if no token nor username then by sure there is no session
                if (!$cookies.get("token") || !$cookies.get("username")) {
                    $location.path("/login/")
                }

                if ($scope.loading && $scope.post == null) {
                    return '/api/templates/loading/loading-detail.html'
                } else if ($scope.notFound) {
                    return '/api/templates/error/404.html'
                } else if ($scope.pageError){
                    return '/api/templates/error/500.html'
                } else {
                    return '/api/templates/blog-detail.html'
                }
            }

            if ($cookies.get("token")) {
                $scope.currentUser = $cookies.get("username")
            }

            function postDataSuccess(data) {
                $scope.loading = false
                $scope.post = data
                // $scope.comments = data.comments
                Comment.query({"slug": slug, "type": "post"}, function(data){
                    $scope.comments = data
                })
            }

            function postDataError(data) {
                $scope.loading = false
                if (data.status == 404) {
                    $scope.notFound = true
                } else {
                    $scope.pageError = true
                }
            }

            var slug = $routeParams.slug
            Post.get({"slug": slug}, postDataSuccess, postDataError)

            $scope.switchEditMode = function() {
                if ( $scope.editMode) {
                    // canceled
                    $scope.post.content = oldContent
                } else {
                    // on edit mode
                    oldContent = $scope.post.content
                }

                $scope.editMode = !$scope.editMode
            }

            $scope.updateContent = function() {
                var token = $cookies.get("token")
                $scope.post.$update({
                    "slug": $scope.post.slug,
                    "id": $scope.post.id,
                    "content": $scope.post.content,
                    "action": "edit"
                }, function(data) {
                    // success
                    $scope.editMode = false
                    oldContent = ""
                }, function(data) {
                    // error
                    console.log(data)
                })
            }

            $scope.deleteComment = function(comment) {
                comment.$delete({
                    "id": comment.id
                }, function(data) {
                    // success
                    var index = $scope.comments.indexOf(comment)
                    $scope.comments.splice(index)
                }, function(data) {
                    // error
                    console.log(data)
                })

                // other available methods:
                // $create
                // $save
            }

            $scope.updateReply = function(comment) {
                var token = $cookies.get("token")
                Comment.update({
                    id: comment.id,
                    content: $scope.reply.content,
                    type: "post",
                    slug: slug,
                }, function(data) {
                    // success
                    // $scope.comments.push(data)
                    // resetReply()
                }, function(data) {
                    // error
                    console.log(data)
                })
            }

            $scope.commentOrder = "-timestamp"

            $scope.$watch(function(){
                if ($scope.newComment.content) {
                    $scope.commentError = {}
                }
            })

            $scope.newComment = {}
            $scope.commentError = {}
            $scope.addNewComment = function() {
                // var token = $cookies.get("token")
                if (!$scope.newComment.content) {
                    $scope.commentError.content = ["This field is required"]
                } else {
                    Comment.create({
                        content: $scope.newComment.content,
                        type: "post",
                        slug: slug,
                    }, function(data) {
                        // success
                        data.reply_count = 0
                        $scope.comments.push(data)
                        resetNewComment()
                    }, function(data) {
                        // error
                        console.log(data)
                        $scope.commentError = data.data
                    })
                }
            }

            function resetNewComment(){
              $scope.newComment = {
                          // id: $scope.comments.length + 1,
                          content: "",
              }
            }

            if ($scope.notFound) {
                console.log("Not found")
                // change location
                $location.path("/")
            }
    }
});