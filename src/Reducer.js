export const initialState = {
    user: null,
}

export const actionTypes = {
    SET_USER: "SET_USER",
}

const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.user,
            }
        default:
            console.log("Default case in reducer")
    }
}

export default reducer;