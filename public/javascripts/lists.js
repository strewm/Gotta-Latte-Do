

const fetchLists = async () => {
  const res = await fetch('/lists');

  if (res.status === 401) {
    window.location.href = '/log-in';
    return
  }

  const { lists } = await res.json();
  console.log(lists);
  document.addEventListener('click', (e) => {
    const listContainer = document.querySelector('.tanner')
    const listHTML = lists.map(({ id, title }) => {
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
