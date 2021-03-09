'use strict';

angular.module('core.comment').
    directive('commentReplyThread', function(Comment, $cookies){
        return {
            restrict: "E",
            scope: {
                comment: '=comment',
                slug: '=slug',
            },
            template: "<div class='row' ng-repeat='repl in replies' style='margin-top: 10px;' >" +
            "<div class='col-sm-12'>" +
                "<div class=\"panel panel-default\">" +
                    "<div class=\"panel-body\" > {{ repl.content }} <br/>" +
                    "<small> via {{ repl.user.username }} </small>" +
                    "<small  ng-show=\"repl.user.username == currentUser\">|" +
                    "<a confirm-click='Do you want to delete this?' confirmed-click='deleteComment(repl, comment)' href='#'> Remove </a></small>" +
                "</div>" +
            "</div>" +
            "</div></div>" +
            "<div class='text-center' ng-show='!replies'>" +
                "<img style='margin: 0 auto;' ng-src='/static/img/loading.gif' class='img-responsive'/>" +
            "</div>" +
            "<p style='color:red;' ng-if='reply.content'>Preview: {{ reply.content }}</p>" +
            "<form ng-submit='addCommentReply(reply, comment)'>" +
                "<div class=\"form-group\" ng-class=\"{'has-error': replyError.content}\">" +
                    "<textarea class='form-control' id='replyText-{{comment.id}}' ng-model='reply.content' placeholder='Write your reply'></textarea>" +
                    "<label class=\"control-label\" for=\"replyText-{{comment.id}}\" ng-if='replyError.content'><span ng-repeat='error in replyError.content'> {{ error }} <br> </span></label>" +
                "</div>" +
                "<input class='btn btn-default btn-sm' type='submit' value='reply'/>" +
            "</form>",
            link: function(scope, element, attr) {
                if ($cookies.get("token")) {
                    scope.currentUser = $cookies.get("username")
                }

                scope.currentUser = $cookies.get("username")
                if (scope.comment) {
                    var commentID = scope.comment.id
                    if (commentID) {
                        Comment.get({id: scope.comment.id}, function(data){
                            scope.replies = data.replies
                        })
                    }
                }

                scope.reply = {}
                scope.replyError = {}
                scope.$watch(function(){
                    if (scope.reply.content) {
                        scope.replyError = {}
                    }
                })

                scope.deleteComment = function(reply, comment) {
                    Comment.delete({
                        "id": reply.id
                    }, function(data) {
                        // success
                        var index = scope.replies.indexOf(reply)
                        scope.replies.splice(index)
                        comment.reply_count -= 1
                    }, function(data) {
                        // error
                        console.log(data)
                    })
                }

                scope.addCommentReply = function(reply, comment) {
                    if (!reply.content) {
                        scope.replyError.content = ["This field is required"]
                    } else {
                        Comment.create({
                            content: reply.content,
                            type: "post",
                            slug: scope.slug,
                            parent_id: comment.id,
                        }, function(data) {
                            // success
                            // $scope.comments.push(data)
                            if (comment.reply_count) {
                                comment.reply_count += 1
                            } else {
                                comment.reply_count = 1
                            }
                            scope.replies.push(data)
                            // resetNewComment()
                            reply.content = ""
                        }, function(data) {
                            // error
                            console.log(data)
                            scope.replyError = data.data
                        })
                    }
                }
            }
        }
    })