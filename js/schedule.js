function addErrorLabel(id, content) {
    var el = document.createElement('label');
    el.id = id;
    el.classList.add('error');
    el.innerHTML = content;
    document.getElementsByClassName('inputForm')[0].appendChild(el);
}

function RemoveCurrentLabels() {
    var errorLabels = document.querySelectorAll('.error');
    for (var i = 0; i < errorLabels.length; i++)
        errorLabels[i].remove();
    var successLabel = document.querySelector('#success');
    if (successLabel != null) successLabel.remove();
}

function addSuccessLabel(content) {
    var el = document.createElement('label');
    el.id = 'success';
    el.innerHTML = content;
    document.getElementById('schedule-record').appendChild(el);
}

function checkField(fieldId, regexStr, errorMsg) {
    var x = document.getElementById(fieldId);
    const regex = new RegExp(regexStr);
    if (!regex.test(x.value)) {
        if (document.getElementById('error-' + fieldId) == null)
            addErrorLabel('error-' + fieldId, errorMsg);
        return false;
    }
    return true;
}

function checkAll() {
	RemoveCurrentLabels();
    var allCorrect = (checkField('titleInput', '^[^,]{1,255}$', 'Използвайте от 1 до 255 символа, не се допуска символа \',\'') &&
		checkField('keywordsInput', '^[^,]{1,255}$', 'Използвайте от 1 до 255 символа, не се допуска символа \',\'')) &
		checkField('gradeInput', '^(([2-5]([.][0-9]*)?)|(6([.]0*)?))?$', 'Оценката трябва да е число от 2 до 6 (десетичен разделител \'.\')');
    return allCorrect;
}

function addNewRecord(slotNumber) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var recordData = {
        schedule_id: urlParams.get('schedule_id'),
        slot_number: slotNumber,
        presentation_title: document.getElementById('titleInput').value,
        keywords: document.getElementById('keywordsInput').value
    };
    fetch("./php/ScheduleRecordRequestHandler.php", {
        method: 'POST',
        body: JSON.stringify(recordData)
    }).then(response => response.json())
        .then(r => {
            if (!r['success'])
                addErrorLabel('', `Неуспешно записване: ${r['msg']}`);
        });
}

function changeRecord(slotNumber) {
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var recordData = {
        schedule_id: urlParams.get('schedule_id'),
        slot_number: slotNumber,
        presentation_title: document.getElementById('titleInput').value,
        keywords: document.getElementById('keywordsInput').value,
		grade: document.getElementById('gradeInput').value != ''? document.getElementById('gradeInput').value: null
    };
    fetch("./php/ScheduleRecordRequestHandler.php", {
        method: 'PUT',
        body: JSON.stringify(recordData)
    }).then(response => response.json())
        .then(r => {
            if (!r['success'])
                addErrorLabel('', `Неуспешна промяна: ${r['msg']}`);
        });
}

function deleteRecord(slotNumber) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
    var recordData = {
        schedule_id: urlParams.get('schedule_id'),
        slot_number: slotNumber
    };
    fetch("./php/ScheduleRecordRequestHandler.php", {
        method: 'DELETE',
        body: JSON.stringify(recordData)
    }).then(response => response.json())
        .then(r => {
            if (!r['success'])
			    addErrorLabel('', `Изтриването не е успешно: ${r['msg']}`);
        });
}

function exit() {
    fetch("./php/Session.php", {
        method: 'DELETE'
    }).then(response => response.json())
        .then(async (r) => {
            window.location.href = "./index.html";
    }); 
}
	
function RemoveCurrentForms() {
    var inputForms = document.querySelectorAll('.inputForm');
    for (var i = 0; i < inputForms.length; i++)
        inputForms[i].remove();
    //var successLabel = document.querySelector('#success');
    //if (successLabel != null) successLabel.remove();
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
    var currentUserType = await getCurrentUser('type');
    if(currentUserType == 'ADMIN')
		return true;
	return false;
        //document.getElementById('create-schedule-btn').style = "";
	//html style="display:none";		
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

async function newInputForm(){
	RemoveCurrentForms();
	var newForm = document.createElement("form");
	newForm.id = "form" + this.id;
	newForm.className += "inputForm";
	newForm.style = "display: none";
	insertAfter(document.getElementById("schedule-record-table"), newForm);
	var tableRecords = document.getElementById(this.id);
	
	var table = document.getElementById("schedule-record-table");
		for (var i = 0, row; row = table.rows[i]; i++) {
			row.style.backgroundColor = "#ffffff";
		}
	tableRecords.style.backgroundColor = "#6083a3";
	
	var newTitle = document.createElement("input");
	newTitle.id = "titleInput";
	newTitle.placeholder = "Тема";
	newTitle.type = "text";
	newTitle.style.color = "#172f45";
	newTitle.style.backgroundColor = "#ffffff";
	newTitle.style.border = "1px solid #172f45";
	newTitle.style.width = "300px";
	newTitle.style.height = "30px";
	newTitle.style.margin = "10px";
	newTitle.value = tableRecords.getElementsByTagName('td')[3].innerHTML;
	document.getElementById(newForm.id).appendChild(newTitle);
	
	var newKeywords = document.createElement("input");
	newKeywords.id = "keywordsInput";
	newKeywords.placeholder = "Ключови думи";
	newKeywords.value = tableRecords.getElementsByTagName('td')[4].innerHTML;
	newKeywords.type = "text";
	newKeywords.style.color = "#172f45";
	newKeywords.style.backgroundColor = "#ffffff";
	newKeywords.style.border = "1px solid #172f45";
	newKeywords.style.width = "300px";
	newKeywords.style.height = "30px";
	newKeywords.style.margin = "10px";
	document.getElementById(newForm.id).appendChild(newKeywords);
	
	var newGrade = document.createElement("input");
	newGrade.id = "gradeInput";
	newGrade.placeholder = "Оценка";
	newGrade.value = tableRecords.getElementsByTagName('td')[5].innerHTML;
	newGrade.type = "text";
	newGrade.style.color = "#172f45";
	newGrade.style.backgroundColor = "#ffffff";
	newGrade.style.border = "1px solid #172f45";
	newGrade.style.width = "100px";
	newGrade.style.height = "30px";
	newGrade.style.margin = "10px";
	var is_admin = await showAdminFeatures();
	if(!is_admin || tableRecords.getElementsByTagName('td')[2].innerHTML == "")
		newGrade.style = "display: none";
	document.getElementById(newForm.id).appendChild(newGrade);
	
	var submitBtn = document.createElement("button");
	submitBtn.id = "save-btn" + this.id;
	submitBtn.innerHTML = "Запази";
	submitBtn.style.color = "#ffffff";
	submitBtn.style.backgroundColor = "#172f45";
	submitBtn.style.border = "1px solid #ffffff";
	submitBtn.style.width = "100px";
	submitBtn.style.height = "35px";
	submitBtn.style.margin = "10px";
	submitBtn.onclick = function(event){
		if(checkAll()){
			if(tableRecords.getElementsByTagName('td')[2].innerHTML == "") 
				addNewRecord(this.id.substr("save-btn".length));
			else
				changeRecord(this.id.substr("save-btn".length));
			location.reload();
		}
		event.preventDefault();
	};
	document.getElementById(newForm.id).appendChild(submitBtn);
	
	var deleteBtn = document.createElement("button");
	deleteBtn.id = "del-btn" + this.id;
	deleteBtn.innerHTML = "Изтрий запис";
	deleteBtn.style.color = "#ffffff";
	deleteBtn.style.backgroundColor = "#172f45";
	deleteBtn.style.border = "1px solid #ffffff";
	deleteBtn.style.width = "100px";
	deleteBtn.style.height = "35px";
	deleteBtn.style.margin = "10px";
	deleteBtn.onclick = function(event){
		deleteRecord(this.id.substr("del-btn".length));
		location.reload();
		event.preventDefault();
	};
	document.getElementById(newForm.id).appendChild(deleteBtn);
	
	var isActive;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var schedule_id = urlParams.get('schedule_id');
	await fetch("./php/ScheduleRequestHandler.php?id=" + schedule_id, {
        method: 'GET'
    }).then(response => response.json())
        .then(r => {
            if (r['success'] != null && !r['success'])
                addErrorLabel('error', `${r['msg']}`);
            else {
				isActive = r['is_active'];
            }
     });
    var presenter_username = tableRecords.getElementsByTagName('td')[2].innerHTML;
	if ((presenter_username == "" && isActive=="1") || is_admin )
		newForm.style = "display:";
	else{
		var presenter_id;
		await fetch("./php/UserRequestHandler.php?by_what=username&what=id&value=" + presenter_username, {
				method: 'GET'        
		}).then(response => response.json())
			.then(r => { 
				console.log(r);
				if (r['success'])
					presenter_id = r['value'];
				else
					presenter_id = -1;
		});
		var currentUserId = await getCurrentUser('id');
		if(currentUserId == presenter_id && isActive=="1")
			newForm.style = "display:";
	}	
}

async function getRecord() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var schedule_id = urlParams.get('schedule_id');
	
	var start_time, end_time, step;
	await fetch("./php/ScheduleRequestHandler.php?id=" + schedule_id, {
        method: 'GET'
    }).then(response => response.json())
        .then(r => {
            if (r['success'] != null && !r['success'])
                addErrorLabel('error', `${r['msg']}`);
            else {
                start_time = r['schedule_start'];
				end_time = r['schedule_end'];
				step = r['schedule_step'];
            }
        });
	
    await fetch("./php/ScheduleRecordRequestHandler.php?schedule_id=" + schedule_id, {
        method: 'GET'
    }).then(response => response.json())
        .then(async (r) => {
            if (r['success'] != null && !r['success'])
                addErrorLabel('error', `${r['msg']}`);
            else {
				let cnt = i = 0;
                for (; i < Object.keys(r).length; i++) {
					for(; cnt < r[i]['slot_number']; cnt++){
						var tbodyRef = document.getElementById('schedule-record-table').getElementsByTagName('tbody')[0];
						var newRow = tbodyRef.insertRow();
						newRow.id = cnt;
						newRow.addEventListener("click",newInputForm);
						insertCell(newRow, cnt + 1);
						var startTime = convertStartTime(start_time, cnt, step);
						var endTime = convertEndTime(startTime, step);
						insertCell(newRow, startTime.substr(0, 5) + " - " + endTime.substr(0, 5));
						insertCell(newRow, "");
						insertCell(newRow, "");
						insertCell(newRow, "");
						insertCell(newRow, "");
					}
					
					var tbodyRef = document.getElementById('schedule-record-table').getElementsByTagName('tbody')[0];
                    var newRow = tbodyRef.insertRow();
					newRow.id = cnt;
					newRow.addEventListener("click",newInputForm);
					insertCell(newRow, cnt + 1);
					var newStartTime = convertStartTime(start_time, r[i]['slot_number'], step);
					var newEndTime = convertEndTime(newStartTime, step);
                    insertCell(newRow, newStartTime.substr(0, 5) + " - " + newEndTime.substr(0, 5));
					var presenter = r[i]['presenter_id'];
					var presenter_fn = "";
					var is_admin = await showAdminFeatures();
					if(is_admin){
						await fetch("./php/UserRequestHandler.php?by_what=id&what=faculty_number&value=" + presenter, {
							method: 'GET'
						}).then(response => response.json())
							.then(r => {
								if (r['success'])
									presenter_fn = r['value'];
							});
					}
					await fetch("./php/UserRequestHandler.php?by_what=id&what=username&value=" + presenter, {
                        method: 'GET'
                    }).then(response => response.json())
                        .then(r => {
                            if (r['success'])
                                insertCell(newRow, r['value'] + (presenter_fn==""? "": " (" + presenter_fn + ")"));
                            else
                                insertCell(newRow, `Username not found; ID: ${presenter}`);
                        });
					insertCell(newRow, r[i]['presentation_title']);
                    insertCell(newRow, r[i]['keywords']);
                    if(r[i]['grade'] != null)
						insertCell(newRow, r[i]['grade']);
					else
						insertCell(newRow, '');
					cnt++;
                }
				var maxTime = maxSlotNumber(start_time, end_time, step);
				for(; cnt < maxTime; cnt++){
					var tbodyRef = document.getElementById('schedule-record-table').getElementsByTagName('tbody')[0];
					var newRow = tbodyRef.insertRow();
					newRow.id = cnt;
					newRow.addEventListener("click",newInputForm);
					insertCell(newRow, cnt + 1);
					var startTime = convertStartTime(start_time, cnt, step);
					var endTime = convertEndTime(startTime, step);
					insertCell(newRow, startTime.substr(0, 5) + " - " + endTime.substr(0, 5));
					insertCell(newRow, "");
					insertCell(newRow, "");
					insertCell(newRow, "");
					insertCell(newRow, "");
				}
            }
        });
}

function maxSlotNumber(start, end, step){
	var first = start.split(":");
	var minutes1 = (+first[0]) * 60 + (+first[1]); 
	var second = end.split(":");
	var minutes2 = (+second[0]) * 60 + (+second[1]);
	var third = step.split(":");
	var minutes3 = (+third[0]) * 60 + (+third[1]);
	var date = new Date(1970,0,1);
	return Math.floor((minutes2 - minutes1) / minutes3);	 
}

function convertEndTime(start, step){
	var first = start.split(":");
	var minutes1 = (+first[0]) * 60 + (+first[1]); 
	var second = step.split(":");
	var minutes2 = (+second[0]) * 60 + (+second[1]);
	var date = new Date(1970,0,1);
	date.setMinutes(minutes1 + minutes2);
	return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");	
}

function convertStartTime(start, slot_number, step){
	var first = start.split(":");
	var minutes1 = (+first[0]) * 60 + (+first[1]); 
	var second = step.split(":");
	var minutes2 = (+second[0]) * 60 + (+second[1]);
	var date = new Date(1970,0,1);
	date.setMinutes(minutes1 + minutes2 * slot_number);
	return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");	
}

function insertCell(row, value) {
    var newCell = row.insertCell();
    newCell.appendChild(document.createTextNode(value));
}

async function exportPdf(){
    await domtoimage.toPng(document.getElementById('schedule-record-table'))
        .then(function (blob) {
            var pdf = new jsPDF('0', 'pt', [$('#schedule-record-table').width(), $('#schedule-record-table').height()]);
            pdf.addImage(blob, 'PNG', 0, 0, $('#schedule-record-table').width(), $('#schedule-record-table').height());
            pdf.save("test.pdf");
        });
}

async function export_csv()
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var schedule_id = urlParams.get('schedule_id');
	
	var title, date, start_time, end_time, step, is_active;
	await fetch("./php/ScheduleRequestHandler.php?id=" + schedule_id, {
        method: 'GET'
    }).then(response => response.json())
        .then(r => {
            if (r['success'] != null && !r['success'])
                addErrorLabel('error', `${r['msg']}`);
            else {
				title = r['title'];
				date = r['date'];
                start_time = r['schedule_start'];
				end_time = r['schedule_end'];
				step = r['schedule_step'];
				is_active = r['is_active'];
            }
        });
	var csvContent = "data:text/csv;charset=utf-8,";
	csvContent += title + ',' +
				  date + ',' +
				  start_time.substr(0, 5) + ',' +
				  end_time.substr(0, 5) + ',' +
				  step.substr(0, 5) + ',' +
				  is_active + '\n';
	await fetch("./php/ScheduleRecordRequestHandler.php?schedule_id=" + schedule_id, {
        method: 'GET'
    }).then(response => response.json())
        .then(async (r) => {
            if (r['success'] != null && !r['success'])
                addErrorLabel('error', `${r['msg']}`);
            else {
				let cnt = i = 0;
                for (; i < Object.keys(r).length; i++) {
					for(; cnt < r[i]['slot_number']; cnt++){
						var startTime = convertStartTime(start_time, cnt, step);
						var endTime = convertEndTime(startTime, step);
						csvContent += (cnt+1) + ',' + startTime.substr(0, 5) + " - " + endTime.substr(0, 5) + ',,,,\n';
					}
					var startTime = convertStartTime(start_time, r[i]['slot_number'], step);
					var endTime = convertEndTime(startTime, step);
					csvContent += (cnt+1) + ',' +
								  startTime.substr(0, 5) + " - " + endTime.substr(0, 5) + ',' + 
								  r[i]['presenter_id'] + ',' +
								  r[i]['presentation_title'] + ',' +
								  r[i]['keywords'] + ',' +
								  (r[i]['grade'] ?? '') + '\n';
					cnt++;
                }
				var maxTime = maxSlotNumber(start_time, end_time, step);
				for(; cnt < maxTime; cnt++){
					var startTime = convertStartTime(start_time, cnt, step);
					var endTime = convertEndTime(startTime, step);

					csvContent += (cnt+1) + ',' + startTime.substr(0, 5) + " - " + endTime.substr(0, 5) + ',,,,\n';
				}
            }
        });
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", 'schedule' + schedule_id + '.csv');
	document.body.appendChild(link);
	link.click();
}

window.addEventListener('load', getRecord);