//Storage Controler

const storageCtrl = (function() {
   
    return {

        storeItem : function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = []

                items.push(item)

                localStorage.setItem('items', JSON.stringify(items))

            } else {

                items = JSON.parse(localStorage.getItem('items'))

                items.push(item)

                localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromLS: function(){
            let items;

            if(localStorage.getItem('items') === null){
                items = []        
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }

            return items
        },

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function(item,index){
                if(updatedItem.id === item.id){
                    items.splice(index,1, updatedItem)
                }
            })

            localStorage.setItem('items', JSON.stringify(items))            
        },

        deleteItemFromLS: function(id){

            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function(item,index){
                if(id === item.id){
                    items.splice(index,1)
                }
            })

            localStorage.setItem('items', JSON.stringify(items))  
        }, 

        clearStorage: function(){
            localStorage.removeItem('items')
        }
    }
})()


//Item Controller

const itemCtrl = (function(){

    //item constructor
    const Item = function(id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    //state
    const data = {
        items : storageCtrl.getItemsFromLS(),
        currentItem : null,
        totalCalories : 0
    }

    //public method
    return {
        getItems : function(){
            return data.items
        },

        addItem: function(name, calories){
            //generate ID
            let ID;

            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            //parse calories to number
            calories = parseInt(calories)

            //create new item
            const newItem = new Item(ID, name, calories)

            //add to items array
            data.items.push(newItem)

            return newItem;
        }, 

        getItemById: function(id){
            let found = null

            //looping through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item
                }
            })

            return found
        },

        updateItem: function(name, calories){
            calories = parseInt(calories)

            let found = null

            data.items.forEach(function(item){
                if(item.id == data.currentItem.id){
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })

            return found
        },

        deleteItem: function(id){
            //get ids
            const ids = data.items.map(function(item){
                return item.id
            })

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index,1)
        },

        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item
        },

        getCurrentItem: function(){
            return data.currentItem
        },

        getTotalCalories: function(items){

            let total = 0

            data.items.forEach(function(item){
                total += item.calories
            })

            data.totalCalories = total

            return data.totalCalories
        },

        logData : function(){
            return data;
        }
    }

})()

//UI Controller
const UICtrl = (function(){

    const UISelectors ={
        itemList : '#item-list',
        listItems : '#item-list li',
        clearBtn : '.clear-btn',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        itemNameInput : '#item-name',
        itemCalorieInput: '#item-calories',
        totalCalories : '.total-calories'
    }

    //public method
    return{
        populateItemList: function(items){
            let html = ''
            items.forEach(item => {
                html += ` <li class="collection-item" id="item-${item.id}"> 
                <strong> ${item.name} </strong> <em> ${item.calories} cal</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function(){
            return{
                name : document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalorieInput).value
            }
        },

        addListItem: function(item){

            //show list item (unhide)
            document.querySelector(UISelectors.itemList).style.display = 'block'

            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id = `item-${item.id}`

            li.innerHTML = `
            <strong> ${item.name} </strong> <em> ${item.calories} cal</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
            `
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems) 

            //turn node list ^ into array
            listItems = Array.from(listItems)

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id')

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong> ${item.name} </strong> <em> ${item.calories} cal</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                   `
                }
            })
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)

            item.remove()
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCalorieInput).value = ''
        },

        hideLineStyle: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = `${totalCalories} cal`
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = itemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCalorieInput).value = itemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },

        clearItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems)

            //turn into array
            listItems = Array.from(listItems)

            listItems.forEach(function(listItem){
                listItem.remove()
            })
        },

        clearEditState: function(){
            UICtrl.clearInput()

            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
        },

        showEditState: function(){
           
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.itemNameInput).style.color = 'grey'
            document.querySelector(UISelectors.itemCalorieInput).style.color = 'grey'
        },
        getSelectors: function(){
            return UISelectors
        }
    }

})()



//App
const app = (function(itemCtrl, storageCtrl, UICtrl){

    //load event listener
    const loadEventListener = function() {
        const UISelectors = UICtrl.getSelectors()

        //add item
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        //disable enter
        document.addEventListener('keydown', function(e){
            if(e.key === 13 || e.which === 13){
                e.preventDefault()
                return false
            }
        })

        //edit icon event click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

        //back btn event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState)

        //clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
    }


    //addd item submit
    const itemAddSubmit = function(e){

        //get form input from UI Controller
        const input = UICtrl.getItemInput()

        if(input.name !== '' && input.calories !== ''){
            const newItem = itemCtrl.addItem(input.name, input.calories)

            //show item on UI
            UICtrl.addListItem(newItem)

            //get total calories
            const totalCalories = itemCtrl.getTotalCalories()

            //show total on the UI
            UICtrl.showTotalCalories(totalCalories)

            //add to local storage
            storageCtrl.storeItem(newItem)

            //clear fields after submitng
            UICtrl.clearInput()
        }

        e.preventDefault()
    }

    //edit item when icon clicked
    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id

            //break into array
            const listIdArr = listId.split('-')

            //get actual id
            const id = parseInt(listIdArr[1])

            //get item
            const itemToEdit = itemCtrl.getItemById(id)

            //set curr item
            itemCtrl.setCurrentItem(itemToEdit)

            //add item to form
            UICtrl.addItemToForm()
            
        }
        e.preventDefault()
    } 

    //update item submit

    const itemUpdateSubmit = function(e){

        const input = UICtrl.getItemInput()

        const updatedItem = itemCtrl.updateItem(input.name, input.calories)

        //update UI
        UICtrl.updateListItem(updatedItem)

        //get total calories
        const totalCalories = itemCtrl.getTotalCalories()

        //show total on the UI
        UICtrl.showTotalCalories(totalCalories)

        //get updated item to LS
        storageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    //delete button
    const itemDeleteSubmit = function(e){

        const currentItem = itemCtrl.getCurrentItem()

        //delete from data
        itemCtrl.deleteItem(currentItem.id)

        //delete in the UI
        UICtrl.deleteListItem(currentItem.id)

        //get total calories
        const totalCalories = itemCtrl.getTotalCalories()

        //show total on the UI
        UICtrl.showTotalCalories(totalCalories)

        //delete from LS
        storageCtrl.deleteItemFromLS(currentItem.id)
  
        UICtrl.clearEditState()

        e.preventDefault()
    }

    //clear btn event
    const clearAllItemsClick = function(e){
        //clear all items from data
        itemCtrl.clearAllItems()

        //get total calories
        const totalCalories = itemCtrl.getTotalCalories()

        //show total on the UI
        UICtrl.showTotalCalories(totalCalories)
        
        //remove items on UI
        UICtrl.clearItems()

        //remove items from LS
        storageCtrl.clearStorage()

        UICtrl.hideLineStyle()
    }


    //public method
    return{
        init: function(){

            //set initial state
            UICtrl.clearEditState()
         
            //fetching data from state
            const items = itemCtrl.getItems()

            if(items.length === 0){

                UICtrl.hideLineStyle()

            } else {

            //populate list with items
            UICtrl.populateItemList(items)

            }

            //load event listner
            loadEventListener()
        }
    }

})(itemCtrl, storageCtrl ,UICtrl)


app.init()


