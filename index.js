const updateButton = document.querySelector('#update-button');

// Register a click event on the update button
updateButton.addEventListener('click', () => {
  const data = document.querySelector('#json-input').value;
  const year = document.querySelector('#year-input').value;

  // Parse the data and validate
  if (Boolean(data) && Boolean(year)) {
    const json = JSON.parse(data);

    const relevant = json
      // Filter the data based on year
      .filter(item => item.birthday.split('/')[2] === year)
      // Convert the date strings to date objects
      .map(item => {
        item.birthday = new Date(item.birthday);
        return item;
      });

    // Get groups of days
    const groups = getDayGroups(relevant);

    // Render the results
    render(groups);
  }
});

/**
 * Groups the collection of members by their birth-days. Also sorts each collection by the
 * birthday. Returns a key-value object, whose key is birth-day and value is an array of
 * members.
 * @param {*} data The collection of members
 */
function getDayGroups(data) {
  // Create groups of birth-days
  const dayGroup = data.reduce((memo, item) => {
    const day = item.birthday.getDay();

    if (!memo[day]) {
      memo[day] = [];
    }

    memo[day].push(item);
    return memo;
  }, {});

  // Sort each group based on birthdays
  for (day in dayGroup) {
    dayGroup[day] = dayGroup[day].sort((a, b) => a.birthday.getTime() - b.birthday.getTime());
  }

  return dayGroup;
}

/**
 * Renders the grouped collection of members on the UI. It internally prepares the HTML
 * by calculating the number of rows required.
 * @param {*} groups The grouped collection of members.
 */
function render(groups) {
  // Clear out current data in HTML
  clearOldData();

  for (day in groups) {
    const birthdays = groups[day];

    // Calculate the least scale required for the grid
    const scale = getMatrixScale(birthdays.length);

    // It will hold the HTML
    let html = [`<div class="members-row">`];

    for (let i = 0; i < scale * scale; i++) {
      if (i > birthdays.length - 1) {
        html.push(`<div class="member empty"></div>`);
      } else {
        html.push(
          `<div class="member" style="background-color: ${getRandomRolor()}">
          ${getInitials(birthdays[i].name)}
          </div>`
        );
      }

      if ((i + 1) % scale === 0 && (i + 1) < scale * scale) {
        html.push(`</div><div class="members-row">`);
      }
    }

    html.push(`</div>`);

    // Assign the HTML to the UI
    document.querySelector(`.weekday.weekday-${day} .members`).innerHTML = html.join('');
  }
}

/**
 * Utility function to clear the old HTML of members
 */
function clearOldData() {
  for (let i = 0; i < 7; i++) {
    document.querySelector(`.weekday.weekday-${i} .members`).innerHTML = '';
  }
}

/**
 * Returns the least scale of the matrix, which can contain `length` elements.
 * @param {*} length The number of elements to contain.
 */
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

/**
 * Returns the initials of a name. Requires that first name and last name to be
 * concatenated by a single space.
 * @param {*} name The name from which the initials are drawn
 */
function getInitials(name) {
  return name.split(' ').map(item => item[0]).join('');
}

/**
 * Generates a random hash for a dark-color.
 */
function getRandomRolor() {
  var letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10)];
  }

  return color;
}
