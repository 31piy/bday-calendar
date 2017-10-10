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

    const groups = getDayGroups(relevant);
    render(groups);
  }
});

function getDayGroups(data) {
  const dayGroup = data.reduce((memo, item) => {
    const day = item.birthday.getDay();

    if (!memo[day]) {
      memo[day] = [];
    }

    memo[day].push(item);
    return memo;
  }, {});

  for (day in dayGroup) {
    dayGroup[day] = dayGroup[day].sort((a, b) => a.birthday.getTime() - b.birthday.getTime());
  }

  return dayGroup;
}

function render(groups) {
  clearOldData();

  for (day in groups) {
    const birthdays = groups[day];
    const scale = getMatrixScale(birthdays.length);
    let html = [];
    console.log(birthdays);

    for (let i = 0; i < scale; i++) {
      html.push(`<div class="members-row">`);

      for (let j = 0; j < scale; j++) {
        const member = birthdays[i + j];

        if (!member) {
          html.push(`<div class="member empty"></div>`);
        } else {
          html.push(`<div class="member" style="background-color: ${getRandomRolor()};">${getInitials(member.name)}</div>`)
        }
      }

      html.push(`</div>`);
    }

    document.querySelector(`.weekday.weekday-${day} .members`).innerHTML = html.join('');
  }
}

function clearOldData() {
  for (let i = 0; i < 7; i++) {
    document.querySelector(`.weekday.weekday-${i} .members`).innerHTML = '';
  }
}

function getMatrixScale(length) {
  if (length === 1) {
    return 1;
  }

  let i = 2;

  while (length > i * i) {
    i++;
  }

  return i;
}

function getInitials(name) {
  return name.split(' ').map(item => item[0]).join('');
}

function getRandomRolor() {
  var letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 10)];
  }

  return color;
}