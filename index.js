const inputs = document.querySelectorAll('[data-input]')
const BugetBtn = document.querySelector('[data-add-buget]')
const ExpenseBtn = document.querySelector('[data-add-Expense]')
const showUpdate = document.querySelectorAll('[data-show]')
const ExpenseValueTable = document.querySelector('[data-value-table]')
const container = document.querySelector(".grocery-container")
const ClearBtn = document.querySelector('[data-clear-btn]')

const PREFIX = 'Bugget-app-';

function ComputeBuget() {
  
  
 this.addBuget = ()=> {
  this.BugetValue = inputs[0].value;
    if(this.BugetValue === '' || this.BugetValue < 0) 
      return this.BugetValue = undefined;

    this.BugetValue = parseFloat(this.BugetValue);
    //  add to local storage
    //delete then add (replace) 
    this.replaceLocalStorage(`Buget-input`, this.BugetValue);
  
    // updater();
    showUpdate[0].innerHTML = this.BugetValue;
    
    if(this.ExpenseValue !== undefined)
    return showUpdate[2].innerHTML = this.BugetValue - this.ExpenseValue;

    showUpdate[2].innerHTML = this.BugetValue
  }

  this.addExpense = () => {
    this.ExpenseTitle = inputs[1].value;
    this.ExpenseValue = inputs[2].value;

    if(this.ExpenseValue === '' || this.ExpenseValue < 0 || this.ExpenseTitle === '') 
      return this.ExpenseValue = undefined; 
    
    this.ExpenseValue = parseFloat(this.ExpenseValue);
      this.CreatList();
    
   //  check if there is expenseValue and set
    if(localStorage.getItem(`${PREFIX}PrevExpValue`))
    {
      const prevEXpValue = JSON.parse(localStorage.getItem(`${PREFIX}PrevExpValue`));
      this.ExpenseValue += prevEXpValue;
   }

  showUpdate[1].innerHTML = this.ExpenseValue;
  localStorage.setItem(`${PREFIX}PrevExpValue` , this.ExpenseValue);

  if(this.BugetValue !== undefined)
   showUpdate[2].innerHTML = this.BugetValue - this.ExpenseValue;

   // add last expense value to infoList
   
   this.replaceLocalStorage(`net-Expense-Value`, this.ExpenseValue)
  }

  this.CreatList = () => {
    //  giving an id 
    const id = new Date().getTime().toLocaleString();
 
    //  add to local storage
   this.addToLocalStorage(`${this.ExpenseTitle}`, this.ExpenseValue , `${PREFIX}elist`, id)

    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `
    <p class="title">${this.ExpenseTitle}</p>
    <p class="Value">${this.ExpenseValue}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
   // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", this.deleteExpense);
  // const editBtn = element.querySelector(".edit-btn");
  // editBtn.addEventListener("click", this.editExpense());

  //append child
  ExpenseValueTable.appendChild(element);
  //show container with lists
  container.classList.add("show-container");
  }

  // this.editExpense = () => {

  // }

  this.deleteExpense = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    let value = element.querySelector('.Value').innerHTML;
    value = parseFloat(value);
    ExpenseValueTable.removeChild(element);
        if(ExpenseValueTable.children.length === 0){
            container.classList.remove("show-container");
        }
        //handle LOCAL STORAGE infoItem
        
        let infoItems = this.getFromLocalStorage(`${PREFIX}infoList`);
        infoItems.filter(item => {
          if(item.Key === `net-Expense-Value`) {
            if(item.Value !== 0 ){
              item.Value -= value;
            }
            localStorage.setItem(`${PREFIX}PrevExpValue`, item.Value);
              showUpdate[1].innerHTML =item.Value;
              showUpdate[2].innerHTML = this.BugetValue - item.Value;
            return item.Value
          }
        }) 
        localStorage.setItem(`${PREFIX}infoList`,  JSON.stringify(infoItems));

        // remove from local storage
        this.removeFromLocalStorage(id, `${PREFIX}elist`)
  }
  //clear all items

   this.clearAllItem = () => {
    const items = document.querySelectorAll(".grocery-item");
    if(items.length >0 ){
        items.forEach(item=>{
          ExpenseValueTable.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    // handle eList L.S
    localStorage.removeItem(`${PREFIX}elist`);

    // handle infolist L.S
    let infoItems = this.getFromLocalStorage(`${PREFIX}infoList`);
    infoItems.filter(item => {
      if(item.Key === `net-Expense-Value`) {
        item.Value = 0;
      }
      localStorage.setItem(`${PREFIX}PrevExpValue`, item.Value);
        showUpdate[1].innerHTML =item.Value;
        showUpdate[2].innerHTML = this.BugetValue;
      return item.Value;
    })
    localStorage.setItem(`${PREFIX}infoList`,  JSON.stringify(infoItems));
   }


  //  add to local storage
     this.addToLocalStorage = (Key , Value, type, id) => {
      const grocery = {Key, Value, id};
      let items = this.getFromLocalStorage(type);
      items.push(grocery);
      localStorage.setItem(type, JSON.stringify(items));
     }

    //  get from local Storage
     this.getFromLocalStorage = (key) => {
      return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) :[];
     }
    // replace in localStorage
    this.replaceLocalStorage = (replaceKey, replaceValue) => {
      let infoItems = this.getFromLocalStorage(`${PREFIX}infoList`);
      let isUnique;

      if(infoItems.length != 0) {
        let isExist;
        infoItems.filter((item ,index) => {
            isExist = item.Key.includes(replaceKey);
            if(replaceKey === item.Key) {
              //check if buget value duplicated 
              if(isUnique) {
                isUnique = false;
              return  infoItems.splice(index,1)
              } 
              isUnique = true;
              return  infoItems.splice(index,1, { Key:replaceKey , Value:replaceValue});
          } 
        })
        if(!isExist)
         infoItems.push({ Key: replaceKey , Value:replaceValue});
        localStorage.setItem(`${PREFIX}infoList`,  JSON.stringify(infoItems)) ;
      } 
      else {
        if(replaceKey === `Buget-input`)
        this.addToLocalStorage(replaceKey , this.BugetValue , `${PREFIX}infoList` );
        else 
        this.addToLocalStorage(replaceKey , this.ExpenseValue , `${PREFIX}infoList`);
      }
    } 

    //remove from local storage
    this.removeFromLocalStorage = (id, type) => {
      let items = this.getFromLocalStorage(type);
     items = items.filter(item=> {
         if(item.id !== id) {
             return item;
         }
     });
     localStorage.setItem(type, JSON.stringify(items));
    }

     //SET UP 
    this.setupItems = () => {
      let eItems = this.getFromLocalStorage(`${PREFIX}elist`);
      let infoItems = this.getFromLocalStorage(`${PREFIX}infoList`);
  
      if(eItems.length > 0) {
        eItems.forEach(item => {
              this.createListItem(item.Key, item.Value, item.id)
          });
          container.classList.add("show-container");
      }
      if(infoItems.length > 0) {
        infoItems.forEach((item) => {
          if(item.Key.includes(`Buget-input`)) {
            showUpdate[0].innerHTML = item.Value;
            inputs[0].value = item.Value;
            this.BugetValue = item.Value;
          }
           else {
            showUpdate[1].innerHTML = item.Value;
            this.ExpenseValue = item.Value;
           }
           console.log(this.BugetValue, this.ExpenseValue)
        })
        showUpdate[2].innerHTML = showUpdate[0].innerHTML - showUpdate[1].innerHTML;
      }
    }

    this.createListItem = (key, Value, id) => {
      const element = document.createElement("article");
      let attr = document.createAttribute("data-id");
      attr.value = id;
      element.setAttributeNode(attr);
      element.classList.add("grocery-item");
      element.innerHTML = `
      <p class="title">${key}</p>
      <p class="Value">${Value}</p>
      <div class="btn-container">
        <!-- edit btn -->
        <button type="button" class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <!-- delete btn -->
        <button type="button" class="delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
     // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", this.deleteExpense);
  // const editBtn = element.querySelector(".edit-btn");
  // editBtn.addEventListener("click", this.editExpense);

  //append child
  ExpenseValueTable.appendChild(element);
    }
}
const BugetComputer = new ComputeBuget();

window.addEventListener("DOMContentLoaded",BugetComputer.setupItems());

BugetBtn.addEventListener("click",(e) =>{ 
  e.preventDefault();
  BugetComputer.addBuget()
});

ExpenseBtn.addEventListener('click',(e) =>{ 
  e.preventDefault();
  BugetComputer.addExpense()
})

ClearBtn.addEventListener('click' , (e)=> {
  e.preventDefault();
  BugetComputer.clearAllItem()
})