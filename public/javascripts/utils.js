export const handleErrors = async (err) => {
    if (err.status >= 400 && err.status < 600) {
      const errorJSON = await err.json();
      const errorsContainer = document.querySelector(".errors-container");
      let errorsHtml = [
        `
          <div class="alert alert-danger">
              Something went wrong. Please try again.
          </div>
        `,
      ];
      const { errors } = errorJSON;
      if (errors && Array.isArray(errors)) {
        errorsHtml = errors.map(
          (message) => `
            <div class="alert alert-danger">
                ${message}
            </div>
          `
        );
      }
      errorsContainer.innerHTML = errorsHtml.join("");
    } else {
      alert(
        "Something went wrong. Please check your internet connection and try again!"
      );
    }
  };



// This function checks the dueDate selected for the task
// If the task is due today, it changes the task info "due" text to "Today", same for "Tomorrow"
// If the task is due in the past, it changes it to "OVERDUE!"
// Otherwise, it writes the due date as a date in yyyy-mm-dd format.

export const dateFormatter = (task) => {

  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1)

  let ddToday = String(today.getDate()).padStart(2, '0');
  let mmToday = String(today.getMonth() + 1).padStart(2, '0');
  let yyyyToday = today.getFullYear();

  let ddTom = String(tomorrow.getDate()).padStart(2, '0');
  let mmTom = String(tomorrow.getMonth() + 1).padStart(2, '0');
  let yyyyTom = tomorrow.getFullYear();

  today = yyyyToday + '-' + mmToday + '-' + ddToday;
  tomorrow = yyyyTom + '-' + mmTom + '-' + ddTom;

  let selectedDate = task.dueDate.slice(0,10).replace(/-/g, '/');
  selectedDate = new Date(selectedDate);
  let diff = new Date().getTime() - selectedDate.getTime();

  let due = task.dueDate.slice(0,10);


  if (due === today) {
      return due = 'Today';
  }

  if (due === tomorrow) {
      return due = 'Tomorrow';
  }

  if (diff > 0) {
      return due = 'OVERDUE!'
  }

  return due;
}
