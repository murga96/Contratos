export const initialState = {
    editDialog: false,
    elementDialog: {},
}

export const actionTypes = {
    SET_EDIT_DIALOG: "SET_EDIT_DIALOG",
    SET_ELEMENT_DIALOG: "SET_ELEMENT_DIALOG",
}

const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "SET_EDIT_DIALOG":
            return {
                ...state,
                editDialog: action.editDialog,
            }
        case "SET_ELEMENT_DIALOG":
            return {
                ...state,
                elementDialog: action.elementDialog,
            }
        default:
            console.log("Default case in reducer")
    }
}

export default reducer;