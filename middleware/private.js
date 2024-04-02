import jwt from "jsonwebtoken";

export const privateRoutes = (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, msg: "you must login first" });
  }
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decode.data;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
};
