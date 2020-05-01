const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = {};

io.on('connection',(socket)=>{
    console.log('Bir kullanıcı bağlandı.');

    socket.on('newUser',(data)=>{
        const defaultData ={
            id: socket.id,
            position:{
                x:0,
                y:0
            }
        }

        const userData = Object.assign(data,defaultData);
        users[socket.id] = userData;

        socket.broadcast.emit('newUser',userData);
    });


    socket.on('disconnect',()=>{
        socket.broadcast.emit('discUser',users[socket.id]);
        delete users[socket.id];
    });

});

module.exports=socketApi;