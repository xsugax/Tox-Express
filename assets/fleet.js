var map = L.map('fleetMap').setView([20,0],2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map);

/* Ship Route */
var ship = L.marker([6.5,3.3]).addTo(map).bindPopup("Cargo Vessel TX-90821");

var step=0;
setInterval(()=>{
let lat = 6.5 + (50-6.5)*(step/100);
let lng = 3.3 + (4.5-3.3)*(step/100);
ship.setLatLng([lat,lng]);
step++;
if(step>100) step=0;
},150);

/* Aircraft */
var plane = L.circleMarker([40,-74],{radius:6,color:"#00e5ff"}).addTo(map);
setInterval(()=>{
plane.setLatLng([
40+(Math.random()-0.5)*10,
-74+(Math.random()-0.5)*10
]);
},2000);