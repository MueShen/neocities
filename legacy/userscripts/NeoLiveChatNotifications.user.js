// ==UserScript==
// @name        NeoLivechatNotifications
// @version     1.3.5
// @namespace   NeoLiveChat
// @match       https://support-admin-master.chat.cc.local/*
// @downloadURL https://maritoahike.neocities.org/utils/NeoLiveChatNotifications.user.js
// @author      MariToahike
// @description Simple notification service for new Live chat
// @run-at document-end
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require 	https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM_log
// ==/UserScript==
// Добавлено автоматическое обновление для упрощения апдейта в будущем,
// добавлен текст уведомлений и фио клиента 
// В СТРОКЕ 22 укажите свое имя агента

let AgentName= "Connor";
function wait (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  const retry = (fn, ms) => new Promise(resolve => {
    fn()
      .then(resolve)
      .catch(() => {
        setTimeout(() => {
            //killObserver();
          console.log('reinitializing notifications...');
          retry(fn, ms).then(resolve);
        }, ms);
      })
  });




const mainLoop= async () => {
    await wait(5000);
    retry(ObservLaunch,5000)
        .then(console.log)
        .catch(console.log);

    window.setInterval(IIFE_RoutineObserverRestarter,120000)
    console.log("Main Loop exits");
}

mainLoop().catch(console.error);


async function IIFE_RoutineObserverRestarter()
    {
        try{killObserver()} catch(e){} //prevent unnescesary errors
        retry(ObservLaunch,5000)
        .then(console.log)
        .catch(console.log);
    }

let observer=null;

 function ObservLaunch()
{
    return new Promise ((resolve,reject) => {
        //console.log("Observer attempts to start");

        let target=document.getElementsByClassName("vac-room-list")[0];
        let callb= (mutationList => {
        console.log(mutationList);
        if(true)
        {
            if(document.getElementsByClassName("get-message-author")[0]==null)
            { notifyMe(0); }
            if(!document.getElementsByClassName("get-message-author")[0].innerText.includes(AgentName.slice(0,2))){
                notifyMe(1,document.getElementsByClassName("get-message-author")[0].parentElement.children[1].innerText,document.getElementsByClassName("get-message-author")[0].parentElement.parentElement.children[0].children[0].children[0].innerText);
            }
        }});
        if(observer==null) observer = MutationObserver=new MutationObserver(callb);
        observer.observe(target, {
            childList: true, // observe direct children
            subtree: true, // and lower descendants too
            characterDataOldValue: true // pass old data to callback
            });
        console.log("Notification observer utility had started, will now work in background");
        return resolve;
    })
    }

function killObserver()
{
    observer.disconnect();
    delete observer;
    throw new Error("Manual Disconnect");
}
    function notifyMe(tp,msg="Message text not detected",owner="New Chat") {

        if(tp==0)
        messg="Notification type new chat"
        else if(owner!=null)
          {
            messg=owner
          }
        else messg="New message";

        if (!window.Notification) {
            console.log('Browser does not support notifications.');
        } else {
            // check if permission is already granted
            if (Notification.permission === 'granted') {
                // show notification here
                var notify = new Notification(messg, {
                    body: msg
                });
            } else {
                // request permission from user
                Notification.requestPermission().then(function (p) {
                    if (p === 'granted') {
                        // show notification here
                        var notify = new Notification(messg, {
                            body: msg
                        });
                    } else {
                        console.log('User blocked notifications.');
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }
        }
    }


