import express from "express";
import url from 'url';
import request from "request"
import { crawler } from "./crawler.js";
import bodyParser from "body-parser";

var app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post("/auth", urlencodedParser, function (serverReq, serverRes) {
    const username = serverReq.body.username
    const password = serverReq.body.password

    if (!username || ! password) {
        serverRes.send("用户名或密码不能为空")
    }

    crawler.auth({
        callback(href) {
            const resultUrl = url.parse(href, true)
            const {redirect_uri} = resultUrl.query
            const key = url.parse(redirect_uri, true).query.r

            global.dict[key] = {
                username, 
                password,
            }

            serverRes.redirect(href)
        }
    })

})

app.use(express.static('static'));

var server = app
export { server }

