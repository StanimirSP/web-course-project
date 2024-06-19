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
    document.getElementById('registration-form').appendChild(el);
}

function addSuccessLabel(content) {
    var el = document.createElement('label');
    el.id = 'success';
    el.innerHTML = content;
    document.getElementById('registration-form').appendChild(el);
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

function checkIfAlreadyExists() {
    var userData = {
        faculty_number: document.getElementById('facNum').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    fetch("./php/UserRequestHandler.php", {
        method: 'POST',
        body: JSON.stringify(userData)
    }).then(response => response.json())
        .then(r => {
            if (r['success'])
                addSuccessLabel('Успешна регистрация');
            else
                addErrorLabel('user-already-exists', `Вече съществува такъв потребител: ${r['msg']}`);
        });
}

function checkAll(event) {
    RemoveCurrentLabels();
    var allCorrect = checkField('facNum', '^[0-9]{5}$', 'Невалиден факултетен номер, използвайте 5-6 цифри') &
        checkField('username', '^.{3,16}$', 'Невалидно потребителско име, използвайте 3-16 знака') &
        checkField('email', '^[^@]+@[^@]+[.][^@]+$', 'Невалиден e-mail') &
		checkField('email', '^.{0,64}$', 'Невалиден e-mail') &
        checkField('password', '^.{6,32}$', 'Невалидна парола,  използвайте 6-32 знака в комбинация с главна, малка буква и цифри') &
        checkField('password', '[a-z]', 'Невалидна парола, използвайте 6-32 знака в комбинация с главна, малка буква и цифри') &
        checkField('password', '[A-Z]', 'Невалидна парола, използвайте 6-32 6 знака в комбинация с главна, малка буква и цифри') &
        checkField('password', '[0-9]', 'Невалидна парола, използвайте 6-32 6 знака в комбинация с главна, малка буква и цифри');
    if (allCorrect)
        checkIfAlreadyExists();
    event.preventDefault();
}

document.getElementById('register-btn').addEventListener('click', checkAll);
