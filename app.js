fetchdatastate();
var disdate = 0;
var disid = 0;
var elestate = document.getElementById('state');
var ele = document.getElementById('district');

//DETERMINING THE STATE NUMBER AND POPULATE THE OPTIONS
async function fetchdatastate() {
    const responsestate = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/states`);
    const datastate = await responsestate.json();
    let i = 0;
    let totalstate = datastate.states.length;


    while (totalstate--) {
        elestate.innerHTML = elestate.innerHTML +
            '<option value="' + datastate.states[i].state_id + '">' + datastate.states[i].state_name + '</option>';
        i++;
    }
}

//Getting the user selected state id in var - stateid

function showstate(elestate) {
    var stateid = elestate.value;
    console.log(stateid);
    ele.innerHTML = "";
    fetchdatadis(stateid);
}

//Pupulating the district options by state id

async function fetchdatadis(stateid) {
    const response = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateid}`);
    const data = await response.json();
    let i = 0;
    let totaldis = data.districts.length;


    while (totaldis--) {
        ele.innerHTML = ele.innerHTML +
            '<option value="' + data.districts[i].district_id + '">' + data.districts[i].district_name + '</option>';
        i++;
    }
}

//Getting the district id in var - disid and activating the explorecentre func


function showdis(ele) {
    disid = ele.value;
    console.log(disid);
    // ele.innerHTML="";
    explorecentre(disid);
}

//Setting the selected date in the right formate

function showdate(date) {
    var x = document.querySelector('input[type="date"]').value;
    let today = new Date(x);


    tdate2 = (today.getDate() + 2);

    tdate = String(today.getDate() + 1).padStart(2, "0");
    tmonth = String(today.getMonth() + 1).padStart(2, "0");
    tyear = today.getFullYear();
    disdate = (tdate - 1) + "-" + tmonth + "-" + tyear;

    //Adding timeline to the fronend

    document.getElementById("timeline").innerHTML = `Timeline: <button id="today">${disdate}</button>
<button id="tomotime">${(tdate) + "-" + tmonth + "-" + tyear}</button>
<button id="today2">${(tdate2) + "-" + tmonth + "-" + tyear}</button>`;

//function when clicked the timelines button

var xtoday = document.getElementById("today");
var xtomo = document.getElementById("tomotime");
var xtoday2 = document.getElementById("today2");

xtomo.addEventListener("click", function () {
    disdate = (tdate) + "-" + tmonth + "-" + tyear;
    explorecentre(disid);
})
xtoday.addEventListener("click", function () {
    disdate = (tdate - 1) + "-" + tmonth + "-" + tyear;
    explorecentre(disid);
})
xtoday2.addEventListener("click", function () {
    disdate = (tdate2) + "-" + tmonth + "-" + tyear;
    explorecentre(disid);
})
    explorecentre(disid);
}

//passing disid to function in which it again passid the disid to async func for AVAILABILITY CHECK 

function explorecentre(disid) {
    fetchcontent(disid);
    async function fetchcontent(disid) {
        const responsemain = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${disid}&date=${disdate}`);
        const data = await responsemain.json();
        let i = 0;
        let centrelength = data.sessions.length;
        let html = "";
        let thisname = document.getElementById("maincontenthere");
        document.getElementById("datefront").innerHTML = `<h3 id="datefront">Date: ${disdate}</h3>`;


        let avail18 =0,avail45=0;

        while (centrelength--) {

            html += `<p id="maincontent">Center Name: ${data.sessions[i].name}</p>
            <p id="Address">Address: ${data.sessions[i].address}</p>
            <p id="Blockname">Block Name: ${data.sessions[i].block_name}</p>
            <p id="available_capacity_dose1">Doses Availability: <avl style="color:yellow; text-decoration:none;">${data.sessions[i].available_capacity_dose1}</avl></p>
            <p id="min_age_limit">Min Age: ${data.sessions[i].min_age_limit}</p>
            <hr>`;

            if(data.sessions[i].min_age_limit==18) {
            avail18+=data.sessions[i].available_capacity_dose1;
            }
            else {
                avail45+= data.sessions[i].available_capacity_dose1;
            }
            // console.log(data.sessions[i].name);
            // console.log(data.sessions[i].address);
            // console.log(data.sessions[i].block_name);
            // console.log("AVAILABILITY");

            // console.log(data.sessions[i].available_capacity_dose1);
            i++;
        }
        thisname.innerHTML = html;
        let aval = document.getElementById("avail");
        aval.innerHTML = `<h4 id="slotscheck">Total Slots Available (18+): <strong style="color:red; font-size:25px;">${avail18}</strong>&nbsp&nbspTotal Slots Available (45+): <strong style="color:red; font-size:25px;">${avail45}</strong> </h4> `;
    }
}