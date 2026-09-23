import {
  findPublicUser,
  loginUser,
  registerUser,
} from "../services/authService.js";

export async function register(req, res, next) {
  try {
    res.status(201).json(await registerUser(req.body));
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  try {
    res.json(await loginUser(req.body));
  } catch (error) {
    next(error);
  }
}
export async function currentUser(req, res, next) {
  try {
    res.json(await findPublicUser(req.userId));
  } catch (error) {
    next(error);
  }
}
