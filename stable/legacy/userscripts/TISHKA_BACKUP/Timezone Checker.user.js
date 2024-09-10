// ==UserScript==
// @name        Timezone Checker
// @namespace   tishka.xyz
// @match       https://marketing*.lux-casino.co/*
// @match       https://admin.crimson.*.prd.maxbit.private/*
// @grant       none
// @version     1.2
// @author      -
// @description 18.11.2022, 10:29:47
// ==/UserScript==

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function averageDepositSum() {
  await sleep(1000);
  let parsedRes;
  const userMailObj = document.querySelector(".edit-email-player");
  const userMail = userMailObj.innerText;
  await fetch(
    `https://${window.location.host}/admin/payments?q[action_eq]=deposit&q[user_email_eq]=${userMail}&scope=only_success`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      },
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((response) => response.text())
    .then((response) => {
      let DOMparse = new DOMParser();

      parsedRes = DOMparse.parseFromString(response, "text/html");
      console.log(parsedRes);
    })
    .catch((err) => console.log(err));

    const deps = parsedRes.querySelectorAll("table")[1].querySelectorAll("tbody tr");
    console.log(deps[0])
    if(!deps) {
      console.log("не нашли депов");
      return {averageDep: 0, cur: 0};
    }
    let depositsData = [];
    let count = 0;
    const currency = deps[0].querySelectorAll(".col")[2].innerText.match(/[A-Z]{3}/)[0];
    for(let deposit of deps){
      if(count == 10) break;
      let amount = parseFloat(deposit.querySelectorAll(".col")[2].innerText.replace(/[A-Z]{3}/, "").replace(/\s/, "").replace(",", "."));
      depositsData.push(amount);
      count++
    }
    //depositsData = depositsData.reverse();
    console.log(depositsData);
    console.log(currency);

    let depsSum = 0;
    for(let value of depositsData){
      depsSum = depsSum +value;
    }
    console.log("Сумма депозитов:" + depsSum);
    console.log("Количество депозитов: " + count);
    console.log("Средний деп: " + (depsSum / count) );
    console.log("Валюта:" + currency);
    let depsData = {averageDep: depsSum / count, cur: currency};
    return depsData;



}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

async function work() {
  async function getRegionTimeOffset(number) {
    // const res = await createParser("https://fincalculator.ru/api/tel/79013902585", "timezone");
    let resJson;
    let response = await fetch(
      `https://tishka.xyz/api/timezone.php?number=${number}`
    );
    if (response.ok) {
      resJson = await response.json();
    } else {
      alert("Ошибка HTTP timezone: " + response.status);
    }
    return resJson;
  }

  if (window.location.href.match(/players\/./)) {
    let depsData = await averageDepositSum();
    console.log(depsData);
    let panel = document.getElementById("phones_sidebar_section");
    let number = panel.querySelector("ul li").innerText.split(" ")[0].substr(1);
    let a = await getRegionTimeOffset(number);
    // let mskOffset = a.timeZone - 3;
    const curTimeUTCsec = new Date().getTime() / 1000;
    const offsetSec = (a.timeZone - 3) * 3600;
    let regionTime = (curTimeUTCsec + offsetSec) * 1000; // конверт в мсек
    let regionTimeObj = new Date(regionTime);
    let regionTimeMins =
      regionTimeObj.getMinutes() < 10
        ? "0" + regionTimeObj.getMinutes()
        : regionTimeObj.getMinutes();
    let resTime = regionTimeObj.getHours() + ":" + regionTimeMins;
    // panel.querySelector("h3").innerHTML += `<span style="padding-left:10px;color:red;">ВРЕМЯ РЕГИОНА ${resTime}</span>`
    console.log(a);
    console.log(`RABOTAEM TIMEZONE ${a.timeZone}`);

    let bonus = "";
    const ranges = {
      RUB: [100, 301, 500, 2501, 7501, 999999999],
      KZT: [600, 1801, 5000, 25001, 75001, 999999999]
    }
    let range = 0;
    const rangeBonuses = ["E", "F", "A", "B", "C"];
    let rangeE = depsData.averageDep >= ranges[depsData.cur][0] && depsData.averageDep < ranges[depsData.cur][1] ? true : false;
    let rangeF = depsData.averageDep >= ranges[depsData.cur][1] && depsData.averageDep < ranges[depsData.cur][2] ? true : false;
    let rangeA = depsData.averageDep >= ranges[depsData.cur][2] && depsData.averageDep < ranges[depsData.cur][3] ? true : false;
    let rangeB = depsData.averageDep >= ranges[depsData.cur][3] && depsData.averageDep < ranges[depsData.cur][4] ? true : false;
    let rangeC = depsData.averageDep >= ranges[depsData.cur][4] && depsData.averageDep < ranges[depsData.cur][5] ? true : false;
    if(rangeE) bonus = "E";
    if(rangeF) bonus = "F";
    if(rangeA) bonus = "A";
    if(rangeB) bonus = "B";
    if(rangeC) bonus = "C";

    let tmBlock = document.createElement("div");
    tmBlock.classList.add("sidebar_section");
    tmBlock.classList.add("panel");
    tmBlock.classList.add("dangerzone");
    tmBlock.innerHTML = `
      <h3>Telemarketing</h3>
      <div class="panel_contents">
        <div><a>Регион:</a> <b>${a.region}</b></div>
        <div><a>Время региона:</a> <b>${resTime}</b></div>
        <div><a>Моб. опер:</a> <b>${a.operator}</b></div>
        <div><a>Средний деп:</a> <b>${depsData.averageDep.toFixed(2)} ${depsData.cur}</b></div>
        <div><a>Бонус:</a> <b>AWAKE BEZDEP ${bonus}</b></div>
      </div>
  `;
    let elemAfter = document.getElementById("email_sidebar_section");
    insertAfter(tmBlock, elemAfter);
    insertAfter(tmBlock, elemAfter);

  }
}
work();
