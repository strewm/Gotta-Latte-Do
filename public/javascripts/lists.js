import { handleErrors } from './utils';


const fetchLists = async () => {
  const res = await fetch('/lists');

  if (res.status === 401) {
    window.location.href = '/log-in';
    return
  }

  const { lists } = await res.json();
  console.log(lists);
  document.addEventListener('click', (e) => {
    const listContainer = document.querySelector('.')
    const listHTML = lists.map(({ id, title, taskList }) => {
      `<div class=${id}>
      <p class='list-p'${title}</p>
      </div>`
      listContainer.innerHTML = listHTML.join('');
      return listContainer;
    })
  })

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await fetchLists();
    } catch (e) {
      console.error(e);
    }
  })
}

const form = document.querySelector('.list-form');

form.addEventListener('submit', async(e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const title = formData.get(title);


  const body = { title };

  try {
    const res = await fetch('/lists')
  } catch (e) {
  }
  console.log(title);
})
