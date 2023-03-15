
export const addElementToStateArray = (hookArray, hookSetter, element) => {
    hookSetter(
    [...hookArray, element]
    )
}

export const removeElementFromStateArray = (hookArray, hookSetter, element) => {
    let array = [...hookArray];
    let index = array.indexOf(element)
    if (index !== -1) {
    array.splice(index, 1);
    hookSetter(array);
    }
}