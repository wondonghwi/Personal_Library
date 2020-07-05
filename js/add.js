const getToken = () => {
  return localStorage.getItem('token')
};

const getUserByToken = async (token) => {
  try {
    const res = await axios.get('https://api.marktube.tv/v1/me', {
      headers: {Authorization: `Bearer ${token}`} //get이지만 서버와의 약속
    });
    return res.data;
  } catch (e) {
    console.log('getUserByToken error', error);
    return null;
  }
};

const save = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('save');

  e.target.classList.add('was-validated'); //bootStrap 기능 유효성검사

  const titleElement = document.querySelector('#title');
  const messageElement = document.querySelector('#message');
  const authorElement = document.querySelector('#author');
  const urlElement = document.querySelector('#url');

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  if (title === '' || message === '' || author === '' || url === '') {
    return;
  }

  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  try {
    await axios.post('https://api.marktube.tv/v1/book', {
        title,
        message,
        author,
        url,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    location.assign('/');
  } catch (error) {
    console.log('save error', error);
    alert('책 추가 실패');
  }
};

const bindSaveButton = () => {
  const form = document.querySelector('#form-add-book');
  form.addEventListener('submit', save);
};

const main = async () => {
  //버튼에 이벤트 연결
  bindSaveButton();

  //토큰 체크
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  //토큰으로 서버에서 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/login');
    return;
  }
  console.log(user);
};

document.addEventListener('DOMContentLoaded', main);