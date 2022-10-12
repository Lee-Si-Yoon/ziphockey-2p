import "regenerator-runtime";
// import { initializeApp } from "firebase/app";

import httpServer from "./server";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCdWSIKXU2ngt_xlJQaSRiNGPDF5mAyYAA",
//   authDomain: "between-55976.firebaseapp.com",
//   projectId: "between-55976",
//   storageBucket: "between-55976.appspot.com",
//   messagingSenderId: "1081585951052",
//   appId: "1:1081585951052:web:b60c717265ae32c52cafe9",
// };

// const app = initializeApp(firebaseConfig);

const PORT = process.env.PORT || 4000;

const handleListen = () =>
  console.log(`✅ 여기서 굴러가는 중 http://localhost:${PORT}`);

httpServer.listen(PORT, handleListen);
