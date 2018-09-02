import { NOTIFY_USER } from "./Type";

export const notifyUser = (message, messageType) => {
  return {
    type: NOTIFY_USER,
    message,
    messageType
  };
};
