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
    document.getElementById('login-form').appendChild(el);
}

function addSuccessLabel(content) {
    var el = document.createElement('label');
    el.id = 'success';
    el.innerHTML = content;
    document.getElementById('login-form').appendChild(el);
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

function tryLogin() {
    var userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };
    fetch("./php/Session.php", {
        method: 'POST',
        body: JSON.stringify(userData)
    }).then(response => response.json())
        .then(r => {
            if (r['success']) {
                addSuccessLabel('Успешен вход');
                window.location.href = "./homepage.html";
            }
            else
                addErrorLabel('login-failed', `Неуспешен вход: ${r['msg']}`);
        });
}

function checkAll(event) {
    RemoveCurrentLabels();
    var allCorrect = checkField('username', '^.{3,16}$', 'Невалидно потребителско име') &
        checkField('password', '^.{6,32}$', 'Невалидна парола') &
        checkField('password', '[a-z]', 'Невалидна парола') &
        checkField('password', '[A-Z]', 'Невалидна парола') &
        checkField('password', '[0-9]', 'Невалидна парола');
    if (allCorrect)
        tryLogin();
    event.preventDefault();
}

document.getElementById('login-btn').addEventListener('click', checkAll);
