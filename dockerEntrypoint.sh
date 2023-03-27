#!/bin/sh
cd prisma 
echo '---- Starting Migration ----'
npx prisma migrate deploy
echo '---- Migration Complete ----'
cd .. 

echo '---- Starting Server ----'
node -r dotenv/config build