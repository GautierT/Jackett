import {
    FETCH_INDEXERS_ERROR,
    FETCH_INDEXERS_PENDING,
    FETCH_INDEXERS_SUCCESS,
    IndexersConfig,
    IndexersConfigState,
    IndexersConfigActionTypes
} from "../types/indexersConfig";

//
// Initial state

const initialState: IndexersConfigState = {
    isLoaded: false,
    error: "",
    indexers: {} as IndexersConfig,
}

//
// Reducers

export default function indexersReducer(state = initialState, action: IndexersConfigActionTypes) {
    switch(action.type) {
        case FETCH_INDEXERS_PENDING:
            return {
                ...state,
                isLoaded: false
            }
        case FETCH_INDEXERS_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                indexers: action.indexers
            }
        case FETCH_INDEXERS_ERROR:
            return {
                ...state,
                isLoaded: true,
                error: action.error
            }
        default:
            return state;
    }
}

//
// Selectors

export const getIndexersIsLoaded = (state: IndexersConfigState) => state.isLoaded;
export const getIndexersError = (state: IndexersConfigState) => state.error;
export const getIndexers = (state: IndexersConfigState) => state.indexers;
