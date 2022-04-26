export const initialState = {
    user: null,
    token: null,
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_TOKEN: "SET_TOKEN",
}

const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.user,
            }
        case "SET_TOKEN":
            return {
                ...state,
                token: action.token,
            }
        default:
            console.log("Default case in reducer")
    }
}

export default reducer;