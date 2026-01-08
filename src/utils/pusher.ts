import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_app_id!,
  key: process.env.NEXT_PUBLIC_PUSHER_key!,
  secret: process.env.PUSHER_secret!,
  cluster: process.env.PUSHER_cluster!,
  useTLS: true,
});

export default pusher;
