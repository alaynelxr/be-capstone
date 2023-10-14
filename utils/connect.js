// utils/connect.js
const { PrismaClient } = require("@prisma/client");

// Create an instance of the Prisma client
const prisma = new PrismaClient();

module.exports = { prisma };
