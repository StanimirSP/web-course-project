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
    document.getElementById('schedule-creation-form').appendChild(el);
}

function addSuccessLabel(content) {
    var el = document.createElement('label');
    el.id = 'success';
    el.innerHTML = content;
    document.getElementById('schedule-creation-form').appendChild(el);
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

function createSchedule() {
    var scheduleData = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        schedule_start: document.getElementById('schedule-start').value,
        schedule_end: document.getElementById('schedule-end').value,
        schedule_step: document.getElementById('schedule-step').value
    };
    fetch("./php/ScheduleRequestHandler.php", {
        method: 'POST',
        body: JSON.stringify(scheduleData)
    }).then(response => response.json())
        .then(r => {
            if (r['success']) {
                addSuccessLabel(`График (ID: ${r['inserted_id']}) е създаден успешно`);
			}
            else
                addErrorLabel('schedule-creation-failed', `Неуспешно създаване на график: ${r['msg']}`);
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

function checkAll(event) {
    RemoveCurrentLabels();
    var allCorrect = checkField('title', '^.{1,255}$', 'Невалидно заглавие')&
		checkField('schedule-step', '^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$', 'Невалиден интервал');
    if (allCorrect)
        createSchedule();
    event.preventDefault();
}

document.getElementById('create-schedule-btn').addEventListener('click', checkAll);
