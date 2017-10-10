const updateButton = document.querySelector('#update-button');

updateButton.addEventListener('click', () => {
  const data = document.querySelector('#json-input').value;
  const year = document.querySelector('#year-input').value;

  if (Boolean(data) && Boolean(year)) {
    const json = JSON.parse(data);
    const relevant = json
      .filter(item => item.birthday.split('/')[2] === year)
      .map(item => {
        item.birthday = new Date(item.birthday);
        return item;
      });
  }
});