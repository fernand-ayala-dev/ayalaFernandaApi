import userRouter from "./userRouter.js";
import signsRouter from "./signsRouter.js";
import horoscopoRouter from "./horoscoposRouter.js";
import compatibilityRouter from "./compatibilityRouter.js";

const routerAPI = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/signs", signsRouter);
  app.use("/api/horoscopos", horoscopoRouter);
  app.use("/api/compatibility", compatibilityRouter);
};

export default routerAPI;
