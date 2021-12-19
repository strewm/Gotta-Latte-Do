import { handleErrors, addTaskInfoListeners, updateOverDueValue } from "./utils.js";
import { fetchTasks, fetchAssignTasks, fetchIncompleteTasks,fetchCompletedTasks } from "./fetch-tasks.js";
import { search } from "./search.js";
import { fetchContactTasks, addNewContact } from "./contacts.js";
import { fetchLists } from "./lists.js";




// // Change the color of incomplete/complete tabs when fetching their respective lists
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




document.addEventListener("DOMContentLoaded", async () => {
    try {
      await fetchLists();
      await fetchTasks();
      //await fetchAssignTasks();
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

        const tasksDue = document.querySelector('.tasksDueValue');
        tasksDue.innerText = (Number(tasksDue.innerText) + 1).toString()

        await fetchTasks();
        await updateOverDueValue();


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

          <input class="contact-input" type="text" id="email" name="email" placeholder="Enter email address"/>
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
  }
})

const addList = document.querySelector('.add-lists');

addList.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const editForm = document.querySelector('.edit-form');
  editForm.style.display = 'none';
  const addListForm = document.querySelector('.add-list-form');
  addListForm.innerHTML = `
  <div class="cloud"></div>
  <div class ="list-pop">
  <h2 class="h2-add-list">Add List</h2>
  <div id='list-add'>
    <form class='addNewList'>
      <input type='text' class='list-add list-add-edited' id='title' name='title' placeholder='New List'>
      <label for='title' class='list-label'</label>
      <div class="add-list-buttons-container">
        <button class='addSubmitButton button-modal'>Submit</button>
        <button class='listCancelButton button-modal'>Cancel</button>
      </div>
    </form>
  </div>
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


const tomorrowTasks = document.querySelector('.due-tomorrow');
tomorrowTasks.addEventListener('click', async(e) => {
  e.stopPropagation();
  const res = await fetch('/lists/tomorrow');

  const { tasks } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
      <h2 class="task-list-header">Tasks Due Tomorrow</h2>
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


const overdueTasks = document.querySelector('.overdue');
overdueTasks.addEventListener('click', async(e) => {
  e.stopPropagation();
  const res = await fetch('/lists/overdue');

  const { tasks } = await res.json();

  const tasksListContainer = document.querySelector(".task-list");
  const listName = `
      <h2 class="task-list-header">Overdue Tasks</h2>
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
