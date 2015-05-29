console.log('nurseInfo.js loaded')

nurseInfo=function(){
    nurseInfo.bench();
}

nurseInfo.fun=function(ui){
    var divFun=document.getElementById('nurseInfoFun')
    divFun.innerHTML='<table><tr><td>Select parameter : <select id="selectParm"></select></td><td></td></tr><tr><td id="NurseInfo_Date"></td><td id="NurseInfo_Shift"></td></tr></table>'
    // Dimensional chartind
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
		    p=v[nurseInfo.dt.parmSelected]=="TRUE"
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
    	.y(d3.scale.linear().domain([-0.1,1.1]))
    	.elasticY(false)
        .elasticX(true)
    	.keyAccessor(function (x){
    		//return 100*Math.random()
    		var d = nurseInfo.dt.docs[x.key]
    		return new Date(d['Date:']+' '+d["Time RRT Paged:"])
    	})
    	.valueAccessor(function (y){
    		var d = nurseInfo.dt.docs[y.key]
    		return d[nurseInfo.dt.parmSelected]=="TRUE"
    	})
    	.radiusValueAccessor(function (r){
    		return 1
    	})
    	.title(function(d){
    		return JSON.stringify(nurseInfo.dt.docs[d.key],false,3)
    	})
    	//.onClick(function(){return true})
    

	C["NurseInfo_Shift"]=dc.pieChart('#NurseInfo_Shift')
	D["NurseInfo_Shift"]=cf.dimension(function(d,i){
    	return d.Shift
        //return new Date(d['Date:']+' '+d["Time RRT Paged:"])
    })
    R["NurseInfo_Shift"]={}
    openHealth.unique(nurseInfo.dt.tab.Shift).map(function(p){
    	R["NurseInfo_Shift"][p]=0
    })
    
    G["NurseInfo_Shift"]=D["NurseInfo_Shift"].group().reduce(
        // reduce in
		function(p,v){
		    R["NurseInfo_Shift"][v.Shift]+=1
		    return R["NurseInfo_Shift"][v.Shift]			
		},
		// reduce out
		function(p,v){
			R["NurseInfo_Shift"][v.Shift]-=1
		    return R["NurseInfo_Shift"][v.Shift]
		},
		// ini
		function(){return 0}
    )

    C["NurseInfo_Shift"]
    	.width(250)
		.height(220)
		.radius(100)
		.innerRadius(30)
		.dimension(D["NurseInfo_Shift"])
		.group(G["NurseInfo_Shift"])
		/*.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
		.colorAccessor(function(d, i){
			if(res.G_years_reduce[d.key].expt){return res.G_years_reduce[d.key].obs/res.G_years_reduce[d.key].expt}
			else {return 0}
        })*/
		.title(function(d){return d.Shift});

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