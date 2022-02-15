import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const io = new Server();

export const bootStrapSocketIo = (appServer) => {
  //console.log(appServer,"===appServer")
  io.attach(appServer);
  io.use((socket, next) => {
      console.log('Handshake data:', socket.handshake.headers.authorization);
      const token  = socket.handshake.headers.authorization;
      if(token){
        const authToken = jwt.verify(token, process.env.JWT_KEY);
        console.log('User ID from the token', authToken.id);
        socket.join(authToken.id);
      }
       next();
  })
  
};

export const sendDmNotification = (roomId, message) => {
  //console.log(roomId)
    io.to(roomId).emit('notification', message);
};
export const sendDmReadNotification = (roomId, message) => {
  //console.log(roomId)
    io.to(roomId).emit('read', message);
};
