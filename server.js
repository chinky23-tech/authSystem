const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config();

const user = require('./models/user');
const app = express();

//middleware

