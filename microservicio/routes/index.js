// server.js

import { Router } from "express";
import {insertaUsuario,recuperarUsuarios,login,logout} from '../controllers/crudUsuarios.js'
import { valida_token ,remover_token} from "../funciones/token.js";
const router = Router();

router.get('/usuarios',valida_token, async (req, res) => recuperarUsuarios(req,res));

router.post('/usuarios',  async (req, res) => insertaUsuario(req, res));

router.post('/login',  async (req, res) => login(req, res));

router.post('/logout', remover_token,async (req, res) => logout(req, res))

export default router
