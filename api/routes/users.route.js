import express from "express";
import UserCtrl from "../controllers/users.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(UserCtrl.apiGetUsers).post(UserCtrl.apiPostUser);

router.route("/login").post(UserCtrl.apiLoginUser);

router
  .route("/me")
  .get(auth, UserCtrl.apiGetSelfUser)
  .put(auth, UserCtrl.apiUpdateUser);

router.route("/:userId").get(UserCtrl.apiGetUser);

router.route("/me/logout").post(auth, UserCtrl.apiLogOutUser);

router.route("/me/logoutall").post(auth, UserCtrl.apiLogOutAll);

export default router;
