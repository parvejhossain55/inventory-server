const AuthService = require("../services/AuthServices");

// register user
exports.register = async (req, res) => {
  try {
    const { status, message, user } = await AuthService.register(req.body);

    return res.status(status).json({
      message,
      user,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Registration failed, Server error", error: err });
  }
};

// verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { status, message } = await AuthService.verifyEmail(req.query.token);
    return res.status(status).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error asdf" });
  }
};

// user login
exports.login = async (req, res) => {
  try {
    const { status, message, token, userData } = await AuthService.login(
      req.body
    );
    res.status(status).json({ message, user: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// forgot user password
exports.forgotPassword = async (req, res) => {
  try {
    const { status, message } = await AuthService.forgotPassword(
      req.body.email
    );
    res.status(status).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// verify password reset token
exports.verifyResetToken = async (req, res) => {
  try {
    const { status, message, token } = await AuthService.verifyResetToken(
      req.params.token
    );

    res.status(status).json({ message, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// change user password
exports.changePassword = async (req, res) => {
  try {
    const { status, message } = await AuthService.changePassword(
      req.params.token,
      req.body.password
    );

    res.status(status).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// update user profile
exports.updateProfile = async (req, res) => {
  let userId = req.user._id;
  let updatedUser = req.body;

  try {
    const { status, message, user } = await AuthService.UpdateProfile(
      userId,
      updatedUser
    );

    res.status(status).json({ message, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get user profile
exports.getUserById = async (req, res) => {
  try {
    let userId = req.user._id;
    const { status, user } = await AuthService.getUserById(userId);

    res.status(status).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
