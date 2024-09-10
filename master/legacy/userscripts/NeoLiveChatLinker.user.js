// ==UserScript==
// @name         NeoLivechatLinker
// @version      0.25
// @namespace    NeoLiveChat
// @description  Simple backend linker service for new Live chat
// @author       MariToahike aka Mushen, учась на работе Toshka и SupportDesk IT отдела
// @match        https://support-admin-master.chat.cc.local/*
// @require 	 https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @downloadURL  https://maritoahike.neocities.org/utils/NeoLivechatLinker.js
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM_log
// ==/UserScript==
// теперь поддерживает все проекты
// переписан механизм поиска почты\номера и проекта



(async function () {
    'use strict';

    //

    let whereToPutEmail=".detail-value";

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (true) {

        //console.log("working...");

        await sleep(100);

        try
          {
            let textlastcollection = document.getElementsByClassName("vac-text-last");
            let focusedChatEmail=textlastcollection[textlastcollection.length-1].firstChild;
            let ProjectName=document.querySelectorAll("h3")[1].parentNode.childNodes[2].innerText.split(" ")[0].split(":")[1];
            let usedLink;
            let IDElem=focusedChatEmail;
            let FoundID=focusedChatEmail.innerText;
            let emailLink = `https://admin.crimson.${ProjectName}.prd.maxbit.private/admin/players/find_user?filters[id_or_email]=${FoundID}&commit=Найти'`
            let phoneLink = `https://admin.crimson.${ProjectName}.prd.maxbit.private/admin/players/find_user?filters[phone_number]=${FoundID}&commit=Найти'`
            if(FoundID.includes("+")&&!FoundID.includes("@"))
              {
                usedLink=phoneLink;
              }
            else usedLink=emailLink;


            let fullLinkElem = `<a id="enhancerLinkElem" target="_blank" href="${usedLink}">${FoundID}</a>`;
            IDElem.innerHTML = fullLinkElem;


          }
       catch
         {

         }

    }
})();