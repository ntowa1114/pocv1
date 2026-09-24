const http= require('http');

const fs = require('fs');
const path =require ('path');

const TEST_PAN = '4111111111111111'; //クレカ番号

function readBody(req){
    return new Promise((resolve)=>{
        let data='';
        // ① データが小分けで届くたびに文字列を結合する
        req.on('data', (chunk) => {data += chunk; });
         // ② すべてのデータを受信し終えたら完了（resolve）
        req.on('end',() => {resolve(data);});
    });
}

//指定したファイルをディスクから読んで、そのままブラウザに返す
function serve(res, file, ct){ //ct:Content-Type
    //__dirname→このserver.jsがあるフォルダ　path.joinでフルパス
    fs.readFile(path.join(__dirname, file),(err, buf) => {
        if(err){
            res.writeHead(404);
            res.end('file no found');
            return;
        }
        res.writeHead(200,{'Content-Type': ct});
        res.end(buf);
    })
}

//加盟店サーバー
http.createServer(async (req, res) => {
    console.log(`受信: ${req.method} ${req.url}`); //ログ

    if(req.method === 'GET' && req.url=='/'){
        
        return serve(res, 'merchant.html', 'text/html');
    }

    if(req.method == 'POST' && req.url =='/pay'){
        const body = await readBody(req); // ← 中身を待って受け取る
        const hasPAN = body.includes(TEST_PAN); //カード番号が含まれるか調べる
        console.log(`  └ 中身: ${body} PAN含まれるか=${hasPAN ? 'YES' : 'no'}`); //bodyにはカード番号
        
        res.writeHead(200,{'Content-Type': 'text/plain; charset=utf-8'});
        res.end('payを受け取りました');
        return;
    }
    res.writeHead(404); //Not Found
    res.end('not found')
}).listen(8080, 'localhost', () => {
  console.log('merchant : http://localhost:8080/');
});

//pspサーバー(8001)

http.createServer(async (req,res) =>{
    console.log(`受信(PSP): ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url === '/charge'){
        const body = await readBody(req)
        const hasPAN = body.includes(TEST_PAN);
        console.log(`  └ 中身: ${body}  PAN=${hasPAN ? 'YES' : 'no'}`);
        res.writeHead(200,{'Content-Type': 'text/plain; charset=utf-8'});
        res.end('chargeを受け取りました');
        return;
        
    }

    res.writeHead(404);
    res.end('not found');

    }).listen(8081,'127.0.0.1', () => {
        console.log('psp : http://127.0.0.1:8081/');
    
});