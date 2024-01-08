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
    }
    else{
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

//create class for form validation

class formValidation{
  constructor(form){
    this.inputsRequiringValidation = form.queries('[data-validate]');
    this.setValidationForInputs();
  }

  setValidationForInputs(){
    this.inputsRequiringValidation.forEach(input => {
      input.addEventListener('blur', this.checkInput.bind(this))
    })
  }

  checkInput(e){
    const input = e.target;
    const inputParent = input.closest('.parent');
    let validations = JSON.parse(input.dataset.validate);
    let errorMassageEl = inputParent.querySelector('.validationMsg');
    
    let isValidateInput = this.validateInput(input , validations);
    if(!(isValidateInput.isValid)){
      inputParent.classList.add('error');
      errorMassageEl.innerHTML = isValidateInput.errorMsg;
    }
  }

  validateInput(input , validations){
    let isValid = true;
    let errorMsg = '';
    for(let validate of validations){
      switch(validate){
        case 'noEmpty':
          isValid =  isEmpty(input) ? false : true;
          errorMsg = 'لطفا کادر را خالی نگذارید';
          break;
      }
      if(!isValid) {
        break;
      }
    }

    return {isValid : isValid , errorMsg : errorMsg}
  }
}
const formEl = dc.query('form');
const formVal = new formValidation(formEl);
