import {Pusher} from '@pusher/pusher-websocket-react-native';

export const handleConnectPusher = async () => {
  const pusher = Pusher.getInstance();

  await pusher.init({
    apiKey: '073e276cec735b80630d',
    cluster: 'ap1',
  });

  pusher.connect();

  return pusher
};
