const courseVideos = document.querySelectorAll(".courseVideo");
if (courseVideos.length > 0) {
  courseVideos.forEach((videoWrap) => {
    const video = videoWrap.querySelector("video");
    videoWrap.onclick = () => {
      videoWrap.classList.add("active");
      video.controls = true;
      video.play();
    };

    video.onended = () => {
      videoWrap.classList.remove("active");
      video.controls = false;
    };
  });
}



//-----------------------------------------------------



//create reuseable class for checkBox list
class checkBoxList {
  constructor(checkBoxList) {
    this.checkBoxList = checkBoxList;
    this.options = this.checkBoxList.querySelectorAll(".checkList > input");
    this.removeableItemsContainer =
      this.checkBoxList.querySelector(".removeableItems");
    this.optionsChangeEventSetter();
  }
  optionsChangeEventSetter() {
    this.options.forEach((item) => {
      item.addEventListener("change", this.optionsEventHandler.bind(this));
    });
  }
  optionsEventHandler(e) {
    const checkbox = e.target;
    if (checkbox.checked) {
      let removeableItem = `<span data-id="${checkbox.id}"><span data-id="${checkbox.id}" class="remove">×</span>${checkbox.dataset.text}</span>`;
      this.removeableItemsContainer.innerHTML += removeableItem;
      this.removeBtnsEventSetter();
    } else {
      const itemToRemove = this.removeableItemsContainer.querySelector(
        `[data-id="${checkbox.id}"]`
      );
      itemToRemove.remove();
    }
  }
  removeBtnsEventSetter() {
    const removeBtns =
      this.removeableItemsContainer.querySelectorAll(".remove");
    removeBtns.forEach((item) => {
      item.addEventListener("click", this.removeBtnsEventHandler.bind(this));
    });
  }
  removeBtnsEventHandler(e) {
    let removeBtn = e.target;
    let itemToRemove = removeBtn.parentNode;
    let myCheckBox = this.checkBoxList.querySelector(
      `.checkList > input[id='${removeBtn.dataset.id}']`
    );
    myCheckBox.checked = false;
    itemToRemove.remove();
  }
}
//create checkBoxs Objects
const checkBoxListObjects = [];
const checkBoxListsElements = dc.queries(".checkBoxList");
checkBoxListsElements.forEach((item) => {
  const checkBoxListObject = new checkBoxList(item);
  checkBoxListObjects.push(checkBoxListObject);
});



//-----------------------------------------------------



//create reuseable listItem class
class itemList {
  constructor(itemList) {
    this.addBtn = itemList.querySelector(".button");
    this.input = itemList.querySelector("input");
    this.removeableItems = itemList.querySelector(".removeableItems");
    this.addBtnSetEvent();
  }
  addBtnSetEvent() {
    this.addBtn.addEventListener("click", this.addBtnEventHandler.bind(this));
  }
  addBtnEventHandler(e) {
    if (this.input.value.trim() !== "") {
      let newItem = `<span><span class="remove">×</span>${this.input.value}</span>`;
      this.removeableItems.innerHTML += newItem;
      this.input.value = "";
      this.removeBtnsSetEvent();
    } else {
      this.input.value = "";
    }
  }
  removeBtnsSetEvent() {
    const removeBtns = this.removeableItems.querySelectorAll(".remove");
    removeBtns.forEach((item) => {
      item.addEventListener("click", function () {
        let item = this.parentNode;
        item.remove();
      });
    });
  }
}
const listItemObjects = [];
const listItems = dc.queries(".itemList");
listItems.forEach((item) => {
  const listItemObject = new itemList(item);
  listItemObjects.push(listItemObject);
});



//-----------------------------------------------------



//create class for form validation

class formValidation {  
  constructor(form) {
    this.form = form;
    this.inputsRequiringValidation = this.form.queries("[data-validate]");
    this.setValidationForInputs();
    this.setSubmitValidationForForm();
    this.isValidForm = true;
  }

  setValidationForInputs() {
    this.inputsRequiringValidation.forEach((input) => {
      if (input.type === "radio" || input.type === "checkbox" || input.type === "file") {
        input.addEventListener("change", this.checkInput.bind(this, input));
      } else {
        input.addEventListener("blur", this.checkInput.bind(this, input));
      }
    });
  }

  setSubmitValidationForForm() {
    this.form.addEventListener("submit", this.validateFormOnSubmit.bind(this));
  }

  validateFormOnSubmit(e) {
    e.preventDefault();
    this.isValidForm = true;
    for(let input of this.inputsRequiringValidation){
      this.checkInput(input);
    }
    if (this.isValidForm) {
      // this.form.submit();
      const formData = new FormData(e.target);
      const formDataObject = Object.fromEntries(formData.entries())
      formDataObject.favTraining = formData.getAll('favTraining');
      fetch('server.htm' , {
        method: 'POST',
        body: JSON.stringify(formDataObject),
        headers : {
          "Content-Type": "application/json",
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
      .then(response => response.text())
      .then(data => { 
        if(data === 'ok'){
          callModal.success('روزمه شما با موفقیت ثبت شد' , 2000 , 1.5);
          this.clearForm();
        }
        else{
          callModal.fail('مشکلی پیش آمد لطفا دوباره سعی کنید' , 2000 , 1.5)
        }
      })
      
    }
    else{
      callModal.fail('اطلاعات خود را به طور کامل وارد کنید' , 2000 , 1.5)
    }
  }

  checkInput(input) {
    const inputParent = input.closest(".parent");
    let validations = JSON.parse(input.dataset.validate);
    let errorMassageEl = inputParent.querySelector(".validationMsg");
    let isValidInput = this.validateInput(input, validations);
    if (!isValidInput.isValid) {
      inputParent.classList.add("error");
      errorMassageEl.innerHTML = isValidInput.errorMsg;
      if(this.isValidForm){
        this.isValidForm = false;
      }
    } else {
      inputParent.classList.remove("error");
      errorMassageEl.innerHTML = "";
    }
  }

  validateInput(input, validations) {
    let isValid = true;
    let errorMsg = "";
    for (let validate of validations) {
      switch (validate) {
        case "noEmpty":
          if (this.isEmpty(input)) {
            isValid = false;
            errorMsg = "لطفا کادر را خالی نگذارید";
          }
          break;
        case "number":
          if (!this.isNumber(input)) {
            isValid = false;
            errorMsg = "فقط مقدار عددی مجاز میباشد";
          }
          break;
        case "onlyLetters":
          if (!this.isLetters(input)) {
            isValid = false;
            errorMsg = "فقط حروف فارسی و انگلیسی مجاز میباشد";
          }
          break;
        case "email":
          if (!this.isEmail(input)) {
            isValid = false;
            errorMsg = "لطفا ایمیل معتبر وارد کنید";
          }
          break;
        case "radio":
          if (!this.radioIsChecked(input)) {
            isValid = false;
            errorMsg = "یک مورد را انتخاب کنید";
          }
          break;
        case "checkbox":
          if (!this.checkBoxChecked(input)) {
            isValid = false;
            errorMsg =
              "حداقل یک مورد را انتخاب کنید یا زمینه کاری خود را در کارد زیر وارد کنید";
          }
          break;
        case "fileSelect":
          if (!this.fileSelected(input)) {
            isValid = false;
            errorMsg = "لطفا فایل رزومه خود را انتخاب کنید";
          }
          break;
      }
      if (!isValid) {
        break;
      }
    }

    return { isValid: isValid, errorMsg: errorMsg };
  }

  isEmpty(inputEl) {
    if (inputEl.value.trim() === "") {
      return true;
    } else {
      return false;
    }
  }

  isNumber(inputEl) {
    const numRegEx = /^\d+$/;
    if (numRegEx.test(inputEl.value)) {
      return true;
    } else {
      return false;
    }
  }

  isLetters(inputEl) {
    const regEx = /^[a-z\u0600-\u06FF\s]+$/i;
    if (regEx.test(inputEl.value)) {
      return true;
    } else {
      return false;
    }
  }
  isEmail(inputEl) {
    const regEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (regEx.test(inputEl.value)) {
      return true;
    } else {
      return false;
    }
  }

  fileSelected(inputEl) {
    if (inputEl.files.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  radioIsChecked(inputEl) {
    let radioName = inputEl.name;
    const RadioButtonsGroup = this.form.queries(`[name='${radioName}']`);
    let hasBeenSelected = false;
    for (let radio of RadioButtonsGroup) {
      if (radio.checked) {
        hasBeenSelected = true;
        break;
      }
    }
    return hasBeenSelected;
  }

  checkBoxChecked(inputEl) {
    const parentEl = inputEl.closest(".parent");
    const otherFavTrainingTextArea = this.form.query(
      '[name="otherFavTraining"]'
    );
    let checkboxesGroup = parentEl.querySelectorAll('input[type="checkbox"]');
    let hasBeenSelected = false;
    for (let checkBox of checkboxesGroup) {
      if (checkBox.checked) {
        hasBeenSelected = true;
        break;
      }
    }
    if (!(otherFavTrainingTextArea.value.trim() === "")) {
      hasBeenSelected = true;
    }

    return hasBeenSelected;
  }

  clearForm(){
    this.form.reset();
      this.form.querySelector('.select-file .removeableItems').innerHTML = '';
      this.form.querySelector('.checkBoxList .removeableItems').innerHTML = '';
  }
}
const formEl = dc.query("form");
const formVal = new formValidation(formEl);



//-----------------------------------------------------





//deactive clicker elements if click outside them
const clickerElements = dc.queries("[data-onclick]");
document.addEventListener("click", (e) => {
  let clickedOnclickerElements = false;
  clickerElements.forEach((item) => {
    if (item.contains(e.target)) {
      clickedOnclickerElements = true;
    }
  });
  if (!clickedOnclickerElements) {
    clickerElements.forEach((item) => {
      item.classList.remove("active");
    });
  }
});



//-----------------------------------------------------


//class for secele file
class selectFile {
  constructor(selectFileContaner) {
    this.contaner = selectFileContaner;
    this.fileBtn = this.contaner.querySelector("#resumefile");
    this.removeableItems = selectFileContaner.querySelector(".removeableItems");
    this.setFileBtnEvent();
  }

  setFileBtnEvent() {
    this.fileBtn.addEventListener(
      "change",
      this.fileBtnEventHandler.bind(this)
    );
  }

  fileBtnEventHandler(e) {
    const fileBtn = e.target;
    let newItem = `<span><span class="remove">×</span>${fileBtn.files[0].name}</span>`;
    this.removeableItems.innerHTML += newItem;
    this.removeBtnsSetEvent();
  }
  removeBtnsSetEvent() {
    const removeBtns = this.removeableItems.querySelectorAll(".remove");
    const fileBtn = this.fileBtn;
    removeBtns.forEach((item) => {
      item.addEventListener("click", function () {
        let item = this.parentNode;
        item.remove();
        fileBtn.value = "";
      });
    });
  }
}

const selectFileSection = dc.query(".select-file");
const selectFileSectionObject = new selectFile(selectFileSection);
