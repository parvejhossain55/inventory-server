const User = require("../models/UserModel");
const { SendEmail } = require("../utils/SendEmail");
const { createToken, verifyPassword, hashPassword } = require("../utils/auth");
const crypto = require("crypto");

async function register(user) {
  try {
    const { email, password } = user;

    // check if username or email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { status: 409, message: "Email already exists" };
    }

    // hashed password
    const hashedPass = await hashPassword(password);

    user.password = hashedPass;

    // create new user
    const newUser = new User(user);

    // generate email verification token
    const token = newUser.generateVerificationToken();

    // send verification email
    const subject = "Email Verification";
    const html = `
        <p>Thank you for registering! Please verify your email by clicking the link below:</p>
        <a href="${process.env.CLIENT_URL}/verify-email?token=${token}">Verify Email</a>
      `;

    const result = await SendEmail(email, subject, html);

    if (result.accepted[0] === email) {
      newUser.save();
      return {
        status: 201,
        message:
          "User registered successfully. Please check your email to verify your account.",
        user: newUser,
      };
    }
    return {
      status: 500,
      message: "User registered failed.",
    };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Server error" };
  }
}

async function verifyEmail(token) {
  try {
    // find user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return { status: 400, message: "Invalid token or token has expired" };
    }

    // verify email
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return { status: 200, message: "Email verified successfully" };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Server error" };
  }
}

async function login({ email, password }) {
  try {
    // Check if user with given email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return { status: 400, message: "Email does not exists in our database" };
    }

    if (!user.emailVerified) {
      return { status: 400, message: "Please verify your email address" };
    }

    // Compare passwords
    const passwordsMatch = await verifyPassword(password, user.password);

    if (!passwordsMatch) {
      return { status: 400, message: "Password does not match" };
    }

    const userData = {
      name: user.firstName + " " + user.lastName,
      role: user.role,
      email: user.email,
    };

    // Generate a JWT and return it
    const token = createToken({ _id: user._id});

    return { status: 200, message: "Login Successful", token, userData };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal server error" };
  }
}

async function forgotPassword(email) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { status: 400, message: "User with this email does not exist" };
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.emailVerified = false;
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    const subject = "Password Reset Request";
    const html = `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>You have requested a password reset for your account.</p>
        <p>Please follow the link below to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/verify-reset-token/${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not make this request, please ignore this email.</p>
      `;

    SendEmail(email, subject, html);

    return { status: 200, message: "Password reset email has been sent" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal server error" };
  }
}

async function verifyResetToken(token) {
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return { status: 400, message: "Invalid or expired token" };
    }

    // verify email
    user.emailVerified = true;
    await user.save();

    return { status: 200, message: "Email verified successfully", token };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Server error" };
  }
}

async function changePassword(token, password) {
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return { status: 400, message: "Invalid or expired token" };
    }

    if (!user.emailVerified) {
      return { status: 400, message: "Please verify your email address" };
    }

    // Update user's password and reset token fields in the database
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    // Send a password changed email
    let subject = "Password Changed Successfully";
    let html = `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Your account password has been successfully changed.</p>
        <p>If you did not make this request, please contact our support team.</p>
      `;

    SendEmail(user.email, subject, html);

    return {
      status: 200,
      message: "Password has been changed successfully changed",
    };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Server error" };
  }
}

async function UpdateProfile(userId, updatedUser) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { status: 400, message: "User Not Found" };
    }

    if (updatedUser.password) {
      const hashedPassword = await hashPassword(updatedUser.password);
      updatedUser.password = hashedPassword;
    }

    const newUser = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    return {
      status: 200,
      message: "Profile successfully updated",
      user: newUser,
    };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Server Error" };
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  verifyResetToken,
  changePassword,
  UpdateProfile,
};
