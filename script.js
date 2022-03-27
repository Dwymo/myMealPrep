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
//     instructions = [{
//     instructionName = instructionName,
//     insturctionNumber = instructionNumber,
//     instructionContent = instructionContent
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
Delete a Recipe: Completed

*/

//All Variables will be declared at the start so its easier to locate them all
const recipesContainer = document.querySelector('[data-recipes]');
const newRecipeForm = document.querySelector('[data-new-recipe-form]')
const newRecipeInput = document.querySelector('[data-new-recipe-input]')
const recipeTitleElement = document.querySelector('[data-recipe-title]')
const deleteRecipe = document.querySelector('[data-delete-recipe-button]');

const newIngredientForm = document.querySelector('[data-new-ingredient-form]')
const newIngredientNameInput = document.querySelector('[data-new-ingredient-name-input]')
const newIngredientTypeInput = document.querySelector('[data-new-ingredient-type-input]')
const newIngredientAmountInput = document.querySelector('[data-new-ingredient-amount-input]')
const recipeIngredientsContainer = document.querySelector('[data-ingredients-list]')

const recipeInstructionsContainer = document.querySelector('[data-instructions-list]')
const newInstructionForm = document.querySelector('[data-new-instructions-form]')
const newInstructionInput = document.querySelector('[data-new-instructions-input]')

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

//add an event listener for when pressing the delete button
deleteRecipe.addEventListener('click', e => {
     //filter the recipies list to remove the recipe marked as selected
     recipes = recipes.filter(recipe => recipe.id !== selectedRecipeId)
     //empty all content out of the recipe container
     recipesContainer.innerText = null
     //reset the selected recipe back to nothing being selected
     selectedRecipeId = null
     //save the new list of recipies and re0load the webpage
     save()
     render()

})
  

//Creating an Empty Recipe using current date/time for unique id
function createRecipe(name) {
    return  {id: Date.now().toString(), name: name, ingredients: [], instructions: []}
  }

//add an event listener to the specified to take action when adding an ingredient
newIngredientForm.addEventListener('submit', e => {
    //stop any default action's - such as refreshing the page 
    e.preventDefault()
    //Create the ingredient using the name, type and amount entered in the form
    const ingredientName = newIngredientNameInput.value
    const ingredientType = newIngredientTypeInput.value
    const ingredientAmount = newIngredientAmountInput.value
    //if the input from any of the form is blank, do nothing
    if (ingredientName == null || ingredientType == null || ingredientAmount == null 
        || ingredientName === '' || ingredientType === '' || ingredientAmount === '') return
    //else locate the selected recipe
    const selectedRecipe = recipes.find(recipe => recipe.id == selectedRecipeId)
    //create an ingredient using the information entered
    const ingredient = createIngredient(ingredientName, ingredientType, ingredientAmount)
    //remove any data in the form so it can be re-used
    newIngredientNameInput.value = null
    newIngredientTypeInput.value = null
    newIngredientAmountInput.value = null
    //add the new ingredient to the existing list in the selected recipe
    selectedRecipe.ingredients.push(ingredient)
    //save the new list of recipes and re-load the webpage
    save()
    render()
})

//Creating an Empty Recipe using current date/time for unique id
function createIngredient(name, type, amount) {
    return  {id: Date.now().toString(), name: name, type: type, amount: amount}
  }

  //add an event listener to the specified to take action when creating a new recipe
newInstructionForm.addEventListener('submit', e => {
    //stop any default action's - such as refreshing the page 
    e.preventDefault()
    //create the instruction using the input from the form
    const instructionContent = newInstructionInput.value
    //if the input from the form is blank, do nothing
    if (instructionContent == null || instructionContent === '') return
    //else locate the selected recipe
    const selectedRecipe = recipes.find(recipe => recipe.id == selectedRecipeId)
    //create an instruction
    const instruction = createInstruction(instructionContent)
    //remove any data in the form so it can be re-used
    newInstructionInput.value = null
    //add the newly created instruction to the list of existing instructions
    selectedRecipe.instructions.push(instruction)
    //save the new list of recipes and re-load the webpage
    save()
    render()
})

  //Creating an Empty Recipe using current date/time for unique id
  function createInstruction(instruction) {
    return  {id: Date.now().toString(), instruction: instruction}
  }

//Render entire page
function render() {
    //clear all data inside the recipe container (this should remove anything that wasnt saved)
    clearElement(recipesContainer)
    clearElement(recipeIngredientsContainer)
    clearElement(recipeInstructionsContainer)
    //render all the saved recipes back to the list
    renderRecipes()
        /*
        Originally I was locating the selected recipe at the start of each query that used it
        then realised I could first select the recipe and pass this through each function instead
        */
    //locate the selected recipe
    const selectedRecipe = recipes.find(recipe => recipe.id == selectedRecipeId)
    //if no recipe is selcted
    if (selectedRecipeId == null){
        //Selected Recipe Header should specify to select a recipe
        recipeTitleElement.innerText = "Choose a Recipe"
    } else {
        //else put the selected recie name in the Recipe Header
        recipeTitleElement.innerText = selectedRecipe.name
        renderIngredients(selectedRecipe)
        renderInstructions(selectedRecipe)
        //renderIngredients(selectedRecipe)
        //recipeIngredientsElement.innerText = ingredients
      
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

//Render list of ingredients from the selected recipe
function renderIngredients (selectedRecipe){
    //for every ingredient that exists in the selected recipe
    selectedRecipe.ingredients.forEach(ingredient => {
        //create an element with the following data:
        //create the element as a List Item
        const listItem = document.createElement('li')
        //set a Listid data to be the id of the selectdRecipe
        listItem.dataset.ingredientId = ingredient.id
        //add a class to the List Item called ingredient
        listItem.classList.add("ingredient")
        //Set the text of the element to the Full ingredient including amount and type
        listItem.innerText = `${ingredient.name} - ${ingredient.amount}${ingredient.type}`
        //add to the newly created ingredient to the recipies list of ingredients
        recipeIngredientsContainer.appendChild(listItem)
    })
}

//Render list of instructions from the selected recipe
function renderInstructions (selectedRecipe){
    //for every instruction that exists in the selected recipe
    selectedRecipe.instructions.forEach(instruction => {
        //create an element with the following data:
        //create the element as a List Item
        const listItem = document.createElement('li')
        //set a Listid data to be the id of the selectdRecipe
        listItem.dataset.instructionId = instruction.id
        //add a class to the List Item called instruction
        listItem.classList.add("instruction")
        //Set the text of the element to the Full ingredient including amount and type
        listItem.innerText = instruction.instruction
        //add to the newly created ingredient to the recipies list of ingredients
        recipeInstructionsContainer.appendChild(listItem)
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