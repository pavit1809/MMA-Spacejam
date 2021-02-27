import * as actionTypes from './actions';

const initialState ={
	userInfo:null,
	check:0,
}

const reducer = (state = initialState,action) =>{
	switch (action.type) {
		case actionTypes.CHANGE_STATE:
		{
			// console.log("userInfo edited")
			return{
				...state,
				userInfo:action.userInfo
			}
		}
		case actionTypes.CHANGE_CHECK:
		{
			// console.log("check edited")
			return{
				...state,
				check:action.check
			}
		}
	}
	return state;
};

export default reducer;