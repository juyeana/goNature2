import { GET_PACKAGES, GET_PACKAGE, PACKAGE_LOADING } from '../actions/types';

const initialState = {
  packages: [],
  packageDetail:{},
  loading:false
};

export default function (state = initialState, action) {
  switch (action.type) {

    case PACKAGE_LOADING:{
      return{...state,
        loading:true

      }
    }
    case GET_PACKAGES: {
      return {
        ...state,
        loading:false,
        packages: action.payload,
      };
    }
    case GET_PACKAGE: {
      return {
        ...state,
        loading: false,

        packageDetail: action.payload,
      };
    }
    default:
      
      return state;
  }
}
