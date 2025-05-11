import connection from "../config/connectDB";
// import jwt from 'jsonwebtoken'
// import md5 from "md5";
// import e from "express";
require('dotenv').config();


const winGoPage = async (req, res) => {
    return res.render("bet/wingo/win.ejs");
}

const winGoPage3 = async (req, res) => {
    return res.render("bet/wingo/win3.ejs");
}

const winGoPage5 = async (req, res) => {
    return res.render("bet/wingo/win5.ejs");
}

const winGoPage10 = async (req, res) => {
    return res.render("bet/wingo/win10.ejs");
}


const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}

function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
}

function timerJoin(params = '', addHours = 0) {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
}

const rosesPlus = async (auth, money) => {
    const [level] = await connection.query('SELECT * FROM level ');

    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE token = ? AND veri = 1 LIMIT 1 ', [auth]);
    let userInfo = user[0];
    const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [userInfo.invite]);

    if (userInfo.total_money >= 100) {
        if (f1.length > 0) {
            let infoF1 = f1[0];
            for (let levelIndex = 1; levelIndex <= 6; levelIndex++) {
                let rosesF = 0;
                if (infoF1.user_level >= levelIndex && infoF1.total_money >= 100) {
                    rosesF = (money / 100) * level[levelIndex - 1].f1;
                    if (rosesF > 0) {
                        await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF, rosesF, rosesF, infoF1.phone]);
                        let timeNow = Date.now();
                        const sql2 = `INSERT INTO roses SET 
                            phone = ?,
                            code = ?,
                            invite = ?,
                            f1 = ?,
                            time = ?`;
                        await connection.execute(sql2, [infoF1.phone, infoF1.code, infoF1.invite, rosesF, timeNow]);

                        const sql3 = `
                            INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                            total_turn_over = total_turn_over + VALUES(total_turn_over)
                            `;

                        await connection.execute(sql3, [infoF1.phone, infoF1.code, infoF1.invite, money, money]);
                    }
                }
                const [fNext] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [infoF1.invite]);
                if (fNext.length > 0) {
                    infoF1 = fNext[0];
                } else {
                    break;
                }
            }
        }
    }
}

//yaha se

// const rosesPlus = async (auth, money) => {
//     const [level] = await connection.query('SELECT * FROM level ');
//     let level0 = level[0];

//     const [user] = await connection.query('SELECT `phone`, `code`, `invite` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);
//     let userInfo = user[0];
//     const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [userInfo.invite]);
//     if (money >= 10000) {
//         if (f1.length > 0) {
//             let infoF1 = f1[0];
//             let rosesF1 = (money / 100) * level0.f1;
//             await connection.query('UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone]);
//             const [f2] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF1.invite]);
//             if (f2.length > 0) {
//                 let infoF2 = f2[0];
//                 let rosesF2 = (money / 100) * level0.f2;
//                 await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF2, rosesF2, rosesF2, infoF2.phone]);
//                 const [f3] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF2.invite]);
//                 if (f3.length > 0) {
//                     let infoF3 = f3[0];
//                     let rosesF3 = (money / 100) * level0.f3;
//                     await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF3, rosesF3, rosesF3, infoF3.phone]);
//                     const [f4] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF3.invite]);
//                     if (f4.length > 0) {
//                         let infoF4 = f4[0];
//                         let rosesF4 = (money / 100) * level0.f4;
//                         await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF4, rosesF4, rosesF4, infoF4.phone]);
//                     }
//                 }
//             }

//         }
//     }
// }


// const rosesPlus = async (auth, money) => {
//     const [level] = await connection.query('SELECT * FROM level ');

//     const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `user_level` FROM users WHERE token = ? AND veri = 1 LIMIT 1 ', [auth]);
//     let userInfo = user[0];
//     const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [userInfo.invite]);

//     if (money < 300) {
//         return; // No need to proceed if money is less than 300
//     }

//     if (f1.length === 0) {
//         return; // No referrer found
//     }

//     let infoF1 = f1[0];

//     const f2 = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [infoF1.invite]);
//     if (f2.length > 0) {
//         let infoF2 = f2[0];
//         if (infoF2.user_level >= 2) {
//             let rosesF2 = (money / 100) * level[1].f1;
//             await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF2, rosesF2, rosesF2, infoF2.phone]);
//         }

//         const f3 = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [infoF2.invite]);
//         if (f3.length > 0) {
//             let infoF3 = f3[0];
//             if (infoF3.user_level >= 3) {
//                 let rosesF3 = (money / 100) * level[2].f1;
//                 await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF3, rosesF3, rosesF3, infoF3.phone]);
//             }

//             const f4 = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [infoF3.invite]);
//             if (f4.length > 0) {
//                 let infoF4 = f4[0];
//                 if (infoF4.user_level >= 4) {
//                     let rosesF4 = (money / 100) * level[3].f1;
//                     await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF4, rosesF4, rosesF4, infoF4.phone]);
//                 }
//             }
//         }
//     }
// }


// const rosesPlus = async (auth, money) => {
//     const [level] = await connection.query('SELECT * FROM level ');
//     const [user] = await connection.query('SELECT `phone`, `code`, `invite` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);
//     let userInfo = user[0];
//     const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [userInfo.invite]);
//     let infoF1 = f1[0];

//     const [check_invite] = await connection.query('SELECT * FROM users WHERE invite = ?', [userInfo.invite]);
//     if (money >= 300) {
//         let levels = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44];
//         let levelIndex = levels.findIndex(levelThreshold => check_invite.length < levelThreshold);

//         if (levelIndex !== -1) {
//             let rosesF1 = (money / 100) * level[levelIndex].f1;
//             await connection.query('UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone]);
//         }
//     }
// }

//yaha tak

const betWinGo = async (req, res) => {
    let { typeid, join, x, money } = req.body;
    let auth = req.cookies.auth;

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }


    let gameJoin = '';
    if (typeid == 1) gameJoin = 'wingo';
    if (typeid == 3) gameJoin = 'wingo3';
    if (typeid == 5) gameJoin = 'wingo5';
    if (typeid == 10) gameJoin = 'wingo10';
    const [winGoNow] = await connection.query(`SELECT period FROM wingo WHERE status = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1 `);
    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);
    if (!winGoNow[0] || !user[0] || !isNumber(x) || !isNumber(money)) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }

    let userInfo = user[0];
    let period = winGoNow[0].period;
    let fee = (x * money) * 0.02;
    let total = (x * money) - fee;
    let timeNow = Date.now();
    let check = userInfo.money - total;

    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product = years + months + days + Math.floor(Math.random() * 1000000000000000);

    let formatTime = timerJoin();

    let color = '';
    if (join == 'l') {
        color = 'big';
    } else if (join == 'n') {
        color = 'small';
    } else if (join == 't') {
        color = 'violet';
    } else if (join == 'd') {
        color = 'red';
    } else if (join == 'x') {
        color = 'green';
    } else if (join == '0') {
        color = 'red-violet';
    } else if (join == '5') {
        color = 'green-violet';
    } else if (join % 2 == 0) {
        color = 'red';
    } else if (join % 2 != 0) {
        color = 'green';
    }

    let checkJoin = '';

    if (!isNumber(join) && join == 'l' || join == 'n') {
        checkJoin = `
        <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
            <img src="/images/${(join == 'n') ? 'small' : 'big'}.png" class="van-image__img">
        </div>
        `
    } else {
        checkJoin =
            `
        <span data-v-a9660e98="">${(isNumber(join)) ? join : ''}</span>
        `
    }


    let result = `
    <div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${(color)}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
    `;

    function timerJoin(params = '', addHours = 0) {
        let date = '';
        if (params) {
            date = new Date(Number(params));
        } else {
            date = new Date();
        }

        date.setHours(date.getHours() + addHours);

        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());

        let hours = date.getHours() % 12;
        hours = hours === 0 ? 12 : hours;
        let ampm = date.getHours() < 12 ? "AM" : "PM";

        let minutes = formateT(date.getMinutes());
        let seconds = formateT(date.getSeconds());

        return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }
    let checkTime = timerJoin(date.getTime());

    if (check >= 0) {
        const sql = "INSERT INTO minutes_1 (id_product, phone, code, invite, stage, level, money, amount, fee, `get`, game, bet, status, today, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await connection.execute(sql, [id_product, userInfo.phone, userInfo.code, userInfo.invite, period, userInfo.level, total, x, fee, 0, gameJoin, join, 0, checkTime, timeNow]);
        await connection.execute('UPDATE `users` SET `money` = `money` - ? WHERE `token` = ? ', [money * x, auth]);
        const [users] = await connection.query('SELECT `money`, `level` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);
        await rosesPlus(auth, money * x);
        // const [level] = await connection.query('SELECT * FROM level ');
        // let level0 = level[0];
        // const sql2 = `INSERT INTO roses SET 
        // phone = ?,
        // code = ?,
        // invite = ?,
        // f1 = ?,
        // f2 = ?,
        // f3 = ?,
        // f4 = ?,
        // time = ?`;
        // let total_m = money * x;
        // let f1 = (total_m / 100) * level0.f1;
        // let f2 = (total_m / 100) * level0.f2;
        // let f3 = (total_m / 100) * level0.f3;
        // let f4 = (total_m / 100) * level0.f4;
        // await connection.execute(sql2, [userInfo.phone, userInfo.code, userInfo.invite, f1, f2, f3, f4, timeNow]);
        // console.log(level);
        return res.status(200).json({
            message: 'Successful bet',
            status: true,
            data: result,
            change: users[0].level,
            money: users[0].money,
        });
    } else {
        return res.status(200).json({
            message: 'The amount is not enough',
            status: false
        });
    }
}

const listOrderOld = async (req, res) => {
    let { typeid, pageno, pageto } = req.body;

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }
    if (pageno < 0 || pageto < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ', [auth]);

    let game = '';
    if (typeid == 1) game = 'wingo';
    if (typeid == 3) game = 'wingo3';
    if (typeid == 5) game = 'wingo5';
    if (typeid == 10) game = 'wingo10';

    const [wingo] = await connection.query(`SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto} `);
    const [wingoAll] = await connection.query(`SELECT * FROM wingo WHERE status != 0 AND game = '${game}' `);
    const [period] = await connection.query(`SELECT period FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `);
    if (!wingo[0]) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    if (!pageno || !pageto || !user[0] || !wingo[0] || !period[0]) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }
    let page = Math.ceil(wingoAll.length / 10);
    return res.status(200).json({
        code: 0,
        msg: "Receive success",
        data: {
            gameslist: wingo,
        },
        period: period[0].period,
        page: page,
        status: true
    });
}

const GetMyEmerdList = async (req, res) => {
    let { typeid, pageno, pageto } = req.body;

    // if (!pageno || !pageto) {
    //     pageno = 0;
    //     pageto = 10;
    // }

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }

    if (pageno < 0 || pageto < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let auth = req.cookies.auth;

    let game = '';
    if (typeid == 1) game = 'wingo';
    if (typeid == 3) game = 'wingo3';
    if (typeid == 5) game = 'wingo5';
    if (typeid == 10) game = 'wingo10';

    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1 LIMIT 1 ', [auth]);
    const [minutes_1] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + ',' + Number(pageto)}`, [user[0].phone]);
    const [minutes_1All] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC `, [user[0].phone]);

    if (!minutes_1[0]) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    if (!pageno || !pageto || !user[0] || !minutes_1[0]) {
        return res.status(200).json({
            message: 'Error!',
            status: true
        });
    }
    let page = Math.ceil(minutes_1All.length / 10);

    let datas = minutes_1.map((data) => {
        let { id, phone, code, invite, level, game, ...others } = data;
        return others;
    });

    return res.status(200).json({
        code: 0,
        msg: "Receive success",
        data: {
            gameslist: datas,
        },
        page: page,
        status: true
    });
}

const addWinGo = async (game) => {
    // Get a connection and start a transaction
    const conn = await connection.getConnection();
    await conn.beginTransaction();
    
    try {
        let join = '';
        if (game == 1) join = 'wingo';
        if (game == 3) join = 'wingo3';
        if (game == 5) join = 'wingo5';
        if (game == 10) join = 'wingo10';

        // Get current period with parameterized query
        const [winGoNow] = await conn.query(
            'SELECT period FROM wingo WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1',
            [join]
        );

        if (!winGoNow || winGoNow.length === 0) {
            console.error(`No active period found for game ${join}`);
            await conn.rollback();
            conn.release();
            return;
        }

        // Get admin settings
        const [setting] = await conn.query('SELECT * FROM `admin`');
        if (!setting || setting.length === 0) {
            console.error('Admin settings not found');
            await conn.rollback();
            conn.release();
            return;
        }

        let period = winGoNow[0].period; // current period
        let amount = Math.floor(Math.random() * 10); // default random result

        // Get current players with parameterized query
        const [minPlayers] = await conn.query(
            'SELECT * FROM minutes_1 WHERE status = 0 AND game = ?',
            [join]
        );

        // Determine result based on player bets - 2+ players
        if (minPlayers.length >= 2) {
            const betColumns = [
                // red_small 
                { name: 'red_0', bets: ['0', 't', 'd', 'n'] },
                { name: 'red_2', bets: ['2', 'd', 'n'] },
                { name: 'red_4', bets: ['4', 'd', 'n'] },
                // green small 
                { name: 'green_1', bets: ['1', 'x', 'n'] },
                { name: 'green_3', bets: ['3', 'x', 'n'] },
                // green big 
                { name: 'green_5', bets: ['5', 'x', 't', 'l'] },
                { name: 'green_7', bets: ['7', 'x', 'l'] },
                { name: 'green_9', bets: ['9', 'x', 'l'] },
                // red big 
                { name: 'red_6', bets: ['6', 'd', 'l'] },
                { name: 'red_8', bets: ['8', 'd', 'l'] }
            ];

            // Calculate total money for each bet category using parameterized queries
            const totalMoneyPromises = betColumns.map(async column => {
                // Create a parameterized query with placeholders
                const placeholders = column.bets.map(() => '?').join(',');
                const [result] = await conn.query(
                    `SELECT SUM(money) AS total_money FROM minutes_1 WHERE game = ? AND status = 0 AND bet IN (${placeholders})`,
                    [join, ...column.bets]
                );
                return { 
                    name: column.name, 
                    total_money: result[0].total_money ? parseInt(result[0].total_money) : 0 
                };
            });

            const categories = await Promise.all(totalMoneyPromises);
            
            // Find category with smallest total bets
            let smallestCategory = categories.reduce((smallest, category) =>
                (smallest === null || category.total_money < smallest.total_money) ? category : smallest,
                null
            );
            
            const colorBets = {
                red_6: [6],
                red_8: [8],
                red_2: [2],
                red_4: [4],
                green_3: [3],
                green_7: [7],
                green_9: [9],
                green_1: [1],
                green_5: [5],
                red_0: [0],
            };

            // Determine result based on smallest bet category
            const betsForCategory = colorBets[smallestCategory.name] || [];
            const availableBets = betsForCategory.filter(bet =>
                !categories.find(category => 
                    category.name === smallestCategory.name && 
                    category.total_money < smallestCategory.total_money
                )
            );
            
            let lowestBet;
            if (availableBets.length > 0) {
                lowestBet = availableBets[0];
            } else if (betsForCategory.length > 0) {
                lowestBet = betsForCategory.reduce((lowest, bet) =>
                    (bet < lowest) ? bet : lowest,
                    betsForCategory[0]
                );
            }

            amount = lowestBet;
        } 
        // Determine result based on player bets - single player with significant bet
        else if (minPlayers.length === 1 && parseFloat(minPlayers[0].money) >= 20) {
            const betColumns = [
                { name: 'red_small', bets: ['0', '2', '4', 'd', 'n'] },
                { name: 'red_big', bets: ['6', '8', 'd', 'l'] },
                { name: 'green_big', bets: ['5', '7', '9', 'x', 'l'] },
                { name: 'green_small', bets: ['1', '3', 'x', 'n'] },
                { name: 'violet_small', bets: ['0', 't', 'n'] },
                { name: 'violet_big', bets: ['5', 't', 'l'] }
            ];

            // Calculate bets using parameterized queries
            const categoriesPromises = betColumns.map(async column => {
                const placeholders = column.bets.map(() => '?').join(',');
                const [result] = await conn.query(
                    `SELECT SUM(money) AS total_money FROM minutes_1 WHERE game = ? AND status = 0 AND bet IN (${placeholders})`,
                    [join, ...column.bets]
                );
                return { 
                    name: column.name, 
                    total_money: parseInt(result[0]?.total_money) || 0 
                };
            });

            const categories = await Promise.all(categoriesPromises);

            const colorBets = {
                red_big: [6, 8],
                red_small: [2, 4],
                green_big: [7, 9],
                green_small: [1, 3],
                violet_big: [5],
                violet_small: [0],
            };

            // Find smallest bet category
            const smallestCategory = categories.reduce((smallest, category) =>
                (!smallest || category.total_money < smallest.total_money) ? category : smallest,
                null
            );

            if (smallestCategory) {
                const betsForCategory = colorBets[smallestCategory.name] || [];
                const availableBets = betsForCategory.filter(bet =>
                    !categories.find(category => 
                        category.name === smallestCategory.name && 
                        category.total_money < smallestCategory.total_money
                    )
                );

                const lowestBet = availableBets.length > 0 ? 
                    availableBets[0] : 
                    (betsForCategory.length > 0 ? Math.min(...betsForCategory) : amount);
                    
                amount = lowestBet;
            }
        }

        // Get timestamp for new record
        let timeNow = Date.now();

        // Determine next pre-set result from admin settings if available
        let nextResult = '';
        if (game == 1) nextResult = setting[0].wingo1;
        if (game == 3) nextResult = setting[0].wingo3;
        if (game == 5) nextResult = setting[0].wingo5;
        if (game == 10) nextResult = setting[0].wingo10;

        let newArr = '';
        let resultToUpdate = amount; // Default to calculated amount

        // Check if we should use admin-set results
        if (nextResult == '-1') {
            // Random result (no preset results)
            newArr = '-1';
        } else {
            // Process preset results
            let arr = nextResult.split('|');
            let check = arr.length;
            
            if (check == 1) {
                newArr = '-1';
            } else {
                // Remove first result from list and keep the rest
                for (let i = 1; i < arr.length; i++) {
                    newArr += arr[i] + '|';
                }
                newArr = newArr.slice(0, -1); // Remove trailing |
            }
            
            // Use the first preset result
            resultToUpdate = arr[0];
        }

        // Update current period with result
        await conn.execute(
            'UPDATE wingo SET amount = ?, status = ? WHERE period = ? AND game = ?',
            [resultToUpdate, 1, period, join]
        );

        // Insert new period record
        await conn.execute(
            'INSERT INTO wingo SET period = ?, amount = ?, game = ?, status = ?, time = ?',
            [Number(period) + 1, 0, join, 0, timeNow]
        );

        // Determine admin setting field to update
        let adminField = '';
        if (game == 1) adminField = 'wingo1';
        if (game == 3) adminField = 'wingo3';
        if (game == 5) adminField = 'wingo5';
        if (game == 10) adminField = 'wingo10';

        // Update admin settings with new array of preset results
        await conn.execute(
            `UPDATE admin SET ${adminField} = ?`,
            [newArr]
        );

        // Commit all changes
        await conn.commit();
        console.log(`Successfully added new period for game ${join}, result: ${resultToUpdate}`);
    } catch (error) {
        // Rollback on error
        await conn.rollback();
        console.error('Error in addWinGo:', error);
    } finally {
        // Always release the connection
        conn.release();
    }
}



const handlingWinGo1P = async (typeid) => {
    // Get a connection and start a transaction
    const conn = await connection.getConnection();
    await conn.beginTransaction();
    
    try {
        // Determine which game we're handling
        let game = '';
        if (typeid == 1) game = 'wingo';
        if (typeid == 3) game = 'wingo3';
        if (typeid == 5) game = 'wingo5';
        if (typeid == 10) game = 'wingo10';

        // Get the latest result with parameterized query
        const [winGoNow] = await conn.query(
            'SELECT * FROM wingo WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT 1',
            [game]
        );

        // Check if we have valid results
        if (!winGoNow || winGoNow.length === 0) {
            console.error(`No result found for game ${game}`);
            await conn.rollback();
            conn.release();
            return;
        }

        // Update result with parameterized query
        await conn.execute(
            'UPDATE minutes_1 SET result = ? WHERE status = 0 AND game = ?',
            [winGoNow[0].amount, game]
        );
        
        let result = Number(winGoNow[0].amount);
        
        // Update statuses based on result using parameterized queries
        switch (result) {
            case 0:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?, ?)',
                    [game, 'l', 'n', 'd', '0', 't']
                );
                break;
            case 1:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'x', '1']
                );
                break;
            case 2:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'd', '2']
                );
                break;
            case 3:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'x', '3']
                );
                break;
            case 4:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'd', '4']
                );
                break;
            case 5:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?, ?)',
                    [game, 'l', 'n', 'x', '5', 't']
                );
                break;
            case 6:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'd', '6']
                );
                break;
            case 7:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'x', '7']
                );
                break;
            case 8:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'd', '8']
                );
                break;
            case 9:
                await conn.execute(
                    'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet NOT IN (?, ?, ?, ?)',
                    [game, 'l', 'n', 'x', '9']
                );
                break;
            default:
                break;
        }

        // Handle high/low bets
        if (result < 5) {
            await conn.execute(
                'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet = ?',
                [game, 'l']
            );
        } else {
            await conn.execute(
                'UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = ? AND bet = ?',
                [game, 'n']
            );
        }

        // Get unprocessed bet orders
        const [order] = await conn.execute(
            'SELECT * FROM minutes_1 WHERE status = 0 AND game = ?',
            [game]
        );

        // Process each winning order
        for (let i = 0; i < order.length; i++) {
            let orders = order[i];
            let result = orders.result;
            let bet = orders.bet;
            let total = orders.money;
            let id = orders.id;
            let phone = orders.phone;
            var nhan_duoc = 0;
            
            // Payout calculation logic (keeping the existing logic)
            if (bet == 'l' || bet == 'n') {
                nhan_duoc = total * 2;
            } else {
                if (result == 0 || result == 5) {
                    if (bet == 'd' || bet == 'x') {
                        nhan_duoc = total * 1.5;
                    } else if (bet == 't') {
                        nhan_duoc = total * 4.5;
                    } else if (bet == "0" || bet == "5") {
                        nhan_duoc = total * 4.5;
                    }
                } else {
                    if (result == 1 && bet == "1") {
                        nhan_duoc = total * 9;
                    } else if (result == 1 && bet == 'x') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 2 && bet == "2") {
                        nhan_duoc = total * 9;
                    } else if (result == 2 && bet == 'd') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 3 && bet == "3") {
                        nhan_duoc = total * 9;
                    } else if (result == 3 && bet == 'x') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 4 && bet == "4") {
                        nhan_duoc = total * 9;
                    } else if (result == 4 && bet == 'd') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 6 && bet == "6") {
                        nhan_duoc = total * 9;
                    } else if (result == 6 && bet == 'd') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 7 && bet == "7") {
                        nhan_duoc = total * 9;
                    } else if (result == 7 && bet == 'x') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 8 && bet == "8") {
                        nhan_duoc = total * 9;
                    } else if (result == 8 && bet == 'd') {
                        nhan_duoc = total * 2;
                    }
                    
                    if (result == 9 && bet == "9") {
                        nhan_duoc = total * 9;
                    } else if (result == 9 && bet == 'x') {
                        nhan_duoc = total * 2;
                    }
                }
            }
            
            // Get user's current money
            const [users] = await conn.execute(
                'SELECT `money` FROM `users` WHERE `phone` = ?', 
                [phone]
            );
            
            if (!users || users.length === 0) {
                console.error(`User with phone ${phone} not found`);
                continue; // Skip this order and continue with the next
            }
            
            let totals = parseFloat(users[0].money) + parseFloat(nhan_duoc);
            
            // Update order and user balance
            await conn.execute(
                'UPDATE `minutes_1` SET `get` = ?, `status` = 1 WHERE `id` = ?',
                [parseFloat(nhan_duoc), id]
            );
            
            await conn.execute(
                'UPDATE `users` SET `money` = ? WHERE `phone` = ?',
                [totals, phone]
            );
        }
        
        // Commit all changes if successful
        await conn.commit();
        console.log(`Successfully processed results for game ${game}`);
    } catch (error) {
        // Rollback on error
        await conn.rollback();
        console.error('Error in handlingWinGo1P:', error);
    } finally {
        // Always release the connection
        conn.release();
    }
}

module.exports = {
    winGoPage,
    betWinGo,
    listOrderOld,
    GetMyEmerdList,
    handlingWinGo1P,
    addWinGo,
    winGoPage3,
    winGoPage5,
    winGoPage10
}