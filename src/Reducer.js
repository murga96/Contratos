export const initialState = {
    editDialog: [],
}

export const actionTypes = {
    SET_EDIT_DIALOG: "SET_EDIT_DIALOG",
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_EDIT_DIALOG":
            return {
                ...state,
                editDialog: action.editDialog,
            }
    }
}

export default reducer;