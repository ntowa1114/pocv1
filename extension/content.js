console.log('[案A content]注入された: ',location.href,'top='+(window.top === window.self)); //このスクリプトが動いているページのURL。どのフレームに注入されたかが分かる。


//matches(https://example.com/) 以下のページを開いたら content.js を実行してね

//ページのfetchを横取り

//元のfetchを退避(一時的に保存)
const origFetch =window.fetch;
//fetch関数を自分の関数に差し替え(fetchを呼ぶと自分の関数を呼ぶ)
window.fetch = function(input,init){
    console.log('[案A hook] fetchで',input,'を取得');
    //本来のfetch実行
    return origFetch.apply(this, arguments);
};