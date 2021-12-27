import { addTaskInfoListeners, updateTaskListContainer } from "./utils.js";


// fetch user's search query
export const search = async (searchValue) => {

  const res = await fetch(`/search/${searchValue}`, {
    method: "GET"
  })

  const { results } = await res.json();
  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }


  const listName = `
  <h2 class="task-list-header">Search Results</h2>
  `
  await updateTaskListContainer(results, listName);

  await addTaskInfoListeners();
}
