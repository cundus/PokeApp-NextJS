import { createContext, useReducer } from "react";

export const AppContext = createContext();

const initialState = {
  pocket: [],
  chance: 100,
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: { ...action.payload },
      };
    case "LOGOUT":
      localStorage.removeItem("pocket");
      localStorage.removeItem("chance");

      return {
        pocket: [],
        chance: 100,
        user: {},
      };

    case "ADD_POKEMON":
      const newPokemon = [...state.pocket, { ...action.payload }];
      return {
        ...state,
        pocket: newPokemon,
      };

    case "REMOVE_POKEMON":
      const deletePokemon = state.pocket.filter(
        (item) => item.name !== action.payload.name
      );
      return {
        ...state,
        pocket: deletePokemon,
        chance: state.chance + 1,
      };
    case "USE_CATCH":
      return {
        ...state,
        chance: state.chance - 1,
      };
    case "SAVE_DATA":
      localStorage.setItem("pocket", JSON.stringify(state.pocket));
      localStorage.setItem("chance", JSON.stringify(state.chance));
      return state;
    case "GET_DATA":
      const pocketData = localStorage.getItem("pocket");
      const chanceData = localStorage.getItem("chance");

      if (!pocketData) {
        return { ...state, pocket: state.pocket };
      }
      if (!chanceData) {
        return { ...state, chance: state.chance };
      }

      return { ...state, pocket: JSON.parse(pocketData), chance: chanceData };
    default:
      throw new Error("unknown cases");
  }
};

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
