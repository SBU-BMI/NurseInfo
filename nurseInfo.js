console.log('nurseInfo.js loaded')

nurseInfo=function(){
    nurseInfo.bench();
}

nurseInfo.fun=function(ui){
	colorMap={
		domain:[0,1,1.5,2,4],
		range:["green","yellow","orange","red","maroon"]
		//range:["green","blue","orange","red","maroon"]
		//domain:[0,1,2,3,4],
		//range:["green","yellow","red","maroon","black"]
	}
    var divFun=document.getElementById('nurseInfoFun')
    divFun.innerHTML='<input type="button" value="reload" id="reload" style="color:red"> <input type="button" value="replot" id="replot" style="color:green"><table><tr><td>Show individual patients for parameter <select id="selectParm"></select> (color=severity, area=length of stay, y-axis time of the day RRT paged):</td><td></td></tr><tr><td id="NurseInfo_Date"></td><td></td></tr><tr><td id="lengthOfStay">LengthOfStay over time<br></td></tr></table>'
    reload.style.fontSize=replot.style.fontSize="large"
    reload.onclick=function(){
    	location.reload()
    }
    replot.onclick=function(){
    	//location.reload()
    	//var ui=document.getElementById("nurseInfo")
    	//nurseInfoFun.innerHTML=""
    	//4
    	alert("Replot not Working yet Dan, should be done soon ...")
    }

    //divFun.innerHTML=+'Time<table><tr><td id="NurseInfo_Shift"></td><td></td><td></td></tr></table>'
    // Dimensional chartind
    var tableSeverity=document.createElement('table')
    tableSeverity.innerHTML='<tr><td><h3 style="color:navy">Severity:<br>(ARORI score)</h3></td><td id="danScore">Score<br></td><td id="Hypotension">Hypotension<br></td><td id="Acute_respiratory_failure">Acute respiratory failure<br></td><td id="Change_in_Mental_Status">Change_in_Mental_Status<br></td><td id="Concerned_about_the_patient">Concerned about the patient<br></td><td><h3 style="color:navy">Outcome:</h3></td><td id="DischargeToLocation">DischargeToLocation<br></td><td id="All" style="vertical-align:top">Number of Patients Selected<br></td></tr>'
    divFun.appendChild(tableSeverity)
    var tableTime=document.createElement('table')
    tableTime.innerHTML='<tr><td><h3 style="color:navy">Pace:</h3></td><td id="Shift"></td><td id="dayOfWeek"></td><td id="patientsPerLengthOfStay">Number of Patients per length of stay</td></tr>'
    divFun.appendChild(tableTime)
    var tablePlace=document.createElement('table')
    tablePlace.innerHTML='<tr><td><h3 style="color:navy">Place/Team:</h3></td><td id="Unit" style="vertical-align:top">Unit<br></td><td id="Unit_From" style="vertical-align:top">Unit From<br></td><td id="Unit_Transferred_to" style="vertical-align:top">Unit Transferred to<br></td><td id="Primary_Responder" style="vertical-align:top">Primary Responder<br></td><td>...</td></tr>'
    divFun.appendChild(tablePlace)
    //var tableWho=document.createElement('table')
    //tableWho.innerHTML='<tr><td><h3 style="color:navy">Person:</h3></td><td id="Primary_Responder">Primary Responder<br></td><td>...</td></tr>'
    //divFun.appendChild(tableWho)
    var tableOut=document.createElement('table')
    tableOut.innerHTML='<tr><td>...</td></tr>'
    divFun.appendChild(tableOut)
    var tableAllTF=document.createElement('table')
    tableAllTF.innerHTML='<tr id="allTFtr"><td><h3 style="color:navy">Some other TRUE/FALSE checks:</h3></td></tr>'
    // divFun.appendChild(tableAllTF) // <-- table deactivated

    var patientTableDiv=document.createElement('div')
    patientTableDiv.innerHTML='<hr><input type="button" value="Show Patients Selected (Warning: it will expose the raw, potentially sensitive data!)" id="selectedPatients" hidden="true" style="color:red;fontSize=large"><input type="button" value="Hide Patient table" id="hidePatients" hidden="true" style="color:green;fontSize=large">'
    
    setTimeout(function(){
    	document.getElementById("selectedPatients").onclick=function(){
    		if(!document.getElementById("patientTableTb")){
    			nurseInfo.createTable()
    			nurseInfo.showHideTable(document.getElementById("patientTableTb"))
    		}else{
    			document.getElementById("patientTableTb").hidden=false
    		}
    		
    		document.getElementById("selectedPatients").hidden=true
    		document.getElementById("hidePatients").hidden=false
    	}
    	document.getElementById("hidePatients").onclick=function(){
    		//nurseInfo.createTable()
    		document.getElementById("selectedPatients").hidden=false
    		document.getElementById("hidePatients").hidden=true
    		document.getElementById("patientTableTb").hidden=true
    	}
    	document.getElementById("selectedPatients").hidden=false
    	document.getElementById("loadReportButton").hidden=true
    	document.getElementById("loadReportButton").parentNode.removeChild(document.getElementById("loadReportButton"))
    },1000)
    

    divFun.appendChild(patientTableDiv) // <-- table deactivated


    
    C = {}, D={}, G={}, U={}, R={}
    var cf = crossfilter(nurseInfo.dt.docs)
    
	// Select Parameter
	var sel = document.getElementById("selectParm")
	var parms = Object.getOwnPropertyNames(nurseInfo.dt.tab).filter(function(p){
		return (nurseInfo.dt.tab[p][0]=="TRUE"||nurseInfo.dt.tab[p][0]=="FALSE")&(openHealth.unique(nurseInfo.dt.tab[p]).length==2)
	})
	sel.innerHTML='<option value="All">All</option>'
	parms.map(function(p){
		var op = document.createElement('option')
		op.value=p
		op.textContent=p
		sel.appendChild(op)

	})
	nurseInfo.dt.parmSelected=sel.value
	sel.onchange=function(){
		nurseInfo.dt.parmSelected=sel.value
		//Ci = C["NurseInfo_Date"]
		dc.redrawAll()
		//dc.renderAll()
		//$('.dc-chart g text').css('fill','black');
    	//$('#nurseInfoFun td').css({color:"blue"})
	}


	var createNurseInfo_Date=function(){
    D["NurseInfo_Date"]=cf.dimension(function(d,i){
    	return i
        //return new Date(d['Date:']+' '+d["Time RRT Paged:"])
    })
    C["NurseInfo_Date"]=dc.bubbleChart('#NurseInfo_Date')
    R["NurseInfo_Date"]={p:0,v:0}
    G["NurseInfo_Date"]=D["NurseInfo_Date"].group().reduce(
        // reduce in
		function(p,v){
		    //p=10*Math.random()
		    //p=v[nurseInfo.dt.parmSelected]=="TRUE"
		    p=v.lengthOfStay
		    return p //v.Arrhythmia=="TRUE"			
		},
		// reduce out
		function(p,v){
			//p=10*Math.random()
		    return p //v.Arrhythmia=="TRUE"
		},
		// ini
		function(){return 0}
    )

    C["NurseInfo_Date"]
    	.width(2000)
    	.height(500)
    	.dimension(D["NurseInfo_Date"])
    	.group(G["NurseInfo_Date"])
    	.x(d3.time.scale())
    	.y(d3.scale.linear())//.domain([-0.1,1.1]))
    	.elasticY(true)
        .elasticX(true)
    	.keyAccessor(function (x){
    		//return 100*Math.random()
    		var d = nurseInfo.dt.docs[x.key]
    		return new Date(d['Date:'])//+' '+d["Time RRT Paged:"])
    	})
    	.valueAccessor(function (y){
    		var d = nurseInfo.dt.docs[y.key]
    		//console.log(d.lengthOfStay)
    		return d["Time RRT Paged:"]//d.lengthOfStay//*(d[nurseInfo.dt.parmSelected]=="TRUE")
    	})
    	.radiusValueAccessor(function (r){
    		if(r.key!="All"){
    			if(nurseInfo.dt.tab[nurseInfo.dt.parmSelected][r.key]=="TRUE"){
    				if(nurseInfo.dt.patientsSelected[r.key]){
    				return Math.sqrt(nurseInfo.dt.docs[r.key].lengthOfStay/10)
    				}else return 0
    			}else{return 0}
    		}else{return Math.sqrt(nurseInfo.dt.docs[r.key].lengthOfStay/10)}
    	})
    	.colors(d3.scale.linear().domain(colorMap.domain).range(colorMap.range))
		.colorAccessor(function(v,i){
			//console.log(i,nurseInfo.dt.tab.danScore[i])
			return nurseInfo.dt.docs[v.key].danScore//Math.random()*10
		})
    	.title(function(d){
    		return JSON.stringify(nurseInfo.dt.docs[d.key],false,3)
    	})
    	//.onClick(function(){return true})
	}

	var createPieChart=function(parm,cf,funColor,width,height){
		if(!width){width=250}
		if(!height){height=220}
		C[parm]=dc.pieChart('#'+parm)
		D[parm]=cf.dimension(function(d,i){
    		return d[parm]
    	})
    	R[parm]={}
    	openHealth.unique(nurseInfo.dt.tab[parm]).map(function(p){
    		R[parm][p]=0
    	})

    	//nurseInfo.dt.patientsSelected={}  // I'm putting it here because there is only one piechart
    
    	G[parm]=D[parm].group().reduce(
        	// reduce in
			function(p,v){
		    	if(!R[parm].danScore[v[parm]]){R[parm].danScore[v[parm]]=0}
		    	R[parm].danScore[v[parm]]+=v.danScore
		    	R[parm][v[parm]]+=1
		    	//nurseInfo.dt.patientsSelected[v.i]=true
		    	return R[parm][v[parm]]			
			},
			// reduce out
			function(p,v){
				R[parm].danScore[v[parm]]-=v.danScore
		    	R[parm][v[parm]]-=1
		    	//nurseInfo.dt.patientsSelected[v.i]=false
		    	return R[parm][v[parm]]
			},
			// ini
			function(){
				R[parm].danScore={}
				return 0
			}
    	)

    	C[parm]
    		.width(width)
			.height(height)
			.radius(100)
			.innerRadius(30)
			.dimension(D[parm])
			.group(G[parm])
			/*.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
			.colorAccessor(function(d, i){
				if(res.G_years_reduce[d.key].expt){return res.G_years_reduce[d.key].obs/res.G_years_reduce[d.key].expt}
				else {return 0}
        	})
			.title(function(d,i){
"All"				console.log(d)
				return 'lala'+d.key
			});*/
		if(funColor){
			C[parm]
				.colors(d3.scale.linear().domain(colorMap.domain).range(colorMap.range))
				.colorAccessor(funColor)
		}
	}

	var createRowChart=function(parm,cf,funColor,width,height,funOrder){
		C[parm]=dc.rowChart('#'+parm.replace(/ /g,'_').replace(/\W/g,''))
		D[parm]=cf.dimension(function(d,i){
    		return d[parm]
    	})
    	R[parm]={}
    	openHealth.unique(nurseInfo.dt.tab[parm]).map(function(p){
    		R[parm][p]=0
    	})
    
    	G[parm]=D[parm].group().reduce(
        	// reduce in
			function(p,v){
				if(!R[parm].danScore[v[parm]]){R[parm].danScore[v[parm]]=0}
		    	R[parm][v[parm]]+=1
		    	R[parm].danScore[v[parm]]+=v.danScore
		    	return R[parm][v[parm]]			
			},
			// reduce out
			function(p,v){
				R[parm][v[parm]]-=1
				R[parm].danScore[v[parm]]-=v.danScore
				return R[parm][v[parm]]
			},
			// ini
			function(p,v){
				//R[parm].danScore={'TRUE':0,'FALSE':0}
				R[parm].danScore={}
				return 0
			}
    	)

    	if(!width){width=220}
    	else if(!height){
    		height=50+G[parm].all().length*width/18
    		//console.log(parm,width,height)
    	}
    	else{height=250}
		C[parm]
    		.width(width)
			.height(height)
			//.x(d3.scale.ordinal().domain(["Mon","Tue","Tue","Wed","Tur","Fri","Sat","Sun"]))
			//.y(d3.scale.linear())
			//.elasticY(false)
        	.elasticX(true)
			.dimension(D[parm])
			.group(G[parm])
			/*.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
			.colorAccessor(function(d, i){
				if(res.G_years_reduce[d.key].expt){return res.G_years_reduce[d.key].obs/res.G_years_reduce[d.key].expt}
				else {return 0}
        	})*/
			.title(function(d){return d[parm]});
		if(funColor){
			C[parm]
				.colors(d3.scale.linear().domain(colorMap.domain).range(colorMap.range))
				.colorAccessor(funColor)
		}
		if(funOrder){
			C[parm]
				.ordering(funOrder)
		}
	}

	var createAllPatients=function(cf,funColor,width,height){
		var parm="All"
		C[parm]=dc.rowChart('#'+parm.replace(/ /g,'_').replace(/\W/g,''))
		D[parm]=cf.dimension(function(d,i){
    		return d[parm]
    	})
    	R[parm]={}
    	openHealth.unique(nurseInfo.dt.tab[parm]).map(function(p){
    		R[parm][p]=0
    	})

    	nurseInfo.dt.patientsSelected={}  // I'm putting it here because there is only one of these
    
    	G[parm]=D[parm].group().reduce(
        	// reduce in
			function(p,v){
				if(!R[parm].danScore[v[parm]]){R[parm].danScore[v[parm]]=0}
		    	R[parm][v[parm]]+=1
		    	R[parm].danScore[v[parm]]+=v.danScore
		    	nurseInfo.dt.patientsSelected[v.i]=true
		    	return R[parm][v[parm]]			
			},
			// reduce out
			function(p,v){
				R[parm][v[parm]]-=1
				R[parm].danScore[v[parm]]-=v.danScore
				nurseInfo.dt.patientsSelected[v.i]=false
				return R[parm][v[parm]]
			},
			// ini
			function(p,v){
				//R[parm].danScore={'TRUE':0,'FALSE':0}
				R[parm].danScore={}
				return 0
			}
    	)

    	C[parm]
    		.width(520)
			.height(100)
			.elasticX(false)
			.dimension(D[parm])
			.group(G[parm])
			.label(function(d){
				var nTrue=Object.getOwnPropertyNames(nurseInfo.dt.patientsSelected).filter(function(i){return nurseInfo.dt.patientsSelected[i]}).length
				var nAll=nurseInfo.dt.docs.length
				// hide/show patients in table
				nurseInfo.showHideTable(document.getElementById("patientTableTb"))
				return nTrue+"/"+nAll+" ("+Math.round(100*nTrue/nAll)+"%)"//d[parm]
				
			})

		if(funColor){
			C[parm]
				.colors(d3.scale.linear().domain(colorMap.domain).range(colorMap.range))
				.colorAccessor(funColor)
		}
	}



	//d.danScore=(d["Stroke"]=="TRUE")+(d["Change in Mental Status"]=="TRUE")+(d["Acute respiratory failure"]=="TRUE")+(d["Concerned about the patient"]=="TRUE")

	
	


	// ALl TRUE FALSE Checks
	
	/*
	var parmsTR=document.getElementById("allTFtr")
	var j=0
	parms.map(function(pi,i){
		// created td
		if((!R[pi])&(openHealth.unique(nurseInfo.dt.tab[pi]).length>1)){
			j++
			if(j<19){
				//console.log(j,pi)
				var td=document.createElement('td')
				parmsTR.appendChild(td)
				td.innerHTML=pi+'<br>'
				td.id=pi.replace(/ /g,'_').replace(/\W/g,'')
				createRowChart(pi,cf,function(d){
					return R[pi].danScore[d.key]/R[pi][d.key]
				},200)
			}
		}
	})
	4
	*/

	// length of stay over time, id="lengthOfStay"

	var createBarChart=function(parm,cf,funColor,width,height){
		C[parm]=dc.barChart('#'+parm.replace(/ /g,'_').replace(/\W/g,''))
		D[parm]=cf.dimension(function(d,i){
    		return new Date(d.Date)//d["Date:"]
    	})
    	R[parm]={danScore:{},n:{}}
    	openHealth.unique(nurseInfo.dt.tab.Date).map(function(p){
    		R[parm][p]=0
    		R[parm].danScore[p]=0
    		R[parm].n[p]=0
    	})
    
    	G[parm]=D[parm].group().reduce(
        	// reduce in
			function(p,v){
				R[parm][v.Date]+=v[parm]
		    	R[parm].danScore[v.Date]+=v.danScore
		    	R[parm].n[v.Date]+=1
		    	return R[parm][v.Date]			
			},
			// reduce out
			function(p,v){
				R[parm][v.Date]-=v[parm]
		    	R[parm].danScore[v.Date]-=v.danScore
		    	R[parm].n[v.Date]-=1
		    	return R[parm][v.Date]			
			},
			// ini
			function(p,v){
				//R[parm].danScore={'TRUE':0,'FALSE':0}
				return 0
			}
    	)

    	if(!width){width=220}
    	else if(!height){
    		height=50+G[parm].all().length*width/18
    		//console.log(parm,width,height)
    	}
    	else{height=250}
		C[parm]
    		.width(width)
			.height(height)
			.x(d3.time.scale())
			.xUnits(function(){return 365})
			//.y(d3.scale.log())
			//.x(d3.scale.ordinal().domain(["Mon","Tue","Tue","Wed","Tur","Fri","Sat","Sun"]))
			//.y(d3.scale.linear())
			//.elasticY(false)
        	.elasticX(true)
			.dimension(D[parm])
			.group(G[parm])
			/*.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
			.colorAccessor(function(d, i){
				if(res.G_years_reduce[d.key].expt){return res.G_years_reduce[d.key].obs/res.G_years_reduce[d.key].expt}
				else {return 0}
        	})*/
			.title(function(d){return d[parm]});
		if(funColor){
			C[parm]
				.colors(d3.scale.linear().domain(colorMap.domain).range(colorMap.range))
				.colorAccessor(funColor)
		}
	}

	// lengthOfStay

	
	var createPatientsPerLengthOfStay=function(cf,funColor){
		parm="lengthOfStayInt"
		C[parm]=dc.barChart('#patientsPerLengthOfStay')
		D[parm]=cf.dimension(function(d,i){
    		if(!isNaN(d[parm])){
    			return d[parm]
    		}	
    	})
    	R[parm]={danScore:{}}
    	openHealth.unique(nurseInfo.dt.tab[parm]).map(function(p){
    		R[parm].danScore[p]=0
    		R[parm][p]=0
    		//R[parm][new Date(p)]=0
    	})
    
    	G[parm]=D[parm].group().reduce(
        	// reduce in
			function(p,v){
				if(v[parm]>0){
					R[parm][v[parm]]+=1 
		    		R[parm].danScore[v[parm]]+=v.danScore
		    	}
		    	return R[parm][v[parm]]	
			},
			// reduce out
			function(p,v){
				if(v[parm]>0){
					R[parm][v[parm]]-=1 
		    		R[parm].danScore[v[parm]]-=v.danScore
		    	}
		    	return R[parm][v[parm]]			
			},
			// ini
			function(p,v){
				//R[parm].danScore={'TRUE':0,'FALSE':0}
				//R[parm].danScore=0
				return 0
			}
    	)

    	C[parm]
    		.width(1500)
			.height(250)
			.x(d3.scale.linear())
			.elasticY(true)
        	.elasticX(true)
			.dimension(D[parm])
			.group(G[parm])
			.title(function(d){return d[parm]})
			.colors(d3.scale.linear().domain(colorMap.domain).range(colorMap.range))
			.colorAccessor(function(d){
				return R[parm].danScore[d.key]/d.value
			})
			
		
	}





	
    createRowChart("danScore",cf,function(d){
		return d.key
	},250,220)
	createRowChart("Hypotension",cf,function(d){
		return R["Hypotension"].danScore[d.key]/R["Hypotension"][d.key]
	},180,220)
	createRowChart("Change in Mental Status",cf,function(d){
		return R["Change in Mental Status"].danScore[d.key]/R["Change in Mental Status"][d.key]
	},180,220)
	createRowChart("Acute respiratory failure",cf,function(d){
		return R["Acute respiratory failure"].danScore[d.key]/R["Acute respiratory failure"][d.key]
	},180,220)
	createRowChart("Concerned about the patient",cf,function(d){
		return R["Concerned about the patient"].danScore[d.key]/R["Concerned about the patient"][d.key]
	},180,220)
	createRowChart("Unit",cf,function(d){
		return R["Unit"].danScore[d.key]/R["Unit"][d.key]
	},300)
	
	createRowChart("Unit From:",cf,function(d){
		return R["Unit From:"].danScore[d.key]/R["Unit From:"][d.key]
	},300)
	createRowChart("Unit Transferred to",cf,function(d){
		return R["Unit Transferred to"].danScore[d.key]/R["Unit Transferred to"][d.key]
	},300)
	
	createRowChart("Primary Responder",cf,function(d){
		return R["Primary Responder"].danScore[d.key]/R["Primary Responder"][d.key]
	},300)

    createPieChart("Shift",cf,function(d){
		return R["Shift"].danScore[d.key]/R["Shift"][d.key]
	})
    createRowChart("dayOfWeek",cf,function(d){
		return R["dayOfWeek"].danScore[d.key]/R["dayOfWeek"][d.key]
	},300,300,function(day){
		// ordering days of the week
		switch(day.key){
			case "Sun":
				return 0
				break
			case "Mon":
				return 1
				break
			case "Tue":
				return 2
				break
			case "Wed":
				return 3
				break
			case "Thu":
				return 4
				break
			case "Fri":
				return 5
				break
			case "Sat":
				return 6
				break
		}
	})

	createRowChart("DischargeToLocation",cf,function(d){
		return R["DischargeToLocation"].danScore[d.key]/R["DischargeToLocation"][d.key]
	},300,300)

	createBarChart("lengthOfStay",cf,function(d){
		if(R.lengthOfStay.n[d.key]>0){
			return R.lengthOfStay.danScore[d.key]/R.lengthOfStay.n[d.key]
		}else{return 0}
	},2000,500)


	createAllPatients(cf,function(d){
		setTimeout(function(){
			//nurseInfo.createTable()
		},1000)
		return R["All"].danScore[d.key]/R["All"][d.key]
	})


    createNurseInfo_Date()
    createPatientsPerLengthOfStay(cf)

    dc.renderAll();
    $('.dc-chart g text').css('fill','black');
    $('#nurseInfoFun td').css({color:"blue"})
    //var C_Exp = dc.bubbleChart("#suffolkExpectedPqi");


    




}

//nurseInfo.indexMRN

nurseInfo.bench=function(){
    var ui = document.getElementById('nurseInfo')
    ui.innerHTML='<h2>Nursing Informatics Bench @ <a href="#"><img height=60 src="http://stonybrookmedicine.edu/sites/all/themes/SBMtemplate/images/SBMed-logo.png"></a></h2><p><i>Under development [<a href="https://github.com/SBU-BMI/NurseInfo" target=_blank>source</a>], by <a href="http://bmi.stonybrookmedicine.edu/people" target=_blank>Jonas Almeida</a> and <a href="https://www.linkedin.com/pub/william-dan-roberts-phd/12/738/11" target=_blank>Dan Roberts</a> at <a href="http://stonybrookmedicine.edu" target=_blank>Stony Brook University</a></p><div id="nurseInfoFun"></div><hr>'
    // http://www.youtube.com/yt/brand/media/image/YouTube-logo-full_color.png
    // add button to load text file
    var bt = document.createElement('input')
    bt.id="loadReportButton"
    bt.type="file"
    bt.textContent="Load Text Report"
    bt.className="btn btn-default btn-file"
    bt.style.color="blue"
    ui.appendChild(bt)
    bt.onchange=function(evt){
        var f = evt.target.files[0] // file selected
        console.log('parsing '+f.name)
        var reader = new FileReader()
        reader.onload=function(x){
            // remove existing table first, if it exists
            var tt = $('#nurseInfo > .table')
            tt.map(function(i){
                tt[i].parentElement.removeChild(tt[i])
            })
            // parse text
            var txt=x.target.result;
            nurseInfo.dt={arr:txt.split(/[\n\r]+/).map(function(r){return r.split(/\t/)})} // table array
            nurseInfo.dt.docs = openHealth.arr2docs(nurseInfo.dt.arr)
            nurseInfo.dt.docs=nurseInfo.dt.docs.map(function(d,i){
            	d.lengthOfStay=(new Date(d["Discharge Date"])-new Date(d["Admission Date"]))/(1000*3600*24)
            	d.lengthOfStayInt=(function(x){
            		var y = Math.floor(x+1)
            		if(isNaN(y)){return 0}
            		else{return y}
            	})(d.lengthOfStay)
            	d.danScore=(d["Hypotension"]=="TRUE")+(d["Change in Mental Status"]=="TRUE")+(d["Acute respiratory failure"]=="TRUE")+(d["Concerned about the patient"]=="TRUE")
            	d.All="TRUE"
            	var t = d["Time RRT Paged:"].split(':')
            	d["Time RRT Paged:"]=parseFloat(t[0])+parseFloat(t[1]/60)
            	d.i=i
            	d.Date=new Date(d["Date:"])
            	d.dayOfWeek=d.Date.toString().slice(0,3)
            	// privacy please !
            	if((function(x){
            		var y=true, xx=["Physician", "Nurse Practitioner", "Both", "No Documentation",""]
            		xx.forEach(function(xi){
            			if(x==xi){y=false}
            		})
            		return y
            	})(d["Primary Responder"])){
            		d["Primary Responder"]="id removed"
            	}
            	d["MRN"]=d.Encounter=d["Patient First Name"]=d["Patient Last Name"]='XXXXXXXX'
            	// end of provacy protection
            	return d
            	
            })
            nurseInfo.dt.tab=openHealth.docs2tab(nurseInfo.dt.docs)
            // add inpatient time
            nurseInfo.createTable=function(){
            	var tb = document.createElement('table')
            	tb.id="patientTableTb"
            	tb.innerHTML = jmat.table2html({columns:["#"].concat(nurseInfo.dt.arr[0]),rows:nurseInfo.dt.arr.slice(1,-1).map(function(a,i){return [i].concat(a)})})
            	tb.className="table table-striped"
            	ui.appendChild(tb)	
            }
            nurseInfo.fun(ui)
            
            //console.log(txt)
        }
        reader["readAsText"](f)

        //console.log(Date(),evt)
    }



}

nurseInfo.showHideTable=function(tb){
	if(tb){
		setTimeout(function(){ // with a little lag to stay out of graphic rendering
			$('tr',tb).map(function(i,tr){
				if(i>0){
					tr.hidden=!nurseInfo.dt.patientsSelected[i-2]
				}
			})	
		},1000)
	}
}
				

nurseInfo();
