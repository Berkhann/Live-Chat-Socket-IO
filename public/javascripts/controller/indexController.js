app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    $scope.messages = [];

    $scope.init = ()=>{
        const username = prompt('Lütfen adınızı girin.');

        if(username)
            initSocket(username);
        else
            return false;
    }

    function initSocket(username){
        indexFactory.connectSocket('http://localhost:3000',{
            reconnectionAttemps:3,
            reconnectionDelay:600
        }).then((socket)=>{
            socket.emit('newUser',{username});
            socket.on('newUser',(data)=>{
                const messageData={
                    type: {
                        code:0,//server or user  message
                        message:'Katıldı.'//login or disconnect message
                    },//info messages
                    username:data.username
                };
            $scope.messages.push(messageData);
            $scope.$apply();
            });



        socket.on('discUser',(user)=>{
            const messageData={
                type: {
                    code:0,
                    message:'Ayrıldı.'
                },//info messages
                username:user.username
            };
            $scope.messages.push(messageData);
            $scope.$apply();
        });


        }).catch((err)=>{
            console.log(err);
        });
    }


}]);