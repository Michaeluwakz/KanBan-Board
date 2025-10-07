import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (server: NetServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a board room
    socket.on('board:join', ({ boardId, userId }) => {
      socket.join(`board:${boardId}`);
      console.log(`User ${userId} joined board ${boardId}`);
      
      // Notify others in the room
      socket.to(`board:${boardId}`).emit('user:joined', {
        userId,
        socketId: socket.id,
      });
    });

    // Leave a board room
    socket.on('board:leave', ({ boardId, userId }) => {
      socket.leave(`board:${boardId}`);
      console.log(`User ${userId} left board ${boardId}`);
      
      // Notify others in the room
      socket.to(`board:${boardId}`).emit('user:left', {
        userId,
        socketId: socket.id,
      });
    });

    // Task events
    socket.on('task:created', (data) => {
      socket.to(`board:${data.boardId}`).emit('task:created', data);
    });

    socket.on('task:updated', (data) => {
      socket.to(`board:${data.boardId}`).emit('task:updated', data);
    });

    socket.on('task:moved', (data) => {
      socket.to(`board:${data.boardId}`).emit('task:moved', data);
    });

    socket.on('task:deleted', (data) => {
      socket.to(`board:${data.boardId}`).emit('task:deleted', data);
    });

    // Column events
    socket.on('column:created', (data) => {
      socket.to(`board:${data.boardId}`).emit('column:created', data);
    });

    socket.on('column:updated', (data) => {
      socket.to(`board:${data.boardId}`).emit('column:updated', data);
    });

    socket.on('column:deleted', (data) => {
      socket.to(`board:${data.boardId}`).emit('column:deleted', data);
    });

    // User presence/cursor tracking
    socket.on('user:presence', (data) => {
      socket.to(`board:${data.boardId}`).emit('user:presence', {
        ...data,
        socketId: socket.id,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};


