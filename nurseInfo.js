console.log('nurseInfo.js loaded')

nurseInfo=function(){
    nurseInfo.bench();
}

nurseInfo.fun=function(ui){
    var divFun=document.getElementById('nurseInfoFun')
    divFun.innerHTML='<table><tr><td>Select parameter : <select id="selectParm"></select></td><td></td></tr><tr><td id="NurseInfo_Date"></td><td></td></tr><tr><td id="lengthOfStay"></td><td id=""></td></tr></table>'
    //divFun.innerHTML=+'Time<table><tr><td id="NurseInfo_Shift"></td><td></td><td></td></tr></table>'
    // Dimensional chartind
    var tableSeverity=document.createElement('table')
    tableSeverity.innerHTML='<tr><td>Severity:</td><td id="danScore">Score</td><td id="Stroke">Stroke</td><td id="Change_in_Mental_Status">Change_in_Mental_Status</td><td id="Acute_respiratory_failure">Acute respiratory failure</td><td id="Concerned_about_the_patient">Concerned about the patient</td><td>...</td></tr>'
    divFun.appendChild(tableSeverity)
    var tableTime=document.createElement('table')
    tableTime.innerHTML='<tr><td>Pace:</td><td id="Shift"></td><td id="dayOfWeek"></td><td>...</td></tr>'
    divFun.appendChild(tableTime)
    var tablePlace=document.createElement('table')
    tablePlace.innerHTML='<tr><td>Place:</td><td id="Unit">Unit</td><td id="Unit_From">Unit From</td><td id="Unit_Transferred_to">Unit Transferred to</td><td>...</td></tr>'
    divFun.appendChild(tablePlace)
    var tableWho=document.createElement('table')
    tableWho.innerHTML='<tr><td>Person:</td><td id="Primary_Responder">Primary Responder</td><td>...</td></tr>'
    divFun.appendChild(tableWho)
    C = {}, D={}, G={}, U={}, R={}
    var cf = crossfilter(nurseInfo.dt.docs)
    
	// Select Parameter
	var sel = document.getElementById("selectParm")
	var parms = Object.getOwnPropertyNames(nurseInfo.dt.tab).filter(function(p){
		return nurseInfo.dt.tab[p][0]=="TRUE"||nurseInfo.dt.tab[p][0]=="FALSE"
	})
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
		dc.renderAll()
	}



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
    	.width(1000)
    	.height(200)
    	.dimension(D["NurseInfo_Date"])
    	.group(G["NurseInfo_Date"])
    	.x(d3.time.scale())
    	.y(d3.scale.linear())//.domain([-0.1,1.1]))
    	.elasticY(true)
        .elasticX(true)
    	.keyAccessor(function (x){
    		//return 100*Math.random()
    		var d = nurseInfo.dt.docs[x.key]
    		return new Date(d['Date:']+' '+d["Time RRT Paged:"])
    	})
    	.valueAccessor(function (y){
    		var d = nurseInfo.dt.docs[y.key]
    		//console.log(d.lengthOfStay)
    		return d.lengthOfStay*(d[nurseInfo.dt.parmSelected]=="TRUE")
    	})
    	.radiusValueAccessor(function (r){
    		return 1
    	})
    	.title(function(d){
    		return JSON.stringify(nurseInfo.dt.docs[d.key],false,3)
    	})
    	//.onClick(function(){return true})
    

	var createPieChart=function(parm,cf){
		C[parm]=dc.pieChart('#'+parm)
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
		    	R[parm][v[parm]]+=1
		    	return R[parm][v[parm]]			
			},
			// reduce out
			function(p,v){
				R[parm][v[parm]]-=1
		    	return R[parm][v[parm]]
			},
			// ini
			function(){return 0}
    	)

    	C[parm]
    		.width(250)
			.height(220)
			.radius(100)
			.innerRadius(30)
			.dimension(D[parm])
			.group(G[parm])
			/*.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
			.colorAccessor(function(d, i){
				if(res.G_years_reduce[d.key].expt){return res.G_years_reduce[d.key].obs/res.G_years_reduce[d.key].expt}
				else {return 0}
        	})*/
			.title(function(d){return d[parm]});
	}

	var createRowChart=function(parm,cf,funColor){
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

    	C[parm]
    		.width(250)
			.height(220)
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
				.colors(d3.scale.linear().domain([0,1,2,3,4]).range(["green","orange","red","brown","black"]))
				.colorAccessor(funColor)
		}
	}



	//d.danScore=(d["Stroke"]=="TRUE")+(d["Change in Mental Status"]=="TRUE")+(d["Acute respiratory failure"]=="TRUE")+(d["Concerned about the patient"]=="TRUE")

	createRowChart("danScore",cf,function(d){
		return d.key
	})
	createRowChart("Stroke",cf,function(d){
		return R["Stroke"].danScore[d.key]/R["Stroke"][d.key]
	})
	createRowChart("Change in Mental Status",cf,function(d){
		return R["Change in Mental Status"].danScore[d.key]/R["Change in Mental Status"][d.key]
	})
	createRowChart("Acute respiratory failure",cf,function(d){
		return R["Acute respiratory failure"].danScore[d.key]/R["Acute respiratory failure"][d.key]
	})
	createRowChart("Concerned about the patient",cf,function(d){
		return R["Concerned about the patient"].danScore[d.key]/R["Concerned about the patient"][d.key]
	})
	createRowChart("Unit",cf)
	createRowChart("Unit From:",cf)
	createRowChart("Unit Transferred to",cf)
	createRowChart("Primary Responder",cf)

    createPieChart("Shift",cf)
    createRowChart("dayOfWeek",cf,function(d){
		return R["dayOfWeek"].danScore[d.key]/R["dayOfWeek"][d.key]
	})
    

    dc.renderAll();

    //var C_Exp = dc.bubbleChart("#suffolkExpectedPqi");


    




}

//nurseInfo.indexMRN

nurseInfo.bench=function(){
    var ui = document.getElementById('nurseInfo')
    ui.innerHTML='<h2>Nursing Informatics Bench (<a href="#"><img height=60 src="http://www.youtube.com/yt/brand/media/image/YouTube-logo-full_color.png"></a>)</h2><p><i>Under development [<a href="https://github.com/SBU-BMI/NurseInfo" target=_blank>source</a>], by <a href="http://bmi.stonybrookmedicine.edu/people" target=_blank>Jonas Almeida</a> and <a href="https://www.linkedin.com/pub/william-dan-roberts-phd/12/738/11" target=_blank>William Roberts</a> at <a href="http://stonybrookmedicine.edu" target=_blank>Stony Brook University</a></p><div id="nurseInfoFun"></div><hr>'
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
            nurseInfo.dt.docs=nurseInfo.dt.docs.map(function(d){
            	d.lengthOfStay=(new Date(d["Discharge Date"])-new Date(d["Admission Date"]))/(1000*3600*24)
            	d.danScore=(d["Stroke"]=="TRUE")+(d["Change in Mental Status"]=="TRUE")+(d["Acute respiratory failure"]=="TRUE")+(d["Concerned about the patient"]=="TRUE")
            	d.dayOfWeek=(new Date(d["Date:"])).toString().slice(0,3)
            	return d
            })
            // add inpatient time
            nurseInfo.dt.tab=openHealth.docs2tab(nurseInfo.dt.docs)
            var tb = document.createElement('table')
            tb.innerHTML = jmat.table2html({columns:nurseInfo.dt.arr[0],rows:nurseInfo.dt.arr.slice(1,-1)})
            tb.className="table table-striped"
            ui.appendChild(tb)
            nurseInfo.fun(ui)

            //console.log(txt)
        }
        reader["readAsText"](f)

        //console.log(Date(),evt)
    }



}


nurseInfo();