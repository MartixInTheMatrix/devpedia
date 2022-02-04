const express = require('express');
const Eapp = express();
require("dotenv").config();
const { Client, MessageEmbed} = require('discord.js')
import { WS } from "./structure/ws"

const app = new WS(Eapp, process.env.PORT?process.env.PORT:3000, process.env.DBLINK?process.env.DBLINK:' ')
app.init()
app.connect()
