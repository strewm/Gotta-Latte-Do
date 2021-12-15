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


export const dateFormatter = (task) => {

  const today = new Date().toJSON().slice(0,10)

  let tomorrow = today.split('-');
  let month = tomorrow[tomorrow.length - 2]
  let day = tomorrow[tomorrow.length - 1]

  if (day === '31' &&
      (month === '01' ||
      month === '03' ||
      month === '05' ||
      month === '07' ||
      month === '08' ||
      month === '10' ||
      month === '12')) {
          day = '01';
          if (month !== '12' && Number(month) >= 9) {
              month = (Number(month) + 1).toString()
          } else if (month === '12') {
              month = '01';
          }
          else {
              month = '0' + (Number(month) + 1).toString();
          }
  } else if (
      day === '30' && (
      month === '02' ||
      month === '04' ||
      month === '06' ||
      month === '09' ||
      month === '11' ))
      {
      day = '01';
      if (Number(month) <= 9) {
          month = (Number(month) + 1).toString()
      } else {
          month = '0' + (Number(month) + 1).toString();
      }
  } else {
      if (Number(day) >= 9) {
          day = (Number(day) + 1).toString();
      } else {
          day = '0' + (Number(day) + 1).toString();
      }
  }

  tomorrow[tomorrow.length - 1] = day;
  tomorrow[tomorrow.length - 2] = month;

  tomorrow = tomorrow.join('-');


  let due = task.dueDate.slice(0,10);

  if (due === today) {
      return due = 'Today';
  }

  if (due === tomorrow) {
      return due = 'Tomorrow';
  }

  if (Number(due.slice(9)) < Number(today.slice(9))) {
      return due = 'OVERDUE!'
  }

}
