import express from 'express'
import { getUsers, loginUser, registerUser } from '../controllers/userController.js'
import { authentication } from '../middleware/Authmiddlerware.js'


const router = express.Router()

router.post('/',registerUser)
router.get('/',authentication,getUsers)
router.post('/login',loginUser)
router.get('')


export default router