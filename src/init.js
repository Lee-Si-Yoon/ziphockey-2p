import "regenerator-runtime";
import httpServer from "./server";

const PORT = process.env.PORT || 4000;

const handleListen = () =>
  console.log(`✅ 여기서 굴러가는 중 http://localhost:${PORT}`);

httpServer.listen(PORT, handleListen);
