let currentDirectory="main";
let currentPage=0;
let iframe=document.getElementsByClassName("blogembed")[0];
document.getElementById("rightMenuOp0").addEventListener(("click"), Button0, false);
document.getElementById("rightMenuOp1").addEventListener(("click"), Button1, false);
document.getElementById("rightMenuOp2").addEventListener(("click"), Button2, false);
document.getElementById("rightMenuOp3").addEventListener(("click"), Button3, false);

function Button0(){
    currentDirectory="content/main";
    pageUpdate();
};

function Button1(){
    currentDirectory="content/about/main";
    pageUpdate();
};

function Button2(){
    currentDirectory="content/blog/page"+String(currentPage);
    pageUpdate();
};

function Button3(){
    currentDirectory="content/links/page"+String(currentPage);
    pageUpdate();
};



 function pageUpdate() {
    console.log(currentDirectory+".html");
    iframe.setAttribute("src",currentDirectory+".html");
}
