import express from 'express'
import { authentication } from '../middleware/Authmiddlerware.js'
import { AllMessages, sendMessage } from '../controllers/messageController.js'

const messagerouter = express.Router()

messagerouter.post("/",authentication,sendMessage) 
messagerouter.get('/:chatId',authentication,AllMessages)


export {messagerouter}