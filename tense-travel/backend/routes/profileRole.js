const express = require("express");
const {
  createProfileRole,
  findAllRoles,
  findOneById,
  updateRole,
  deleteRole,
} = require("../controller/index");
const {
  profileRoleValidator,
  updateRoleValidator,
  deleteRoleValidator,
} = require("../modules/validators/profileRoleValidator");

const router = express.Router();

router.post("/create-profile-role", [profileRoleValidator], createProfileRole);
router.get("/profile-roles", findAllRoles);
router.get("/find-role/:id", findOneById);
router.put("/update-role/:id", [updateRoleValidator], updateRole);
router.put("/delete-role/:id", [deleteRoleValidator], deleteRole);

exports.router = router;
