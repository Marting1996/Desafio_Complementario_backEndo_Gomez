import { Router } from "express";
import { login, loginRender, registerRender, register, logOut, failGit, profile, profileJson, loginGit, renderChangeRole, changeRole } from "../controllers/users.controller.js";
import { isAuthenticated } from "../middlewares/authenticate.middleware.js";

const currentRouter = Router();

currentRouter.get("/login", loginRender);
currentRouter.post("/login", login);
currentRouter.get("/register", registerRender);
currentRouter.post("/register", register);
currentRouter.post("/logout", logOut);
currentRouter.get("/profile", isAuthenticated, profile);
currentRouter.get("/fail-login", failGit );
currentRouter.get("/login-github", loginGit)
currentRouter.get("/premium", renderChangeRole)
currentRouter.post("/premium", changeRole )


export default currentRouter;
