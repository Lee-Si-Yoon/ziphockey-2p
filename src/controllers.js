export const getHome = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const chatRoom = (req, res) => {
  return res.render("pages/chat", { pageTitle: "Chat" });
};

export const incomeChatRoom = (req, res) => {
  return res.render("pages/getchat", { pageTitle: "receive" });
};

export const sendText = (req, res) => {
  return res.render("pages/sendText", { pageTitle: "text" });
};

export const getRightText = (req, res) => {
  return res.render("pages/getTextRight", { pageTitle: "우측" });
};

export const getLeftText = (req, res) => {
  return res.render("pages/getTextLeft", { pageTitle: "좌측" });
};

// 여기도 뭔가 class화 시킬수 있지 않을까?
