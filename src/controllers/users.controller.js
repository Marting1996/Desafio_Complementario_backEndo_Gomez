import { generateToken } from "../utils.js";
import passport from "passport"
import CustomError from "../services/errors/custom_error.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import { logger } from "../utils/logger.js";
import { UserService } from "../services/index.js";

export const loginRender = async (req, res) => {
    res.render("login", {})
}
export const registerRender = async (req, res) => {
    res.render("register", {})
}

export const login = async (req, res, next) => {
    passport.authenticate("login", async (err, user) => {
        try {
            if (err || !user) {
                return res.status(400).send("Usuario no encontrado");
            } else {
                const token = generateToken(user);

                res.cookie("secretForJWT", token, {
                    maxAge: 60 * 60 * 24 * 1000, // 24 horas
                    httpOnly: true
                });

                res.redirect("/api/current/profile");
            }
        } catch (error) {
            logger.debug(error)
            return next(error);
        }
    })(req, res, next);
};

export const register = async (req, res, next) => {
    try {
        const user = req.body;
        if (!user.first_name || !user.last_name || !user.email || !user.age) {
            return CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo(user),
                message: "Error trying to create user",
                code: EErrors.INVALID_TYPE_ERROR
            });
        }

        passport.authenticate("register", async (err, user) => {
            try {
                if (err || !user) {
                    return res.status(400).send("Error en el registro");
                } else {
                    res.redirect("/api/current/login");
                }
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    } catch (error) {
        logger.debug(error)
        return next(error);
    }
};


export const logOut = async (req, res) => {
    res.clearCookie("secretForJWT");
    res.redirect("/api/current/login");
}

export const loginGit = async (req, res, next) => {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
};

export const gitCallBack = async (req, res, next) => {
    passport.authenticate("github", { failureRedirect: "/fail-github" }, (err, user) => {
        try {
            if (err || !user) {
                return res.status(400).send("Error en la autenticación de GitHub");
            } else {
                const token = generateToken(user);
                res.cookie("secretForJWT", token, {
                    maxAge: 60 * 60 * 1000, // 1 hora
                    httpOnly: true
                }).redirect("/api/current/profile");
            }
        } catch (error) {
            return next(error)
        }
    })(req, res, next);
}

export const profile = async (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        try {
            if (err || !user) {
                return res.status(401).send("Acceso no autorizado");
            }
            res.render("profile", { user: res.locals.user });
        } catch (error) {
            logger.debug(error)
            return next(error);
        }
    })(req, res, next);
};


export const profileJson = async (req, res) => {
    logger.info(user);
    res.send(req.user)
};


export const failGit = async (req, res) => {
    res.render("fail-login", {})
}

export const renderChangeRole = async (req, res) => {
    res.render("changeRole", {})
}
export const changeRole = async (req, res) => {
    //const role = req.user.role
    try {
        const user = res.locals.user
        console.log("Usuario en changeRole:", user);
        const { newRole } = req.body
        const data = {
            role: newRole
        }

        await UserService.updateUser(user._id, data)
        res.clearCookie("secretForJWT");
        res.redirect("/api/current/login")
    } catch (error) {
        return res.render("changeRole", { error: "Error al procesar la solicitud" })
    }
}

