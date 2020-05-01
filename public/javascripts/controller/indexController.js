app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

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
            socket.emit('newUser',{username})
        }).catch((err)=>{
            console.log(err);
        });
    }


}]);