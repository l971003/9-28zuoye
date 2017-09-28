var gulp = require('gulp');
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');
var urlTool = require('url');
var qs = require('qs');
var database = {
    goodslist: [
        {
            name: 'first',
            data: [
                {
                    name: 'pear',
                    price: 4
                },
                {
                    name: 'orange',
                    price: 6
                }
            ]
        },
        {
            name: 'second',
            data: [
                {
                    name: 'grape',
                    price: 2 / 5
                },
                {
                    name: 'apple',
                    price: 5
                }
            ]
        }
    ],
    names: [
        '张三',
        '王麻子',
        '老古董'
    ],
    users: [
        {
            userName: 'zhangsan',
            password: 123456
        },
        {
            userName: 'lisi',
            password: 12345
        }
    ]
}
function login(userName, password) {

    var exist = false;

    var success = false;

    var users = database['users'];

    for (var i = 0, length = users.length; i < length; i++) {

        if (userName == users[i].userName) {
            exist = true;
            if (users[i].password == password) {
                success = true;
            }
            break;
        }

    }

    return exist ? { success: success } : exist;
}
gulp.task('mockServer', function () {
    gulp.src('.')
        .pipe(webserver({
            port: 8008,
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                var method = req.method;
                var url = req.url;
                var urlObj = urlTool.parse(url);
                var pathname = urlObj.pathname;
                var getParamsStr = urlObj.query;

                if (method == 'GET') {
                    switch (pathname) {
                        case '/goodslist':
                            res.setHeader('content-type', 'application/json;charset=utf-8');
                            res.write(JSON.stringify(database['goodslist']));
                            res.end();
                            break;
                            case '/names':
                            res.setHeader('content-type', 'application/json;charset=utf-8');
                            res.write(JSON.stringify(database['names']));
                            res.end();
                            break;
                        default:
                        res.setHeader('content-type', 'application/json;charset=utf-8');
                            res.end('没有这个路径');
                            break;
                    }
                } else if (method == 'POST') {
                    var postParams = '';
                    req.on('data', function (chunk) {
                        postParams += chunk;
                    })
                    req.on('end', function () {
                        var postParamsObj = qs.parse(postParams);
                        // console.log(postParamsObj)
                        switch (pathname) {
                            case '/login':
                                res.setHeader('content-type', 'application/json;charset=utf-8')
                                var exist = login(postParamsObj.userName, postParamsObj.password);
                                if (exist) {
                                    if (exist.success) {
                                        var data = {
                                            message: '登陆成功'
                                        }
                                        res.write(JSON.stringify(data));
                                    } else {
                                        var error = {
                                            message: '密码错误'
                                        }
                                        res.write(JSON.stringify(error))
                                    }
                                } else {
                                    res.write('账号不存在');
                                }
                                res.end();
                                break;
                            case '/register':
                                break;
                            default:
                                res.end();
                                break;
                        }
                    })
                }
            }
        }))
    })
    gulp.task('default', ['mockServer'])