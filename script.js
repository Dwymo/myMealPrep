// //Meal Information Variables
// var Recipe = {
//     name: name,
//     description = description,
//     image = image,
//     cookingTime = cookingTime, // in seconds
//     prepTime = prepTime, // in seconds
//     applicances = applicances, //will be chosen from a list of pre-determined options
//     //Each ingredient in a recipe will have it's own set of information
//     ingredients = [{
//         ingredientName = ingredientName,
//         ingredientType = ingredientType, //g, ml, whole, etc
//         ingredientAmount = ingredientAmount}],
//         //nutritional Info will be grouped into one object
//     nutritionalInformation = [{
//         calories = calories,
//         fat = fat,
//         saturates =saturates,
//         sugar = sugar,
//         salt = salt
//     }],
//     additionalNotes = additionalNotes

// };

/*

ToDo:

Save Function: Completed
Render Function: Partially Completed
Clear all data from an area, ready to load new data: Completed
Creating an empty recipe: Completed
Submit a new recipe request to create the empty recipe: Completed


*/

//All Variables will be declared at the start so its easier to locate them all
const recipesContainer = document.querySelector('[data-recipes]');
const newRecipeForm = document.querySelector('[data-new-recipe-form]')
const newRecipeInput = document.querySelector('[data-new-recipe-input]')
const recipeTitleElement = document.querySelector('[data-recipe-title]')

//getting the recipe list aswell as the selected recipe list from local storage
const LOCAL_STORAGE_LIST_KEY = 'meal.list'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'meal.selectedMealId'
let recipes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedRecipeId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


//add an event listener to the entire recipe Container
recipesContainer.addEventListener('click', e =>{
    //if the clicked item is a list eliement
    if (e.target.tagName.toLowerCase() === 'li'){
        //set that element as the selected recipe
        selectedRecipeId = e.target.dataset.recipeId
        save()
        render()
    }})



//add an event listener to the specified to take action when creating a new recipe
newRecipeForm.addEventListener('submit', e => {
    //stop any default action's - such as refreshing the page 
    e.preventDefault()
    //create the recipe name using the input from the form
    const recipeName = newRecipeInput.value
    //if the input from the form is blank, do nothing
    if (recipeName == null || recipeName === '') return
    //else create a blank recipe with just a name for now
    const recipe = createRecipe(recipeName)
    //remove any data in the form so it can be re-used
    newRecipeInput.value = null
    //add the newly created recipe to the list of existing recipes
    recipes.push(recipe)
    //save the new list of recipes and re-load the webpage
    save()
    render()
})

//Creating an Empty Recipe using current date/time for unique id
function createRecipe(name) {
    return  {id: Date.now().toString(), name: name}
  }

  
//Render entire page
function render() {
    //clear all data inside the recipe container (this should remove anything that wasnt saved)
    clearElement(recipesContainer)
    //render all the saved recipes back to the list
    renderRecipes()
    //locate the selected recipe
    const selectedRecipe = recipes.find(recipe => recipe.id == selectedRecipeId)
    //if no recipe is selcted
    if (selectedRecipeId == null){
        //Selected Recipe Header should specify to select a recipe
        recipeTitleElement.innerText = "Choose a Recipe"
    } else {
        //else put the selected recie name in the Recipe Header
        recipeTitleElement.innerText = selectedRecipe
        //clear the ingerdients and guide data
        //so the previously selected recipe does not combine with new one
        //clearElement(ingredients)
        //clearElement(guide)
        //render Remaining Deta
        //renderIngredients(selectedRecipeId)
        //renderGuide(selectedRecipeId)
    }
}


//Render list of projects
function renderRecipes (){
    //for every recipe that exists
    recipes.forEach(recipe => {
        //create an element with the following data:
        //create the element as a List Item
        const listElement = document.createElement('li')
        //set a Listid data to be the id of the recipe
        listElement.dataset.recipeId = recipe.id
        //add a class to the List Item called list-recipe
        listElement.classList.add("meal-list-item")
        //Set the text of the element to the recipe name
        listElement.innerText = recipe.name
        //if the recipe id is the selected recipe in the list
        if (recipe.id === selectedRecipeId) {
        //also set a class to the element called active-recipe
        //(this will be used to add additional css to the selected element)
        listElement.classList.add('active-recipe')
        }
        //add to the recipe continer the newly created element
        recipesContainer.appendChild(listElement)
    })
}

//clear all elements in an array
function clearElement(element) {
        //while there is still a value in the element
        while (element.firstChild) {
        //remove that value
        element.removeChild(element.firstChild)
    }
  }



//Save all currently loaded data to the local storage
function save(){
    //save all the currently loaded recipes
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(recipes))
    //save the currently selected recipe as a selected item for next load
   // localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedRecipeId)
}

render()