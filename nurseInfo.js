console.log('nurseInfo.js loaded')

nurseInfo=function(){
    nurseInfo.bench();
}


nurseInfo.bench=function(){
    var ui = document.getElementById('nurseInfo')
    ui.innerHTML='<h2>Nursing Informatics Bench</h2><p><i>Under development [<a href="https://github.com/SBU-BMI/NurseInfo" target=_blank>source</a>], by <a href="http://bmi.stonybrookmedicine.edu/people" target=_blank>Jonas Almeida</a> and <a href="https://www.linkedin.com/pub/william-dan-roberts-phd/12/738/11" target=_blank>William Roberts</a> at <a href="http://stonybrookmedicine.edu" target=_blank>Stony Brook University</a></p>'
    console.log(':-)')
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
            var a = txt.split(/[\n\r]/).map(function(r){return r.split(/\t/)}) // table array
            var tb = document.createElement('table')
            tb.innerHTML = jmat.table2html({columns:a[0],rows:a.slice(1,-1)})
            tb.className="table table-striped"
            ui.appendChild(tb)
            4

            //console.log(txt)
        }
        reader["readAsText"](f)

        //console.log(Date(),evt)
    }

}


nurseInfo();