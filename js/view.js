function RemoveCurrentLabels() {
    var errorLabels = document.querySelectorAll('.error');
    for (var i = 0; i < errorLabels.length; i++)
        errorLabels[i].remove();
    var successLabel = document.querySelector('#success');
    if (successLabel != null) successLabel.remove();
}

function addErrorLabel(id, content) {
    var el = document.createElement('label');
    el.id = id;
    el.classList.add('error');
    el.innerHTML = content;
    document.getElementById('homepage-main').appendChild(el);
}

function addSuccessLabel(content) {
    var el = document.createElement('label');
    el.id = 'success';
    el.innerHTML = content;
    document.getElementById('homepage-main').appendChild(el);
}

function getData() {
    fetch("./php/ScheduleRequestHandler.php", {
        method: 'GET'
    }).then(response => response.json())
        .then(async (r) => {
            if (r['success'] != null && !r['success'])
                addErrorLabel('error', `${r['msg']}`);
            else {
				
				var is_adm = await is_admin();
				if(is_adm){
                    var tr = document.getElementById('schedule-main-table').tHead.children[0],
                    th = document.createElement('th');
                    th.innerHTML = "Изтриване на график";
                    tr.appendChild(th);
					
					var tr = document.getElementById('schedule-main-table').tHead.children[0],
                    th = document.createElement('th');
                    th.innerHTML = "Активност";
                    tr.appendChild(th);
                }				
                for (let i = 0; i < Object.keys(r).length; i++) {
                    var tbodyRef = document.getElementById('schedule-main-table').getElementsByTagName('tbody')[0];
                    var newRow = tbodyRef.insertRow();
                    insertCell(newRow, r[i]['id']);
                    insertCell(newRow, r[i]['title']);
                    insertCell(newRow, r[i]['date']);
                    var id = r[i]['created_by'];
					

                    await fetch("./php/UserRequestHandler.php?by_what=id&what=username&value=" + id, {
                        method: 'GET'
                    }).then(response => response.json())
                        .then(r => {
                            if (r['success'])
                                insertCell(newRow, r['value']);
                            else
                                insertCell(newRow, `Username not found; ID: ${id}`);
                        });
						
					insertCell(newRow, r[i]['is_active'] == "1" ? "Да":"Не");
					
					let btn = document.createElement("button");
				    btn.innerHTML = "Преглед";
				    btn.className += 'btn-view';
					btn.onclick = function(){
						window.location.href = "./schedule.html?schedule_id=" + r[i]['id'];
					};
				    var newCell = newRow.insertCell();
				    newCell.appendChild(btn);
					if(is_adm){
                        let del_btn = document.createElement("button");
                        del_btn.innerHTML = "Изтриване";
                        del_btn.className += 'btn-del';
                        del_btn.onclick = function(event) {
							deleteData(r[i]['id']);
							location.reload();
							event.preventDefault();
						};
                        var newCell = newRow.insertCell();
                        newCell.appendChild(del_btn);
						
						let lock_btn = document.createElement("button");
                        if(r[i]['is_active'] == "1")
							lock_btn.innerHTML = "Заключване";
						else
							lock_btn.innerHTML = "Отключване";
						
                        lock_btn.className += 'btn-lock';
						lock_btn.id += 'btn-lock' + r[i]['id'];
                        lock_btn.onclick = function(event) {
							lockData(r[i]['id'],r[i]['is_active']);
							location.reload();
							event.preventDefault();
						};
						
                        var newCell = newRow.insertCell();
                        newCell.appendChild(lock_btn);
					}
                }
            }
        });
}

function insertCell(row, value) {
    var newCell = row.insertCell();
    newCell.appendChild(document.createTextNode(value));
}

function exit() {
    fetch("./php/Session.php", {
        method: 'DELETE'
    }).then(response => response.json())
        .then(async (r) => {
            window.location.href = "./index.html";
    }); 
}

async function getCurrentUser(what)
{
	var res = null;
	await fetch("./php/UserRequestHandler.php?by_what=current&what=" + what, {
		method: 'GET'
	}).then(response => response.json())
     	.then(r => {
			if(r['success']) res = r['value'];
	});
	return res;
}

async function showAdminFeatures()
{
	currentUserType = await getCurrentUser('type');
	if(currentUserType == 'ADMIN'){
		document.getElementById('create-schedule-btn').style = "display: block";
		document.getElementById('csv-import').style = "display: block";
	}
}

async function is_admin()
{
    var currentUserType = await getCurrentUser('type');
    if(currentUserType == 'ADMIN')
        return true;
    return false;                
}

async function lockData(scheduleId, isActive){
	
	var recordData = {
		schedule_id: scheduleId,
        is_active: isActive == "1" ? false : true
    };
	console.log(recordData);
	await fetch("./php/ScheduleRequestHandler.php", {
		method: 'PUT',
		body: JSON.stringify(recordData)
	}).then(response => response.json())
		.then(r => {
			if (!r['success'])
				addErrorLabel('', `Неуспешна промяна: ${r['msg']}`);
		});
}

function deleteData(schedule_id) {
	var schedule_data = {id: schedule_id};
    fetch("./php/ScheduleRequestHandler.php", {
        method: 'DELETE',
        body: JSON.stringify(schedule_data)
    }).then(response => response.json())
        .then(async (r) => {
            if (!r['success'])
                addErrorLabel('', `error: ${r['msg']}`);
        });
}

function import_helper()
{
	document.getElementById('csv-input').click();
}

async function parse_csv(csvContent)
{
	const SCHEDULE_FIELD_CNT = 6;
	const RECORD_FIELD_CNT = 6;
	var lines = csvContent.split(/\r\n|\n/);
	var data = lines[0].split(',');
	if(data.length != SCHEDULE_FIELD_CNT)
		return false;
	var sheduleInfo = [{
		title: data[0],
        date: data[1],
        schedule_start: data[2],
        schedule_end: data[3],
        schedule_step: data[4],
		is_active: data[5]
	}];
	console.log(sheduleInfo);
	for (var i=1; i<lines.length-1; i++)
	{
		console.log(i);
		data = lines[i].split(',');
		if(data.length != RECORD_FIELD_CNT)
			return false;
		if(data[3] == '')
			continue;
		sheduleInfo.push({
			slot_number: data[0]-1,
			presenter_id: data[2],
			presentation_title: data[3],
			keywords: data[4],
			grade: data[5] == ''? null: data[5]
		});
	}
	var success = true;
	await fetch("./php/ImportSchedule.php", {
		method: 'POST',
		body: JSON.stringify(sheduleInfo)
	}).then(response => response.json())
		.then(r => {
			if (!r['success'])
				success = false;
		});
	return success;
}

function import_csv()
{
	const selectedFile = document.getElementById('csv-input').files[0];
	if (selectedFile)
	{
		var reader = new FileReader();
		reader.readAsText(selectedFile, "UTF-8");
		reader.onload = async (evt) => {
			var f = await parse_csv(evt.target.result);
			if(f)
				location.reload();
			else
				addErrorLabel('', 'could not import schedule');
		}
		reader.onerror = function (evt) {
			addErrorLabel('', 'error reading file');
		}
    }
}


window.addEventListener('load', getData);
window.addEventListener('load', showAdminFeatures);
document.getElementById('csv-input').addEventListener('change', import_csv);