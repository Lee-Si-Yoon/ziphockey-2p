export const getHome = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const chatRoom = (req, res) => {
  return res.render("chat", { pageTitle: "Chat" });
};

export const incomeChatRoom = (req, res) => {
  return res.render("getchat", { pageTitle: "receive" });
};

export const sendText = (req, res) => {
  return res.render("pages/sendText", { pageTitle: "text" });
};
