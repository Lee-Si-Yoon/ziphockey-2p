import "regenerator-runtime";

import httpServer from "./server";

const PORT = process.env.PORT || 4000;

const handleListen = () =>
  console.log(`✅ Listening on http://localhost:${PORT}`);

httpServer.listen(PORT, handleListen);
