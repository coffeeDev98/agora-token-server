const express = require("express");
const { RtmTokenBuilder, RtmRole } = require("agora-access-token");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();

const nocache = (req, res, next) => {
  res.header("Cache-Content", "private, no-cache, no-store, must-revalidate ");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = (req, res) => {
  // set response header
  res.header("Access-Control-Allow-Origin", "*");
  // get channel name
  const channel = req.query.channel;
  if (!channel) {
    return res.status(500).json({ error: "channel is required" });
  }
  // get uid
  let uid = req.query.uid;
  if (!uid || uid === "") {
    uid = 0;
  }
  // get role
  let role = RtmRole.Rtm_User;

  console.log({ channel, uid });

  // get the expiration time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime === "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate priviledge expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const priviledgeExpireTime = currentTime + expireTime;
  // build the token
  console.log({ uid });
  const token = RtmTokenBuilder.buildToken(
    APP_ID,
    APP_CERTIFICATE,
    uid,
    role,
    priviledgeExpireTime
  );
  // return the token
  return res.json({ token: token });
};

app.get("/access_token", nocache, generateAccessToken);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`APP_ID: ${APP_ID}`);
  console.log(`APP_CERTIFICATE: ${APP_CERTIFICATE}`);
});
