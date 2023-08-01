import React from 'react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';

import { SOCKET_URL } from '../common/constants';

const socket = io(SOCKET_URL);
const SocketContext = React.createContext<Socket>(socket);

export { socket, SocketContext };
