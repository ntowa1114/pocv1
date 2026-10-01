console.log('[案A content]注入された: ',location.href,'top='+(window.top === window.self)); //このスクリプトが動いているページのURL。どのフレームに注入されたかが分かる。

const TEST_PAN ='4111111111111111'
//matches(https://example.com/) 以下のページを開いたら content.js を実行してね

//ページのfetchを横取り

//元のfetchを退避(一時的に保存)
const origFetch =window.fetch;
//fetch関数を自分の関数に差し替え(fetchを呼ぶと自分の関数を呼ぶ)
window.fetch = function(input,init){
    const hasPAN =init.body.includes(TEST_PAN);
        //frame: frameidが0ならtop, それ以外なら数字を出力
        const frame = (window.top === window.self) ? 'top' : 'iframe';
    console.log('[案A hook]','宛先=',input, 'PAN=',hasPAN,'body=',init.body);
    //本来のfetch実行
    return origFetch.apply(this, arguments);
};