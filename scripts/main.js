const { log, table } = console;

// serealize form
const myForm = document.forms['myForm'];

function serialize(form) {
  // get most things
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Get full values for checkboxes & multi-selects
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const fullData = formData.getAll(key);
      if (fullData.length > 1) {
        data[key] = fullData;
      }
    }
  }

  return data;
}

myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const data = serialize(myForm);
  log('data', data);

  const city = document.forms['city'];
  const country = document.forms['country'];

  let cityData = data.city;
  let countryData = data.country;

  const mountNode = document.getElementById('mount');
  log(mountNode);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityData},${countryData}&units=metric&APPID=128944992833eb85f19eeebe5415027c`
  )
    .then((response) => response.json())
    .then((data) => {
      table(data);
      renderWeather(data);
    });

  function renderWeather(data = {}, targetEl = mountNode) {
    const list = document.createElement('ul');
    const li = document.createElement('li');
    li.innerHTML = `
<div class="mount">
<h2>Location: ${data.name}, ${data.sys.country}</h2>
<p>Feels Like: ${data.main.feels_like}c</p>
<p>Humidity: ${data.main.humidity}</p>
<p>Pressure: ${data.main.pressure}</p>
<p>Temp: ${data.main.temp}c</p>
<p>Temp Max: ${data.main.temp_max}c</p>
<p>Temp Min: ${data.main.temp_min}c</p>
</div>
`;
    list.append(li);
    targetEl.innerHTML = '';
    targetEl.append(list);
  }
  e.currentTarget.reset();
});
