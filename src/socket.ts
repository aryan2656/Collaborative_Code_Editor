const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8081';
const RECONNECT_DELAY = 1500;

let socket: WebSocket | null = null;
const messageListeners = new Set<(event: MessageEvent) => void>();

function connect() {
    socket = new WebSocket(WS_URL);

    socket.addEventListener('open', () => {
        console.log('connected');
    });

    socket.addEventListener('close', () => {
        console.log(`disconnected, retrying in ${RECONNECT_DELAY}ms`);
        setTimeout(connect, RECONNECT_DELAY);
    });

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    socket.addEventListener('message', (event) => {
        for (const listener of messageListeners) listener(event);
    });
}

connect();

export function onMessage(listener: (event: MessageEvent) => void) {
    messageListeners.add(listener);
    return () => {
        messageListeners.delete(listener);
    };
}

export function send(data: string) {
    if (socket?.readyState === WebSocket.OPEN) socket.send(data);
}
