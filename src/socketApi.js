const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = {};

//Helpers
const randomColor = require('../helpers/randomColor');

io.on('connection',(socket)=>{
    console.log('Bir kullanıcı bağlandı.');

    socket.on('newUser',(data)=>{
        const defaultData ={
            id: socket.id,
            position:{
                x:0,
                y:0
            },
            color:randomColor()
        };

        const userData = Object.assign(data,defaultData);
        users[socket.id] = userData;
        socket.broadcast.emit('newUser',userData);
        socket.emit('initPlayers',users);
    });


    socket.on('disconnect',()=>{
        socket.broadcast.emit('discUser',users[socket.id]);
        delete users[socket.id];
    });

    socket.on('animate',(data)=>{
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;

        socket.broadcast.emit('animate',{
            socketId: socket.id,
            x:data.x,
            y:data.y});
    });

    socket.on('newMessage',(data)=>{
        const messageData = Object.assign({socketId:socket.id},data);
        socket.broadcast.emit('newMessage',messageData);
    })

});

module.exports=socketApi;