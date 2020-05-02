app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    $scope.messages = [];
    $scope.players = [];

    $scope.init = ()=>{
        const username = prompt('Lütfen adınızı girin.');

        if(username)
            initSocket(username);
        else
            return false;
    }

    

    async function initSocket(username){

        const connectionOptions = {
            reconnectionAttemps:3,
            reconnectionDelay:600
        };
    try{
        const socket = await indexFactory.connectSocket('https://chat-chat-chat-01.herokuapp.com/',connectionOptions);

            socket.emit('newUser',{username});

            socket.on('initPlayers',(players)=>{
                $scope.players = players;
                $scope.$apply();
            });

            socket.on('newUser',(data)=>{
                const messageData={
                    type: {
                        code:0,//server or user  message
                        message:'Katıldı.'//login or disconnect message
                    },//info messages
                    username:data.username
                };
            $scope.messages.push(messageData);
            $scope.players[data.id] =data;
            scroolTop();
            $scope.$apply();
            });


        socket.on('newMessage',(message)=>{
            $scope.messages.push(message);
            $scope.$apply();
            showBuble(message.socketId,message.text);
            scroolTop();
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
            delete  $scope.players[data.id];
            scroolTop();
            $scope.$apply();
        });


        socket.on('animate',(data)=>{
            $('#'+ data.socketId).animate({'left':data.x , 'top':data.y },()=>{
                animate=false;
            });
        });
        
        let animate = false;
        $scope.onClickPlayer=($event)=>{
            if(!animate)
            {
                let x =$event.offsetX;
                let y = $event.offsetY;

                socket.emit('animate',{x,y})
                animate=true;
                $('#'+ socket.id).animate({'left':x , 'top':y },()=>{
                    animate=false;
                });
            }
        };


        $scope.newMessage=()=>{
            let message = $scope.message;

            const messageData={
                type: {
                    code:1,//server or user  message
                },
                username:username,
                text : message
            };
            $scope.messages.push(messageData);
            $scope.message = '';

            socket.emit('newMessage',messageData);
            showBuble(socket.id,message);
            scroolTop();
        }


        function scroolTop(){
            setTimeout(()=>{
                const element = document.getElementById('chat-area');
                element.scrollTop = element.scrollHeight;
            });
        };

        function showBuble(id,message){
            $('#'+id).find('.message').show().html(message);

            setTimeout(() => {
                $('#'+id).find('.message').hide();
            }, 2000);
        }

        return{
            connectSocket
        }

    }catch(err){
        console.log(err);
    }
    }

}]);