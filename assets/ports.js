const yard = document.getElementById("yard");

for(let i=0;i<80;i++){
const box = document.createElement("div");
box.className="container-box";
box.style.opacity=Math.random();
yard.appendChild(box);
}