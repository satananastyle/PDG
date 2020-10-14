const ESC_CODE = 27;
const TIME_OF_ANSWER = 10000;
const STATUS_OK = 200;

const loginBtn = document.querySelector('.main__wrapper .login-btn');
const modal = document.querySelector('.modal');
const modalForm = modal.querySelector('form');
const URL_UPLOAD = modalForm.action;

const closeBtn = modal.querySelector('.modal__close-btn');
const emailInput = modal.querySelector('input[type="email"]');
const passwordInput = modal.querySelector('input[type="password"]');
const submitBtn = modal.querySelector('button[type="submit"]');
const inputs = modal.querySelectorAll('input');
const errorMessage = modal.querySelector('.error');


const openModal = () => {
    modal.classList.remove('modal--hidden');

    modal.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onModalEscPress);
    closeBtn.addEventListener('click', onCloseBtnClick);
    submitBtn.addEventListener('click', onSubmitBtn);

    inputs.forEach(function (element) {
        element.oninput = function () {
            element.parentElement.classList.remove('modal__input--error');
        };
    });
}

const closeModal = () => {
    modalForm.reset();
    inputs.forEach(function (element) {
        element.parentElement.classList.remove('modal__input--error');
    });

    modal.classList.add('modal--hidden');
    errorMessage.removeAttribute('style');

    modal.removeEventListener('click', onOverlay);
    document.removeEventListener('keydown', onModalEscPress);
    closeBtn.removeEventListener('click', onCloseBtnClick);
}

const onModalEscPress = (evt) => {
    if (evt.keyCode === ESC_CODE) {
        closeModal();
    }
}

const onOverlay = (evt) => {
    if (evt.target === modal) {
        closeModal();
    }
}

const onLoginBtnClick = (evt) => {
    evt.preventDefault();
    openModal();
}

const onCloseBtnClick = (evt) => {
    evt.preventDefault();
    closeModal();
}

const upload = (data, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
        if (xhr.status === STATUS_OK) {
            const response = xhr.response;
            if (!response.err) {
                document.location.href = response.url;
                errorMessage.removeAttribute('style');
            } else {
                errorMessage.style.display = 'block';
                errorMessage.textContent = response.msg;
            }
        } else {
            onError;
        }
    });

    xhr.addEventListener('error', onError);
    xhr.addEventListener('timeout', onError);

    xhr.open('POST', URL_UPLOAD);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(data);
};

const createErrorMessage = () => {
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Не удалось установить связь с сервером';
};

const onSubmitBtn = (evt) => {
    evt.preventDefault();
    if (emailInput.value && emailInput.validity.valid && passwordInput.value) {
        upload(new FormData(modalForm), createErrorMessage);
    }

    if (!emailInput.value || !emailInput.validity.valid) {
        emailInput.parentElement.classList.add('modal__input--error');
    }

    if (!passwordInput.value) {
        passwordInput.parentElement.classList.add('modal__input--error');
    }

    return;
}

loginBtn.addEventListener('click', onLoginBtnClick);