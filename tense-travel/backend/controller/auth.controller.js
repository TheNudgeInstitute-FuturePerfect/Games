const isEmpty = require("lodash.isempty");
const {
  generatePassword,
  validatePassword,
} = require("../utils/PasswordGenerate");
const { userModel } = require("../models/index");
const { reponseModel, handleSuccess } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existsUser = await userModel.findOne({
      email,
    });

    if (!isEmpty(existsUser)) {
      res
        .status(400)
        .json({ message: "User already registered", data: {}, success: false });
    } else {
      // hash the password
      const hashedPassword = await generatePassword(password);

      const user = new userModel({ ...req.body, password: hashedPassword });
      await user.save({ name, email, password });
      res
        .status(200)
        .json({ data: {}, message: "User registered", success: true });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      res
        .status(200)
        .json({ message: "Invalid credentials", data: {}, success: false });
      return;
    }
    const hashedPassword = await validatePassword(password, user["password"]);
    if (!hashedPassword) {
      res
        .status(200)
        .json({ message: "Invalid credentials", data: {}, success: false });
      return;
    }

    res.status(201).json({
      data: { id: user._id },
      message: "Loggedin success",
      success: true,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.checkUserByMobile = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    let checkUser = await userModel.findOne(
      {
        mobile: mobileNumber,
      },
      { uuid: 1, mobile: 1, email: 1, firstName: 1, lastName: 1 }
    );

    if (!isEmpty(checkUser)) {
      handleSuccess(
        reponseModel(
          httpStatusCodes.OK,
          "User already registered",
          true,
          checkUser
        ),
        req,
        res
      );
    } else {
      const response = await this.registerUserByMobile(req, res, next);

      handleSuccess(
        reponseModel(
          httpStatusCodes.OK,
          !isEmpty(response)
            ? "User registered success"
            : "User registered not success",
          !isEmpty(response) ? true : false,
          response
        ),
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.registerUserByMobile = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const user = new userModel({ ...req.body, mobile: mobileNumber });
    await user.save({ mobile: mobileNumber });
    return user;
  } catch (err) {
    next(err);
  }
};
