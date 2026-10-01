console.log('[background] 拡張が起動しました');

const TEST_PAN ='4111111111111111'
// HTTPリクエストを監視し、リクエスト発生時にコールバックを実行
chrome.webRequest.onBeforeRequest.addListener(
    (details) =>{
        if (details.method !== 'POST') return; // POST以外は無視する

        let body = '';
        if(details.requestBody){ //body(送信情報)の要求
            //フォーム形式
            if(details.requestBody.formData){ //通常のフォームデータ送信のとき
                
                body = JSON.stringify(details.requestBody.formData)
                
            }else if(details.requestBody.raw && details.requestBody.raw[0]){ //raw=APIで送るJSONデータなどの生データ
            //それ以外
                try{
                    body = new TextDecoder('utf-8').decode(details.requestBody.raw[0].bytes);
                }catch(e){
                    body='[decode失敗]';
                }
            }
            

        }

        const hasPAN =body.includes(TEST_PAN);
        //frame: frameidが0ならtop, それ以外なら数字を出力
        let frame ='';
        if (details.frameId ===0){
            frame='top'
        }else{
            frame='iframe('+details.frameId+')';
        }

        console.log(`[案B] ${frame}  宛先=${details.url}  PAN=${hasPAN ? 'YES' : 'no'}  body=${body}`) //httpリクエストのurl,frameid(フレーム識別タグ)をログで出力
    },

    {urls: ['http://localhost:8080/*','http://127.0.0.1:8081/*']},
    ['requestBody']
);