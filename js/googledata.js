let url = 'https://script.google.com/macros/s/AKfycbwdgOC_kODY9xxwUP63CQTgEeW-wjBiCZI0OrwCIZsrqaziRBgHk4r0HvLTGdG9e1d4jQ/exec';
var getAllData=[];
//fetch record from the google sheet
fetch(url)
.then(res => res.json())
.then((out) => {
    let allData = out.GoogleSheetData;
    getAllData.push({'name': 'India','count': (allData.length-1), 'role': 'all', 'sampler':0,'surveyor':0,'deo':0,'frt':0, 'site_eng': 0, 'supervisor': 0 , 'specialization': ''});
    allData.forEach(function(value,key) {
        if(key != 0){
            let newArray = {
                'name' : value[3].trim(),
                'role' : value[4],
                'district': value[1],
                'specialization': value[6].trim()+','+value[7].trim()+','+value[8].trim()+','+value[9].trim()+','+value[10].trim()+','+value[11].trim()+','+value[12].trim()+','+value[13].trim()
            };
            getAllData[key] = newArray;
        }
        
    });
    renderChart();
})
.catch(err => { throw err });

//after few second it will load all record
function renderChart(){
    document.getElementById("loader").style.display='none';
    var total_sampler = 0;
    var total_site_eng = 0;
    var total_surveyor = 0;
    var total_deo = 0;
    var total_frt = 0;
    var total_supervisor = 0;
    var resRole = [];
    // fetch role and total count
    getAllData.forEach(function(item){
        // console.log(item)
        var i = resRole.findIndex(x => x.role == item.role);
        if(i <= -1){
            resRole.push({role: item.role});
        }        
    });

    var resStates = [];
    //fetch record according to their 
    getAllData.forEach(function(item){
        if(item.role == resRole[2].role){
            total_sampler = total_sampler + 1;
        }else if(item.role == resRole[3].role){
            total_supervisor = total_supervisor + 1;
        }else if(item.role == resRole[6].role){
            total_site_eng = total_site_eng + 1;
        }else if(item.role == resRole[4].role){
            total_frt = total_frt + 1;
        }else if(item.role == resRole[1].role){
            total_surveyor = total_surveyor + 1;
        }else if(item.role == resRole[5].role){
            total_deo = total_deo + 1;
        }else{
            if(item.role == resRole[0].role){
                
                resStates.push({ name : item.name,
                    role : item.role,
                    count : item.count,
                    sampler : total_sampler,
                    surveyor : total_surveyor,
                    supervisor : total_supervisor,
                    deo : total_deo,
                    frt : total_frt,
                    site_eng : total_site_eng,
                    specialization : item.specialization
                });
            }
        }
            // console.log(item)
        if(item.role != 'all'){
        var i = resStates.findIndex(x => (x.name == item.name));
        //if found new role then insert it as new entry otherwise it will compare
        if(i <= -1){            
            resStates.push({ name: item.name, data: [{
                        name: item.name,
                        role: item.role,
                        item: item.name,
                        specialization: item.specialization,
                        count: 1
                    }]});            
        }else{
            
            let compareName = item.name;
            let compareRole = item.role;
            let stateData = resStates[i].data;
            let count = parseInt(stateData.length);
            stateData.forEach(function(roleitem, index){
                if(compareName == roleitem.name && roleitem.role != compareRole){
                }else{
                    let totalcount = parseInt(roleitem.count) + 1;
                    var concatspec = roleitem.specialization +','+item.specialization;
                    
                    let newSpec = concatspec.split(',');
                    let unique = newSpec.filter((item, i, ar) => ar.indexOf(item) === i);
        
                    stateData[index] = {
                        name: item.name,
                        role: item.role,
                        item: item.name,
                        specialization: unique.join(","),
                        count: totalcount
                    }
                }
                var rolefilter = resRole.findIndex(rolex => rolex.role == item.role);
                if(rolefilter <= -1){
                    stateData[index] = {
                        name: item.name,
                        role: item.role,
                        item: item.name,
                        specialization: unique.join(","),
                        count: totalcount
                    }
                }else{
                    
                    if(rolefilter != 0 && roleitem.name == item.name && roleitem.role != item.role){

                        var concatspec = roleitem.specialization +','+item.specialization;
                        
                        let newSpec = concatspec.split(',');
                        let unique = newSpec.filter((item, i, ar) => ar.indexOf(item) === i);
                        var namefilter = stateData.findIndex(namex => namex.role == item.role);

                        if(namefilter == -1){
                            stateData.push({
                                name: item.name,
                                role: item.role,
                                item: item.name,
                                specialization: unique.join(","),
                                count: 1
                            });
                        }else{
                            let utotalcount = parseInt(stateData[namefilter].count);
                            stateData[namefilter] = {
                                name: item.name,
                                role: item.role,
                                item: item.name,
                                specialization: unique.join(","),
                                count: utotalcount
                            };
                        }

                    }else{                        
                        var namefilter = stateData.findIndex(namex => namex.role == item.role);
                        var concatspec = roleitem.specialization +','+item.specialization;
                        
                        let newSpec = concatspec.split(',');
                        let unique = newSpec.filter((item, i, ar) => ar.indexOf(item) === i);
                        var namefilter = stateData.findIndex(namex => namex.role == item.role);

                        if(namefilter == -1){
                            stateData.push({
                                name: item.name,
                                role: item.role,
                                item: item.name,
                                specialization: unique.join(","),
                                count: 1
                            });
                        }
                    }
                    
                }
                // return false;
            });
            resStates[0].sampler = total_sampler;
            resStates[0].surveyor = total_surveyor;
            resStates[0].supervisor = total_supervisor;
            resStates[0].deo = total_deo;
            resStates[0].frt = total_frt;
            resStates[0].site_eng = total_site_eng;
            
            var concatspecs = resStates[0].specialization+','+item.specialization;
                        
            let newSpecs = concatspecs.split(',');
            let uniques = newSpecs.filter((item, i, ar) => ar.indexOf(item) === i);
            resStates[0].specialization = uniques.join(",");
        }
    }
    });

    // Highchart read Jammu & kashmir as Jammu and Kashmir and same for Orissa as Odisha
    var replace = resStates.findIndex(x => (x.name == 'Jammu & Kashmir'));
    var replace2 = resStates.findIndex(rx => (rx.name == 'Orissa'));
    resStates[replace2].name = 'Odisha';
    resStates[replace].name = 'Jammu and Kashmir';
    var tooltipEnabled = true;
    function renderCustomTooltip(point) {
        var series = point.series,
          chart = series.chart,
          renderer = chart.renderer,
          customTooltip = chart.customTooltip;
        console.log(point);
        if (customTooltip) {
          customTooltip.destroy();
        }
        sampler = parseInt(point.options.sampler);
        site_eng = parseInt(point.options.site_eng);
        frt = parseInt(point.options.frt);
        surveyor = parseInt(point.options.surveyor);
        supervisor = parseInt(point.options.supervisor);
        deo = parseInt(point.options.deo);
        let specialization = point.options.specialization;
        let newSpec = specialization.split(',');
        let arr = newSpec.filter(e => String(e).trim());

        let specialization_text = arr
        let str_spec_text = specialization_text.toString();
                    
        let newSpecs = str_spec_text.split(',');
        let newBrk=[];
        if(newSpecs.length > 3){                        
            for(i=0; i < newSpecs.length; i++){
                if(i != 0 && i){                        
                    if (i % 3 === 0) {
                        newBrk[i] = "<br />" + newSpecs[i];
                    }else{
                        newBrk[i] = newSpecs[i];
                    }
                }else{
                    newBrk[i] = newSpecs[i];
                }
            }
        }else{
            for(i=0; i < 3; i++){
                    if(newSpecs[i] != undefined){
                        newBrk[i] = newSpecs[i];
                    }
            }
        }
        // console.log(newBrk);
        var addnewBrk = str_spec_text.toString()
        // console.log(newBrk);
        // add break
        var special_text = addnewBrk.replace(/,/g,', ');
        var html='<div class="row start-div" style="min-height: 560px !important;"><div class="col-md-12>"';
        html +='<div class="card" style="width: 25rem">';
        html +='<div class="card-body">';
        html +='<h4 class="card-title"><i class="fa-solid fa-location-dot"></i>'+point.options.name+'</h4> <hr class="hr-style" />';
        html +='<h6 class="card-subtitle mb-2 text-muted">Manpower</h6>';
        html +='<p class="card-text">'+parseInt(sampler+site_eng+frt+surveyor+supervisor+deo)+'</p>';
        html +='<div class="card-text row"><div class="col-lg-4">Sampler<p class="role-text">'+((sampler==0)?'--':sampler)+'</p></div><div class="col-lg-4">Surveyor<p  class="role-text">'+((surveyor==0)?'--':surveyor)+'</p></div><div class="col-lg-3">Supervisor<p  class="role-text">'+((supervisor==0)?'--':supervisor)+'</p></div></div>';
        html +='<div class="card-text row"><div class="col-lg-4">DEO\'s<p class="role-text">'+((deo==0)?'--':deo)+'</p></div><div class="col-lg-4">FRT\'s<p  class="role-text">'+((frt==0)?'--':frt)+'</p></div><div class="col-lg-3">Site Engineer<p class="role-text">'+((site_eng==0)?'--':site_eng)+'</p></div></div>';
        html +='<div class="card-text row"><span>Specialization</span><p class="col-lg-12 specs" style="width:100px !important;word-break: break-all;">'+special_text+'</p></div>';
        html +='</div>';
        html +='</div>';
        html +='</div>';
        chart.customTooltip = renderer.label(html, 60, 30, null, null, null, true).attr({
          zIndex: 999
        }).add();
      }
    (async () => {

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json'
        ).then(response => response.json());

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                // zoomType: 'xy',
                height: 600,
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(248, 227, 229)'],
                        [1, 'rgb(226, 244, 250)']                        
                    ]
                },
                events: {
                    load: function() {
                        console.log(this.series[0].points[0])
                        renderCustomTooltip(this.series[0].points[0]);
                    }
                }
            },
            title: {
                text: ''
            },
            exporting: { enabled: false },
            legend: {
                title: {
                    text: '',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                },
                layout: 'vertical',
                align: 'left',
                floating: true,
                valueDecimals: 0,
                valueSuffix: '',
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgb(255, 255, 255)',
                symbolRadius: 0,
                symbolHeight: 14,
                itemStyle: {
                    fontSize: '10px'
                }


            },

            mapNavigation: {
                enabled: false
            },
            mapView: {
                projection: {
                    name: 'WebMercator'
                },
                center: [70, 22.9],
                zoom: 4.5
            },
            tooltip: {
                // enabled: false,
                backgroundColor: 'none',
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                padding: 0,
                positioner: function () {
                    return {
                        x: 61,
                        y: 30
                    };
                },
                formatter: function () {
                    console.log(this.point.name);
                    var sampler = 0;
                    var supervisor = 0;
                    var surveyor = 0;
                    var deo = 0;
                    var frt = 0;
                    var site_eng = 0;
                    var specialization = 0;
                    var specialization_text = '';
                    
                    this.point.data.forEach(function(item){
                        
                        if(item.role == resRole[2].role){
                                sampler = parseInt(item.count);
                        }else if(item.role == resRole[6].role){
                                site_eng = parseInt(item.count);
                        }else if(item.role == resRole[4].role){
                                frt = parseInt(item.count);
                        }else if(item.role == resRole[1].role){
                                surveyor = parseInt(item.count);
                        }else if(item.role == resRole[3].role){
                                supervisor = parseInt(item.count);
                        }else if(item.role == resRole[5].role){
                                deo = parseInt(item.count);
                        }else{
                            if(item.role == resRole[0].role){
                                sampler = parseInt(item.sampler);
                                site_eng = parseInt(item.site_eng);
                                frt = parseInt(item.frt);
                                surveyor = parseInt(item.surveyor);
                                supervisor = parseInt(item.supervisor);
                                deo = parseInt(item.deo);                                
                            }                            
                        }

                       specialization = item.specialization.replace(', ',',');
                       let newSpec = specialization.split(',');
                       let arr = newSpec.filter(e => String(e).trim());

                        specialization_text = arr
                        
                    // let unique = newSpec.filter((item, i, ar) => ar.indexOf(item) === i);
                    });
                    
                    let str_spec_text = specialization_text.toString();
                    
                    let newSpecs = str_spec_text.split(',');
                    let newBrk=[];
                    if(newSpecs.length > 4){                        
                        for(i=0; i < newSpecs.length; i++){
                            if(i != 0 && i){                        
                                if (i % 4 === 0) {
                                    newBrk[i] = "<br />" + newSpecs[i];
                                }else{
                                    newBrk[i] = newSpecs[i];
                                }
                            }else{
                                newBrk[i] = newSpecs[i];
                            }
                        }
                    }else{
                        for(i=0; i < 4; i++){
                                if(newSpecs[i] != undefined){
                                    newBrk[i] = newSpecs[i];
                                }
                        }
                    }
                    // console.log(newBrk);
                    var addnewBrk = newBrk.toString()
                    // console.log(newBrk);
                    // add break
                    var special_text = str_spec_text.replace(/,/g,', ');

                    var html='<div class="row start-div" style="min-height: 560px !important;"><div class="col-md-12>"';
                    html +='<div class="card" style="width: 25rem">';
                    html +='<div class="card-body">';
                    html +='<h4 class="card-title"><i class="fa-solid fa-location-dot"></i>'+this.point.name+'</h4> <hr class="hr-style" />';
                    html +='<h6 class="card-subtitle mb-2 text-muted">Manpower</h6>';
                    html +='<p class="card-text">'+parseInt(sampler+site_eng+frt+surveyor+supervisor+deo)+'</p>';
                    html +='<div class="card-text row"><div class="col-lg-4">Sampler<p class="role-text">'+((sampler==0)?'--':sampler)+'</p></div><div class="col-lg-4">Surveyor<p  class="role-text">'+((surveyor==0)?'--':surveyor)+'</p></div><div class="col-lg-3">Supervisor<p  class="role-text">'+((supervisor==0)?'--':supervisor)+'</p></div></div>';
                    html +='<div class="card-text row"><div class="col-lg-4">DEO\'s<p class="role-text">'+((deo==0)?'--':deo)+'</p></div><div class="col-lg-4">FRT\'s<p  class="role-text">'+((frt==0)?'--':frt)+'</p></div><div class="col-lg-3">Site Engineer<p class="role-text">'+((site_eng==0)?'--':site_eng)+'</p></div></div>';
                    html +='<div class="card-text row"><span>Specialization</span><p class="col-lg-12 specs">'+special_text+'</p></div>';
                    html +='</div>';
                    html +='</div>';
                    html +='</div>';
                    return html;
                }
            },
            plotOptions: {
                series: {
                    color: '#bdbcbb',
                    name: 'States',
                    cursor: 'pointer',
                    // point: {
                    //     events: {
                    //         click: function () {

                    //             if (this.value == 0) {


                    //                 alert('No CSR Spent!');
                    //             }

                    //             else {

                    //             }
                    //         }
                    //     }
                    // }
                }
            },


            credits: {
                enabled: false
            },

            series: [{
                mapData: topology,
                joinBy: 'name',
                showInLegend: false,
                point: {
                    events: {
                        click: function() {
                            this.series.chart.update({
                                tooltip: {
                                    enabled: true
                                }
                            });
                        }                        
                    }
                },
                dataLabels: {
                    enabled: true,
                    color: 'black',
                    shadow: false,
                    zIndex: 1000,
                    style: {
                        textOutline: false
                    },
                    format: '{point.name}'
                },
                name: ' ',
                states: {
                    hover: {
                        color: '#64AE60'
                    }
                },
                "type": "map",
                "data":resStates
            }]
        });
    })();
}