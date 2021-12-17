import { handleErrors, addTaskInfoListeners } from "./utils.js";
import { fetchTask, fetchComments, postComment } from "./task-comments.js";

// fetch user's tasks (all)

export const fetchTasks = async () => {
    const res = await fetch("/tasks")

    if (res.status === 401) {
        window.location.href = "/log-in";
        return;
      }

    const { tasks, user } = await res.json();

    const tasksListContainer = document.querySelector(".task-list");
    const listName = `
  <h2 class="task-list-header">All of <strong>${user.username}'s</strong> self-assigned tasks.</h2>
  `
    const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
      if (isCompleted === true) {
        return `
        <div class='task-info' id=${id}>
            <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
            <label for=${id} id=${id} class="task-check-box">${description}</label>
        </div>
        `
      } else {
      return `<div class='task-info' id=${id}>
                <input type="checkbox" class="task-check-box" id=${id} name=${id}>
                <label for=${id} id=${id} class="task-check-box">${description}</label>
            </div>
        `
    }
  })
  tasksListContainer.innerHTML = listName + tasksHtml.join("");
  await addTaskInfoListeners();
  }


// fetch assigned tasks

const fetchAssignTasks = async () => {
  const res = await fetch("/tasks/assigned")

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks } = await res.json();

  const assignedTaskContainer = document.querySelector(".assigned-list");
  if(tasks) {
    const listName = `
    <h2 class="task-list-header">All tasks assigned to <strong></strong> by others.</h2>
    `
    const tasksHtml = tasks.map(({ id, description, User }) => `
    <div class="assigned-grid">
    <div class="task-info" id=${id}>
        <input type="checkbox" class="task-check-box" id=${id} name=${id}>
        <label for=${id} id=${id} class="task-check-box">${description}</label>
    </div>
    <div>
      <strong>Assigned by: ${User.username}</strong>
    </div>
    </div>
    `)

    assignedTaskContainer.innerHTML = listName + tasksHtml.join("")

    await addTaskInfoListeners();
  }

}

// fetch user's tasks (all)

export const fetchIncompleteTasks = async () => {
  const res = await fetch("/tasks/incomplete")

  if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

  const { tasks, user } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
  <h2 class="task-list-header"><strong>${user.username}' s</strong> incomplete tasks.</h2>
  `
  const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
    if (isCompleted === true) {
      return `
      <div class='task-info' id=${id}>
          <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
          <label for=${id} id=${id} class="task-check-box">${description}</label>
      </div>
      `
    } else {
    return `<div class='task-info' id=${id}>
              <input type="checkbox" class="task-check-box" id=${id} name=${id}>
              <label for=${id} id=${id} class="task-check-box">${description}</label>
          </div>
      `
  }
})

  tasksListContainer.innerHTML = listName + tasksHtml.join("");

  await addTaskInfoListeners();
}

// fetch user's completed tasks

const fetchCompletedTasks = async () => {
  const res = await fetch("/tasks/complete")

  if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

  const { tasks, user } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
  <h2 class="task-list-header"><strong>${user.username}' s</strong> completed tasks.</h2>
  `
  const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
    if (isCompleted === true) {
      return `
      <div class='task-info' id=${id}>
          <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
          <label for=${id} id=${id} class="task-check-box">${description}</label>
      </div>
      `
    } else {
    return `<div class='task-info' id=${id}>
              <input type="checkbox" class="task-check-box" id=${id} name=${id}>
              <label for=${id} id=${id} class="task-check-box">${description}</label>
          </div>
      `
  }
})

  tasksListContainer.innerHTML = listName + tasksHtml.join("");

  await addTaskInfoListeners();
}

// fetch user's search query

const search = async (searchValue) => {

    const res = await fetch(`/search/${searchValue}`, {
      method: "GET"
    })

    const { results } = await res.json();
    if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }


  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
  <h2 class="task-list-header">Search Results</h2>
  `
  const tasksHtml = results.map(({ id, description, isCompleted, Lists }) => {
    if (isCompleted === true) {
      return `
      <div class='task-info' id=${id}>
          <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
          <label for=${id} id=${id} class="task-check-box">${description}</label>
      </div>
      `
    } else {
    return `<div class='task-info' id=${id}>
              <input type="checkbox" class="task-check-box" id=${id} name=${id}>
              <label for=${id} id=${id} class="task-check-box">${description}</label>
          </div>
      `
  }
})

  tasksListContainer.innerHTML = listName + tasksHtml.join("");

  await addTaskInfoListeners();
}


// Change the color of incomplete/complete tabs when fetching their respective lists
// function changeColor() {
//   this.style.backgroundColor = "#FAECDA";
//   this.style.color = "#8A715B";
//   return;
// }

// toggle between incomplete and completed tasks
// incomplete button
const incompleteTaskList = document.querySelector('#incomplete')
incompleteTaskList.addEventListener("click", async (e) => {
  await fetchIncompleteTasks();
  const clearAssignedList = document.querySelector('.assigned-list');
  clearAssignedList.innerHTML = ``;

  // const currColor = this.style.backgroundColor;

  // if (currColor === "#E0A979") {
  //   this.style.backgroundColor = "#FAECDA";
  // } else {
  //   this.style.backgroundColor = "#E0A979";
  // }
})

// completed button
const completeTaskList = document.querySelector('#complete')
completeTaskList.addEventListener("click", async (e) => {
  await fetchCompletedTasks();
  const clearAssignedList = document.querySelector('.assigned-list');
  clearAssignedList.innerHTML = ``;
})

// shows tasks that user assigns to their contacts

const fetchContactTasks = async (id) => {
  const res = await fetch(`/tasks/task/${id.id}`)
  if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

  const { tasks, user, isContact } = await res.json();
  const tasksListContainer = document.querySelector(".task-list");
  let listName = ``;
  if(!isContact) {
    listName = `
    <h2 class="task-list-header">All of <strong>${user.username}'s</strong> self-assigned tasks.</h2>
    `
    await fetchAssignTasks();
  } else {
    listName = `
  <h2 class="task-list-header">Tasks that you've assigned to <strong>${user.username}</strong>.</h2>
  `
  const clearAssignedList = document.querySelector('.assigned-list')
  clearAssignedList.innerHTML = ``;
  }
  const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
    if (isCompleted === true) {
      return `
      <div class='task-info' id=${id}>
          <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
          <label for=${id} id=${id} class="task-check-box">${description}</label>
      </div>
      `
    } else {
    return `<div class='task-info' id=${id}>
              <input type="checkbox" class="task-check-box" id=${id} name=${id}>
              <label for=${id} id=${id} class="task-check-box">${description}</label>
          </div>
      `
  }
})

  tasksListContainer.innerHTML = listName + tasksHtml.join("");

}

//dynamically add new contact to the sidebar
const addNewContact = async (id) => {
  const res = await fetch(`/users/${id}`, {
    method: "GET"
  })

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { userInfo } = await res.json();
  const addNewContact = `
  <div class="list-grid">
    <div>
        <li class="contact-list" id=${userInfo.id}>${userInfo.username}</li>
    </div>
    <div>
        <a class="delete-contact" id=${userInfo.id}>-</a>
    </div>
  </div>
  `
  const contactContainer = document.querySelector('.contact-list-sidebar');
  const node = document.createElement("div")
  node.innerHTML = addNewContact;
  contactContainer.appendChild(node);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
      await fetchLists();
      await fetchTasks();
      await fetchAssignTasks();
    } catch (e) {
      console.error(e);
    }
  }
);


// create a new task
const form = document.querySelector(".create-task");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const description = formData.get("description")
    const dueDate = formData.get("dueDate")
    const checkStatus = formData.get("isCompleted")
    const givenTo = formData.get("givenTo")
    const title = formData.get("title");
    let isCompleted;

    //convert checkbox to boolean value
    if (checkStatus === 'on') {
        isCompleted = true;
    } else {
        isCompleted = false;
    }

    const body = { description, dueDate, isCompleted, givenTo, title }

    try {
        const res = await fetch("/tasks", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",

            }
        })

        if (res.status === 401) {
            window.location.href = "/log-in";
            return;
          }
        if (!res.ok) {
            throw res;
          }

        form.reset();
        await fetchTasks();
    } catch (err) {
        handleErrors(err)
    }
})

// add contacts
const addContacts = document.querySelector('.add-contacts')

addContacts.addEventListener("click", async (e) => {
  const addContactsContainer = document.querySelector('.add-contact-sidebar')
  // add contact form. checks against invalid email and existing contacts
  addContactsContainer.innerHTML = `
  <div class="cloud"></div>
  <div class="contact-pop">
  <form class="contacts-form">
  <h2 class="h2-add-contact">Add New Contact</h2>
  <p class="p-form">Add people to your contacts by their email address.</p>
      <input type="hidden" name="_csrf">
      <div class="add-contact-input">

          <input type="text" id="email" name="email" placeholder="Enter email address"/>
      </div>

      <div class="add-contact-buttons-container">
          <button type="submit" class="add-contact-buttons">Add Contact</button>

          <button class="add-contact-cancel add-contact-buttons">Cancel</button>
      </div>
  </form>
  <div class="form_error"></div>
  </div>
  `
  const form = document.querySelector(".contacts-form");

  const throwError = () => {
      const formError = document.querySelector(".form_error")
      formError.innerHTML = `
              <p class="form-error-p">You entered an invalid email address, or this email is currently in your contacts.</p>
            `
}
  // create new contact
  form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const email = formData.get("email")

      const body = { email }

      try {
          const res = await fetch("/contacts", {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                  "Content-Type": "application/json",

              }
          })

          if (res.status === 401) {
              window.location.href = "/log-in";
              return;
            }
          if (!res.ok) {

              throw throwError();
            }
          const { contact } = await res.json();
          await addNewContact(contact.contactId)
          form.reset();
          addContactsContainer.innerHTML = ``;

      } catch (err) {
          handleErrors(err)
      }
  })
  // close add contact container
  const closeAddContact = document.querySelector('.add-contact-cancel')
  closeAddContact.addEventListener('click', (e) => {
    addContactsContainer.innerHTML = ``;
  })
})

// switch between your tasks and your contact's tasks
const contacts = document.querySelector('.contact-list-sidebar')

contacts.addEventListener("click", async (e) => {
  e.stopPropagation();
  const target = e.target;
  fetchContactTasks(target)
})


// delete a contact

const deleteContact = document.querySelector('.contact-list-sidebar')

deleteContact.addEventListener("click", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  if(e.target.innerText === '-'){
    const targetRemoval = e.target.parentNode.parentNode
    const deleteContactId = e.target.id;
    targetRemoval.remove();

    await fetchTasks();

    try {

      await fetch(`/contacts/${deleteContactId}`, {
        method: "DELETE",
      })



    } catch (err) {
      handleErrors(err)
    }
  }

})

const fetchLists = async () => {
  const res = await fetch('/lists/')

  if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

  const { allLists } = await res.json();

  const listContainer = document.querySelector(".lists-grid-container");
  const listHtml = allLists.map(({ id, title }) => `
  <div class='list-grid'>
  <div class="list-info">
    <li class='list-lists' id=${id}>${title}</li>
  </div>
  <div> <a class='delete-list' id=${id}> - </a> </div>
  </div>
  `)

  listContainer.innerHTML = listHtml.join("");

  const listLists = document.querySelectorAll('.list-lists');

    listLists.forEach((list) => {
      list.addEventListener('click', async(e) => {
        e.stopPropagation();
        const listId = list.id;

        const res = await fetch(`/lists/${listId}/tasks`);

        const { tasks } = await res.json();

        const tasksContainer = document.querySelector('.task-list');

        const listTitle = `
          <h2 class="task-list-header">${list.innerText}</h2>
        `

        const tasksHtml = tasks.map((task) => {
          if (task.Task.isCompleted === true) {
            return `
              <div class="task-info" id=${task.Task.id}>
                <input type="checkbox" class="task-check-box" id=${task.Task.id} name=${task.Task.id} checked>
                <label for=${task.Task.id} id=${task.Task.id} class="task-check-box">${task.Task.description}</label>
              </div>
            `
          } else {

            return `
              <div class="task-info" id=${task.Task.id}>
                <input type="checkbox" class="task-check-box" id=${task.Task.id} name=${task.Task.id}>
                <label for=${task.Task.id} id=${task.Task.id} class="task-check-box">${task.Task.description}</label>
              </div>
          `
          }
        })

        tasksContainer.innerHTML = listTitle + tasksHtml.join('');

        await addTaskInfoListeners();
      })
    })
}



// delete a list

const deleteList = document.querySelector('.list-list-sidebar')

deleteList.addEventListener("click", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  const deleteListId = e.target.id;
  if (e.target.innerText === '-') {
    const targetRemoval = e.target.parentNode.parentNode
    targetRemoval.remove();
    try {

      await fetch(`/lists/${deleteListId}`, {
        method: "DELETE",
      })

    } catch (err) {
      handleErrors(err)
    }
  } else if (e.target.className === 'list-lists') {
    const listId = e.target.id;
    const listForm = document.querySelector('.updateList');
    const listTitle = await fetch(`/lists/${listId}`, {
      method: "GET",
    })
    const { listName } = await listTitle.json();
    listForm.innerHTML = `
    <h2>Edit List Name</h2>
    <div id='list-edit'>
      <form class='list-edit-form'>
      <input type='text' class='list-edit' id='title' name='title' placeholder=${listName.title}>
      <label for='title' class='list-label'${listName.title} </label>
      <div>
      <button class='submitButton'>Submit</button>
      </div>
      <div>
      <button class='editCancelButton'>Cancel</button>
      </div>
      </form>
    </div>
      `
      const listUpdate = document.querySelector('.list-edit-form')
      listUpdate.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(listUpdate);
        const title = formData.get('title')
        const body = { title }
        await fetch(`/lists/${listId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        listForm.innerHTML = '';
        await fetchLists();
      })
    const cancelButton = document.querySelector('.editCancelButton');
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      listForm.innerHTML = '';
    })
  }
})
const addList = document.querySelector('.add-lists');

addList.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const addListForm = document.querySelector('.add-list-form');
  addListForm.innerHTML = `
  <h2>Add List</h2>
  <div id='list-add'>
    <form class='addNewList'>
    <input type='text' class='list-add' id='title' name='title' placeholder='New List'>
    <label for='title' class='list-label'</label>
    <div>
    <button class='addSubmitButton'>Submit</button>
    </div>
    <div>
    <button class='listCancelButton'>Cancel</button>
    </div>
    </form>
  </div>
    `
    const addList = document.querySelector('.addNewList');
    addList.addEventListener('submit', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const formData = new FormData(addList);

      const title = formData.get('title');
      const body = { title };

      try {
        await fetch(`/lists`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          addListForm.innerHTML = '';
          await fetchLists();
      } catch(e) {
        console.error(e);
      }

      });
    const addCancelButton = document.querySelector('.listCancelButton');

    addCancelButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      addListForm.innerHTML = '';
    })
})



window.addEventListener('DOMContentLoaded', async () => {
  const settings = document.querySelector('#settings');

  settings.addEventListener('click', event => {
    event.stopPropagation();
    document.querySelector('.settingGroup').classList.remove('settingHide');
  });

  window.addEventListener('click', () => {
    document.querySelector('.settingGroup').classList.add('settingHide');

  });

})





const signOutButton = document.querySelector("#signOut");

signOutButton.addEventListener("click", async (e) => {

  e.preventDefault();
  try {
    await fetch("/users/logout", {
      method: "POST"
    })

    window.location.href = "/";
  } catch (err) {
    handleErrors(err)
  }

})


// search function
const searchContainer = document.querySelector('#searchBar');

searchContainer.addEventListener("keypress", async (e) => {
  const searchValue = document.querySelector('#searchBar').value;

  if (e.key === "Enter") {
    await search(searchValue);
    const clearAssignedList = document.querySelector('.assigned-list');
    clearAssignedList.innerHTML = ``;
    searchContainer.value = '';
  }
})


const allTasksList = document.querySelector('.all-tasks');
allTasksList.addEventListener('click', async(e) => {
  e.stopPropagation();
  await fetchTasks();
})

const givenToOthersList = document.querySelector('.given-to-others');

givenToOthersList.addEventListener('click', async(e) => {
  e.stopPropagation();
  const res = await fetch('/lists/given-to-others');

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
      <h2 class="task-list-header">Tasks Given to Others</h2>
`
  const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
      if (isCompleted === true) {
        return `
        <div class='task-info' id=${id}>
            <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
            <label for=${id} id=${id} class="task-check-box">${description}</label>
        </div>
        `
      } else {
      return `<div class='task-info' id=${id}>
                <input type="checkbox" class="task-check-box" id=${id} name=${id}>
                <label for=${id} id=${id} class="task-check-box">${description}</label>
            </div>
        `
    }
  })

  tasksListContainer.innerHTML = listName + tasksHtml.join("");

  await addTaskInfoListeners();
})


const givenToMeList = document.querySelector('.given-to-me');

givenToMeList.addEventListener('click', async(e) => {
  e.stopPropagation();
  const res = await fetch('/lists/given-to-me');

  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }

  const { tasks } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
      <h2 class="task-list-header">Tasks Given to Me</h2>
`
  const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
    if (isCompleted === true) {
      return `
      <div class='task-info' id=${id}>
          <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
          <label for=${id} id=${id} class="task-check-box">${description}</label>
      </div>
      `
    } else {
    return `<div class='task-info' id=${id}>
              <input type="checkbox" class="task-check-box" id=${id} name=${id}>
              <label for=${id} id=${id} class="task-check-box">${description}</label>
          </div>
      `
  }
})

  tasksListContainer.innerHTML = listName + tasksHtml.join("");

  await addTaskInfoListeners();
})



const todaysTasks = document.querySelector('.due-today');
todaysTasks.addEventListener('click', async(e) => {
  e.stopPropagation();
  const res = await fetch('/lists/today');

  const { tasks } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
      <h2 class="task-list-header">Tasks Due Today</h2>
`
const tasksHtml = tasks.map(({ id, description, isCompleted }) => {
  if (isCompleted === true) {
    return `
    <div class='task-info' id=${id}>
        <input type="checkbox" class="task-check-box" id=${id} name=${id} checked>
        <label for=${id} id=${id} class="task-check-box">${description}</label>
    </div>
    `
  } else {
  return `<div class='task-info' id=${id}>
            <input type="checkbox" class="task-check-box" id=${id} name=${id}>
            <label for=${id} id=${id} class="task-check-box">${description}</label>
        </div>
    `
    }
    })
  tasksListContainer.innerHTML = listName + tasksHtml.join("");
  await addTaskInfoListeners();
})
