import uuid from "../libs/uuid.lib";

/**
 * User id
 */
const USER_ID_KEY = "NEST_EXAMPLES_USER_ID";
export const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId || !userId.length) {
    const newUserId = uuid();
    userId = newUserId;
    localStorage.setItem(USER_ID_KEY, newUserId);
  }
  return userId;
};
export const resetUserId = () => {
  const newUserId = uuid();
  localStorage.setItem(USER_ID_KEY, newUserId);
  return newUserId;
};

/**
 * User name
 */
const USER_NAME_KEY = "NEST_EXAMPLES_USER_NAME";
const DEFAULT_USER_NAME = "John Doe";
export const getUserName = () => {
  let userName = localStorage.getItem(USER_NAME_KEY);
  if (!userName || !userName.length) {
    userName = DEFAULT_USER_NAME;
    localStorage.setItem(USER_NAME_KEY, userName);
  }
  return userName;
};
export const setUserName = (userName: string) => {
  localStorage.setItem(USER_NAME_KEY, userName);
  return userName;
};
